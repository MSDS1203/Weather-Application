// load unit preference from localStorage or default to false (imperial)
export const getStoredUnitChoice = () => {
    return localStorage.getItem("isMetric") === "true"; 
};

// toggle the unit preference & save to browser localStorage
export const toggleUnitChoice = (setIsMetric) => {
    setIsMetric(prev => {
        const newVal = !prev; // toggle choice
        localStorage.setItem("isMetric", newVal);
        return newVal;
    });
};