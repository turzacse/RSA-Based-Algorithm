const crypto = require('crypto');

// Function to hash a message using a specified algorithm
function hashMessage(message, algorithm) {
    // Convert the message to a Buffer
    const byteMessage = Buffer.from(message, 'utf-8');

    // Choose the hashing algorithm
    let hash;
    if (algorithm === 'md5') {
        hash = crypto.createHash('md5');
    } else if (algorithm === 'sha1') {
        hash = crypto.createHash('sha1');
    } else if (algorithm === 'sha256') {
        hash = crypto.createHash('sha256');
    } else {
        throw new Error("Unsupported hash algorithm. Use 'md5', 'sha1', or 'sha256'.");
    }

    // Update the hash with the message and return the hexadecimal digest
    return hash.update(byteMessage).digest('hex');
}

// Example Usage
const message = "Turza";

const md5Hash = hashMessage(message, 'md5');
const sha1Hash = hashMessage(message, 'sha1');
const sha256Hash = hashMessage(message, 'sha256');

console.log("MD5:", md5Hash);
console.log("SHA-1:", sha1Hash);
console.log("SHA-256:", sha256Hash);
