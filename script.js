const starsContainer = document.createElement('div');
const lineElement = document.getElementById("line")
document.body.appendChild(starsContainer);
document.body.appendChild(lineElement);
const stars = [];
const totalStars = window.innerWidth < 600 ? 5 : 30;
// Add a Map to store star positions

const starPositions = new Map();
const activeConnections = new Map(); // Store active connection lines

// Add this after creating starsContainer
const plusIconContainer = document.createElement('div');
plusIconContainer.className = 'plus-icon-container';

// Create the rounded square background
const roundedSquare = document.createElement('div');
roundedSquare.className = 'rounded-square';

// Create the crossed lines container
const crossedLines = document.createElement('div');
crossedLines.className = 'crossed-lines';

// Create horizontal and vertical lines
const horizontalLine = document.createElement('div');
horizontalLine.className = 'line horizontal';

const verticalLine = document.createElement('div');
verticalLine.className = 'line vertical';

// Assemble the plus icon
crossedLines.appendChild(horizontalLine);
crossedLines.appendChild(verticalLine);
roundedSquare.appendChild(crossedLines);
plusIconContainer.appendChild(roundedSquare);
document.body.appendChild(plusIconContainer);

// Get the position of the plus icon
const plusIconRect = plusIconContainer.getBoundingClientRect();
const plusIconCenterX = plusIconRect.left + plusIconRect.width / 2;
const plusIconCenterY = plusIconRect.top + plusIconRect.height / 2;

// Add hover effect
plusIconContainer.addEventListener('mouseover', () => {
    plusIconContainer.classList.add('hover');
});

plusIconContainer.addEventListener('mouseout', () => {
    plusIconContainer.classList.remove('hover');
});

// Add click event to plusIconContainer to create a star
plusIconContainer.addEventListener('click', () => {
    createStarAtCenter(); // Create star at the center of the screen
});

// Create the play icon container
const playIconContainer = document.createElement('div');
playIconContainer.className = 'play-icon-container';

// Create the rounded square background for the play icon
const playRoundedSquare = document.createElement('div');
playRoundedSquare.className = 'play-square';

// Create the play icon (triangle)
const playIcon = document.createElement('div');
playIcon.className = 'play-icon';

// Create two parallel lines
const line1 = document.createElement('div');
line1.className = 'line parallel-line';
const line2 = document.createElement('div');
line2.className = 'line parallel-line';

// Function to toggle between triangle and lines
function togglePlayIcon(isRotating) {
    // Clear previous content
    playRoundedSquare.innerHTML = '';

    if (isRotating) {
        // Append lines when rotating
        playRoundedSquare.appendChild(line1);
        playRoundedSquare.appendChild(line2);
    } else {
        // Append triangle when not rotating
        playRoundedSquare.appendChild(playIcon);
    }
}

// Position the play icon in the bottom right corner
playIconContainer.style.position = 'fixed';
playIconContainer.style.bottom = '20px';
playIconContainer.style.right = '20px';
playIconContainer.style.cursor = 'pointer';
playIconContainer.style.zIndex = '1000'; // Ensure it's on top

// Add click event to playIconContainer to toggle rotation
let isRotating = false;
playIconContainer.addEventListener('click', () => {
    isRotating = !isRotating;
    if (isRotating) {
        document.body.classList.add('rotate');
    } else {
        document.body.classList.remove('rotate');
    }
    togglePlayIcon(isRotating); // Toggle between triangle and lines
});

// Append the rounded square to the play icon container
playRoundedSquare.appendChild(playIcon); // Initially add the triangle
playIconContainer.appendChild(playRoundedSquare); // Append the square to the container
document.body.appendChild(playIconContainer); // Finally, append the container to the body

// Initially set the play icon to the triangle
togglePlayIcon(isRotating);

// Function to create a star at the center of the screen
function createStarAtCenter() {
    const starContainer = document.createElement('div');
    starContainer.className = 'star-container';
    document.body.appendChild(starContainer); // Append the container to the body

    const star = document.createElement('div');
    star.className = 'star';
    star.style.position = 'absolute';
    star.style.top = '50%'; // Center vertically
    star.style.left = '50%'; // Center horizontally
    star.style.transform = 'translate(-50%, -50%)'; // Adjust for centering
    star.style.backgroundColor = 'red'; 
    star.style.borderRadius = '50%';

    // Adjust size based on mobile or desktop
    if (window.innerWidth < 600) {
        star.style.width = '18px'; 
        star.style.height = '18px'; 
    } else {
        star.style.width = '15px'; 
        star.style.height = '15px'; 
    }
    star.style.boxShadow = '0 0 10px red'; 

    starContainer.appendChild(star); // Append the star to its container

    document.body.appendChild(starContainer); // Append the container to the body

    // Make the star glow red for 1 second
    setTimeout(() => {
        star.style.boxShadow = '0 0 10px white';
        star.style.backgroundColor = 'white'; 
    }, 1000);
    makeStarDraggable(star);
}

