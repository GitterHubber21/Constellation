const starsContainer = document.createElement('div');
const lineElement = document.getElementById("line")
document.body.appendChild(starsContainer);
document.body.appendChild(lineElement);
const stars = [];
const totalStars = 30;
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
    const star = document.createElement('div');
    star.className = 'star';
    star.style.position = 'absolute';
    star.style.top = '50%';
    star.style.left = '50%'; 
    star.style.transform = 'translate(-50%, -50%)';
    star.style.backgroundColor = 'red'; 
    star.style.borderRadius = '50%';
    star.style.width = '15px'; 
    star.style.height = '15px'; 
    star.style.boxShadow = '0 0 10px red'; 

    document.body.appendChild(star);

    // Make the star glow red for 1 second
    setTimeout(() => {
        star.style.boxShadow = '0 0 10px white';
        star.style.backgroundColor = 'white'; 
    }, 1000);
    makeStarDraggable(star);

    
});

// Create stars and position them randomly, avoiding the plus icon
for (let i = 0; i < totalStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    let top, left;
    do {
        top = `${Math.random() * 100}vh`;
        left = `${Math.random() * 100}vw`;
    } while (isOverlappingWithPlusIcon(top, left, plusIconCenterX, plusIconCenterY));

    star.style.top = top;
    star.style.left = left;
    // Add unique ID to each star
    star.dataset.id = `star-${i}`;
    starsContainer.appendChild(star);
    stars.push(star);
    // Store initial position in Map
    starPositions.set(star.dataset.id, { top, left });

    // Make stars draggable
    star.addEventListener('mousedown', (e) => {
        star.style.cursor = 'grabbing'; // Change cursor to grabbing
        const offsetX = e.clientX - star.getBoundingClientRect().left;
        const offsetY = e.clientY - star.getBoundingClientRect().top;

        const onMouseMove = (e) => {
            const newLeft = `${e.clientX - offsetX}px`;
            const newTop = `${e.clientY - offsetY}px`;
            star.style.left = newLeft;
            star.style.top = newTop;
            // Update position in Map
            starPositions.set(star.dataset.id, { top: newTop, left: newLeft });
            connectNearbyStars(star); // Check for nearby stars while dragging
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            star.style.cursor = 'grab'; 
            // Check if the star is still connected before removing the line
            if (!isStarConnected(star)) {
                removeLine(); // Remove line when dragging stops if not connected
            }
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
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
            document.body.removeChild(activeConnections.get(connectionKey1));
            activeConnections.delete(connectionKey1);
        }
        if (activeConnections.has(connectionKey2)) {
            document.body.removeChild(activeConnections.get(connectionKey2));
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
                    document.body.removeChild(newLineElement);
                    activeConnections.delete(connectionKey);
                });
                newLineElement.addEventListener('mouseover', () => {
                    newLineElement.style.border = '2px solid red';
                });
                
                newLineElement.addEventListener('mouseout', () => {
                    newLineElement.style.border = '2px solid white';
                });

                document.body.appendChild(newLineElement);

                // Store the new connection
                activeConnections.set(connectionKey, newLineElement);
            }
        }
    });

}

// Update removeLine function to remove all connections for a star
function removeLine() {
    activeConnections.forEach((line, key) => {
        document.body.removeChild(line);
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
        star.style.cursor = 'grabbing'; // Change cursor to grabbing
        const offsetX = e.clientX - star.getBoundingClientRect().left;
        const offsetY = e.clientY - star.getBoundingClientRect().top;

        const onMouseMove = (e) => {
            const newLeft = `${e.clientX - offsetX}px`;
            const newTop = `${e.clientY - offsetY}px`;
            star.style.left = newLeft;
            star.style.top = newTop;
            // Update position in Map
            starPositions.set(star.dataset.id, { top: newTop, left: newLeft });
            connectNearbyStars(star); // Check for nearby stars while dragging
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            star.style.cursor = 'grab'; 
            // Check if the star is still connected before removing the line
            if (!isStarConnected(star)) {
                removeLine(); // Remove line when dragging stops if not connected
            }
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // Add unique ID to the new star
    star.dataset.id = `star-${stars.length}`; // Ensure unique ID
    stars.push(star); 
    starPositions.set(star.dataset.id, { top: star.style.top, left: star.style.left }); // Store initial position
}

// Function to check if the star overlaps with the plus icon
function isOverlappingWithPlusIcon(top, left, plusIconCenterX, plusIconCenterY) {
    const starRect = {
        top: parseFloat(top),
        left: parseFloat(left),
        width: 15, 
        height: 15 
    };

    const plusIconRect = {
        top: plusIconCenterY - 25, 
        left: plusIconCenterX - 25, 
        width: 50,
        height: 50
    };

    return !(
        starRect.left > plusIconRect.left + plusIconRect.width ||
        starRect.left + starRect.width < plusIconRect.left ||
        starRect.top > plusIconRect.top + plusIconRect.height ||
        starRect.top + starRect.height < plusIconRect.top
    );
}
