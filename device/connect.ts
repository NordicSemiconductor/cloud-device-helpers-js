import { ReadlineParser } from '@serialport/parser-readline'
import { SerialPort } from 'serialport'
import { atCMD } from './atCMD'
import { flash } from './flash'

const defaultInactivityTimeoutInSeconds = 300

export type Connection = {
	end: () => Promise<void>
	at: (cmd: string) => Promise<string[]>
}

/**
 * Connects to a device and prepares it for execution of firmware.
 *
 * This flashes the AT host hexfile on successful connection.
 * Use connection.end() to terminate the connection.
 */
export const connect = async ({
	device,
	delimiter,
	atHostHexfile,
	progress,
	debug,
	warn,
	port,
	inactivityTimeoutInSeconds,
	onEnd,
}: {
	device: string
	atHostHexfile: string
	delimiter?: string
	progress?: (...args: string[]) => void
	debug?: (...args: string[]) => void
	warn?: (...args: string[]) => void
	port?: SerialPort
	inactivityTimeoutInSeconds?: number
	onEnd?: (port: SerialPort, timeout: boolean) => void
}): Promise<{
	connection: Connection
	deviceLog: string[]
	onData: (fn: (s: string) => void) => void
}> =>
	new Promise((resolve, reject) => {
		const deviceLog: string[] = []
		const timeoutSeconds =
			inactivityTimeoutInSeconds ?? defaultInactivityTimeoutInSeconds
		progress?.(`Connecting to`, device)
		progress?.(`Inactivity timeout`, `${timeoutSeconds} seconds`)
		const portInstance =
			port ??
			new SerialPort({
				path: device,
				baudRate: 115200,
				autoOpen: true,
				dataBits: 8,
				lock: true,
				stopBits: 1,
				parity: 'none',
				rtscts: false,
			})
		const parser = portInstance.pipe(
			new ReadlineParser({ delimiter: delimiter ?? '\r\n' }),
		)
		const connectionHandler = atCMD({
			device,
			port: portInstance,
			parser,
			delimiter: delimiter ?? '\r\n',
			progress: (...args) => {
				deviceLog.push(`${new Date().toISOString()}\t${args.join('\t')}`)
				progress?.(device, ...args)
			},
		})

		let inactivityTimer: NodeJS.Timeout
		const startTimer = () => {
			inactivityTimer = setTimeout(onInactive, timeoutSeconds * 1000)
		}

		const stopTimer = () => {
			if (inactivityTimer !== undefined) clearTimeout(inactivityTimer)
		}

		const resetTimer = () => {
			stopTimer()
			startTimer()
		}

		let ended = false
		const end = async (timeout: boolean) => {
			ended = true
			stopTimer()
			onEnd?.(portInstance, timeout)
			if (!portInstance.isOpen) {
				warn?.(device, 'port is not open')
				return
			}
			progress?.(device, 'closing port')
			portInstance.close()
			progress?.(device, 'port closed')
		}

		const onInactive = () => {
			warn?.(device, `No data received after ${timeoutSeconds} seconds`)
			void end(true)
		}

		portInstance.on('open', async () => {
			progress?.(device, `connected`)
			void flash({
				hexfile: atHostHexfile,
				debug: (...args: any[]) => debug?.('AT Host', ...args),
				warn: (...args: any[]) => warn?.('AT Host', ...args),
			})
			startTimer()
		})

		const at = async (cmd: string) => {
			resetTimer()
			return connectionHandler(cmd)
		}

		const listeners: ((s: string) => void)[] = []
		parser.on('data', async (data: string) => {
			debug?.(device, data)
			deviceLog.push(`${new Date().toISOString()}\t${data.trimEnd()}`)
			listeners.map((l) => l(data))
			if (data.includes('AT host sample started')) {
				resolve({
					connection: {
						at,
						end: async () => end(false),
					},
					deviceLog,
					onData: (fn) => {
						listeners.push(fn)
					},
				})
			}
			resetTimer()
		})
		portInstance.on('close', () => {
			if (ended) {
				progress?.(device, 'port closed')
			} else {
				warn?.(device, 'port closed unexpectedly')
				onEnd?.(portInstance, false)
			}
			stopTimer()
		})
		portInstance.on('error', (err) => {
			stopTimer()
			warn?.(device, err.message)
			reject(err)
		})
	})
