import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import { randomUUID } from 'node:crypto'
import * as os from 'os'
import * as path from 'path'

const seggerFlashScript = (fwFile: string) => `h 
w4 4001e504 2
w4 4001e50c 1
sleep 100
rx 1000
h
w4 4001e504 1
loadfile ${fwFile}
rx 1000
g
exit`

/**
 * Implements flashing firmware using Segger JLink
 */
export const flash = async ({
	hexfile,
	warn,
	debug,
}: {
	hexfile: string
	warn?: (...args: string[]) => void
	debug?: (...args: string[]) => void
}): Promise<string[]> => {
	const script = path.join(os.tmpdir(), `${randomUUID()}.script`)
	await fs.writeFile(script, seggerFlashScript(hexfile), 'utf-8')
	debug?.(seggerFlashScript(hexfile))
	return new Promise((resolve, reject) => {
		const flash = spawn('JLinkExe', [
			'-device',
			'nrf9160',
			'-if',
			'SWD',
			'-speed',
			'1000',
			'-NoGui',
			'1',
			script,
		])
		const log: string[] = []
		let timedOut = false
		const t = setTimeout(() => {
			flash.kill('SIGHUP')
			timedOut = true
			return reject(
				new Error(`Timeout while waiting for flashing to complete.`),
			)
		}, 60 * 1000)
		flash.stdout.on('data', (data) => {
			data
				.toString()
				.trim()
				.split('\n')
				.filter((s: string) => s.length)
				.map((s: string) => {
					debug?.(s)
					log.push(s)
				})
		})

		flash.stderr.on('data', (data) => {
			data
				.toString()
				.trim()
				.split('\n')
				.filter((s: string) => s.length)
				.map((s: string) => warn?.(s))
		})

		flash.on('exit', () => {
			clearTimeout(t)
			if (log.join('\n').includes('Failed to open file.')) {
				warn?.(`Failed to open file: ${hexfile}`)
				return reject(new Error(`Failed to open file: ${hexfile}!`))
			}
			if (log.join('\n').includes('Script processing completed.')) {
				resolve(log)
			} else if (!timedOut) {
				reject(new Error('Flashing did not succeed for unknown reasons.'))
			}
		})
	})
}
