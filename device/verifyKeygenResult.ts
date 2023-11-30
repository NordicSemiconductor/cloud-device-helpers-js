import cbor from 'cbor'
import { createHash } from 'crypto'

export const verifyKeygenResult = (
	csrBase64: string,
): {
	verified: boolean
	checksum?: string
	signedChecksum?: string
	error?: string
} => {
	const parts = csrBase64.split('.')
	if (parts.length !== 2)
		return {
			verified: false,
			error: 'Payload could not be split',
		}

	const csrChecksum = createHash('sha256')
		.update(Buffer.from(parts[0], 'base64url'))
		.digest('hex')

	try {
		const signedChecksum = cbor.decodeFirstSync(
			Buffer.from(parts[1], 'base64url'),
			{
				tags: {
					18: (v: any) => cbor.decodeFirstSync(v[2]).value[3].toString('hex'),
				},
			},
		)
		return {
			verified: csrChecksum === signedChecksum,
			checksum: csrChecksum,
			signedChecksum,
		}
	} catch (error: any) {
		return {
			verified: false,
			error: `CBOR: ${error.message}`,
		}
	}
}
