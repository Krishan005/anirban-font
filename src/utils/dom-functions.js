export const scrollToErrorElement = (id) => {
    const errorElement = document.getElementById(id); // Replace with your actual element ID
    if (errorElement) {
        errorElement.scrollIntoView({
            // or 'auto' for instant scrolling
            block: "center", // or 'end' or 'center'
        });
    }
};