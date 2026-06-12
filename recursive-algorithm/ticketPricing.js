/**
 * Movie Ticket Pricing Program
 * Determines ticket price based on age using switch statement
 */

// Version 1: Using switch with true (for range checking)
function getTicketPrice(age) {
    // Validate input
    if (typeof age !== 'number' || isNaN(age) || age < 0) {
        return "Invalid age. Please enter a valid positive number.";
    }
    
    // Using switch with true for range checking
    let category;
    let price;
    
    switch (true) {
        case (age <= 12):
            category = "Child";
            price = 10;
            break;
        case (age >= 13 && age <= 17):
            category = "Teenager";
            price = 15;
            break;
        case (age >= 18):
            category = "Adult";
            price = 20;
            break;
        default:
            return "Invalid age range";
    }
    
    return {
        age: age,
        category: category,
        price: price,
        message: `Age ${age} (${category}): Ticket price is $${price}`
    };
}

// Example usage:
console.log(getTicketPrice(10)); // Child
console.log(getTicketPrice(15)); // Teenager
console.log(getTicketPrice(25)); // Adult
console.log(getTicketPrice(-5)); // Invalid age
console.log(getTicketPrice("twenty")); // Invalid age   