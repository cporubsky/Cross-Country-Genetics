"use strict"

// A randomly-generated secret string
const secret = '93apiepovineaoi309uuaphgoanlane4o;aij4o8*(%WP*(P(NUV)))'
// The algorithm to use in cyphering
const algorithm = 'aes-256-ctr'

const crypto = require('crypto');

/**
 *  This class handles the encryption for user passwords.
 *  @class
 */
class Encryption {

  /**
   *  @function salt
   *  @memberof Encryption
   *  @description Creates a random value for use as salt.
   *  @return {hex} salt
   */
  salt() {
    return crypto.randomBytes(32).toString('hex').slice(0,32);
  }

  /**
   *  @function digest
   *  @param {string} plaintext - The plain text password.
   *  @memberof Encryption
   *  @description Creates a cryptographic hash of the provided
   *  plaintext, with additional salt using a module
   *  specific secret.
   *  @return {hex} digest
   */
  digest(plaintext) {
    const hash = crypto.createHash('sha256');
    hash.update(plaintext);
    hash.update(secret);
    return hash.digest('hex');
  }

  /**
   *  @function encipher
   *  @param {string} plaintext - The plain text password.
   *  @memberof Encryption
   *  @description Enciphers a plain text password.
   *  @return {hex} encrypted
   */
  encipher(plaintext) {
    const cipher = crypto.createCipher(algorithm, secret);
    var encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   *  @function decipher
   *  @param {string} crypttext - The encrypted password.
   *  @memberof Encryption
   *  @description Deciphers encrypted password.
   *  @return {utf8} deciphered
   */
  decipher(crypttext) {
    const decipher = crypto.createCipher(algorithm, secret);
    var deciphered = decipher.update(crypttext, 'hex', 'utf8');
    deciphered += decipher.final('utf8');
    return deciphered;
  }

}

module.exports = exports = new Encryption();