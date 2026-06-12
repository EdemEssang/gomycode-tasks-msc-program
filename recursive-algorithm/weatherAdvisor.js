/**
 * Weather Clothing Advisor
 * Provides clothing recommendations based on temperature and rain conditions
 */


function getClothingAdvice(temperature, isRaining) {
    // Validate inputs
    if (typeof temperature !== 'number' || isNaN(temperature)) {
        return "Invalid temperature. Please enter a valid number.";
    }
    
    // Determine temperature category
    let advice = "";
    let clothing = "";
    let accessories = "";
    
    // Temperature-based clothing recommendations
    if (temperature <= -20) {
        clothing = "Extreme cold gear: thermal base layer, insulated jacket, snow pants, thick gloves, balaclava";
        accessories = "Heavy winter boots, face mask, hand warmers";
    } 
    else if (temperature <= 0) {
        clothing = "Heavy winter coat, sweater, thermal underwear, thick pants, warm gloves, scarf";
        accessories = "Winter boots, wool socks, ear muffs or beanie";
    } 
    else if (temperature <= 10) {
        clothing = "Winter jacket, fleece or hoodie, long-sleeve shirt, jeans or warm pants, light gloves";
        accessories = "Warm boots or closed shoes, scarf (optional)";
    } 
    else if (temperature <= 20) {
        clothing = "Light jacket or cardigan, long-sleeve shirt, jeans or chinos";
        accessories = "Comfortable closed shoes, light scarf (optional)";
    } 
    else if (temperature <= 30) {
        clothing = "T-shirt, shorts or light pants, summer dress";
        accessories = "Sandals or sneakers, sunglasses";
    } 
    else {
        clothing = "Lightweight clothing: tank top, shorts, breathable fabrics";
        accessories = "Sandals, wide-brimmed hat, sunscreen recommended";
    }
    
    // Rain adjustments
    if (isRaining) {
        if (temperature <= 10) {
            accessories += ", waterproof jacket, umbrella, waterproof boots";
        } else {
            accessories += ", umbrella or raincoat, waterproof shoes";
        }
        advice += "☔ It's raining! ";
    }
    
    // Special weather alerts
    if (temperature > 35) {
        advice += "⚠️ Extreme heat warning! Stay hydrated and avoid direct sunlight. ";
    } else if (temperature < -10) {
        advice += "⚠️ Extreme cold warning! Limit time outdoors. ";
    }
    
    // Combine advice
    const fullAdvice = `${advice}Wear: ${clothing}. ${accessories ? `Accessories: ${accessories}.` : ''}`;
    
    return {
        temperature: temperature,
        isRaining: isRaining,
        temperatureCategory: getTemperatureCategory(temperature),
        clothing: clothing,
        accessories: accessories,
        advice: fullAdvice
    };
}

// Helper function to get temperature category
function getTemperatureCategory(temp) {
    if (temp <= -20) return "Extreme Cold";
    if (temp <= 0) return "Freezing";
    if (temp <= 10) return "Cold";
    if (temp <= 20) return "Cool";
    if (temp <= 30) return "Warm";
    return "Hot";
}