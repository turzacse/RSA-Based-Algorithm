// signBlindedMessage.js
const modExp = require('./modExp');

function signBlindedMessage(blindedMessage, d, n) {
    // Sign the blinded message using private key: (blindedMessage^d) % n
    return modExp(blindedMessage, d, n);
}

module.exports = signBlindedMessage;