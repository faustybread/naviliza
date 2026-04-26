/**
 * --- 1. Music & Interaction Logic ---
 * Browsers block autoplay by default. 
 * This starts the music on the very first tap or click anywhere on the screen.
 */
const bgMusic = document.getElementById("bg-music");
let musicStarted = false;

document.addEventListener('click', () => {
    if (!musicStarted && bgMusic) {
        bgMusic.play().catch(e => console.log("Audio block: ", e));
        musicStarted = true;
    }
}, { once: true });

/**
 * --- 2. Floating Heart Generator ---
 * Creates subtle, floating hearts that drift upward in the background.
 */
function createFloatingHeart() {
    const container = document.getElementById('hearts-container');
    const heart = document.createElement('div');
    
    heart.innerHTML = '❤️';
    heart.className = 'heart';
    
    // Randomize position, size, and speed for a natural look
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
    const duration = (Math.random() * 3 + 4); // Between 4s and 7s
    heart.style.animationDuration = duration + 's';
    
    container.appendChild(heart);
    
    // Remove from DOM once animation finishes to keep the site fast
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// Generate a heart every 500ms
setInterval(createFloatingHeart, 500);

/**
 * --- 3. Relationship Time Counter ---
 * Calculates exactly how long you've been together since April 27, 2022.
 */
const anniversaryDate = new Date("April 27, 2022 00:00:00").getTime();

function updateCounter() {
    const now = new Date().getTime();
    const diff = now - anniversaryDate;

    // Time constants
    const s = 1000;
    const m = s * 60;
    const h = m * 60;
    const d = h * 24;
    const mo = d * 30.44; // Approx average month
    const y = d * 365.25; // Accounting for leap years

    const years = Math.floor(diff / y);
    const months = Math.floor((diff % y) / mo);
    const days = Math.floor((diff % mo) / d);
    const hours = Math.floor((diff % d) / h);
    const minutes = Math.floor((diff % h) / m);
    const seconds = Math.floor((diff % m) / s);

    document.getElementById("years").innerText = years.toString().padStart(2, '0');
    document.getElementById("months").innerText = months.toString().padStart(2, '0');
    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
}

setInterval(updateCounter, 1000);
updateCounter();

/**
 * --- 4. Quiz Logic ---
 * Controls the 3-question game that locks the gifts.
 */
const quizData = [
    { q: "Where did we go on our first date?", opts: ["A Cute Cafe", "The Movies", "A Park"], ans: 0 },
    { q: "What is my absolute worst habit?", opts: ["Sleeping late", "Stealing blankets", "Slow replies"], ans: 1 },
    { q: "Who said 'I love you' first?", opts: ["Me (Rahul)", "You (Liza)", "Both!"], ans: 0 }
];

let currentQ = 0;
const qText = document.getElementById("question-text");
const qOptions = document.getElementById("quiz-options");
const quizCont = document.getElementById("quiz-container");
const quizDone = document.getElementById("quiz-success");
const presentsCard = document.getElementById("presents-section");

function loadQuestion() {
    const data = quizData[currentQ];
    qText.innerText = data.q;
    qOptions.innerHTML = "";

    data.opts.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.innerText = opt;
        btn.className = "quiz-btn";
        btn.onclick = () => checkAnswer(idx, btn);
        qOptions.appendChild(btn);
    });
}

function checkAnswer(idx, btn) {
    if (idx === quizData[currentQ].ans) {
        currentQ++;
        if (currentQ < quizData.length) {
            loadQuestion();
        } else {
            // Unlock Gifts Section
            quizCont.classList.add("hidden");
            quizDone.classList.remove("hidden");
            presentsCard.classList.remove("locked");
        }
    } else {
        btn.classList.add("wrong");
        btn.innerText = "Try again! 😝";
        setTimeout(() => {
            btn.classList.remove("wrong");
            btn.innerText = quizData[currentQ].opts[idx];
        }, 800);
    }
}

loadQuestion();

/**
 * --- 5. Gift Modal & Camera Control ---
 * Handles the logic for opening virtual gifts.
 */
const modal = document.getElementById("gift-modal");
const modalImg = document.getElementById("modal-image");
const modalMsg = document.getElementById("modal-message");
const modalTitle = document.getElementById("modal-title");
const camCont = document.getElementById("camera-container");
const video = document.getElementById("camera-stream");
let activeStream = null;

const giftData = {
    flowers: { 
        title: "Virtual Flowers! 💐", 
        msg: "Because you deserve all the blooms in the world. Happy 4th Anniversary, Liza!", 
        img: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500" 
    },
    mirror: { 
        title: "Look Closely... 🪞", 
        msg: "This mirror reflects the most beautiful girl in the universe.", 
        img: null 
    },
    letter: { 
        title: "A Little Note 💌", 
        msg: "Four years have passed, and every day I find a new reason to love you more. Forever to go, bby.", 
        img: null 
    }
};

async function openGift(type) {
    const gift = giftData[type];
    modalTitle.innerText = gift.title;
    modalMsg.innerText = gift.msg;
    
    // Toggle Image
    if (gift.img) {
        modalImg.src = gift.img;
        modalImg.style.display = "block";
    } else {
        modalImg.style.display = "none";
    }

    // Toggle Camera (Mirror)
    if (type === 'mirror') {
        camCont.classList.remove("hidden");
        try {
            activeStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            video.srcObject = activeStream;
        } catch (e) {
            console.log("Cam Access Denied");
            modalMsg.innerText = "Oops! Please allow camera access to see the mirror view! 🥺";
        }
    } else {
        camCont.classList.add("hidden");
    }

    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
    
    // Stop camera stream to save battery and privacy
    if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
        activeStream = null;
    }
    video.srcObject = null;
}

// Close modal if user clicks outside of the content box
window.onclick = (e) => { if (e.target == modal) closeModal(); }