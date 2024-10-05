// modInverse.js
const gcd = require('./gcd');

function modInverse(e, phi) {
    let t = 0, newT = 1;
    let r = phi, newR = e;

    while (newR !== 0) {
        let quotient = Math.floor(r / newR);
        [t, newT] = [newT, t - quotient * newT];
        [r, newR] = [newR, r - quotient * newR];
    }

    if (r > 1) throw new Error('e is not invertible');
    if (t < 0) t = t + phi;

    return t;
}
module.exports = modInverse;