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
            m: "Happy Anniversary, my love ❤️🥺 Today is such a special day because it reminds me of the day my life became brighter and happier with uhh in it 🌏🫀 Since uhh came into my world, every moment has felt more meaningful, every smile has felt more real, and every dream has felt closer because I have uhh by my side 🫶 Uhh are the most beautiful part of my life, the one who makes my heart race and my soul feel calm at the same time ❤️ Uhh smile can light up my darkest days, uhh voice brings me peace, and uhh love gives me strength in ways uhh may never fully know 🥺🎀…aaj hume 4 saal saath hogye hai and i am so grateful to have uhh bby mere chaand, my princess 🎀mere dil ke tukde 🥺🌏🫀❤️…I am so grateful for uhh and for everything uhh do for me ❤️🧿 Uhh care about me in ways no one else ever has, always thinking about what is best for me, always wanting to see me happy, safe, and successful 🌏🫶 Uhh love is pure and selfless, and it shows in the little things uhh do every day 🎀 Uhh support me when I need strength, guide me when I feel lost, and stand beside me no matter what 🫀 Having someone like uhh who truly wants the best for me is the greatest blessing, and I never want to take that for granted 🥺❤️…Uhh are not only gorgeous and irresistible, but also kind, caring, and the most precious person I know ❤️ Being with uhh feels like home, like comfort, like excitement, and like everything good wrapped into one person 🌏🫶 Every laugh we share, every memory we create, and every little moment with uhh becomes something I treasure deeply 🥺🎀….Thank uhh for loving me, supporting me, and staying by my side ❤️ I promise to always respect uhh, care for uhh, and love uhh with all that I have 🫀 Uhh are not just my girlfriend, uhh are my best friend, my greatest blessing, and the woman I see beside me in every future dream 🧿 Happy Anniversary, future wifey 🫶 No matter how much time passes, I will always choose uhh, again and again 🌏❤️ I love uhh endlessly 🥺❤️🎀", 
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
