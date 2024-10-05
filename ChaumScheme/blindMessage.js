// blindMessage.js
const modExp = require('./modExp');

function blindMessage(message, e, n) {
    const r = 7; // Random number chosen by the user (must be coprime with n)

    // Blind the message using (message * r^e) % n
    const blindedMessage = (message * modExp(r, e, n)) % n;

    return { blindedMessage, r };
}

module.exports = blindMessage;