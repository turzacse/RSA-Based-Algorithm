// unblindSignature.js
const modInverse = require('./modInverse');

function unblindSignature(blindSignature, r, n) {
    // Unblind the signature using (blindSignature * r^-1) % n
    const rInverse = modInverse(r, n);
    return (blindSignature * rInverse) % n;
}

module.exports = unblindSignature;