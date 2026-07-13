import CryptoJS from 'crypto-js';

const ENC_KEY = '1234567890';

export const EncryptValue = (value: string) => {
	const key = CryptoJS.enc.Utf8.parse(ENC_KEY);
	const iv = CryptoJS.enc.Utf8.parse(ENC_KEY);
	return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), key, {
		keySize: 128 / 8,
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	}).toString();
};

export const GenerateMD5 = (value: string) => {
	return CryptoJS.MD5(value).toString();
};


export const EncryptWithKey = (string: any, key: any): any => {
	if (!key) {
		throw new Error('Encryption key is required.');
	}
	const keyBytes = CryptoJS.enc.Utf8.parse(key);
	const iv = CryptoJS.enc.Utf8.parse('8080808080808080');

	const encrypted = CryptoJS.AES.encrypt(
		CryptoJS.enc.Utf8.parse(string),
		keyBytes,
		{
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
		}
	);

	return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}



export const DecryptWithKey = (cipherText: string, key: string): string => {
	const keyBytes = CryptoJS.enc.Utf8.parse(key);
	const iv = CryptoJS.enc.Utf8.parse('8080808080808080');

	// Convert Base64 → WordArray
	const cipherParams = CryptoJS.lib.CipherParams.create({
		ciphertext: CryptoJS.enc.Base64.parse(cipherText),
	});

	const decrypted = CryptoJS.AES.decrypt(cipherParams, keyBytes, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	});

	return decrypted.toString(CryptoJS.enc.Utf8);
};
