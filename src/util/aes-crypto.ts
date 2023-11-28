class AESCrypto {
  private static ivLength = 12;

  static async importKey(envKey: string): Promise<CryptoKey> {
    const rawKey = Uint8Array.from(atob(envKey), (c) => c.charCodeAt(0));
    return crypto.subtle.importKey(
      'raw',
      rawKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(text: string, key: CryptoKey): Promise<ArrayBuffer> {
    const iv = crypto.getRandomValues(new Uint8Array(AESCrypto.ivLength));
    const encodedText = new TextEncoder().encode(text);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedText
    );

    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    return combined.buffer;
  }

  static async decrypt(
    encrypted: ArrayBuffer,
    key: CryptoKey
  ): Promise<string> {
    const iv = new Uint8Array(encrypted, 0, AESCrypto.ivLength);
    const encryptedData = new Uint8Array(encrypted, AESCrypto.ivLength);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decrypted);
  }
}

export { AESCrypto };
