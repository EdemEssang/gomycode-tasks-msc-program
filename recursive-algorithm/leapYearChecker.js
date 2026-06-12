function isLeapYearExplicit(year) {
    if (year % 400 === 0) {
        return true;  // Divisible by 400 → leap year
    }
    if (year % 100 === 0) {
        return false; // Divisible by 100 but not 400 → not leap year
    }
    if (year % 4 === 0) {
        return true;  // Divisible by 4 → leap year
    }
    return false;     // Not divisible by 4 → not leap year
}