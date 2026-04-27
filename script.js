// --- 1. Music & Floating Hearts ---
const bgMusic = document.getElementById("bg-music");
let musicActive = false;

// Trigger music on the first click anywhere on the page
document.addEventListener('click', () => {
    if (!musicActive && bgMusic) {
        bgMusic.play().catch(e => console.log("Audio block:", e));
        musicActive = true;
    }
}, { once: true });

function createHeart() {
    const container = document.getElementById('hearts-container');
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
    const duration = (Math.random() * 3 + 4);
    heart.style.animationDuration = duration + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000);
}
setInterval(createHeart, 500);

// --- 2. Relationship Timer ---
// Set the start date of the relationship here!
const anniversary = new Date("April 26, 2022 00:00:00").getTime();

function updateTimer() {
    const now = new Date().getTime();
    const diff = now - anniversary;

    const s = 1000, m = s * 60, h = m * 60, d = h * 24;
    const mo = d * 30.44, y = d * 365.25;

    document.getElementById("years").innerText = Math.floor(diff / y).toString().padStart(2, '0');
    document.getElementById("months").innerText = Math.floor((diff % y) / mo).toString().padStart(2, '0');
    document.getElementById("days").innerText = Math.floor((diff % mo) / d).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((diff % d) / h).toString().padStart(2, '0');
    document.getElementById("minutes").innerText = Math.floor((diff % h) / m).toString().padStart(2, '0');
    document.getElementById("seconds").innerText = Math.floor((diff % m) / s).toString().padStart(2, '0');
}
setInterval(updateTimer, 1000);
updateTimer();

// --- 3. Gifts Modal Logic ---
const modal = document.getElementById("gift-modal");
const gImg = document.getElementById("modal-image");
const cam = document.getElementById("camera-stream");
const camBox = document.getElementById("camera-container");
let streamRef = null;

async function openGift(type) {
    // You can edit the text and images for the gifts here
    const info = {
        flowers: { 
            t: "Virtual Flowers! 💐", 
            m: "Because you deserve all the blooms in the world. Happy Anniversary, Liza!", 
            i: "https://i.pinimg.com/736x/41/44/4a/41444a3411893b9f120001d2697dbf6d.jpg" 
        },
        mirror: { 
            t: "Look Closely... 🪞", 
            m: "This mirror reflects the most beautiful girl in the universe.", 
            i: null 
        },
        letter: { 
            t: "A Little Note 💌", 
            m: "Four years have passed, and every day I find a new reason to love you more. Forever to go, bby.", 
            i: null 
        }
    };
    
    document.getElementById("modal-title").innerText = info[type].t;
    document.getElementById("modal-message").innerText = info[type].m;
    
    // Show image if it exists
    if(info[type].i) { 
        gImg.src = info[type].i; 
        gImg.style.display = "block"; 
    } else { 
        gImg.style.display = "none"; 
    }

    // Handle Camera Logic
    if(type === 'mirror') {
        camBox.classList.remove("hidden");
        try { 
            streamRef = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } }); 
            cam.srcObject = streamRef; 
        } catch(e) { 
            console.log("Cam error");
            document.getElementById("modal-message").innerText = "Oops! Please allow camera access to see the mirror view! 🥺";
        }
    } else { 
        camBox.classList.add("hidden"); 
    }
    
    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
    
    // Stop the camera completely when modal is closed
    if(streamRef) { 
        streamRef.getTracks().forEach(t => t.stop()); 
        streamRef = null; 
    }
    cam.srcObject = null;
}

// Close modal when clicking outside of it
window.onclick = (e) => { 
    if(e.target == modal) closeModal(); 
}