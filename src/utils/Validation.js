export function isEmpty(value) {
    return value === undefined || value === null || value === '' || !value || value == NaN;
}

export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9. _-]+@[a-zA-Z0-9. -]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

export function checkLength(value, length) {
    return value && value.length == length;
}

