// verifySignature.js
const modExp = require('./modExp');

function verifySignature(message, signature, e, n) {
    const verifiedMessage = modExp(signature, e, n);
    return verifiedMessage === message;
}

module.exports = verifySignature;