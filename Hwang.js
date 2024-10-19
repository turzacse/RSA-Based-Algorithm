const crypto = require('crypto');

function gcd(a, b) {
    return b === 0n ? a : gcd(b, a % b);
}

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

// 1.Key Generation
function generateKey() {
    const p = BigInt(11);
    const q = BigInt(13);
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    const e = BigInt(7); 
    const d = modInverse(e, phi);
    return { n, e, d };
}

// 2.Blinding Phase
function blindMessage(m, e, n) {
    const r1 = BigInt(3);
    const r2 = BigInt(5);
    const a1 = BigInt(2);
    const a2 = BigInt(3);
    const alpha1 = (r1 ** e * m ** a1) % n;
    const alpha2 = (r2 ** e * m ** a2) % n;

    return { alpha1, alpha2, a1, a2, r1, r2 };
}

// 3.Signing Phase
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

// 4. Unblinding Phase
function unblindSignatures(t1, t2, a1, a2, b1, b2, n, r1, r2) {
    // Find integers w and t such that a1 * b1 * w + a2 * b2 * t = 1
    const d = gcd(a1 * b1, a2 * b2); 
    const w = (a2 * b2 / d) % (a1 * b1); 
    const t = (a1 * b1 / d) % (a2 * b2);
    
    const R1 = modInverse(r1,n);
    const R2 = modInverse(r2,n);

    const S1 = (t1 * R1) % n;
    const S2 = (t2 * R2) % n;

    const S = (S1 ** w * S2 ** t) % n;
    return S;
}

// 5. Signature Verification
function verifySignature(S, m, e, n) {
    const LHS = (S ** e) % n;
    return LHS === m;
}

// Example Usage
const { n, e, d } = generateKey();
const message = BigInt(8);
const { alpha1, alpha2, a1, a2, r1, r2 } = blindMessage(message, e, n);
const { t1, t2, b1, b2 } = signMessage(alpha1, alpha2, d, n);
const S = unblindSignatures(t1, t2, a1, a2, b1, b2, n,r1,r2);
const isValid = verifySignature(S, message, e, n);

console.log(`Final Signature: ${S}`);
console.log(`Is signature valid? ${isValid}`);