
// table ans 
const bigInt = require('big-integer');
const consoleTable = require('console.table');

// Function to generate random 5-digit prime number
function generateSmallPrime() {
    const smallPrimes = [
        10007, 10009, 10037, 10039, 10061, 10067, 10069, 10079, 10091, 10093
    ];
    return bigInt(smallPrimes[Math.floor(Math.random() * smallPrimes.length)]);
}

// Function to generate RSA keys (Public and Private)
function generateKeys() {
    const p = generateSmallPrime();
    const q = generateSmallPrime();
    const n = p.multiply(q);
    const phi = p.prev().multiply(q.prev());
    const e = bigInt(65537); // Common public exponent
    const d = e.modInv(phi);
    return { publicKey: { e, n }, privateKey: { d, n } };
}

// Function to generate blinding factor
function generateBlindingFactor(n) {
    let r;
    do {
        r = bigInt.randBetween(bigInt.one, n.prev());
    } while (bigInt.gcd(r, n).notEquals(1));
    return r;
}

// Function to blind the message
function blindMessage(message, publicKey) {
    const { e, n } = publicKey;
    const m = bigInt(message);
    const r = generateBlindingFactor(n);
    const blindedMessage = m.multiply(r.modPow(e, n)).mod(n);
    return { blindedMessage, blindingFactor: r };
}

// Function to sign the message
function signMessage(blindedMessage, privateKey) {
    const { d, n } = privateKey;
    return bigInt(blindedMessage).modPow(d, n);
}

// Function to unblind the message
function unblindSignature(blindSignature, blindingFactor, publicKey) {
    const { e, n } = publicKey;
    return bigInt(blindSignature).multiply(blindingFactor.modInv(n)).mod(n);
}

// Function to verify the signature
function verifySignature(message, signature, publicKey) {
    const { e, n } = publicKey;
    const m = bigInt(message);
    const s = bigInt(signature).modPow(e, n);
    return m.equals(s);
}

// Run 3 experiments and store results
const experimentResults = [];

for (let i = 0; i < 3; i++) {
    const { publicKey, privateKey } = generateKeys();

    const message = "239";  // Example 5-digit message
    const { blindedMessage, blindingFactor } = blindMessage(message, publicKey);

    const blindSignature = signMessage(blindedMessage, privateKey);
    const unblindedSignature = unblindSignature(blindSignature, blindingFactor, publicKey);

    const isVerified = verifySignature(message, unblindedSignature, publicKey);

    experimentResults.push({
        Experiment: i + 1,
        BlindedMessage: blindedMessage.toString(),
        BlindSignature: blindSignature.toString(),
        UnblindedSignature: unblindedSignature.toString(),
        SignatureVerified: isVerified
    });
}

// Display the results in table format
console.table(experimentResults);
