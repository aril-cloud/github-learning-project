class VinylPlayer {
    constructor() {
        this.albums = document.querySelectorAll('.album');
        this.currentIndex = 0;
        this.isPlaying = false;
        this.currentAlbum = null;

        this.vinylSpinner = document.getElementById('vinylSpinner');
        this.tonearm = document.getElementById('tonearm');
        this.nowPlaying = document.getElementById('nowPlaying');

        this.albumNames = [
            'Album One',
            'Album Two',
            'Album Three'
        ];

        this.init();
    }

    init() {
        // Set up album click events
        this.albums.forEach((album, index) => {
            const sleeve = album.querySelector('.sleeve');
            sleeve.addEventListener('click', () => this.playAlbum(index));
        });

        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.navigate(-1));
        document.getElementById('nextBtn').addEventListener('click', () => this.navigate(1));
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());

        // Show first album
        this.updateView();
    }

    navigate(direction) {
        if (this.isPlaying) return; // Don't navigate while playing

        this.currentIndex += direction;

        // Wrap around
        if (this.currentIndex < 0) this.currentIndex = this.albums.length - 1;
        if (this.currentIndex >= this.albums.length) this.currentIndex = 0;

        this.updateView();
    }

    updateView() {
        this.albums.forEach((album, index) => {
            if (index === this.currentIndex) {
                album.classList.remove('hidden');
                album.style.display = 'block';
            } else {
                album.classList.add('hidden');
                // Hide other albums completely for cleaner view
                setTimeout(() => {
                    if (index !== this.currentIndex) {
                        album.style.display = 'none';
                    }
                }, 300);
            }
        });
    }

    playAlbum(index) {
        if (index !== this.currentIndex) return; // Only play the current visible album

        // If already playing this album, do nothing
        if (this.isPlaying && this.currentAlbum === index) return;

        // Stop current playback if any
        if (this.isPlaying) {
            this.stop();
            setTimeout(() => this.startPlaying(index), 600);
        } else {
            this.startPlaying(index);
        }
    }

    startPlaying(index) {
        this.isPlaying = true;
        this.currentAlbum = index;

        const album = this.albums[index];
        const sleeve = album.querySelector('.sleeve');

        // Add playing class to trigger vinyl slide-out animation
        sleeve.classList.add('playing');

        // Wait for vinyl to slide out, then show it on turntable and start spinning
        setTimeout(() => {
            this.vinylSpinner.classList.add('visible');
            setTimeout(() => {
                this.vinylSpinner.classList.add('spinning');
                this.tonearm.classList.add('playing');
                this.nowPlaying.textContent = `Now Playing: ${this.albumNames[index]}`;
            }, 500);
        }, 600);
    }

    stop() {
        if (!this.isPlaying) return;

        // Stop spinning and remove tonearm
        this.vinylSpinner.classList.remove('spinning');
        this.tonearm.classList.remove('playing');

        // Wait a bit, then hide spinner and return vinyl to sleeve
        setTimeout(() => {
            this.vinylSpinner.classList.remove('visible');

            if (this.currentAlbum !== null) {
                const album = this.albums[this.currentAlbum];
                const sleeve = album.querySelector('.sleeve');
                sleeve.classList.remove('playing');
            }

            this.nowPlaying.textContent = 'Select an album to play';
            this.isPlaying = false;
            this.currentAlbum = null;
        }, 500);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VinylPlayer();
});
