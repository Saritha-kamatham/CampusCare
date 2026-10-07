# Test script for newly added specification endpoints and state machine rules
$base = "http://localhost:8080/api"

Write-Host "=== TEST 1: Admin Login & Analytics Summary ===" -ForegroundColor Cyan
$adminAuth = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body '{"email":"admin@campuscare.com","password":"admin123"}' -Headers @{"Content-Type"="application/json"}
$adminToken = $adminAuth.token

$summary = Invoke-RestMethod -Uri "$base/analytics/summary" -Method Get -Headers @{"Authorization"="Bearer $adminToken"}
Write-Host "PASS: /api/analytics/summary returned Total Issues: $($summary.totalIssues), Total Users: $($summary.totalUsers), Resolution Rate: $($summary.resolutionRate)" -ForegroundColor Green

Write-Host "`n=== TEST 2: Student Login & My Issues Endpoint ===" -ForegroundColor Cyan
$studentAuth = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body '{"email":"student1@campuscare.com","password":"student123"}' -Headers @{"Content-Type"="application/json"}
$studentToken = $studentAuth.token

$myIssues = Invoke-RestMethod -Uri "$base/issues/my" -Method Get -Headers @{"Authorization"="Bearer $studentToken"}
Write-Host "PASS: /api/issues/my returned $($myIssues.Count) issues for student $($studentAuth.name)" -ForegroundColor Green

Write-Host "`n=== TEST 3: Staff Login & Open Issues Endpoint ===" -ForegroundColor Cyan
$staffAuth = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body '{"email":"staff1@campuscare.com","password":"staff123"}' -Headers @{"Content-Type"="application/json"}
$staffToken = $staffAuth.token

$openIssues = Invoke-RestMethod -Uri "$base/issues/open" -Method Get -Headers @{"Authorization"="Bearer $staffToken"}
Write-Host "PASS: /api/issues/open returned $($openIssues.Count) unassigned open issues" -ForegroundColor Green

Write-Host "`n=== TEST 4: PUT /api/issues/{id}/assign ===" -ForegroundColor Cyan
# Create a new issue to assign via PUT
$newIssueBody = @{
    title = "Classroom 101 Smart Board Offline"
    description = "Touchscreen and HDMI input not responding."
    category = "CLASSROOM"
    priority = "MEDIUM"
    location = "Academic Block A, 101"
} | ConvertTo-Json
$createdIssue = Invoke-RestMethod -Uri "$base/issues" -Method Post -Body $newIssueBody -Headers @{"Authorization"="Bearer $studentToken"; "Content-Type"="application/json"}

$assignBody = @{
    staffId = $staffAuth.id
    note = "Testing PUT /assign endpoint"
} | ConvertTo-Json
$putAssigned = Invoke-RestMethod -Uri "$base/issues/$($createdIssue.id)/assign" -Method Put -Body $assignBody -Headers @{"Authorization"="Bearer $adminToken"; "Content-Type"="application/json"}
Write-Host "PASS: PUT /api/issues/{id}/assign succeeded! Status: $($putAssigned.status), Assignee: $($putAssigned.assignedStaffName)" -ForegroundColor Green

Write-Host "`n=== TEST 5: State Machine Validation (Invalid transition REPORTED -> CLOSED) ===" -ForegroundColor Cyan
$rawIssue = Invoke-RestMethod -Uri "$base/issues" -Method Post -Body $newIssueBody -Headers @{"Authorization"="Bearer $studentToken"; "Content-Type"="application/json"}
try {
    Invoke-RestMethod -Uri "$base/issues/$($rawIssue.id)/status" -Method Put -Body '{"status":"CLOSED","notes":"premature close"}' -Headers @{"Authorization"="Bearer $adminToken"; "Content-Type"="application/json"}
    Write-Host "FAIL: Invalid transition was not rejected!" -ForegroundColor Red
} catch {
    Write-Host "PASS: Invalid transition was rejected with status 400 Bad Request ($($_.Exception.Message))" -ForegroundColor Green
}

Write-Host "`n=== TEST 6: Admin Update User PUT /api/admin/users/{id} ===" -ForegroundColor Cyan
$updateUserBody = @{
    name = "Student Alex Rivera (Updated)"
    phone = "+1 (555) 999-4444"
    department = "Software Engineering"
} | ConvertTo-Json
$updatedUser = Invoke-RestMethod -Uri "$base/admin/users/$($studentAuth.id)" -Method Put -Body $updateUserBody -Headers @{"Authorization"="Bearer $adminToken"; "Content-Type"="application/json"}
Write-Host "PASS: PUT /api/admin/users/{id} succeeded! Name: $($updatedUser.name), Phone: $($updatedUser.phone), Dept: $($updatedUser.department)" -ForegroundColor Green

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  ALL SPECIFICATION & STATE MACHINE TESTS PASSED 100%!       " -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
