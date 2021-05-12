import { spawn } from 'child_process'
import { parse } from 'shell-quote'
import { LogFN } from './log'

export const runCmd = async ({
	cmd,
	timeoutInSeconds,
	progressLog,
	successLog,
	warnLog,
	errorLog,
}: {
	cmd: string
	timeoutInSeconds?: number
	progressLog?: LogFN
	successLog?: LogFN
	warnLog?: LogFN
	errorLog?: LogFN
}): Promise<string> =>
	new Promise((resolve, reject) => {
		const [program, ...args] = parse(cmd) as string[]
		const p = spawn(program, args)
		let timedOut = false
		const t = setTimeout(() => {
			p.kill('SIGHUP')
			timedOut = true
		}, (timeoutInSeconds ?? 60) * 1000)

		const data: string[] = []
		p.stdout.on('data', (d) => {
			progressLog?.(d.toString())
			data.push(d.toString())
		})

		const error: string[] = []
		p.stderr.on('data', (d) => {
			warnLog?.(d.toString())
			error.push(d.toString())
		})

		p.on('close', (code) => {
			clearTimeout(t)
			if (timedOut) {
				errorLog?.('Timed out.')
				return reject(new Error(`Timeout while running command '${cmd}'.`))
			}
			if (code === 0) {
				successLog?.('Succeeded.')
				return resolve(data.join('\n'))
			}
			errorLog?.(error.join('\n'))
			reject(error.join('\n'))
		})
	})
