const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const readline = require("readline-sync");

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth()
});

// Display QR Code in Terminal
client.on("qr", (qr) => {
    console.log("📌 Scan this QR Code to log in:");
    qrcode.generate(qr, { small: true });
});

// When the client is ready
client.on("ready", async () => {
    console.log("\n✅ WhatsApp Web is connected!\n");

    // Get number of contacts
    const contactCount = parseInt(readline.question("📞 Enter the number of contacts: "), 10);
    if (isNaN(contactCount) || contactCount <= 0) {
        console.log("❌ Invalid number of contacts.");
        return;
    }

    // Collect phone numbers
    let numbers = [];
    for (let i = 0; i < contactCount; i++) {
        let num = readline.question(`📱 Enter contact ${i + 1} (without +): `).trim();
        if (!/^\d+$/.test(num)) {
            console.log("❌ Invalid number format! Try again.");
            i--; // Retry the same contact input
            continue;
        }
        numbers.push(num + "@c.us"); // Convert to WhatsApp format
    }

    // Get message input
    let message = readline.question("💬 Enter the message to send: ").trim();
    if (!message) {
        console.log("❌ Message cannot be empty.");
        return;
    }

    // Send messages to all entered numbers
    console.log("\n🚀 Sending messages...\n");
    for (let number of numbers) {
        try {
            await client.sendMessage(number, message);
            console.log(`✅ Message sent to ${number}`);
        } catch (err) {
            console.log(`❌ Failed to send message to ${number}: ${err.message}`);
        }
    }

    console.log("\n🎉 Messages sent successfully!\n");
});

// Handle authentication issues
client.on("auth_failure", () => console.log("❌ Authentication failed! Please delete session data and retry."));

// Start the WhatsApp client
client.initialize();
