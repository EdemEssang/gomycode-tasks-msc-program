// Time complexity: O(log n) instead of O(n)
function powerFast(base, exponent) {
    // Handle zero exponent
    if (exponent === 0) return 1;
    
    // Handle negative exponents
    if (exponent < 0) {
        return 1 / powerFast(base, -exponent);
    }
    
    // Fast exponentiation using squaring
    if (exponent % 2 === 0) {
        // If exponent is even: base^n = (base^(n/2))^2
        const half = powerFast(base, exponent / 2);
        return half * half;
    } else {
        // If exponent is odd: base^n = base * base^(n-1)
        return base * powerFast(base, exponent - 1);
    }
}

// Example usage:
console.log(powerFast(2, 10)); // 1024
console.log(powerFast(3, 5));  // 243
console.log(powerFast(5, -2)); // 0.04
console.log(powerFast(7, 0));  // 1 
