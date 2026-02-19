$payload = @{
    Credential = @{
        Login = "XMLLEADER"
        Password = "9VV_z0FdWvcrjEYG3XcM"
    }
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://admin.mygo.co/api/hotel/ListCity" -Method Post -Body $payload -ContentType "application/json"
$response.ListCity | ForEach-Object { 
    "$($_.Id): $($_.Name)" 
} | Out-File "c:\Users\medaz\Downloads\slimaTourCRM-main\slimaTourCRM-main\client-front\lib\all-cities.txt"
