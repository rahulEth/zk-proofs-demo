const snarkjs = require('snarkjs');
const fs = require('fs');
const { sha256 } = require('js-sha256');
const { buildMimc7 } = require("circomlibjs");

async function run() {
    // Step 1: Compile the circuit
    const circuitDef = await snarkjs.compile("PasswordHash.circom");

    // Step 2: Generate a trusted setup (use Powers of Tau)
    const ptau = await snarkjs.powersOfTau.newAccumulator();
    await snarkjs.powersOfTau.contribute(ptau, 'contributor');

    const { verificationKey, provingKey } = await snarkjs.setup(circuitDef, ptau);

    // Step 3: Generate witness
    const userPassword = "mysecretpassword";
    const userPasswordHash = sha256(userPassword);
    const storedHash = userPasswordHash; // Simulating stored hash

    const input = {
        password: userPassword,
        storedHash: storedHash
    };

    const witness = snarkjs.wtns.calculate(input, circuitDef);

    // Step 4: Generate proof
    const { proof, publicSignals } = await snarkjs.groth16.prove(provingKey, witness);

    // Step 5: Verify proof
    const isValid = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
    
    if (isValid) {
        console.log("Proof is valid!");
    } else {
        console.log("Proof is invalid!");
    }
}

run().catch(err => console.error(err));




Zero-Knowledge Proof
When the user runs this circuit, they generate a proof that they know the password that hashes to the stored hash without revealing the password itself. This proof can be verified by the verifier without exposing any sensitive information.

Benefits
Privacy: The user's password is never exposed during authentication.
Security: The proof is cryptographically secure, meaning it's computationally infeasible to fake it.
Efficiency: The verification process is fast and does not require exposing sensitive information.
Conclusion
By using Circom and zero-knowledge proofs, you can design an authentication system that verifies a user's credentials without exposing them. This approach leverages the power of cryptographic hashes and the efficiency of zero-knowledge proofs to ensure both security and privacy.

