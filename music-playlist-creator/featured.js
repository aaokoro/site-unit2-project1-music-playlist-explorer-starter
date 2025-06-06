// Featured Playlist JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initial load of featured playlist modal
    showRandomPlaylistModal();

    // Add event listener for shuffle button
    const shuffleButton = document.getElementById('shuffle-featured');
    if (shuffleButton) {
        shuffleButton.addEventListener('click', () => {
            // Add animation class to button
            shuffleButton.classList.add('shuffling');

            // Close any open modals
            closeAllModals();

            // Show a new random playlist modal
            showRandomPlaylistModal();

            // Remove animation class after animation completes
            setTimeout(() => {
                shuffleButton.classList.remove('shuffling');
            }, 500);
        });
    }
});

function showRandomPlaylistModal() {
    // Show loading state
    document.querySelector('.featured-content').innerHTML = `
        <div id="loading">Loading featured playlist...</div>
    `;

    try {
        // Get all modals from the page
        const modals = document.querySelectorAll(".modal-overlay");

        // Select a random modal index (0 to modals.length-1)
        const randomIndex = Math.floor(Math.random() * modals.length);

        // Get the selected modal
        const selectedModal = modals[randomIndex];

        // Clone the modal content
        const modalClone = selectedModal.cloneNode(true);

        // Remove the ID to avoid duplicate IDs
        modalClone.removeAttribute('id');

        // Add a class to identify it as the featured modal
        modalClone.classList.add('featured-modal');

        // Set display to flex to make it visible
        modalClone.style.display = 'flex';

        // Get the playlist name from the modal
        const playlistName = modalClone.querySelector('.playlist-info h2').textContent;

        // Replace loading message with the modal clone
        document.querySelector('.featured-content').innerHTML = '';
        document.querySelector('.featured-content').appendChild(modalClone);

        // Add event listener to the close button in the cloned modal
        const closeButton = modalClone.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                // Show a new random playlist modal when closed
                showRandomPlaylistModal();
            });
        }

        // Add event listeners to the shuffle button in the cloned modal
        const shuffleButton = modalClone.querySelector('.shuffle-button');
        if (shuffleButton) {
            shuffleButton.addEventListener('click', function() {
                // Find the song boxes in the cloned modal
                const songBoxes = modalClone.querySelectorAll('.song-box');
                const songBoxesArray = Array.from(songBoxes);
                const songBoxesContainer = modalClone.querySelector('.song-boxes');

                // Remove all song boxes from the container
                songBoxesContainer.innerHTML = '';

                // Shuffle the array of song boxes
                for (let i = songBoxesArray.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [songBoxesArray[i], songBoxesArray[j]] = [songBoxesArray[j], songBoxesArray[i]];
                }

                // Add a visual effect to the shuffle button
                this.classList.add('shuffling');

                // Re-append the shuffled song boxes to the container with a staggered animation
                songBoxesArray.forEach((songBox, index) => {
                    setTimeout(() => {
                        songBox.style.opacity = '0';
                        songBoxesContainer.appendChild(songBox);

                        // Trigger reflow to ensure animation works
                        void songBox.offsetWidth;

                        songBox.style.opacity = '1';
                    }, index * 150);
                });

                // Remove the visual effect after animation completes
                setTimeout(() => {
                    this.classList.remove('shuffling');
                }, songBoxesArray.length * 150 + 300);
            });
        }

        console.log(`Featured playlist: ${playlistName}`);
    } catch (error) {
        console.error('Error showing random playlist modal:', error);
        document.querySelector('.featured-content').innerHTML = `
            <div class="error-message">
                <p>Sorry, we couldn't load the featured playlist. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

// Function to close all modals (copied from script.js)
function closeAllModals() {
    const modals = document.querySelectorAll(".modal-overlay");
    modals.forEach(modal => {
        modal.style.display = "none";
    });
}
