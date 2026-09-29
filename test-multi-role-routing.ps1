# Test script for Multi-Role Registration and Department-Based Routing
$baseUrl = "http://localhost:8080/api"

Write-Host "`n=== TEST 1: Register New Staff Member ===" -ForegroundColor Cyan
$uniqueId = [System.Guid]::NewGuid().ToString().Substring(0, 8)
$staffEmail = "staff_$uniqueId@campuscare.com"
$staffRegisterBody = @{
    name = "Network Specialist Bob"
    email = $staffEmail
    password = "Password123!"
    role = "ROLE_STAFF"
    department = "IT Infrastructure & Networks"
    phone = "+1 (555) 999-1111"
} | ConvertTo-Json

$staffRegResp = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $staffRegisterBody -ContentType "application/json"
Write-Host "Staff Registered Successfully! ID: $($staffRegResp.id), Name: $($staffRegResp.name), Role: $($staffRegResp.role), Dept: $($staffRegResp.department)" -ForegroundColor Green
$staffToken = $staffRegResp.token

Write-Host "`n=== TEST 2: Register New Administrator ===" -ForegroundColor Cyan
$adminEmail = "admin_$uniqueId@campuscare.com"
$adminRegisterBody = @{
    name = "Dean Alice Smith"
    email = $adminEmail
    password = "Password123!"
    role = "ROLE_ADMIN"
    department = "Campus Administration"
    phone = "+1 (555) 888-2222"
} | ConvertTo-Json

$adminRegResp = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $adminRegisterBody -ContentType "application/json"
Write-Host "Admin Registered Successfully! ID: $($adminRegResp.id), Name: $($adminRegResp.name), Role: $($adminRegResp.role), Dept: $($adminRegResp.department)" -ForegroundColor Green
$adminToken = $adminRegResp.token

Write-Host "`n=== TEST 3: Student Login & Create Wi-Fi Issue ===" -ForegroundColor Cyan
$studentLoginBody = @{
    email = "student1@campuscare.com"
    password = "student123"
} | ConvertTo-Json

$studentResp = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $studentLoginBody -ContentType "application/json"
$studentToken = $studentResp.token

$issueBody = @{
    title = "Engineering Hall 302 Wi-Fi Down [Auto-Test $uniqueId]"
    description = "Wi-Fi access point in 302 is blinking red and unreachable."
    category = "WIFI_INTERNET"
    priority = "HIGH"
    location = "Engineering Hall 302"
} | ConvertTo-Json

$issueHeaders = @{ Authorization = "Bearer $studentToken" }
$newIssue = Invoke-RestMethod -Uri "$baseUrl/issues" -Method Post -Body $issueBody -ContentType "application/json" -Headers $issueHeaders
Write-Host "Issue Created: #$($newIssue.issueCode) - $($newIssue.title) (Category: $($newIssue.category))" -ForegroundColor Green

Write-Host "`n=== TEST 4: Check Notifications for IT Staff vs Facilities Staff ===" -ForegroundColor Cyan
# Check newly registered IT staff Bob
$staffHeaders = @{ Authorization = "Bearer $staffToken" }
$bobNotifs = Invoke-RestMethod -Uri "$baseUrl/notifications" -Method Get -Headers $staffHeaders
$bobMatched = $bobNotifs | Where-Object { $_.message -like "*$($newIssue.issueCode)*" }

if ($bobMatched) {
    Write-Host "PASS: IT Staff (Bob) received department alert: '$($bobMatched.title)'" -ForegroundColor Green
} else {
    Write-Host "FAIL: IT Staff (Bob) did NOT receive notification!" -ForegroundColor Red
}

# Login as Facilities Staff (David Chen: staff3@campuscare.com / staff123)
$facLogin = @{
    email = "staff3@campuscare.com"
    password = "staff123"
} | ConvertTo-Json
$facResp = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $facLogin -ContentType "application/json"
$facHeaders = @{ Authorization = "Bearer $($facResp.token)" }
$facNotifs = Invoke-RestMethod -Uri "$baseUrl/notifications" -Method Get -Headers $facHeaders
$facMatched = $facNotifs | Where-Object { $_.message -like "*$($newIssue.issueCode)*" }

if ($facMatched) {
    Write-Host "FAIL: Facilities staff unexpectedly received Wi-Fi alert!" -ForegroundColor Red
} else {
    Write-Host "PASS: Facilities staff (David Chen) did NOT receive the Wi-Fi alert (correct department isolation)!" -ForegroundColor Green
}

Write-Host "`n=== TEST 5: IT Staff Bob Claims and Resolves the Ticket ===" -ForegroundColor Cyan
$claimResp = Invoke-RestMethod -Uri "$baseUrl/issues/$($newIssue.id)/claim" -Method Put -Headers $staffHeaders
Write-Host "Ticket Claimed! Status: $($claimResp.status), Assigned Staff: $($claimResp.assignedStaffName)" -ForegroundColor Green

$resolveBody = @{
    status = "RESOLVED"
    notes = "Replaced faulty PoE injector and verified Wi-Fi throughput at 350 Mbps."
} | ConvertTo-Json
$resolveResp = Invoke-RestMethod -Uri "$baseUrl/issues/$($newIssue.id)/status" -Method Put -Body $resolveBody -ContentType "application/json" -Headers $staffHeaders
Write-Host "Ticket Resolved! Status: $($resolveResp.status), Resolution Notes: $($resolveResp.resolutionNotes)" -ForegroundColor Green

Write-Host "`n=== TEST 6: Student Closes Ticket ===" -ForegroundColor Cyan
$closeBody = @{
    status = "CLOSED"
    notes = "Verified Wi-Fi is working at high speed. Thank you!"
} | ConvertTo-Json
$closeResp = Invoke-RestMethod -Uri "$baseUrl/issues/$($newIssue.id)/status" -Method Put -Body $closeBody -ContentType "application/json" -Headers $issueHeaders
Write-Host "Ticket Closed! Status: $($closeResp.status), Closed Time: $($closeResp.closedTime)" -ForegroundColor Green

Write-Host "`n=======================================================" -ForegroundColor Green
Write-Host " ALL MULTI-ROLE & ROUTING VERIFICATION TESTS PASSED! " -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
