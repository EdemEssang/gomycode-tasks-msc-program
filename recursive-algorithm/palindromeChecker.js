/**
 * Palindrome Checker using Recursion
 * Checks if a string reads the same forwards and backwards
 */

function isPalindrome(str) {
    // Step 1: Clean the string (remove non-alphanumeric, convert to lowercase)
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Step 2: Recursive palindrome check on cleaned string
    function checkPalindrome(s, left, right) {
        // Base case: if pointers cross, it's a palindrome
        if (left >= right) return true;
        
        // Check characters at both ends
        if (s[left] !== s[right]) return false;
        
        // Recursive case: move pointers inward
        return checkPalindrome(s, left + 1, right - 1);
    }
    
    return checkPalindrome(cleaned, 0, cleaned.length - 1);
}

// Example usage:
console.log(isPalindrome("A man, a mood, an animal, puma")); // true
console.log(isPalindrome("edemessang")); // true
console.log(isPalindrome("abadie")); // false
console.log(isPalindrome("No 'x' in Nixon")); // true           
