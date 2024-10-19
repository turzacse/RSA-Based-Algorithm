function gcd(a, b) {
    return b === 0 ? a : gcd(b, a%b);
}

function modInverse(e, phi) {
    let d, i=1;
    while (true) {
        if( e * i % phi === 1) {
            d = i;
            break;
        }
        i++;
    }
    return d;
}

// Function to generate RSA key pair
function generateKeys() {
    const p = 7, q = 3;
    const n = p * q;
    const phi = (p - 1) * (q - 1);

    let e = 3;
    while (gcd(e, phi) !== 1) {
        e += 2;
    }
    const d = modInverse(e, phi);
    return {
        publicKey: { e, n },
        privateKey: { d, n }
    };
}

function charToPosition(char) {
    return char.toLowerCase().charCodeAt(0) - 97; // 'a' is 97 in ASCII
}

function positionToChar(pos) {
    return String.fromCharCode(pos + 97); 
}

function encryptString(message, publicKey) {
    const { e, n } = publicKey;
    let encrypted = '';

    for (let i = 0; i < message.length; i++) {
        const m = charToPosition(message[i]); 
        if (m >= 0 && m <= 25) { 
            const encryptedChar = modExp(m, e, n) % 26; 

            encrypted += positionToChar(encryptedChar);
        } else {
            encrypted += message[i]; 
        }
    }

    return encrypted;
}

function decryptString(encryptedMessage, privateKey) {
    const { d, n } = privateKey;
    let decrypted = '';

    for (let i = 0; i < encryptedMessage.length; i++) {
        const c = charToPosition(encryptedMessage[i]); 
        
        if (c >= 0 && c <= 25) {
            const decryptedChar = modExp(c, d, n) % 26; 
            decrypted += positionToChar(decryptedChar);
        } else {
            decrypted += encryptedMessage[i]; 
        }
    }

    return decrypted;
}

function modExp(base, exp, mod) {
    let result = 1;
    base = base % mod;

    while(exp > 0) {
        if(exp % 2 === 1) result = (result * base) % mod;

        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }

    return result
}

// Example Usage
const { publicKey, privateKey } = generateKeys();

const message = "ict cse";
console.log('Original Message:', message);
const encryptedMessage = encryptString(message, publicKey);
console.log('Encrypted Message:', encryptedMessage); // Should look like 'vgm', etc.

const decryptedMessage = decryptString(encryptedMessage, privateKey);
console.log('Decrypted Message:', decryptedMessage); // Should match original message
