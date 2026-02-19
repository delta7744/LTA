$payload = @{
    Credential = @{
        Login = "XMLLEADER"
        Password = "9VV_z0FdWvcrjEYG3XcM"
    }
    City = 20
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://admin.mygo.co/api/hotel/ListHotel" -Method Post -Body $payload -ContentType "application/json"
$response.ListHotel | Select-Object -First 3 | ForEach-Object { 
    $hotel = $_
    [PSCustomObject]@{
        Id = $hotel.Id
        Name = $hotel.Name
        CityName = $hotel.City.Name
    }
} | ConvertTo-Json
