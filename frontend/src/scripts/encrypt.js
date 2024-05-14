var CryptoJS = require("crypto-js");

function encrypt(data, secretKey) {
    var ciphertext = CryptoJS.AES.encrypt(data.toString(), secretKey).toString();
    return ciphertext;
}

function decrypt(encryptedData, secretKey) {
    var bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export { encrypt, decrypt };
