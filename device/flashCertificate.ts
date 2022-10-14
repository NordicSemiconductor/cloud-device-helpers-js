/**
 * Flash the certificate by writing to the device using AT commands send to the at method
 */
export const flashCertificate = async ({
	at,
	secTag,
	clientCert,
	caCert,
	secondaryCaCert,
}: {
	at: (cmd: string) => Promise<string[]>
	secTag: number
	clientCert: string
	caCert: string
	/**
	 * Optionally provision a secondary CA certificate to the given sec tag
	 */
	secondaryCaCert?: {
		secTag: number
		caCert: string
	}
}): Promise<void> => {
	// Turn off modem
	await at('AT+CFUN=4')
	// 0 – Root CA certificate (ASCII text)
	await at(`AT%CMNG=0,${secTag},0,"${convertNewlines(caCert)}"`)
	// 1 – Client certificate (ASCII text)
	await at(`AT%CMNG=0,${secTag},1,"${convertNewlines(clientCert)}"`)
	if (secondaryCaCert !== undefined) {
		await at(
			`AT%CMNG=0,${secondaryCaCert.secTag},0,"${convertNewlines(
				secondaryCaCert.caCert,
			)}"`,
		)
	}
	// Turn on modem
	await at('AT+CFUN=1')
}

const convertNewlines = (s: string): string => s.replace(/\n/g, '\r\n')
