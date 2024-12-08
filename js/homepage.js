document.addEventListener("DOMContentLoaded", function() {
    const texts = ["Hey", "Hallo"];
    let textIndex = 0;
    let charIndex = 0;
    const typingSpeed = 150; // milliseconds
    const deletingSpeed = 100; // milliseconds

    function typeCharacter() {
        const typingTextElement = document.getElementById("typing-text");
        if (charIndex < texts[textIndex].length) {
            typingTextElement.textContent = texts[textIndex].substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeCharacter, typingSpeed);
        } else {
            setTimeout(deleteCharacter, 2000); // wait 2 seconds before deleting the text
        }
    }

    function deleteCharacter() {
        const typingTextElement = document.getElementById("typing-text");
        if (charIndex > 0) {
            typingTextElement.textContent = texts[textIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(deleteCharacter, deletingSpeed);
        } else {
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(typeCharacter, typingSpeed);
        }
    }

    typeCharacter();
});