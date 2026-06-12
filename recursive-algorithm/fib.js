/**
 * Fibonacci Sequence using Recursion
 * F(0) = 0, F(1) = 1
 * F(n) = F(n-1) + F(n-2)
 */


function fibonacciBasic(n) {
    // Base cases
    if (n === 0) return 0;
    if (n === 1) return 1;
    
    // Recursive case
    return fibonacciBasic(n - 1) + fibonacciBasic(n - 2);
}

// Example usage:
console.log(fibonacciBasic(0)); // 0
console.log(fibonacciBasic(1)); // 1
console.log(fibonacciBasic(5)); // 5
console.log(fibonacciBasic(10)); // 55  

// could be inefficient for large numbers due to repeated calculations. 
// For example, F(5) requires calculating F(4), F(3), F(2), F(1), and F(0) multiple times. 