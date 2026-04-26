const noBtn = document.getElementById('no-btn');

function runAway() {
    // Get the current dimensions of the browser window
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Get the dimensions of the button itself
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    // Calculate a random X and Y position that keeps the button fully on screen
    const randomX = Math.floor(Math.random() * (windowWidth - btnWidth));
    const randomY = Math.floor(Math.random() * (windowHeight - btnHeight));

    // Change the button's position to 'fixed' so it breaks out of the container
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

// Event listener for desktop (when the mouse hovers over it)
noBtn.addEventListener('mouseover', runAway);

// Event listener for mobile (when a finger tries to tap it)
noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault(); // Prevents the tap from actually registering as a click
    runAway();
});