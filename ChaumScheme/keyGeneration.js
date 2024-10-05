// keyGeneration.js
const gcd = require('./gcd');
const modInverse = require('./modInverse');

function generateKeys(p, q) {
    const n = p * q;
    const phi = (p - 1) * (q - 1);

    // Choose e such that 1 < e < phi and gcd(e, phi) = 1
    let e = 2;
    while (gcd(e, phi) !== 1) {
        e++;
    }

    // Calculate d (modular inverse of e mod phi)
    let d = modInverse(e, phi);

    return { publicKey: { e, n }, privateKey: { d, n } };
}
module.exports = generateKeys;