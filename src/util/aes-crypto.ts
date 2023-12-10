class AESCrypto {
  private static textEncoder = new TextEncoder();
  private static textDecoder = new TextDecoder();

  static async importKey(secret: string): Promise<CryptoKey> {
    return crypto.subtle.importKey(
      'raw',
      this.textEncoder.encode(secret),
      'PBKDF2',
      false,
      ['deriveKey']
    );
  }

  static async deriveKey(
    key: CryptoKey,
    salt: Uint8Array,
    usages: CryptoKey['usages'],
    iterations: number = 10000
  ): Promise<CryptoKey> {
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations,
        hash: 'SHA-256',
      },
      key,
      {
        name: 'AES-GCM',
        length: 256,
      },
      false,
      usages
    );
  }

  static async encrypt(
    data: string,
    password: string,
    iterations: number = 10000
  ): Promise<string> {
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const passwordKey = await this.importKey(password);
      const aesKey = await this.deriveKey(
        passwordKey,
        salt,
        ['encrypt'],
        iterations
      );
      const dataArr = this.textEncoder.encode(data);

      const encryptedContent = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        aesKey,
        dataArr
      );

      const encryptedContentArr = new Uint8Array(encryptedContent);
      let iterationsArr = new Uint8Array(
        this.textEncoder.encode(iterations.toString())
      );

      let buff = new Uint8Array(
        iterationsArr.byteLength +
          salt.byteLength +
          iv.byteLength +
          encryptedContentArr.byteLength
      );
      let bytes = 0;
      buff.set(iterationsArr, bytes);
      buff.set(salt, (bytes += iterationsArr.byteLength));
      buff.set(iv, (bytes += salt.byteLength));
      buff.set(encryptedContentArr, (bytes += iv.byteLength));

      const encryptedData = btoa(
        String.fromCharCode.apply(null, Array.from(buff))
      );

      return encryptedData;
    } catch (e: unknown) {
      const error = e as Error;
      throw new Error(`Error encrypting value: ${error.message}`);
    }
  }

  static async decrypt(
    encryptedData: string,
    password: string
  ): Promise<string> {
    try {
      const decodedEncryptedData = atob(encryptedData);
      const encryptedDataBuff = new Uint8Array(
        decodedEncryptedData.split('').map((char) => char.charCodeAt(0))
      );

      let bytes = 0;
      const iterations = Number(
        this.textDecoder.decode(encryptedDataBuff.slice(bytes, (bytes += 5)))
      );

      const salt = new Uint8Array(
        encryptedDataBuff.slice(bytes, (bytes += 16))
      );
      const iv = new Uint8Array(encryptedDataBuff.slice(bytes, (bytes += 12)));
      const data = new Uint8Array(encryptedDataBuff.slice(bytes));

      const passwordKey = await this.importKey(password);
      const aesKey = await this.deriveKey(
        passwordKey,
        salt,
        ['decrypt'],
        iterations
      );
      const decryptedContent = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        aesKey,
        data
      );

      return this.textDecoder.decode(decryptedContent);
    } catch (e: unknown) {
      const error = e as Error;
      throw new Error(`Error decrypting value: ${error.message}`);
    }
  }
}

export { AESCrypto };