// Add CSS for mobile responsiveness
const style = document.createElement('style');
style.innerHTML = `
    .star {
        touch-action: none; 
    }
    .plus-icon-container {
        touch-action: none; 
    }
    @media (max-width: 600px) {
        .star {
            width: 10px;
            height: 10px;
        }
        .plus-icon-container {
            width: 50px;
            height: 50px;
        }
        .play-icon-container{
            width:50px;
            height:50px;
        }
        .crossed-lines {
            position: relative;
            width: 30px;
            height: 30px;
        }
        .play-icon {
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 17.32px solid white;
        }
        .parallel-line {
            width: 5px; 
            height: 20px; 
        .parallel-line:first-child {
            left: calc(50% - 3px); 
        }

        .parallel-line:last-child {
            left: calc(50% + 3px); 
        }
    }
`;
document.head.appendChild(style);


const safeArea = 50; // Define a safe area around the plus icon and play icon

// Function to check if a position is within the safe area of the icons
function isInSafeArea(top, left, iconRect, safeArea) {
    const starRect = {
        top: parseFloat(top),
        left: parseFloat(left),
        width: window.innerWidth < 600 ? 18 : 10, 
        height: window.innerWidth < 600 ? 18 : 10 
    };

    return !(
        starRect.left + starRect.width < iconRect.left - safeArea ||
        starRect.left > iconRect.left + iconRect.width + safeArea ||
        starRect.top + starRect.height < iconRect.top - safeArea ||
        starRect.top > iconRect.top + iconRect.height + safeArea
    );
}

// Create stars and position them randomly, avoiding the plus and play icons
for (let i = 0; i < totalStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    let top, left;
    const plusIconRect = plusIconContainer.getBoundingClientRect();
    const playIconRect = playIconContainer.getBoundingClientRect();

    do {
        top = `${Math.random() * 100}vh`;
        left = `${Math.random() * 100}vw`;
    } while (isInSafeArea(top, left, plusIconRect, safeArea) || isInSafeArea(top, left, playIconRect, safeArea));

    star.style.top = top;
    star.style.left = left;
    // Add unique ID to each star
    star.dataset.id = `star-${i}`;
    starsContainer.appendChild(star);
    stars.push(star);
    // Store initial position in Map
    starPositions.set(star.dataset.id, { top, left });

    // Set star size based on device type
    if (window.innerWidth < 600) {
        star.style.width = '18px'; 
        star.style.height = '18px'; 
    } else {
        star.style.width = '15px'; 
        star.style.height = '15px'; 
    }
    


    star.addEventListener('mousedown', (e) => {
        startDragging(e, star);
    });

    star.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent default touch behavior
        startDragging(e.touches[0], star); // Use the first touch point
    });
}

