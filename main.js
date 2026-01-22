const loveMessages = [
    "I love you because you are everything I have ever wished for in a woman.",
    "I love you because within you lies a beauty I can hardly bear. It overwhelms me.",
    "I love your hazel eyes. They reflect a glow that no moon could ever match.",
    "I love your kindness because it brings beauty to a dull world.",
    "I love your affection through words because even when we cannot see each other you make me feel close.",
    "I love you because your faith mirrors mine and unites us in spirit.",
    "I love you because you understand me better than anyone ever could.",
    "I love you because you were the answer to my prayers.",
    "I love you so deeply that I have shed tears just thinking of you.",
    "I love the brightness of your smile. It lights up my days.",
    "I love your warm comforting presence. It makes me feel safe.",
    "I love your intelligence. It inspires and fascinates me.",
    "I love your kindness and the way you care for others.",
    "I love your messages. They always bring a smile and a blush to my face.",
    "I love you simply because the whole universe conspired for me to love you with all of my heart."
];

const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '💞', '💘'];
let currentMessageIndex = 0;
let isTransitioning = false;

// Create floating hearts background
function createFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    const heartCount = 20;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 15}s`;
        heart.style.animationDuration = `${Math.random() * 10 + 12}s`;
        
        heartsContainer.appendChild(heart);
    }
}

// Update message content
function updateMessage() {
    const messageElement = document.getElementById('loveMessage');
    const numberElement = document.getElementById('messageNumber');
    
    messageElement.textContent = loveMessages[currentMessageIndex];
    numberElement.textContent = `${currentMessageIndex + 1} of ${loveMessages.length}`;
}

// Create sparkle effect on click
function createSparkle(x, y) {
    const sparkles = ['✨', '💫', '⭐', '🌟'];
    const count = 5;
    
    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'click-sparkle';
        sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
        
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = (Math.random() - 0.5) * 60;
        
        sparkle.style.left = `${x + offsetX}px`;
        sparkle.style.top = `${y + offsetY}px`;
        sparkle.style.animationDelay = `${i * 0.1}s`;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 2000);
    }
}

// Move to next message
function nextMessage() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    const card = document.getElementById('card');
    const navHint = document.getElementById('navHint');
    
    // Hide navigation hint after first click
    if (currentMessageIndex === 0) {
        navHint.classList.add('hidden');
    }
    
    // Check if at the end
    if (currentMessageIndex >= loveMessages.length - 1) {
        // Show final message
        card.classList.remove('active');
        card.classList.add('fade-out');
        
        setTimeout(() => {
            document.getElementById('finalMessage').classList.add('show');
        }, 800);
        return;
    }
    
    // Fade out current card
    card.classList.remove('active');
    card.classList.add('fade-out');
    
    setTimeout(() => {
        // Update to next message
        currentMessageIndex++;
        updateMessage();
        
        // Fade in new card
        card.classList.remove('fade-out');
        card.classList.add('active');
        
        isTransitioning = false;
    }, 600);
}

// Click event handler
document.addEventListener('click', (e) => {
    createSparkle(e.clientX, e.clientY);
    nextMessage();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        createSparkle(centerX, centerY);
        nextMessage();
    }
});

// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
        // Swiped left
        nextMessage();
    }
}

// Initialize on load
window.addEventListener('load', () => {
    createFloatingHearts();
    updateMessage();
    
    // Show initial card with animation
    setTimeout(() => {
        document.getElementById('card').classList.add('active');
    }, 300);
});