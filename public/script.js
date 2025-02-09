



//TRIAL -1
const socket = io();
const voiceBtn = document.getElementById("voice-btn");

// Ensure header exists before appending the button
const header = document.querySelector("header") || document.body;
const logoutBtn = document.createElement("button");
logoutBtn.id = "logout-btn";
logoutBtn.innerText = "Logout";
logoutBtn.style.display = "none"; // Initially hidden
header.appendChild(logoutBtn);

// Handle QR Code display
socket.on("qr", (qrCodeUrl) => {
    document.getElementById("qr-code").src = qrCodeUrl;
    document.getElementById("qr-container").style.display = "block";
    document.getElementById("message-section").style.display = "none"; 
    document.getElementById("connect-message").style.display = "block"; 
    logoutBtn.style.display = "none";
});

// Hide QR, show message section & logout button when connected
socket.on("ready", () => {
    document.getElementById("qr-container").style.display = "none";
    document.getElementById("message-section").style.display = "block";
    document.getElementById("connect-message").style.display = "none"; 
    logoutBtn.style.display = "block";
});

document.getElementById("fetch-contacts-btn").addEventListener("click", fetchContacts);

function fetchContacts() {
    socket.emit("getContacts");
}

socket.on("contactsList", (contacts) => {
    const contactsDiv = document.getElementById("contacts");
    contactsDiv.style.display = "block";

    contactsDiv.innerHTML = contacts.length
        ? contacts.map(c => `
            <div class="contact-item">
                <span><b>${c.name}</b>: ${c.number}</span>
                <button onclick="selectNumber('${c.number}')">Select</button>
            </div>
        `).join("")
        : "<p>No contacts found.</p>";
});

function selectNumber(number) {
    document.getElementById("phone-number").value = number;
}



// Update message status
socket.on("messageStatus", (status) => {
    document.getElementById("status").innerText = status;
});

// Send Message Function
function sendMessage() {
    let countryCode = document.getElementById("country-code").value;
    if (countryCode === "custom") {
        countryCode = document.getElementById("custom-country-code").value;
        if (!countryCode.startsWith("+")) countryCode = "+" + countryCode;
    }

    const number = document.getElementById("phone-number").value.trim();
    const message = document.getElementById("message-text").value.trim();

    if (!number || !message) {
        document.getElementById("status").innerText = "❌ Enter details!";
        return;
    }

    socket.emit("sendMessage", { countryCode, number, message });
}

// Handle Country Code Selection
document.getElementById("country-code").addEventListener("change", function() {
    document.getElementById("custom-country-code").style.display = this.value === "custom" ? "block" : "none";
});

// Voice Recognition for Message Input
let recognition;
try {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
        document.getElementById("message-text").value = event.results[0][0].transcript;
    };

    voiceBtn.addEventListener("click", () => {
        recognition.start();
    });
} catch (e) {
    voiceBtn.disabled = true;
}

// Logout Functionality
function logoutUser() {
    socket.emit("logout");
}

socket.on("loggedOut", () => {
    document.getElementById("qr-container").style.display = "block";  // Show QR again
    document.getElementById("message-section").style.display = "none"; // Hide message input
    logoutBtn.style.display = "none"; // Hide logout button
});

// Ensure logout function is correctly referenced
logoutBtn.addEventListener("click", logoutUser);

// Handle Logout Response from Server
socket.on("qrRequired", () => {
    document.getElementById("qr-container").style.display = "block";  
    document.getElementById("message-section").style.display = "none"; 
    document.getElementById("connect-message").style.display = "block"; 
    logoutBtn.style.display = "none";
});

// Update Footer Year
document.getElementById("year").innerText = new Date().getFullYear();




// const socket = io();
// const voiceBtn = document.getElementById("voice-btn");

// // Ensure header exists before appending the logout button
// const header = document.querySelector("header") || document.body;
// const logoutBtn = document.createElement("button");
// logoutBtn.id = "logout-btn";
// logoutBtn.innerText = "Logout";
// logoutBtn.style.display = "none"; // Initially hidden
// header.appendChild(logoutBtn);

// // Get UI elements
// const qrContainer = document.getElementById("qr-container");
// const messageSection = document.getElementById("message-section");
// const connectMessage = document.getElementById("connect-message");

// // Initially, show QR section and hide the message section
// qrContainer.style.display = "block";
// messageSection.style.display = "none";
// connectMessage.style.display = "block";
// logoutBtn.style.display = "none";

// // Show QR Code when received
// socket.on("qr", (qrCodeUrl) => {
//     document.getElementById("qr-code").src = qrCodeUrl;
//     qrContainer.style.display = "block";
//     messageSection.style.display = "none";
//     connectMessage.style.display = "block";
//     logoutBtn.style.display = "none";
// });

// // Ensure UI updates when WhatsApp client is ready
// socket.on("ready", () => {
//     qrContainer.style.display = "none"; // 🔥 Hide QR Section & Message
//     messageSection.style.display = "block"; // ✅ Show Messaging UI
//     connectMessage.style.display = "none"; 
//     logoutBtn.style.display = "block";
// });

// // Update message status
// socket.on("messageStatus", (status) => {
//     document.getElementById("status").innerText = status;
// });

// // Send Message Function
// function sendMessage() {
//     let countryCode = document.getElementById("country-code").value;
//     if (countryCode === "custom") {
//         countryCode = document.getElementById("custom-country-code").value;
//         if (!countryCode.startsWith("+")) countryCode = "+" + countryCode;
//     }

//     const number = document.getElementById("phone-number").value.trim();
//     const message = document.getElementById("message-text").value.trim();

//     if (!number || !message) {
//         document.getElementById("status").innerText = "❌ Enter details!";
//         return;
//     }

//     socket.emit("sendMessage", { countryCode, number, message });
// }

// // Handle Country Code Selection
// document.getElementById("country-code").addEventListener("change", function() {
//     document.getElementById("custom-country-code").style.display = this.value === "custom" ? "block" : "none";
// });

// // Voice Recognition for Message Input
// let recognition;
// try {
//     recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.lang = "en-US";

//     recognition.onresult = (event) => {
//         document.getElementById("message-text").value = event.results[0][0].transcript;
//     };

//     voiceBtn.addEventListener("click", () => {
//         recognition.start();
//     });
// } catch (e) {
//     voiceBtn.disabled = true;
// }

// // Logout Functionality
// function logoutUser() {
//     socket.emit("logout");
// }

// socket.on("loggedOut", () => {
//     qrContainer.style.display = "block";  // ✅ Show QR Section Again
//     messageSection.style.display = "none"; // ❌ Hide message input
//     connectMessage.style.display = "block"; // ✅ Show "Connect to WhatsApp"
//     logoutBtn.style.display = "none"; // ❌ Hide logout button
// });

// // Ensure logout function is correctly referenced
// logoutBtn.addEventListener("click", logoutUser);

// // Handle Logout Response from Server
// socket.on("qrRequired", () => {
//     qrContainer.style.display = "block";  
//     messageSection.style.display = "none"; 
//     connectMessage.style.display = "block"; 
//     logoutBtn.style.display = "none";
// });

// // Update Footer Year
// document.getElementById("year").innerText = new Date().getFullYear();