// Connect nearby stars with a line if they are within 200 pixels
function connectNearbyStars(movingStar) {
    const movingStarRect = movingStar.getBoundingClientRect();
    const x1 = movingStarRect.left + movingStarRect.width / 2;
    const y1 = movingStarRect.top + movingStarRect.height / 2;

    let connections = [];
    
    // Remove all existing connections for the moving star
    const movingStarId = movingStar.dataset.id;
    stars.forEach(otherStar => {
        const otherStarId = otherStar.dataset.id;
        const connectionKey1 = `${movingStarId}-${otherStarId}`;
        const connectionKey2 = `${otherStarId}-${movingStarId}`;
        
        // Remove existing line if present
        if (activeConnections.has(connectionKey1)) {
            const line = activeConnections.get(connectionKey1);
            if (line.parentNode) { // Check if the line is still in the DOM
                line.parentNode.removeChild(line);
            }
            activeConnections.delete(connectionKey1);
        }
        if (activeConnections.has(connectionKey2)) {
            const line = activeConnections.get(connectionKey2);
            if (line.parentNode) { // Check if the line is still in the DOM
                line.parentNode.removeChild(line);
            }
            activeConnections.delete(connectionKey2);
        }
    });

    // Check for new connections
    stars.forEach(star => {
        if (star !== movingStar) {
            const starRect = star.getBoundingClientRect();
            const x2 = starRect.left + starRect.width / 2;
            const y2 = starRect.top + starRect.height / 2;

            const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

            if (distance <= 200) {
                connections.push({
                    id: star.dataset.id,
                    distance: Math.round(distance)
                });
                
                // Create unique connection key
                const connectionKey = `${movingStarId}-${star.dataset.id}`;
                
                // Create a container for the star and its connections
                const starContainer = document.createElement('div');
                starContainer.className = 'star-container';
                document.body.appendChild(starContainer);
                
                // Create new line
                const newLineElement = document.createElement('div');
                newLineElement.className = 'line';
                newLineElement.style.width = `${distance}px`;
                newLineElement.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI}deg)`;
                newLineElement.style.left = `${x1}px`;
                newLineElement.style.top = `${y1}px`;
                newLineElement.style.border = '2px solid white';
                newLineElement.style.position = 'absolute';
                newLineElement.style.cursor = 'pointer'; 
                
                // Add click handler to remove the line
                newLineElement.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    // Remove the line from the DOM
                    if (newLineElement.parentNode) { // Check if the line is still in the DOM
                        newLineElement.parentNode.removeChild(newLineElement);
                    }
                    activeConnections.delete(connectionKey);
                });
                newLineElement.addEventListener('mouseover', () => {
                    newLineElement.style.border = '2px solid red';
                });
                
                newLineElement.addEventListener('mouseout', () => {
                    newLineElement.style.border = '2px solid white';
                });

                // Append the line to the star container
                starContainer.appendChild(newLineElement);
                starContainer.appendChild(star); // Append the star to the container

                // Store the new connection
                activeConnections.set(connectionKey, newLineElement);
            }
        }
    });
}

// Update removeLine function to remove all connections for a star
function removeLine() {
    activeConnections.forEach((line, key) => {
        if (line.parentNode) { // Check if the line is still in the DOM
            line.parentNode.removeChild(line);
        }
    });
    activeConnections.clear();
}

// Check if the star is connected to any other star
function isStarConnected(movingStar) {
    const movingStarRect = movingStar.getBoundingClientRect();
    const x1 = movingStarRect.left + movingStarRect.width / 2;
    const y1 = movingStarRect.top + movingStarRect.height / 2;

    return stars.some(star => {
        if (star !== movingStar) {
            const starRect = star.getBoundingClientRect();
            const x2 = starRect.left + starRect.width / 2;
            const y2 = starRect.top + starRect.height / 2;

            const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            return distance <= 200;
        }
        return false;
    });
} 
function makeStarDraggable(star) {
    star.addEventListener('mousedown', (e) => {
        startDragging(e, star);
    });

    star.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent default touch behavior
        startDragging(e.touches[0], star); // Use the first touch point
    });

    // Add unique ID to the new star
    star.dataset.id = `star-${stars.length}`; // Ensure unique ID
    stars.push(star); 
    starPositions.set(star.dataset.id, { top: star.style.top, left: star.style.left }); // Store initial position
}




// Create the tutorial overlay
const tutorialOverlay = document.createElement('div');
tutorialOverlay.className = 'tutorial-overlay';
tutorialOverlay.innerHTML = `
    <div class="tutorial-content">
        <h2>Tutorial</h2>
        <h3>Welcome to the Constellation Creator Game!</h3>
        <p>Click on the plus icon to create stars. </p>
        <p>Drag the stars to connect them.</p>
        <p>Click on the connections to delete them.</p>
        <p>Click on the play icon to move the sky.</p>
        <p>Let the sky be your canvas!</p>
        <button id="close-tutorial">Close</button>
    </div>
`;
document.body.appendChild(tutorialOverlay);

// Add event listener to close the tutorial
document.getElementById('close-tutorial').addEventListener('click', () => {
    document.body.removeChild(tutorialOverlay);
});
// Function to handle dragging logic
function startDragging(touchOrMouseEvent, star) {
    star.style.cursor = 'grabbing'; // Change cursor to grabbing
    const offsetX = touchOrMouseEvent.clientX - star.getBoundingClientRect().left;
    const offsetY = touchOrMouseEvent.clientY - star.getBoundingClientRect().top;

    const onMove = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX; // Use touch or mouse event
        const clientY = e.touches ? e.touches[0].clientY : e.clientY; // Use touch or mouse event
        const newLeft = `${clientX - offsetX}px`;
        const newTop = `${clientY - offsetY}px`;
        star.style.left = newLeft;
        star.style.top = newTop;
        // Update position in Map
        starPositions.set(star.dataset.id, { top: newTop, left: newLeft });
        connectNearbyStars(star); // Check for nearby stars while dragging
    };

    const onEnd = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
        star.style.cursor = 'grab'; 
        // Check if the star is still connected before removing the line
        if (!isStarConnected(star)) {
            removeLine(); // Remove line when dragging stops if not connected
        }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
}

// Add hover effect for the play icon container
playIconContainer.addEventListener('mouseover', () => {
    playIconContainer.classList.add('hover');
});

playIconContainer.addEventListener('mouseout', () => {
    playIconContainer.classList.remove('hover');
});


