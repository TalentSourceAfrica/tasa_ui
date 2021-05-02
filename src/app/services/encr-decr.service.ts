import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncrDecrService {
  private _keySize: any;
  private _ivSize: any;
  private _iterationCount: any;

  constructor() {
    this._keySize = 256;
    this._ivSize = 128;
    this._iterationCount = 1989;
  }
  //The set method is use for encrypt the value.
  set(keys: any, value: any) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    console.log('iv');
    console.log(iv);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  get(keys: any, value: any) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  generateKey(salt: any, passPhrase: any) {
    return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
      keySize: this._keySize / 32,
      iterations: this._iterationCount,
    });
  }

  encryptWithIvSalt(salt: any, iv: any, passPhrase: any, plainText: any) {
    let key = this.generateKey(salt, passPhrase);
    let encrypted = CryptoJS.AES.encrypt(plainText, key, { iv: CryptoJS.enc.Hex.parse(iv) });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  decryptWithIvSalt(salt: any, iv: any, passPhrase: any, cipherText: any) {
    let key = this.generateKey(salt, passPhrase);
    let cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(cipherText),
    });
    let decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv: CryptoJS.enc.Hex.parse(iv) });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  encrypt(passPhrase: any, plainText: any) {
    let iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(CryptoJS.enc.Hex);
    let salt = CryptoJS.lib.WordArray.random(this._keySize / 8).toString(CryptoJS.enc.Hex);
    let cipherText = this.encryptWithIvSalt(salt, iv, passPhrase, plainText);
    return salt + iv + cipherText;
  }

  decrypt(passPhrase: any, cipherText: any) {
    let ivLength = this._ivSize / 4;
    let saltLength = this._keySize / 4;
    let salt = cipherText.substr(0, saltLength);
    let iv = cipherText.substr(saltLength, ivLength);
    let encrypted = cipherText.substring(ivLength + saltLength);
    let decrypted = this.decryptWithIvSalt(salt, iv, passPhrase, encrypted);
    return decrypted;
  }

  get keySize() {
    return this._keySize;
  }

  set keySize(value) {
    this._keySize = value;
  }

  get iterationCount() {
    return this._iterationCount;
  }

  set iterationCount(value) {
    this._iterationCount = value;
  }
}
