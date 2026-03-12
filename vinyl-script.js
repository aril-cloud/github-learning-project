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
            'Branch One',
            'Branch Two',
            'Branch Three'
        ];

        this.init();
    }

    init() {
        // Set up album click events
        this.albums.forEach((album, index) => {
            const sleeve = album.querySelector('.sleeve');
            // Click center album to play
            sleeve.addEventListener('click', () => {
                if (index === this.currentIndex) {
                    this.playAlbum(index);
                }
            });
        });

        // Mouse-based elastic navigation
        document.addEventListener('mousemove', (e) => {
            if (this.isPlaying) return;

            const windowWidth = window.innerWidth;
            const mouseX = e.clientX;
            const position = mouseX / windowWidth; // 0 to 1

            // Map position to album index
            const totalAlbums = this.albums.length;
            const targetIndex = Math.round(position * (totalAlbums - 1));

            if (targetIndex !== this.currentIndex) {
                this.navigateToIndex(targetIndex);
            }
        });

        // Stop button
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());

        // Show first album
        this.updateView();
    }

    navigate(direction) {
        // If currently playing, stop first
        if (this.isPlaying) {
            this.stop();
        }

        this.currentIndex += direction;

        // Wrap around
        if (this.currentIndex < 0) this.currentIndex = this.albums.length - 1;
        if (this.currentIndex >= this.albums.length) this.currentIndex = 0;

        this.updateView();
    }

    navigateToIndex(index) {
        // If currently playing, stop first
        if (this.isPlaying) {
            this.stop();
        }
        this.currentIndex = index;
        this.updateView();
    }

    updateView() {
        // Update background color based on selected album
        document.body.setAttribute('data-album', this.currentIndex);

        // Update coverflow positions
        this.albums.forEach((album, index) => {
            const position = index - this.currentIndex;

            // Remove old position attributes
            album.removeAttribute('data-position');

            // Set new position
            if (position === 0) {
                album.setAttribute('data-position', '0');
            } else if (position === -1) {
                album.setAttribute('data-position', '-1');
            } else if (position === 1) {
                album.setAttribute('data-position', '1');
            } else if (position < -1) {
                album.setAttribute('data-position', 'hidden-left');
            } else if (position > 1) {
                album.setAttribute('data-position', 'hidden-right');
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
        const vinyl = album.querySelector('.vinyl');

        // Add playing class to trigger vinyl slide-out animation
        sleeve.classList.add('playing');

        // Wait for vinyl to slide up, then start spinning
        setTimeout(() => {
            vinyl.classList.add('spinning');
            this.tonearm.classList.add('playing');
            this.nowPlaying.textContent = `Now Playing: ${this.albumNames[index]}`;
        }, 600);
    }

    stop() {
        if (!this.isPlaying) return;

        // Stop spinning and remove tonearm
        this.tonearm.classList.remove('playing');

        if (this.currentAlbum !== null) {
            const album = this.albums[this.currentAlbum];
            const sleeve = album.querySelector('.sleeve');
            const vinyl = album.querySelector('.vinyl');

            // Stop spinning and return to sleeve
            vinyl.classList.remove('spinning');
            sleeve.classList.remove('playing');
        }

        this.nowPlaying.textContent = 'Select branch';
        this.isPlaying = false;
        this.currentAlbum = null;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VinylPlayer();
});
