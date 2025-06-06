document.addEventListener('DOMContentLoaded', () => {
    showRandomPlaylist();
});

function showRandomPlaylist() {
    document.querySelector('.featured-content').innerHTML = `
        <div id="loading">Loading featured playlist...</div>
    `;

    try {
        const modals = document.querySelectorAll(".modal-overlay");
        const randomIndex = Math.floor(Math.random() * modals.length);
        const selectedModal = modals[randomIndex];

        const playlistCover = selectedModal.querySelector('.playlist-cover').src;
        const playlistName = selectedModal.querySelector('.playlist-info h2').textContent;
        const playlistCreator = selectedModal.querySelector('.playlist-info p').textContent;

        const songBoxes = selectedModal.querySelectorAll('.song-box');
        const songBoxesArray = Array.from(songBoxes);

        for (let i = songBoxesArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [songBoxesArray[i], songBoxesArray[j]] = [songBoxesArray[j], songBoxesArray[i]];
        }
        let featuredHTML = `
            <div class="featured-playlist">
                <div class="featured-header">
                    <div class="featured-image">
                        <img src="${playlistCover}" alt="${playlistName}" class="featured-cover">
                    </div>
                    <div class="featured-info">
                        <h3>${playlistName}</h3>
                        <p>${playlistCreator}</p>
                        <button class="shuffle-button">
                            <i class="material-icons">shuffle</i> Shuffle Songs
                        </button>
                    </div>
                </div>
                <div class="featured-songs">
                    <h4>Songs</h4>
                    <div class="song-boxes">
        `;

        songBoxesArray.forEach(songBox => {
            const duration = songBox.querySelector('.duration').textContent;
            const songCover = songBox.querySelector('.song-cover').src;
            const songTitle = songBox.querySelector('.song-title').textContent;
            const songArtist = songBox.querySelector('.song-artist').textContent;
            const songAlbum = songBox.querySelector('.song-album').textContent;

            featuredHTML += `
                <div class="song-box">
                    <span class="duration">${duration}</span>
                    <img src="${songCover}" alt="${songTitle}" class="song-cover">
                    <div class="song-details">
                        <p class="song-title">${songTitle}</p>
                        <p class="song-artist">${songArtist}</p>
                        <p class="song-album">${songAlbum}</p>
                    </div>
                </div>
            `;
        });

        featuredHTML += `
                    </div>
                </div>
            </div>
        `;

        document.querySelector('.featured-content').innerHTML = featuredHTML;

        const shuffleButton = document.querySelector('.featured-content .shuffle-button');
        if (shuffleButton) {
            shuffleButton.addEventListener('click', function() {
                const songBoxes = document.querySelectorAll('.featured-content .song-box');
                const songBoxesArray = Array.from(songBoxes);
                const songBoxesContainer = document.querySelector('.featured-content .song-boxes');

                songBoxesContainer.innerHTML = '';

                for (let i = songBoxesArray.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [songBoxesArray[i], songBoxesArray[j]] = [songBoxesArray[j], songBoxesArray[i]];
                }

                this.classList.add('shuffling');

                songBoxesArray.forEach((songBox, index) => {
                    setTimeout(() => {
                        songBox.style.opacity = '0';
                        songBoxesContainer.appendChild(songBox);

                        void songBox.offsetWidth;

                        songBox.style.opacity = '1';
                    }, index * 150);
                });

                setTimeout(() => {
                    this.classList.remove('shuffling');
                }, songBoxesArray.length * 150 + 300);
            });
        }

        console.log(`Featured playlist: ${playlistName}`);
    } catch (error) {
        console.error('Error showing random playlist:', error);
        document.querySelector('.featured-content').innerHTML = `
            <div class="error-message">
                <p>Sorry, we couldn't load the featured playlist. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}
