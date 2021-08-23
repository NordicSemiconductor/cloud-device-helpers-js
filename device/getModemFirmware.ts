/**
 * Returns the device's modem firmware version
 */
export const getModemFirmware = async ({
	at,
}: {
	at: (cmd: string) => Promise<string[]>
}): Promise<string> => {
	const mfwv = (await at('AT+CGMR'))[0]
	return mfwv.split('_')[2]
}
