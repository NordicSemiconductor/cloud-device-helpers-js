import { spawn } from 'child_process'
import { LogFN } from './log'

/**
 * Downloads and stores a firmware file using curl
 */
export const download = async ({
	fw,
	target,
	progressLog,
	successLog,
	warnLog,
}: {
	fw: string
	target: string
	progressLog?: LogFN
	successLog?: LogFN
	warnLog?: LogFN
}): Promise<string> =>
	new Promise((resolve, reject) => {
		progressLog?.('Downloading HEX file from', fw)
		progressLog?.('Downloading HEX file to', target)
		const reset = spawn('curl', ['-L', '-s', fw, '-o', target])
		reset.stdout.on('data', (data: string) => {
			data
				.toString()
				.trim()
				.split('\n')
				.filter((s) => s.length)
				.map((s) => progressLog?.('Download HEX file', s))
		})

		reset.stderr.on('data', (data: string) => {
			data
				.toString()
				.trim()
				.split('\n')
				.filter((s) => s.length)
				.map((s) => warnLog?.('Download HEX file', s))
		})

		reset.on('exit', (code) => {
			if (code === 0) {
				successLog?.('Download HEX file', 'succeeded')
				resolve(target)
			} else {
				warnLog?.('Failed to download', fw)
				reject(new Error(`Failed to download ${fw}!`))
			}
		})
	})
