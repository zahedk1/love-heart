// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2px and 8px
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random horizontal position
        particle.style.left = `${Math.random() * 100}%`;
        
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 15}s`;
        
        // Random animation duration
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Create heart on click
function createClickHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.innerHTML = '❤️';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    
    document.body.appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 3000);
}

// Handle click events
document.addEventListener('click', (e) => {
    createClickHeart(e.clientX, e.clientY);
    
    // Create multiple hearts for extra effect
    setTimeout(() => createClickHeart(e.clientX + 20, e.clientY - 10), 100);
    setTimeout(() => createClickHeart(e.clientX - 20, e.clientY - 10), 200);
});

// Create sparkle effect around text
function createSparkles() {
    const message = document.querySelector('.message');
    const sparkleCount = 20;
    
    setInterval(() => {
        for (let i = 0; i < 3; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'absolute';
            sparkle.style.color = 'white';
            sparkle.style.fontSize = '1.5rem';
            sparkle.innerHTML = '✨';
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.pointerEvents = 'none';
            sparkle.className = 'click-heart';
            
            message.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 3000);
        }
    }, 2000);
}

// Add keyboard interaction
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        createClickHeart(centerX, centerY);
        createClickHeart(centerX + 30, centerY - 20);
        createClickHeart(centerX - 30, centerY - 20);
        createClickHeart(centerX + 15, centerY + 20);
        createClickHeart(centerX - 15, centerY + 20);
    }
});

function heartBurst() {
    setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        createClickHeart(x, y);
    }, 3000);
}

window.addEventListener('load', () => {
    createParticles();
    createSparkles();
    heartBurst();
    
    let firstClick = true;
    document.addEventListener('click', () => {
        if (firstClick) {
            document.querySelector('.click-hint').style.opacity = '0';
            firstClick = false;
        }
    }, { once: true });
});

const heartContainer = document.querySelector('.heart-container');
heartContainer.addEventListener('mouseenter', () => {
    heartContainer.style.transform = 'scale(1.2)';
});

heartContainer.addEventListener('mouseleave', () => {
    heartContainer.style.transform = 'scale(1)';
});

heartContainer.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    const rect = heartContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const angle = (Math.PI * 2 * i) / 20;
            const distance = 100;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            createClickHeart(x, y);
        }, i * 50);
    }
});