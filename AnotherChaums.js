// Utility function for modular exponentiation
function modPow(base, exponent, mod) {
    let result = BigInt(1);
    base = base % mod;
    while (exponent > 0) {
        if (exponent % BigInt(2) === BigInt(1)) {
            result = (result * base) % mod;
        }
        exponent = exponent >> BigInt(1);
        base = (base * base) % mod;
    }
    return result;
}

// Function to compute gcd (greatest common divisor)
function gcd(a, b) {
    return b === 0n ? a : gcd(b, a % b);
}

// Step 1: Key Generation (public and private key)
function generateKeyPair() {
    const p = BigInt(101); 
    const q = BigInt(103); 
    const n = p * q; 
    const phiN = (p - BigInt(1)) * (q - BigInt(1)); 

    let e = BigInt(3); 

    while (gcd(e, phiN) !== BigInt(1)) {
        e += BigInt(2);
    }

    let d = modInverse(e, phiN);

    return { publicKey: { e, n }, privateKey: { d, n } };
}

// function modInverse(a, m) {
//     let [m0, x0, x1] = [m, BigInt(0), BigInt(1)];
//     if (m === BigInt(1)) return BigInt(0);  // Return 0 if modulus is 1 (edge case)
    
//     while (a > BigInt(1)) {
//         if (m === BigInt(0)) {
//             throw new RangeError("Division by zero error in modInverse. 'm' should not be zero.");
//         }

//         let q = a / m;
//         [a, m] = [m, a % m];
//         [x0, x1] = [x1 - q * x0, x0];
//     }
    
//     return x1 < BigInt(0) ? x1 + m0 : x1;
// }

function modInverse (e, phi) {
    let d ;
    let i = BigInt(1);
    while (true) {
        if ((e * i) % phi == 1) {
            d = i;
            break;  
        }
        i++;
    }
    return d;
  }


// Step 2: Blinding the message (performed by the client)
function blindMessage(message, publicKey) {
    const { e, n } = publicKey;
    const m = BigInt(message);
    const r = BigInt(Math.floor(Math.random() * 100)) % n;

    // Blinded message: m' = (m * r^e) % n
    const blindedMessage = (m * modPow(r, e, n)) % n;

    return { blindedMessage, r };
}

// Step 3: Signing the blinded message (performed by the signer)
function signBlindedMessage(blindedMessage, privateKey) {
    const { d, n } = privateKey;
    // Sign the blinded message: s' = (m'^d) % n
    const blindedSignature = modPow(blindedMessage, d, n);

    return blindedSignature;
}

// Step 4: Unblinding the signature (performed by the client)
function unblindSignature(blindedSignature, r, publicKey) {
    const { n } = publicKey;

    // Unblinded signature: s = (s' * r^-1) % n
    const rInverse = modInverse(r, n);
    const signature = (blindedSignature * rInverse) % n;

    return signature;
}

// Step 5: Verification of the signature (performed by the client)
function verifySignature(message, signature, publicKey) {
    const { e, n } = publicKey;
    // Verify if signature^e % n == message
    const verifiedMessage = modPow(signature, e, n);
    return verifiedMessage === message;
}


const { publicKey, privateKey } = generateKeyPair();
const message = BigInt(239); // Example message as a number
const { blindedMessage, r } = blindMessage(message, publicKey);
const blindedSignature = signBlindedMessage(blindedMessage, privateKey);
const signature = unblindSignature(blindedSignature, r, publicKey);
const isVerified = verifySignature(message, signature, publicKey);

console.log("Original message:", message.toString());
console.log("Blinded message:", blindedMessage.toString());
console.log("Blinded signature:", blindedSignature.toString());
console.log("Final signature:", signature.toString());
console.log("Is the signature verified?", isVerified); 

// The client can now verify the signature using the public key.
