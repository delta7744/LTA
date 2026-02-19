import { requestMyGoAPI } from "./mygo-service-test.js";

async function testMyGoAPI() {
    console.log("Testing MyGo API connectivity...");

    try {
        // Test ListCity as requested by product owner
        console.log("\n--- Testing ListCity ---");
        const cityResult = await requestMyGoAPI("ListCity", {});
        console.log("ListCity Result:", JSON.stringify(cityResult).substring(0, 500) + "...");

        // Test ListHotel for a known city (e.g., Hammamet ID 10)
        console.log("\n--- Testing ListHotel (City: 10) ---");
        const hotelResult = await requestMyGoAPI("ListHotel", { City: 10 });
        console.log("ListHotel Result:", JSON.stringify(hotelResult).substring(0, 500) + "...");

        console.log("\nVerification SUCCESSFUL!");
    } catch (error) {
        console.error("\nVerification FAILED!");
        console.error(error.message);
    }
}

testMyGoAPI();
