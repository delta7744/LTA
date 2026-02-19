$payload = @{
    Credential = @{
        Login = "XMLLEADER"
        Password = "9VV_z0FdWvcrjEYG3XcM"
    }
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://admin.mygo.co/api/hotel/ListCity" -Method Post -Body $payload -ContentType "application/json"
$targetCities = $response.ListCity | Where-Object { $_.Name -match "Sousse|Douz|Djerba" }
$targetCities | Select-Object Id, Name | ConvertTo-Json
