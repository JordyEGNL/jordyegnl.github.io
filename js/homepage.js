document.addEventListener("DOMContentLoaded", function() {
    const texts = ["Hey", "Hallo"];
    let textIndex = 0;
    let charIndex = 0;
    const typingSpeed = 150; // milliseconds
    const deletingSpeed = 100; // milliseconds
    const minScreenWidth = 600; // minimum screen width for animation
    const typingTextElement = document.getElementById("typing-text");

    function typeCharacter() {
        if (window.innerWidth < minScreenWidth) {
            typingTextElement.textContent = texts[0];
            return;
        };
        if (charIndex < texts[textIndex].length) {
            typingTextElement.textContent = texts[textIndex].substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeCharacter, typingSpeed);
        } else {
            setTimeout(deleteCharacter, 2000); // wait 2 seconds before deleting the text
        }
    }

    function deleteCharacter() {
        if (window.innerWidth < minScreenWidth) return;
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

    const imageElement = document.getElementById('mainImg');
    let clickCount = 0;

    imageElement.addEventListener('click', function() {
        clickCount++;
        if (clickCount === 10) {
            imageElement.src = '/img/cat.gif';
        }
    });
});