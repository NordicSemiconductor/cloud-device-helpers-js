/**
 * Flash the certificate by writing to the device using AT commands send to the at method
 */
export const flashCertificate = async ({
	at,
	secTag,
	clientCert,
	caCert,
}: {
	at: (cmd: string) => Promise<string[]>
	secTag: number
	clientCert: string
	caCert: string
}): Promise<void> => {
	// Turn off modem
	await at('AT+CFUN=4')
	// 0 – Root CA certificate (ASCII text)
	await at(`AT%CMNG=0,${secTag},0,"${caCert.replace(/\n/g, '\r\n')}"`)
	// 1 – Client certificate (ASCII text)
	await at(`AT%CMNG=0,${secTag},1,"${clientCert.replace(/\n/g, '\r\n')}"`)
	// Turn on modem
	await at('AT+CFUN=1')
}
