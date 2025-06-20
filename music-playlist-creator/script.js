const modals = document.querySelectorAll(".modal-overlay");
const closeButtons = document.querySelectorAll(".close-button");
const cards = document.querySelectorAll(".card");

function openModal(modalId) {
   const modal = document.getElementById(modalId);
   if (modal) {
      modal.style.display = "flex";
   }
}

function closeAllModals() {
   modals.forEach(modal => {
      modal.style.display = "none";
   });
}

closeButtons.forEach(button => {
   button.addEventListener("click", closeAllModals);
});

window.onclick = function(event) {
   if (event.target.classList.contains("modal-overlay")) {
      closeAllModals();
   }
}

cards.forEach((card, index) => {
   card.addEventListener("click", function(event) {
      if (!event.target.closest(".like-button")) {
         openModal(`modal-${index}`);
      }
   });
});

const likeButtons = document.querySelectorAll(".card .like-button");

function initializeLikeButtons() {
  likeButtons.forEach((button, index) => {
    const likeCount = button.querySelector(".like-count");
    const storageKey = `playlistLikes_${index}`;
    let isLiked = false; // Default to unliked state

    // Get the initial like count from the HTML
    let currentLikes = parseInt(likeCount.textContent) || 0; // Get from HTML

    // Always start with unliked state regardless of count
    isLiked = false;

    // If there are saved likes in localStorage, use those instead
    const savedLikes = localStorage.getItem(storageKey);
    if (savedLikes !== null) {
      currentLikes = parseInt(savedLikes);
    }

    // Update initial state
    updateLikeButton(button, likeCount, isLiked, currentLikes, storageKey);

    // Add click event to this like button
    button.addEventListener("click", (event) => {
      // Prevent the card click event from firing
      event.stopPropagation();

      isLiked = !isLiked;

      if (isLiked) {
        currentLikes++;

        // Add animation
        likeCount.classList.add("like-animation");
        setTimeout(() => {
          likeCount.classList.remove("like-animation");
        }, 500);
      } else {
        if (currentLikes > 0) {
          currentLikes--;
        }
      }

      updateLikeButton(button, likeCount, isLiked, currentLikes, storageKey);
    });
  });
}

function updateLikeButton(button, likeCount, isLiked, currentLikes, storageKey) {
  // Update like button appearance
  if (isLiked) {
    button.classList.add("liked");
  } else {
    button.classList.remove("liked");
  }

  // Update like count
  likeCount.textContent = currentLikes;

  // Save to localStorage
  localStorage.setItem(storageKey, currentLikes);
}

function clearLikeStorage() {
  for (let i = 0; i < 9; i++) {
    localStorage.removeItem(`playlistLikes_${i}`);
  }
}

clearLikeStorage();

document.addEventListener("DOMContentLoaded", () => {
  initializeLikeButtons();
  initializeSearch();
});

initializeLikeButtons();
initializeSearch();

function initializeSearch() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const cards = document.querySelectorAll('.card');

  if (!searchForm || !searchInput) return;

  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === '') {
      // Show all cards if search is empty
      cards.forEach(card => {
        card.style.display = 'flex';
      });
      return;
    }

    // Filter cards based on search term
    cards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const creator = card.querySelector('p').textContent.toLowerCase();

      if (title.includes(searchTerm) || creator.includes(searchTerm)) {
        card.style.display = 'flex';
        // Add a subtle highlight animation
        card.classList.add('search-match');
        setTimeout(() => {
          card.classList.remove('search-match');
        }, 1000);
      } else {
        card.style.display = 'none';
      }
    });
  });

  searchInput.addEventListener('input', function() {
    if (this.value.trim() === '') {
      cards.forEach(card => {
        card.style.display = 'flex';
      });
    }
  });
}

const shuffleButtons = document.querySelectorAll(".shuffle-button");

shuffleButtons.forEach(button => {
  button.addEventListener("click", function() {
    // Find the current modal and its song boxes
    const modal = this.closest(".modal-content");
    const songBoxes = modal.querySelectorAll('.song-box');
    const songBoxesArray = Array.from(songBoxes);
    const songBoxesContainer = modal.querySelector('.song-boxes');

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
});
