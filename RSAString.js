function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Function to compute modular inverse
function modInverse(e, phi) {
    let m0 = phi;
    let y = 0, x = 1;

    if (phi === 1) return 0;

    while (e > 1) {
        let q = Math.floor(e / phi);
        let t = phi;

        phi = e % phi;
        e = t;
        t = y;

        y = x - q * y;
        x = t;
    }

    if (x < 0) x += m0;

    return x;
}

// Function to generate RSA key pair
function generateKeys() {
    const p = 7; // First prime number
    const q = 3; // Second prime number
    const n = p * q;
    const phi = (p - 1) * (q - 1);

    let e = 3;
    while (gcd(e, phi) !== 1) {
        e += 2;
    }

    const d = modInverse(e, phi);
    console.log('The value of p, q, n, phi, d, e,  ::::::::::', p,q,n,phi,d,e);

    return {
        publicKey: { e, n },
        privateKey: { d, n }
    };
}

// Helper function to map character to position in alphabet (0-25)
function charToPosition(char) {
    return char.toLowerCase().charCodeAt(0) - 97; // 'a' is 97 in ASCII
}

// Helper function to map position back to character
function positionToChar(pos) {
    return String.fromCharCode(pos + 97); // Reverse mapping to 'a'-'z'
}

// Function to encrypt a string message using position values
function encryptString(message, publicKey) {
    const { e, n } = publicKey;
    let encrypted = '';

    for (let i = 0; i < message.length; i++) {
        const m = charToPosition(message[i]); // Convert each char to position 0-25
        if (m >= 0 && m <= 25) { // Encrypt only alphabetic characters
            const encryptedChar = modExp(m, e, n) % 26; // Ensure value is within 0-25

            
            encrypted += positionToChar(encryptedChar);
        } else {
            encrypted += message[i]; // Keep non-alphabet characters unchanged
        }
    }

    return encrypted;
}

// Function to decrypt the encrypted message back to string
function decryptString(encryptedMessage, privateKey) {
    const { d, n } = privateKey;
    let decrypted = '';

    for (let i = 0; i < encryptedMessage.length; i++) {
        const c = charToPosition(encryptedMessage[i]); // Convert char to position 0-25
        
        if (c >= 0 && c <= 25) {
            const decryptedChar = modExp(c, d, n) % 26; // Ensure value is within 0-25
            decrypted += positionToChar(decryptedChar);
        } else {
            decrypted += encryptedMessage[i]; // Keep non-alphabet characters unchanged
        }
    }

    return decrypted;
}

// Function to perform modular exponentiation
function modExp(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) result = (result * base) % mod;
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

// Example Usage
const { publicKey, privateKey } = generateKeys();

const message = "exc";

const name = 'turza';
console.log('The name is :::::::::::::::::::::::::::',name);
console.log('Original Message:', message);

const encryptedMessage = encryptString(message, publicKey);
console.log('Encrypted Message:', encryptedMessage); // Should look like 'vgm', etc.

const decryptedMessage = decryptString(encryptedMessage, privateKey);
console.log('Decrypted Message:', decryptedMessage); // Should match original message
