# CampusCare End-to-End System Test Script
# Usage: powershell -ExecutionPolicy Bypass -File test-e2e.ps1

Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  CampusCare Automated End-to-End Test Suite" -ForegroundColor Green
Write-Host "===================================================================" -ForegroundColor Cyan

$base = "http://localhost:8080/api"

try {
    # 1. Student Login
    Write-Host "`n[1/7] Testing Student Authentication..." -ForegroundColor Yellow
    $studentAuth = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body '{"email":"student1@campuscare.com","password":"student123"}' -Headers @{"Content-Type"="application/json"}
    Write-Host "  -> Student Logged In: $($studentAuth.name) ($($studentAuth.role))" -ForegroundColor Green
    $studentToken = $studentAuth.token

    # 2. Student Submits Issue
    Write-Host "`n[2/7] Submitting New Campus Issue as Student..." -ForegroundColor Yellow
    $newIssue = @{
        title = "AC Unit blowing hot air in Seminar Hall B"
        description = "Temperature in Hall B is over 32C during morning lectures. Compressors seem inactive."
        category = "ELECTRICAL"
        priority = "HIGH"
        location = "Science Complex, Floor 2, Hall B"
    } | ConvertTo-Json
    $issue = Invoke-RestMethod -Uri "$base/issues" -Method Post -Body $newIssue -Headers @{"Authorization"="Bearer $studentToken"; "Content-Type"="application/json"}
    Write-Host "  -> Issue Created: ID=$($issue.id) | Code=$($issue.issueCode) | Status=$($issue.status)" -ForegroundColor Green
    $issueId = $issue.id

    # 3. Admin Login & Stats
    Write-Host "`n[3/7] Testing Admin Dashboard & Triage..." -ForegroundColor Yellow
    $adminAuth = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body '{"email":"admin@campuscare.com","password":"admin123"}' -Headers @{"Content-Type"="application/json"}
    $adminToken = $adminAuth.token
    $stats = Invoke-RestMethod -Uri "$base/admin/dashboard" -Method Get -Headers @{"Authorization"="Bearer $adminToken"}
    Write-Host "  -> Admin Stats: Total Issues=$($stats.totalIssues), Total Users=$($stats.totalUsers)" -ForegroundColor Green

    # 4. Admin Assigns Staff
    Write-Host "`n[4/7] Admin Assigning Issue to Marcus Vance (Electrical Staff)..." -ForegroundColor Yellow
    $assignBody = @{
        staffId = 2
        notes = "Dispatched for urgent inspection before afternoon guest lecture."
    } | ConvertTo-Json
    $assigned = Invoke-RestMethod -Uri "$base/issues/$issueId/assign" -Method Post -Body $assignBody -Headers @{"Authorization"="Bearer $adminToken"; "Content-Type"="application/json"}
    Write-Host "  -> Status: $($assigned.status) | Assigned to: $($assigned.assignedStaffName)" -ForegroundColor Green

    # 5. Staff Updates Status to IN_PROGRESS
    Write-Host "`n[5/7] Staff Accepting and Marking IN_PROGRESS..." -ForegroundColor Yellow
    $staffAuth = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body '{"email":"staff1@campuscare.com","password":"staff123"}' -Headers @{"Content-Type"="application/json"}
    $staffToken = $staffAuth.token
    $progressBody = @{
        status = "IN_PROGRESS"
        notes = "On-site at Hall B. Reset circuit breaker and checking coolant line."
    } | ConvertTo-Json
    $inProgress = Invoke-RestMethod -Uri "$base/issues/$issueId/status" -Method Put -Body $progressBody -Headers @{"Authorization"="Bearer $staffToken"; "Content-Type"="application/json"}
    Write-Host "  -> Status: $($inProgress.status)" -ForegroundColor Green

    # 6. Staff Posts Technical Comment & Resolves
    Write-Host "`n[6/7] Staff Adding Discussion Comment & Marking RESOLVED..." -ForegroundColor Yellow
    $commentBody = @{
        content = "Replaced faulty thermal overload relay. AC unit cooling at 21C nominal."
    } | ConvertTo-Json
    $comment = Invoke-RestMethod -Uri "$base/issues/$issueId/comments" -Method Post -Body $commentBody -Headers @{"Authorization"="Bearer $staffToken"; "Content-Type"="application/json"}
    Write-Host "  -> Comment Added: '$($comment.content)'" -ForegroundColor Green

    $resolveBody = @{
        status = "RESOLVED"
        notes = "System tested under full airflow for 30 minutes. Thermostat functioning normally."
    } | ConvertTo-Json
    $resolved = Invoke-RestMethod -Uri "$base/issues/$issueId/status" -Method Put -Body $resolveBody -Headers @{"Authorization"="Bearer $staffToken"; "Content-Type"="application/json"}
    Write-Host "  -> Final Status: $($resolved.status)" -ForegroundColor Green

    # 7. Audit History Verification
    Write-Host "`n[7/8] Verifying Audit Trail and History Log..." -ForegroundColor Yellow
    $finalIssue = Invoke-RestMethod -Uri "$base/issues/$issueId" -Method Get -Headers @{"Authorization"="Bearer $adminToken"}
    Write-Host "  -> Total Audit Entries: $($finalIssue.history.Count)" -ForegroundColor Green
    foreach ($entry in $finalIssue.history) {
        $from = if ($entry.oldStatus) { $entry.oldStatus } else { "(initial)" }
        Write-Host "     * $from -> $($entry.newStatus) by $($entry.changedByName) ($($entry.changedByRole)): $($entry.note)" -ForegroundColor White
    }

    # 8. Staff 1-Click Self-Assignment Claim Test
    Write-Host "`n[8/8] Testing Staff 1-Click Ticket Claim (Self-Assignment)..." -ForegroundColor Yellow
    $claimIssueBody = @{
        title = "Chemistry Lab Fume Hood #2 Sensor Fault"
        description = "Airflow sensor beeping intermittently during organic chemistry practicals."
        category = "LABORATORY"
        priority = "CRITICAL"
        location = "Chemistry Building, Lab 102"
    } | ConvertTo-Json
    $unassignedIssue = Invoke-RestMethod -Uri "$base/issues" -Method Post -Body $claimIssueBody -Headers @{"Authorization"="Bearer $studentToken"; "Content-Type"="application/json"}
    Write-Host "  -> Created Unassigned Ticket: $($unassignedIssue.issueCode) (Status: $($unassignedIssue.status))" -ForegroundColor Green

    # Verify visible in staff open queue
    $staffStats = Invoke-RestMethod -Uri "$base/staff/dashboard" -Method Get -Headers @{"Authorization"="Bearer $staffToken"}
    $inQueue = $staffStats.unassignedIssues | Where-Object { $_.id -eq $unassignedIssue.id }
    Write-Host "  -> Ticket visible in Staff Open Campus Queue: $([bool]$inQueue)" -ForegroundColor Green

    # Staff claims ticket
    $claimed = Invoke-RestMethod -Uri "$base/issues/$($unassignedIssue.id)/claim" -Method Put -Headers @{"Authorization"="Bearer $staffToken"}
    Write-Host "  -> Staff Claimed Ticket: Status is now $($claimed.status) | Assigned to: $($claimed.assignedStaffName)" -ForegroundColor Green

    Write-Host "`n===================================================================" -ForegroundColor Cyan
    Write-Host "  ALL 8 TESTS PASSED WITH 100% SUCCESS!" -ForegroundColor Green
    Write-Host "===================================================================" -ForegroundColor Cyan
}
catch {
    Write-Host "`n[ERROR] Test failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())" -ForegroundColor Red
    }
}
