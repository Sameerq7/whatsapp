const socket = io();

// QR Code Update
socket.on("qr", (qrCode) => {
    document.getElementById("qr-code").src = qrCode;
    document.getElementById("status").innerText = "✅ Scan the QR Code!";
});

// WhatsApp Ready
socket.on("ready", () => {
    document.getElementById("status").innerText = "✅ WhatsApp Connected!";
    document.getElementById("qr-code").style.display = "none";
});

// Authentication Failed
socket.on("auth_failure", () => {
    document.getElementById("status").innerText = "❌ Authentication Failed. Reload & Try Again!";
});

// Fetch Contacts via WebSocket
function fetchContacts() {
    socket.emit("getContacts", { page: 1, pageSize: 100 });
}

socket.on("contactsList", (data) => {
    const contactsList = document.getElementById("contacts-list");
    contactsList.innerHTML = '<option value="">Select a Contact</option>';

    data.forEach(contact => {
        const option = document.createElement("option");
        option.value = contact.number;
        option.textContent = `${contact.name} (${contact.number})`;
        contactsList.appendChild(option);
    });
});

// Send Message
function sendMessage() {
    let selectedCountryCode = document.getElementById("country-code").value;
    let numbersInput = document.getElementById("numbers").value.split(",").map(num => num.trim());

    let selectedContact = document.getElementById("contacts-list").value;
    if (selectedContact) numbersInput.push(selectedContact);

    let formattedNumbers = numbersInput
        .filter(num => num)
        .map(num => num.startsWith("+") || num.startsWith(selectedCountryCode) ? num : selectedCountryCode + num);

    let message = document.getElementById("message").value;
    let delay = document.getElementById("delay").value || 1000;

    if (!formattedNumbers.length || !message) {
        alert("❌ Please enter at least one number and a message.");
        return;
    }

    fetch("/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: formattedNumbers, message, delay })
    })
    .then(res => res.json())
    .then(data => alert(`✅ ${data.message}`))
    .catch(err => alert(`❌ Error: ${err.message}`));
}

// Send Message to Group
function sendToGroup() {
    let groupName = document.getElementById("group-name").value.trim();
    let groupMessage = document.getElementById("group-message").value.trim();

    if (!groupName || !groupMessage) {
        alert("❌ Please enter a group name and message!");
        return;
    }

    fetch("/send-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupName, message: groupMessage }) // ✅ Fixed Key
    })
    .then(res => res.json())
    .then(data => alert(`✅ ${data.message}`))
    .catch(err => alert(`❌ Error: ${err.message}`));
}

// Send Media
function sendMedia() {
    let number = document.getElementById("media-number").value.trim();
    let fileInput = document.getElementById("file-input");
    let caption = document.getElementById("caption").value.trim();

    if (!number || !fileInput.files.length) {
        alert("❌ Please select a number and file.");
        return;
    }

    let formData = new FormData();
    formData.append("number", number);
    formData.append("media", fileInput.files[0]);
    formData.append("caption", caption);

    fetch("/send-media", { 
        method: "POST", 
        body: formData 
    })
    .then(res => res.json())
    .then(data => alert(`✅ ${data.message}`))
    .catch(err => alert(`❌ Error: ${err.message}`));
}


// Attach functions to global window object
window.fetchContacts = fetchContacts;
window.sendMessage = sendMessage;
window.sendToGroup = sendToGroup;
window.sendMedia = sendMedia;
