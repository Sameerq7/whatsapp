// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const { Client, LocalAuth } = require("whatsapp-web.js");
// const qrcode = require("qrcode");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// app.use(express.static("public"));

// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: { headless: true }
// });

// client.on("qr", (qr) => {
//     console.log("Generating QR Code...");
//     qrcode.toDataURL(qr, (err, url) => {
//         if (!err) io.emit("qr", url);
//     });
// });

// client.on("ready", () => {
//     console.log("✅ WhatsApp Bot is Ready!");
//     io.emit("ready");
// });

// client.initialize();

// io.on("connection", (socket) => {
//     console.log("📡 Client connected");

//     socket.on("sendMessage", async ({ countryCode, number, message }) => {
//         try {
//             if (!number || !message) {
//                 socket.emit("messageStatus", "❌ Error: Phone number and message are required!");
//                 return;
//             }

//             countryCode = countryCode || "+91"; // Default: India
//             number = number.replace(/\D/g, ""); // Remove non-numeric characters
//             const fullNumber = `${countryCode.replace("+", "")}${number}`;
//             const chatId = `${fullNumber}@c.us`;

//             console.log(`📨 Sending message to: ${chatId}`);

//             await client.sendMessage(chatId, message);
//             socket.emit("messageStatus", `✅ Message sent to ${fullNumber}!`);
//         } catch (err) {
//             console.error("❌ Send Message Error:", err);
//             socket.emit("messageStatus", `❌ Error: ${err.message}`);
//         }
//     });

//     socket.on("getContacts", async () => {
//         try {
//             let contacts = await client.getContacts(); // Fetch contacts
    
//             // Filter only valid WhatsApp numbers
//             let filteredContacts = contacts
//                 .filter(c => c.isWAContact && c.number) // Ensure it's a valid contact
//                 .map(c => ({ name: c.name || "Unknown", number: c.number }));
    
//             // Remove duplicates
//             let uniqueContacts = Array.from(new Map(filteredContacts.map(c => [c.number, c])).values());
    
//             console.log(`Fetched ${uniqueContacts.length} valid contacts.`); // Debugging log
    
//             socket.emit("contactsList", uniqueContacts);
//         } catch (error) {
//             console.error("Error fetching contacts:", error);
//             socket.emit("contactsList", []);
//         }
//     });
    
// });

// server.listen(3000, () => {
//     console.log("🚀 Server running on http://localhost:3000");
// });



//TRIAL FINAL
// const express = require("express");
// const http = require("http");
// const fs = require("fs");
// const path = require("path");
// const { Server } = require("socket.io");
// const { Client, LocalAuth } = require("whatsapp-web.js");
// const qrcode = require("qrcode");
// const puppeteer = require('puppeteer');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// app.use(express.static("public"));

// const SESSION_PATH = path.join(__dirname, ".wwebjs_auth");

// // Initialize WhatsApp Client
// let client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: { headless: true }
// });

// client.on("qr", (qr) => {
//     console.log("Generating QR Code...");
//     qrcode.toDataURL(qr, (err, url) => {
//         if (!err) io.emit("qr", url);
//     });
// });

// client.on("ready", () => {
//     console.log("✅ WhatsApp Bot is Ready!");
//     io.emit("ready");
// });

// client.initialize();

// io.on("connection", (socket) => {
//     console.log("📡 Client connected");

//     socket.on("sendMessage", async ({ countryCode, number, message }) => {
//         try {
//             if (!number || !message) {
//                 socket.emit("messageStatus", "❌ Error: Phone number and message are required!");
//                 return;
//             }

//             countryCode = countryCode || "+91"; // Default: India
//             number = number.replace(/\D/g, ""); // Remove non-numeric characters
//             const fullNumber = `${countryCode.replace("+", "")}${number}`;
//             const chatId = `${fullNumber}@c.us`;

//             console.log(`📨 Sending message to: ${chatId}`);

//             await client.sendMessage(chatId, message);
//             socket.emit("messageStatus", `✅ Message sent to ${fullNumber}!`);
//         } catch (err) {
//             console.error("❌ Send Message Error:", err);
//             socket.emit("messageStatus", `❌ Error: ${err.message}`);
//         }
//     });

//     socket.on("getContacts", async () => {
//         try {
//             let contacts = await client.getContacts(); // Fetch contacts
    
//             // Filter only valid WhatsApp numbers
//             let filteredContacts = contacts
//                 .filter(c => c.isWAContact && c.number) // Ensure it's a valid contact
//                 .map(c => ({ name: c.name || "Unknown", number: c.number }));
    
//             // Remove duplicates
//             let uniqueContacts = Array.from(new Map(filteredContacts.map(c => [c.number, c])).values());
    
//             console.log(`Fetched ${uniqueContacts.length} valid contacts.`); // Debugging log
    
//             socket.emit("contactsList", uniqueContacts);
//         } catch (error) {
//             console.error("Error fetching contacts:", error);
//             socket.emit("contactsList", []);
//         }
//     });

//     // Logout functionality: Deletes session and forces re-login
//     socket.on("logout", async () => {
//         console.log("⚡ Logging out...");

