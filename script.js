const bgCanvas = document.getElementById('starfield-bg');
const bgCtx = bgCanvas.getContext('2d');

function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    createStars(bgCtx, bgCanvas, 250);
}

function createStars(ctx, canvas, count) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5;
        const alpha = Math.random() * 0.7 + 0.1;

        ctx.fillStyle = `rgba(200, 200, 220, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

window.addEventListener('resize', resizeBgCanvas);
resizeBgCanvas();

const introCanvas = document.getElementById('intro-canvas');
const introCtx = introCanvas.getContext('2d');
let introStars = [];
let isIntroRunning = true;

function resizeIntroCanvas() {
    introCanvas.width = window.innerWidth;
    introCanvas.height = window.innerHeight;
}
resizeIntroCanvas();
window.addEventListener('resize', resizeIntroCanvas);

class IntroStar {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = (Math.random() - 0.5) * introCanvas.width * 2;
        this.y = (Math.random() - 0.5) * introCanvas.height * 2;
        this.z = Math.random() * introCanvas.width;
        this.oldZ = this.z;
        this.size = Math.random() * 2 + 1;
    }
    update(speed) {
        this.oldZ = this.z;
        this.z -= speed;
        if (this.z <= 1) this.reset();
    }
    draw() {
        let x, y, size;
        let scale = introCanvas.width / this.z;
        x = this.x * scale + introCanvas.width / 2;
        y = this.y * scale + introCanvas.height / 2;
        size = this.size * scale;

        if (x >= 0 && x <= introCanvas.width && y >= 0 && y <= introCanvas.height) {
            introCtx.fillStyle = '#fff';
            introCtx.beginPath();
            introCtx.arc(x, y, size, 0, Math.PI * 2);
            introCtx.fill();
        }
    }
}

for (let i = 0; i < 600; i++) introStars.push(new IntroStar());

let warpSpeed = 10;
const targetWarpSpeed = 0.5;
let introCompleteTriggered = false;

function animateIntro() {
    if (!isIntroRunning) return;
    introCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    introCtx.fillRect(0, 0, introCanvas.width, introCanvas.height);

    if (warpSpeed > targetWarpSpeed) {
        warpSpeed -= 0.05;
    } else if (!introCompleteTriggered) {
        triggerIntroComplete();
        introCompleteTriggered = true;
    }

    introStars.forEach(star => {
        star.update(warpSpeed);
        star.draw();
    });
    requestAnimationFrame(animateIntro);
}

animateIntro();


const introScreen = document.getElementById('intro-screen');
const contentWrapper = document.getElementById('content-wrapper');
const animatedObjects = document.querySelectorAll('.slide-up');

function triggerIntroComplete() {
    setTimeout(() => {
        isIntroRunning = false;
        introScreen.classList.add('fade-out');

        contentWrapper.classList.add('active');
        
        animatedObjects.forEach(obj => {
            obj.classList.add('animate');
        });

    }, 1000);
}


function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    let birthday = new Date(currentYear, 3, 11, 0, 0, 0);

    if (now > birthday) {
        birthday.setFullYear(currentYear + 1);
    }

    const diff = birthday - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const formatTime = (time) => time < 10 ? `0${time}` : time;

    document.getElementById('countdown').innerHTML = 
        `${days}д : ${formatTime(hours)}ч : ${formatTime(minutes)}м : ${formatTime(seconds)}с`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

const audio = document.getElementById('bg-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const volumeSlider = document.getElementById('volume-slider');

audio.volume = volumeSlider.value;

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = '⏸'; // Значок паузы
    } else {
        audio.pause();
        playPauseBtn.textContent = '▶'; // Значок плей
    }
});

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

audio.addEventListener('ended', () => {
    playPauseBtn.textContent = '▶';
});