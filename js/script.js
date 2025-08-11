document.addEventListener('DOMContentLoaded', () => {
    const fightersGrid = document.getElementById('fightersGrid');
    const searchInput = document.getElementById('searchInput');
    const musicToggle = document.getElementById('music-toggle');
    const patrioticSong = document.getElementById('patrioticSong');
    const modal = document.getElementById('fighterModal');
    const closeModal = document.querySelector('.close-button');
    let allFightersData = [];

    // --- 1. Fetch and Display Freedom Fighters ---
    fetch('data/fighters.json')
        .then(response => response.json())
        .then(data => {
            allFightersData = data;
            displayFighters(allFightersData);
        })
        .catch(error => console.error('Error fetching fighter data:', error));

    function displayFighters(fighters) {
        fightersGrid.innerHTML = ''; // Clear existing cards
        fighters.forEach(fighter => {
            const card = document.createElement('div');
            card.className = 'card';
            card.setAttribute('data-aos', 'fade-up');
            card.innerHTML = `
                <img src="${fighter.image}" alt="${fighter.name}">
                <div class="card-content">
                    <h3>${fighter.name}</h3>
                    <p class="dates">${fighter.birth_date} - ${fighter.death_date}</p>
                    <p class="nickname">"${fighter.nickname}"</p>
                    <button class="more-btn" data-id="${fighter.id}">More</button>
                </div>
            `;
            fightersGrid.appendChild(card);
        });
        
        // Add event listeners to the new "More" buttons
        addMoreButtonListeners();
    }

    // --- 2. Search Functionality ---
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredFighters = allFightersData.filter(fighter => 
            fighter.name.toLowerCase().includes(searchTerm) ||
            fighter.nickname.toLowerCase().includes(searchTerm)
        );
        displayFighters(filteredFighters);
    });

    // --- 3. Modal Popup Functionality ---
    function addMoreButtonListeners() {
        const moreButtons = document.querySelectorAll('.more-btn');
        moreButtons.forEach(button => {
            button.addEventListener('click', () => {
                const fighterId = parseInt(button.getAttribute('data-id'));
                const fighterData = allFightersData.find(f => f.id === fighterId);
                openModal(fighterData);
            });
        });
    }
    
    function openModal(fighter) {
        document.getElementById('modalImg').src = fighter.image;
        document.getElementById('modalName').textContent = fighter.name;
        document.getElementById('modalDates').textContent = `${fighter.birth_date} - ${fighter.death_date}`;
        document.getElementById('modalNickname').textContent = `Also known as: ${fighter.nickname}`;
        document.getElementById('modalDetails').textContent = fighter.details;
        modal.style.display = 'block';
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // --- 4. Audio Controls ---
    // A trick to ensure autoplay works on modern browsers
    patrioticSong.volume = 0.5; // Set a default volume
    const playPromise = patrioticSong.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // Autoplay was prevented. Show a "play" icon to encourage user interaction.
            musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        });
    }

    musicToggle.addEventListener('click', () => {
        if (patrioticSong.paused) {
            patrioticSong.play();
            musicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        } else {
            patrioticSong.pause();
            musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // ... all your other code for fetching data, search, and modal ...
    // ... (keep that code as it is) ...

    const musicToggle = document.getElementById('music-toggle');
    const patrioticSong = document.getElementById('patrioticSong');

    // --- NEW Autoplay Logic ---

    // 1. Mute the audio initially to allow autoplay
    patrioticSong.muted = true;
    patrioticSong.volume = 0.5; // We can set the volume, but it will be muted

    // 2. Try to play the muted audio
    const playPromise = patrioticSong.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Autoplay of muted audio started successfully.
            // The icon will show 'muted' state initially.
            musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            console.log("Muted audio is playing automatically.");

            // 3. Create a function to unmute on first user interaction
            const unmuteOnFirstInteraction = () => {
                if (patrioticSong.muted) {
                    patrioticSong.muted = false;
                    musicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                    console.log("Audio unmuted on user interaction.");
                }
                // 4. Remove the event listener after the first interaction
                // so it doesn't run again.
                window.removeEventListener('click', unmuteOnFirstInteraction);
                window.removeEventListener('scroll', unmuteOnFirstInteraction);
                window.removeEventListener('keypress', unmuteOnFirstInteraction);
            };

            // 5. Add event listeners for the first interaction
            window.addEventListener('click', unmuteOnFirstInteraction);
            window.addEventListener('scroll', unmuteOnFirstInteraction);
            window.addEventListener('keypress', unmuteOnFirstInteraction);

        }).catch(error => {
            // Even muted autoplay was blocked, which is rare but possible.
            // In this case, the user must click the button to start.
            console.error("Muted autoplay was also prevented:", error);
            musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        });
    }

    // This part controls the manual toggle button
    musicToggle.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents the window click listener from firing
        if (patrioticSong.paused) {
            patrioticSong.play();
            patrioticSong.muted = false;
            musicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        } else {
            // Toggle mute/unmute if already playing
            if (patrioticSong.muted) {
                patrioticSong.muted = false;
                musicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            } else {
                patrioticSong.muted = true;
                musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            }
        }
    });

    // ... your other existing code ...
});