//         try {
//             // Destroy client session
//             await client.logout();
            
//             // Delete session folder
//             if (fs.existsSync(SESSION_PATH)) {
//                 fs.rmSync(SESSION_PATH, { recursive: true, force: true });
//                 console.log("🗑️ Session data deleted.");
//             }

//             // Reinitialize WhatsApp client
//             client = new Client({
//                 authStrategy: new LocalAuth(),
//                 puppeteer: { headless: true }
//             });

//             client.on("qr", (qr) => {
//                 qrcode.toDataURL(qr, (err, url) => {
//                     if (!err) io.emit("qr", url);
//                 });
//             });

//             client.on("ready", () => {
//                 console.log("✅ WhatsApp Bot is Ready!");
//                 io.emit("ready");
//             });

//             client.initialize();
//             io.emit("loggedOut");
//             io.emit("qrRequired"); // Tell frontend to show QR again
//         } catch (error) {
//             console.error("❌ Logout Error:", error);
//         }
//     });
// });

// server.listen(3000, () => {
//     console.log("🚀 Server running on http://localhost:3000");
// });


//TRIAL-3

const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { Server } = require("socket.io");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static("public"));

const SESSION_PATH = path.join(__dirname, ".wwebjs_auth");
const CACHE_PATH = path.join(__dirname, ".wwebjs_cache");

let clientConnected = false; // Track client status

let client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on("qr", (qr) => {
    console.log("Generating QR Code...");
    qrcode.toDataURL(qr, (err, url) => {
        if (!err) io.emit("qr", url);
    });
});

client.on("ready", () => {
    console.log("✅ WhatsApp Bot is Ready!");
    clientConnected = true;
    io.emit("clientStatus", { connected: true }); // Notify frontend
});

client.on("disconnected", () => {
    console.log("❌ Client Disconnected");
    clientConnected = false;
    io.emit("clientStatus", { connected: false }); // Notify frontend
});

client.initialize();

io.on("connection", (socket) => {
    console.log("📡 Client connected to UI");

    socket.emit("clientStatus", { connected: clientConnected }); // Send initial status

    // 🆕 Handle fetching WhatsApp contacts
    socket.on("getContacts", async () => {
        if (!clientConnected) {
            socket.emit("contactsList", []);
            return;
        }
    
        try {
            const contacts = await client.getContacts();
            
            // Filter only real users (not groups, status, or broadcasts)
            const uniqueContacts = {};
            
            contacts.forEach(contact => {
                if (contact.isUser && !uniqueContacts[contact.id.user]) {
                    uniqueContacts[contact.id.user] = {
                        name: contact.name || contact.pushname || "Unknown",
                        number: contact.id.user
                    };
                }
            });
    
            // Convert object back to an array and limit to 800 contacts
            const formattedContacts = Object.values(uniqueContacts).slice(0, 800);
    
            console.log(`📋 Contacts Fetched: ${formattedContacts.length}`);
            socket.emit("contactsList", formattedContacts);
        } catch (error) {
            console.error("❌ Error fetching contacts:", error);
            socket.emit("contactsList", []);
        }
    });
    


    socket.on("sendMessage", async ({ countryCode, number, message }) => {
        if (!clientConnected) {
            socket.emit("messageStatus", "❌ No WhatsApp client connected!");
            return;
        }

        try {
            if (!number || !message) {
                socket.emit("messageStatus", "❌ Error: Phone number and message are required!");
                return;
            }

            countryCode = countryCode || "+91";
            number = number.replace(/\D/g, "");
            const fullNumber = `${countryCode.replace("+", "")}${number}`;
            const chatId = `${fullNumber}@c.us`;

            console.log(`📨 Sending message to: ${chatId}`);
            await client.sendMessage(chatId, message);
            socket.emit("messageStatus", `✅ Message sent to ${fullNumber}!`);
        } catch (err) {
            console.error("❌ Send Message Error:", err);
            socket.emit("messageStatus", `❌ Error: ${err.message}`);
        }
    });

    socket.on("logout", async () => {
        console.log("⚡ Logging out...");

        try {
            await client.logout();
            clientConnected = false;
            io.emit("clientStatus", { connected: false });

            if (fs.existsSync(SESSION_PATH)) fs.rmSync(SESSION_PATH, { recursive: true, force: true });
            if (fs.existsSync(CACHE_PATH)) fs.rmSync(CACHE_PATH, { recursive: true, force: true });

            console.log("🗑️ Session & cache deleted.");

            client = new Client({
                authStrategy: new LocalAuth(),
                puppeteer: { headless: true }
            });

            client.on("qr", (qr) => qrcode.toDataURL(qr, (err, url) => !err && io.emit("qr", url)));
            client.on("ready", () => {
                console.log("✅ WhatsApp Bot is Ready!");
                clientConnected = true;
                io.emit("clientStatus", { connected: true });
            });

            client.initialize();
            io.emit("loggedOut");
            io.emit("qrRequired");
        } catch (error) {
            console.error("❌ Logout Error:", error);
        }
    });
});

server.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
