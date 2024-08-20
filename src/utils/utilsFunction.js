export const priceFormat = (number, frac = 2) => {
    if (number !== 0 && (!number || isNaN(number))) return "0.00";
    return parseFloat(number).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: frac,
        maximumFractionDigits: frac,
    });
};

export const numberFormat = (number, frac = 2) => {

    if (!number) {
        number = 0;
    }
    if (typeof number === "string") {
        number = number.replace(/,/g, "");
    }
    if (isNaN(number) || !isFinite(number)) {
        number = 0;
    }

    return parseFloat(number).toLocaleString("en-IN", {
        minimumFractionDigits: frac,
        maximumFractionDigits: frac,
    });
};