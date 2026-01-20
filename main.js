// Languages array
const languages = [
    { text: 'ICH LIEBE DICH', name: 'Deutsch', color: '#ff6b9d', emoji: '🇩🇪', animation: 'slide' },
    { text: 'I LOVE YOU', name: 'English', color: '#ff8fab', emoji: '🇬🇧', animation: 'zoom' },
    { text: "JE T'AIME", name: 'Français', color: '#ffa6c1', emoji: '🇫🇷', animation: 'rotate' },
    { text: 'دوستت دارم', name: 'فارسی', color: '#ffb3d9', emoji: '🇮🇷', animation: 'wave' },
    { text: 'أحبك', name: 'العربية', color: '#ffc2e0', emoji: '💚', animation: 'bounce' },
    { text: 'HAMLAΓK', name: 'Taqbaylit', color: '#ffd1e8', emoji: '💙', animation: 'spiral' }
];

let currentLanguage = 0;
let clickCount = 0;

// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 60;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Create background shapes
function createBackgroundShapes() {
    const shapesContainer = document.getElementById('bgShapes');
    const shapes = ['💕', '💖', '💗', '💓', '💝', '✨', '⭐', '🌟'];
    
    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        shape.className = 'bg-shape';
        shape.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.animationDelay = `${Math.random() * 5}s`;
        shape.style.animationDuration = `${Math.random() * 10 + 15}s`;
        
        shapesContainer.appendChild(shape);
    }
}

// Create heart on click with emoji
function createClickHeart(x, y, emoji = '❤️') {
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.innerHTML = emoji;
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 3000);
}

// Create confetti burst
function createConfettiBurst(x, y) {
    const emojis = ['❤️', '💕', '💖', '💗', '💓', '💝', '✨', '⭐'];
    const count = 20;
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const angle = (Math.PI * 2 * i) / count;
            const distance = Math.random() * 150 + 50;
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            createClickHeart(targetX, targetY, emoji);
        }, i * 30);
    }
}

// Change language with animation
function changeLanguage() {
    const mainText = document.getElementById('mainText');
    const langName = document.getElementById('langName');
    const container = document.querySelector('.container');
    const message = document.getElementById('message');
    
    clickCount++;
    currentLanguage = (currentLanguage + 1) % languages.length;
    
    const lang = languages[currentLanguage];
    
    // Remove old animation classes
    message.classList.remove('slide-animation', 'zoom-animation', 'rotate-animation', 
                            'wave-animation', 'bounce-animation', 'spiral-animation');
    
    // Apply fade out
    message.style.opacity = '0';
    message.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        mainText.textContent = lang.text;
        langName.textContent = lang.name;
        
        // Update colors
        document.documentElement.style.setProperty('--accent-color', lang.color);
        
        // Add new animation
        message.classList.add(`${lang.animation}-animation`);
        message.style.opacity = '1';
        message.style.transform = 'scale(1)';
        
        // Update click counter
        document.getElementById('clickCount').textContent = `${clickCount}/${languages.length}`;
        
        // Check if all languages shown
        if (clickCount >= languages.length) {
            setTimeout(() => {
                document.getElementById('missMessage').classList.add('show');
            }, 1000);
        }
    }, 300);
}

// Handle click events
let isChangingLanguage = false;
document.addEventListener('click', (e) => {
    const emoji = languages[currentLanguage].emoji;
    createClickHeart(e.clientX, e.clientY, emoji);
    
    // Create multiple hearts for effect
    setTimeout(() => createClickHeart(e.clientX + 20, e.clientY - 10, emoji), 100);
    setTimeout(() => createClickHeart(e.clientX - 20, e.clientY - 10, emoji), 200);
    
    // Change language
    if (!isChangingLanguage) {
        isChangingLanguage = true;
        changeLanguage();
        setTimeout(() => {
            isChangingLanguage = false;
        }, 500);
    }
});

// Sparkle effect
function createSparkles() {
    setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        createClickHeart(x, y, '✨');
    }, 2000);
}

// Keyboard interaction
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        createConfettiBurst(centerX, centerY);
        changeLanguage();
    }
});

// Heart hover effect
const heartContainer = document.querySelector('.heart-container');
heartContainer.addEventListener('mouseenter', () => {
    heartContainer.style.transform = 'scale(1.3) rotate(10deg)';
});

heartContainer.addEventListener('mouseleave', () => {
    heartContainer.style.transform = 'scale(1) rotate(0deg)';
});

// Double click on heart
heartContainer.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    const rect = heartContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    createConfettiBurst(centerX, centerY);
});

// Initialize on load
window.addEventListener('load', () => {
    createParticles();
    createBackgroundShapes();
    createSparkles();
    
    // Hide click hint after first click
    let firstClick = true;
    document.addEventListener('click', () => {
        if (firstClick) {
            document.getElementById('clickHint').style.opacity = '0.5';
            firstClick = false;
        }
    }, { once: true });
    
    // Initial color
    document.documentElement.style.setProperty('--accent-color', languages[0].color);
});