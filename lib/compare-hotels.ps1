$payload34 = @{
    Credential = @{
        Login = "XMLLEADER"
        Password = "9VV_z0FdWvcrjEYG3XcM"
    }
    City = 34
} | ConvertTo-Json

$payload20 = @{
    Credential = @{
        Login = "XMLLEADER"
        Password = "9VV_z0FdWvcrjEYG3XcM"
    }
    City = 20
} | ConvertTo-Json

"--- Sousse (34) ---"
$res34 = Invoke-RestMethod -Uri "https://admin.mygo.co/api/hotel/ListHotel" -Method Post -Body $payload34 -ContentType "application/json"
$res34.ListHotel | Select-Object -First 2 | ForEach-Object { "$($_.Name) ($($_.City.Name))" }

"--- Douz (20) ---"
$res20 = Invoke-RestMethod -Uri "https://admin.mygo.co/api/hotel/ListHotel" -Method Post -Body $payload20 -ContentType "application/json"
$res20.ListHotel | Select-Object -First 2 | ForEach-Object { "$($_.Name) ($($_.City.Name))" }
