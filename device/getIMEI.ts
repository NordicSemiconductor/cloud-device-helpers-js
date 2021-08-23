const cgsnRegex = /\+CGSN: "([^"]+)"/

/**
 * Returns the device's  IMEI
 */
export const getIMEI = async ({
	at,
}: {
	at: (cmd: string) => Promise<string[]>
}): Promise<string> => {
	const cgsnRes = (await at(`AT+CGSN=1`))[0]
	const imei = cgsnRegex.exec(cgsnRes)?.[1]
	if (!cgsnRegex.test(cgsnRes) || imei === undefined) {
		throw new Error(`Unexpected response: ${cgsnRes}`)
	}
	return imei
}
