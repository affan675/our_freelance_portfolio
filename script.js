// aetherglow.js

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const modeSwitcherBtn = document.getElementById('mode-switcher-btn');
    const constellationCards = document.querySelectorAll('.constellation-card');

    let currentModeIndex = 0;
    const modes = ['dark-mode', 'dusk-mode', 'dawn-mode', 'day-mode'];
    const modeDisplayNames = ['Dark', 'Dusk', 'Dawn', 'Day'];

    // --- Mode Switching Logic ---
    const applyMode = (modeName) => {
        // Remove all mode classes
        modes.forEach(mode => body.classList.remove(mode));

        // Add the new mode class
        body.classList.add(modeName);

        // Update button text
        const displayIndex = modes.indexOf(modeName);
        modeSwitcherBtn.textContent = `Switch Mode: ${modeDisplayNames[displayIndex]}`;

        // Save preference to localStorage
        localStorage.setItem('aetherglow-mode', modeName);
    };

    // Initialize mode from localStorage or based on time
    const initializeMode = () => {
        const savedMode = localStorage.getItem('aetherglow-mode');
        if (savedMode && modes.includes(savedMode)) {
            currentModeIndex = modes.indexOf(savedMode);
            applyMode(savedMode);
        } else {
            // Default to dark mode or based on current time (for a more "enchanted" feel)
            const now = new Date();
            const hour = now.getHours();

            if (hour >= 5 && hour < 10) { // 5 AM to 9:59 AM
                currentModeIndex = 2; // Dawn
            } else if (hour >= 10 && hour < 17) { // 10 AM to 4:59 PM
                currentModeIndex = 3; // Day
            } else if (hour >= 17 && hour < 20) { // 5 PM to 7:59 PM
                currentModeIndex = 1; // Dusk
            } else { // 8 PM to 4:59 AM
                currentModeIndex = 0; // Dark
            }
            applyMode(modes[currentModeIndex]);
        }
    };

    initializeMode(); // Apply mode on load

    modeSwitcherBtn.addEventListener('click', () => {
        currentModeIndex = (currentModeIndex + 1) % modes.length;
        applyMode(modes[currentModeIndex]);
    });

    // --- Constellate Effect on Cards ---
    constellationCards.forEach(card => {
        const svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgContainer.classList.add('constellation-lines');
        svgContainer.setAttribute('width', '100%');
        svgContainer.setAttribute('height', '100%');
        card.appendChild(svgContainer);

        const cardPointsData = JSON.parse(card.dataset.points); // Expected format: [[x1,y1],[x2,y2],...]

        card.addEventListener('mouseenter', () => {
            const cardRect = card.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;

            // Clear previous lines
            svgContainer.innerHTML = '';

            // Draw lines between all points to create a "constellation"
            for (let i = 0; i < cardPointsData.length; i++) {
                for (let j = i + 1; j < cardPointsData.length; j++) {
                    const point1 = cardPointsData[i];
                    const point2 = cardPointsData[j];

                    const x1 = point1[0] * cardWidth;
                    const y1 = point1[1] * cardHeight;
                    const x2 = point2[0] * cardWidth;
                    const y2 = point2[1] * cardHeight;

                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', x1);
                    line.setAttribute('y1', y1);
                    line.setAttribute('x2', x2);
                    line.setAttribute('y2', y2);
                    line.classList.add('constellation-line');
                    svgContainer.appendChild(line);

                    // Add subtle animation (e.g., stroke-dasharray animation)
                    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    line.style.strokeDasharray = length;
                    line.style.strokeDashoffset = length;
                    // Trigger animation with a slight delay for staggered effect
                    setTimeout(() => {
                        line.style.strokeDashoffset = 0;
                    }, Math.random() * 200 + 50); // Random delay for organic feel
                }
            }
        });

        card.addEventListener('mouseleave', () => {
            // Fade out lines instead of instantly removing
            const lines = svgContainer.querySelectorAll('.constellation-line');
            lines.forEach(line => {
                line.style.opacity = 0;
                // Optional: remove after transition to clean up DOM
                line.addEventListener('transitionend', () => {
                    if (line.style.opacity === '0') {
                        line.remove();
                    }
                }, { once: true });
            });
        });
    });

    // --- Smooth Scrolling for Navbar Links & Active State ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Update active class immediately on click
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.4 // Percentage of section visible to be considered active
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(currentSectionId)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    // Observe each section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});
