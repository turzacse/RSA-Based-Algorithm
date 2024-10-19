function gcd(a, b) {
    return b === 0 ? a : gcd(b, a%b);
}

 function modInverse (e, phi) {
    let d , i=1;
    while(true) {
        if((e*i) % phi == 1){ d= i; break; }
        i++;
    }
    return d;
 }

function generateKeys() {
    const p = 101,q = 103; // Take the very large prime. 
    const n = p * q;
    const phi = (p - 1) * (q - 1);

    let e = 7;
    while (gcd(e, phi) !== 1) {
        e += 2;
    }
    const d = modInverse(e, phi);

    return {
        publicKey: { e, n },
        privateKey: { d, n },
    };
}


// Function to encrypt a message
function encrypt(message, publicKey) {
    const { e, n } = publicKey;
    return modExp(message, e, n);
}

// Function to decrypt a message
function decrypt(ciphertext, privateKey) {
    const { d, n } = privateKey;
    return modExp(ciphertext, d, n);
}
function modExp(base, exp, mod) {
    let result = 1 ;
    base = base % mod;

    while(exp > 0) {
        if(exp % 2 === 1) 
            result = (result*base) % mod;

        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

// Usage example
const { publicKey, privateKey } = generateKeys();
const message = 1378;
const ciphertext = encrypt(message, publicKey);
const decryptedMessage = decrypt(ciphertext, privateKey);

console.log('The orginal Message ======>>', message);
console.log('Encrypted Message ========>>', ciphertext);
console.log('Decrypted Message ========>>', decryptedMessage);