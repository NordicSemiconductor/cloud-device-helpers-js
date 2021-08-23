const keygenResRx = /%KEYGEN: "([^"]+)"/

/**
 * Generates the private key on the device and returns the CSR for signing
 * the device certificate.
 *
 * The %KEYGEN response contains a public key in CBOR device pubkey message and COSE signature separated by dot "." with both sides Base64Url-encoded: "Base64Url(public_key_DER).Base64Url(cose_sign)".
 *
 * You can convert the binary CSR data into PEM for signing the device certificate using OpenSSL like this:
 * openssl req -inform DER -in <path to file with binary output> -out csr.pem
 */
export const createPrivateKeyAndCSR = async ({
	at,
	secTag,
}: {
	at: (cmd: string) => Promise<string[]>
	secTag: number
}): Promise<Buffer> => {
	// Turn off modem
	await at('AT+CFUN=4')
	// Delete existing private key
	await at(`AT%CMNG=3,${secTag},2`)
	// Generate the new key
	const res = await at(`AT%KEYGEN=${secTag},2,0`)
	if (!keygenResRx.test(res[0])) {
		throw new Error(`Unexpected response: ${res}`)
	}
	const [csrBase64] = keygenResRx.exec(res[0])?.[1].split('.') ?? []
	const csr = Buffer.from(csrBase64, 'base64url')
	// Turn on modem
	await at('AT+CFUN=1')
	return csr
}
