const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const uploadInput = document.getElementById('uploadImage');

let objectImage = new Image();
let objectX = 50, objectY = 50;
let objectWidth = 100, objectHeight = 100; // Default size
let isDragging = false;

// Access camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { 
        video.srcObject = stream; 
        video.addEventListener('loadedmetadata', () => {
            // Set canvas size to match video size
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        });
    })
    .catch(err => console.error("Camera access denied", err));

// Load uploaded image
uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            objectImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Draw loop: Video + Overlay
function draw() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video
    }
    ctx.drawImage(objectImage, objectX, objectY, objectWidth, objectHeight); // Draw overlay image
    requestAnimationFrame(draw);
}

// Object dragging logic
canvas.addEventListener('mousedown', (e) => {
    if (e.offsetX > objectX && e.offsetX < objectX + objectWidth &&
        e.offsetY > objectY && e.offsetY < objectY + objectHeight) {
        isDragging = true;
    }
});
canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        objectX = e.offsetX - objectWidth / 2;
        objectY = e.offsetY - objectHeight / 2;
    }
});
canvas.addEventListener('mouseup', () => isDragging = false);

// Resize image using mouse scroll
canvas.addEventListener('wheel', (e) => {
    if (e.deltaY < 0) {  // Scroll up to increase size
        objectWidth += 10;
        objectHeight += 10;
    } else if (e.deltaY > 0) {  // Scroll down to decrease size
        objectWidth = Math.max(20, objectWidth - 10); // Minimum size limit
        objectHeight = Math.max(20, objectHeight - 10);
    }
});

// Start drawing loop
requestAnimationFrame(draw);
