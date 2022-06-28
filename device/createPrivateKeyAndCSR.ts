import * as semver from 'semver'
import { getIMEI } from './getIMEI'
import { getModemFirmware } from './getModemFirmware'
import { verifyKeygenResult } from './verifyKeygenResult'

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
	attributes,
	expectedMfwVersion,
	deletePrivateKey,
}: {
	at: (cmd: string) => Promise<string[]>
	secTag: number
	expectedMfwVersion?: string
	attributes?: (_: { imei: string }) => string
	/**
	 * If the device already has a key stored with the same secTag, it needs to be deleted first.
	 */
	deletePrivateKey: boolean
}): Promise<Buffer> => {
	const mfw = await getModemFirmware({ at })
	if (!semver.satisfies(mfw, expectedMfwVersion ?? '>=1.3.0')) {
		throw new Error(
			`Please update your modem firwmare to at least version 1.3.0. Got ${mfw}.`,
		)
	}
	const imei = await getIMEI({ at })
	// Turn off modem
	await at('AT+CFUN=4')
	// Delete existing private key
	if (deletePrivateKey ?? false) await at(`AT%CMNG=3,${secTag},2`)
	// Generate the new key
	const res = await at(
		`AT%KEYGEN=${secTag},2,0,"${
			attributes?.({ imei }) ?? `CN=${imei}`
		}","101010000"`,
	)
	// Turn on modem
	await at('AT+CFUN=1')

	if (!keygenResRx.test(res[0])) {
		throw new Error(`Unexpected response: ${res}`)
	}

	const cose = keygenResRx.exec(res[0])?.[1] ?? ''
	const { verified, error } = verifyKeygenResult(cose)
	if (!verified) {
		throw new Error(`Device returned an invalid CSR: ${error}!`)
	}

	const [csrBase64] = cose.split('.') ?? []
	const csr = Buffer.from(csrBase64, 'base64url')

	return csr
}
