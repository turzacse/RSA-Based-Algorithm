function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

 function modInverse (e, phi) {
    let d ;
    for(let i =1; i<5000; i++){
        if((e*i) % phi == 1){
            d= i;
            break;
        }
    }
    return d;
 }


// Function to generate RSA key pair
function generateKeys() {
    //First we need to take large prime number for P & Q.  
    const p = 13,q = 11; 
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
        allkey: {p,q,n,phi,e,d}
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

// Usage example
const { publicKey, privateKey,allkey } = generateKeys();

console.log('all key here', allkey);

const message = 101; // Your message (as a number)
console.log('The orginal Message::::::::::', message)
const ciphertext = encrypt(message, publicKey);
console.log('Encrypted:', ciphertext);

const decryptedMessage = decrypt(ciphertext, privateKey);
console.log('Decrypted:', decryptedMessage);