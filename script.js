// Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-bg');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.fontSize = 16;
        this.columns = this.canvas.width / this.fontSize;
        this.drops = Array(Math.floor(this.columns)).fill(1);

        window.addEventListener('resize', () => this.resize());
        this.draw();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = this.canvas.width / this.fontSize;
        this.drops = Array(Math.floor(this.columns)).fill(1);
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(char, x, y);

            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }

        requestAnimationFrame(() => this.draw());
    }
}

class SwipeableCards {
    constructor() {
        this.cards = document.querySelectorAll('.card');
        this.currentCard = null;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.isDragging = false;
        this.cardIndex = this.cards.length - 1;

        this.init();
    }

    init() {
        // Set up cards
        this.cards.forEach((card, index) => {
            card.style.zIndex = this.cards.length - index;

            // Mouse events
            card.addEventListener('mousedown', (e) => this.startDrag(e));

            // Touch events
            card.addEventListener('touchstart', (e) => this.startDrag(e));
        });

        // Global mouse/touch events
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        document.addEventListener('touchmove', (e) => this.drag(e));
        document.addEventListener('touchend', () => this.endDrag());

        // Button events
        document.getElementById('like').addEventListener('click', () => this.swipeRight());
        document.getElementById('nope').addEventListener('click', () => this.swipeLeft());

        this.updateCurrentCard();
    }

    updateCurrentCard() {
        this.currentCard = this.cards[this.cardIndex];
    }

    startDrag(e) {
        if (!this.currentCard) return;

        this.isDragging = true;
        this.currentCard.classList.add('swiping');

        const touch = e.type.includes('touch') ? e.touches[0] : e;
        this.startX = touch.clientX;
        this.startY = touch.clientY;
    }

    drag(e) {
        if (!this.isDragging || !this.currentCard) return;

        e.preventDefault();
        const touch = e.type.includes('touch') ? e.touches[0] : e;
        this.currentX = touch.clientX - this.startX;
        this.currentY = touch.clientY - this.startY;

        const rotate = this.currentX * 0.1;
        this.currentCard.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${rotate}deg)`;

        // Show like/nope indicator
        if (this.currentX > 50) {
            this.currentCard.classList.add('like');
            this.currentCard.classList.remove('nope');
        } else if (this.currentX < -50) {
            this.currentCard.classList.add('nope');
            this.currentCard.classList.remove('like');
        } else {
            this.currentCard.classList.remove('like', 'nope');
        }
    }

    endDrag() {
        if (!this.isDragging || !this.currentCard) return;

        this.isDragging = false;
        this.currentCard.classList.remove('swiping');

        const threshold = 100;

        if (this.currentX > threshold) {
            this.animateSwipe('right');
        } else if (this.currentX < -threshold) {
            this.animateSwipe('left');
        } else {
            // Return to center
            this.currentCard.style.transform = '';
            this.currentCard.classList.remove('like', 'nope');
        }
    }

    animateSwipe(direction) {
        const distance = direction === 'right' ? 1000 : -1000;
        this.currentCard.classList.add('removed');
        this.currentCard.style.transform = `translateX(${distance}px) rotate(${distance * 0.1}deg)`;

        const status = document.getElementById('status');
        status.textContent = direction === 'right' ? 'Liked!' : 'Nope!';

        setTimeout(() => {
            if (this.currentCard) {
                this.currentCard.remove();
            }
            this.cardIndex--;

            if (this.cardIndex >= 0) {
                this.updateCurrentCard();
            } else {
                status.textContent = 'No more cards!';
            }
        }, 300);
    }

    swipeLeft() {
        if (!this.currentCard) return;
        this.currentX = -200;
        this.animateSwipe('left');
    }

    swipeRight() {
        if (!this.currentCard) return;
        this.currentX = 200;
        this.animateSwipe('right');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MatrixRain();
    new SwipeableCards();
});
