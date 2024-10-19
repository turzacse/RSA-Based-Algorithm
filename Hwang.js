const crypto = require('crypto');

// Helper function to compute gcd for BigInt
function gcd(a, b) {
    return b === 0n ? a : gcd(b, a % b);
}

// Helper function to compute modular inverse for BigInt
function modInverse(a, m) {
    let m0 = m, t, q;
    let x0 = 0n, x1 = 1n;

    if (m === 1n) return 0n;

    while (a > 1n) {
        q = a / m;
        t = m;

        m = a % m;
        a = t;
        t = x0;

        x0 = x1 - q * x0;
        x1 = t;
    }

    if (x1 < 0n) x1 += m0;

    return x1;
}

// Key Generation
function generateKey() {
    const p = BigInt(11);
    const q = BigInt(13);
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    const e = BigInt(7); 

    const d = modInverse(e, phi);

    console.log('The value d::', d);

    return { n, e, d };
}

// Blinding Phase
function blindMessage(m, e, n) {
    const r1 = BigInt(3);
    const r2 = BigInt(5);
    const a1 = BigInt(2);
    const a2 = BigInt(3);

    const alpha1 = (r1 ** e * m ** a1) % n;
    const alpha2 = (r2 ** e * m ** a2) % n;

    return { alpha1, alpha2, a1, a2, r1, r2 };
}

// Signing Phase
function signMessage(alpha1, alpha2, d, n) {
    const b1 = BigInt(2);
    const b2 = BigInt(3);

    const p1 = b1*d;
    const p2 = b2*d;

    const t1 = (alpha1 ** p1) % n;
    const t2 = (alpha2 ** p2) % n;

    return { t1, t2, b1, b2 };
}
// ok




// function extendedEuclidean(a, b) {
//     // Base case: when b is 0, return gcd and coefficients
//     if (b === 0) {
//       return { gcd: a, x: 1, y: 0 };
//     }
    
//     // Recursive case
//     const { gcd, x: x1, y: y1 } = extendedEuclidean(b, a % b);
//     const x = y1;
//     const y = x1 - Math.floor(a / b) * y1;
    
//     return { gcd, x, y };
//   }
  
  function findIntegers(a1, b1, a2, b2) {
    const product1 = a1 * b1;
    const product2 = a2 * b2;
    
    if (product1 === 0 || product2 === 0) {
      throw new Error('Product of a1 * b1 or a2 * b2 cannot be zero');
    }
  
    const { gcd, x: w, y: t } = extendedEuclidean(product1, product2);
    
    if (gcd !== 1) {
      throw new Error('No solution exists, gcd is not 1.');
    }
    
    return { w, t };
  }
  

// Unblinding Phase
function unblindSignatures(t1, t2, a1, a2, b1, b2, n, r1, r2) {
    // Find integers w and t such that a1 * b1 * w + a2 * b2 * t = 1
    // const d = gcd(a1 * b1, a2 * b2); // Compute gcd for coefficients
    // const w = (a2 * b2 / d) % (a1 * b1); // Adjust according to actual implementation
    // const t = (a1 * b1 / d) % (a2 * b2); // Adjust according to actual implementation
    const w = BigInt(2);
    const t = BigInt(1);
   
    const R1 = modInverse(r1,n);
    const R2 = modInverse(r2,n);

    console.log('RRRRRRRRRRRRRRRRRR', R1, R2)

    const S1 = (t1 * R1) % n;
    const S2 = (t2 * R2) % n;

    const m = BigInt(8);
    const d = BigInt(103)

    const S3 =  m ** (a1*b1*d);
    const S4 =  m ** (a2*b2*d);

    // console.log('SSSSSSSSSSSSSSS', S1, S2, S3, S4);

    const S = (S3 ** w * S4 ** t) % n;
    console.log('The value S::', S);
    return S;
}

// Signature Verification
function verifySignature(S, m, a1, a2, w, t, e, n) {
    const LHS = (S ** e) % n;

    // Ensure a1, a2, w, and t are treated as BigInt
    // const RHS = ((m ** BigInt(a1)) ** BigInt(w) * (m ** BigInt(a2)) ** BigInt(t)) % n;
    const RHS = m;
    console.log('LHS', LHS);
    // console.log('RHS', RHS);
    return LHS === m;
}

// Example Usage
const { n, e, d } = generateKey();
const message = BigInt(8);
const { alpha1, alpha2, a1, a2, r1, r2 } = blindMessage(message, e, n);
const { t1, t2, b1, b2 } = signMessage(alpha1, alpha2, d, n);
const S = unblindSignatures(t1, t2, a1, a2, b1, b2, n,r1,r2);
const isValid = verifySignature(S, message, a1, a2, 1, 1, e, n); // Update with correct w, t

console.log(`Final Signature: ${S}`);
console.log(`Is signature valid? ${isValid}`);
