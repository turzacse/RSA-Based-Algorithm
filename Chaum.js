// app.js
const generateKeys = require('./ChaumScheme/keyGeneration');
const blindMessage = require('./ChaumScheme/blindMessage');
const signBlindedMessage = require('./ChaumScheme/signBlindedMessage');
const unblindSignature = require('./ChaumScheme/unblindSignature');
const verifySignature = require('./ChaumScheme/verifySignature');

// Step 1: Generate keys (p and q are large prime numbers)
const { publicKey, privateKey } = generateKeys(61, 53);

// Original message (must be a number less than n)
const message = 42; // Example message (This must be less than n)

// Step 2: User blinds the message
const { blindedMessage, r } = blindMessage(message, publicKey.e, publicKey.n);
console.log('Blinded (Encrypted) Message:', blindedMessage);

// Step 3: Signer signs the blinded message
const blindSignature = signBlindedMessage(blindedMessage, privateKey.d, privateKey.n);
console.log('Blind Signature:', blindSignature);

// Step 4: User unblinds the signature to get the original message's signature
const signature = unblindSignature(blindSignature, r, publicKey.n);
console.log('Unblinded (Decrypted) Message:', signature);

// Step 5: Verifier verifies the signature
const isValid = verifySignature(message, signature, publicKey.e, publicKey.n);
console.log('Is the signature valid?', isValid);

// Print the Original and Decrypted Messages for clarity
console.log(`Original Message: ${message}`);
console.log(`Decrypted Message (Signature): ${signature}`);
