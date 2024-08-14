pragma circom 2.0.0;

template PasswordHash() {
    signal input password; // User's input password
    signal input storedHash; // Stored hash of the correct password

    signal output isValid; // Output signal to indicate if the password is valid

    // Hash the input password
    signal hashedPassword = sha256(password);

    // Check if the hashed password matches the stored hash
    isValid <== (hashedPassword === storedHash) ? 1 : 0;
}

component main = PasswordHash();

