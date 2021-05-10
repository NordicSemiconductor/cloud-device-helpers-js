import { spawn } from 'child_process'
import { parse } from 'shell-quote'
import { progress, warn } from './log'

export const runCmd = async ({
	cmd,
	timeoutInSeconds,
}: {
	cmd: string
	timeoutInSeconds?: number
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
			progress(cmd, d.toString())
			data.push(d.toString())
		})

		const error: string[] = []
		p.stderr.on('data', (d) => {
			warn(cmd, d.toString())
			error.push(d.toString())
		})

		p.on('close', (code) => {
			clearTimeout(t)
			if (timedOut)
				return reject(new Error(`Timeout while running command '${cmd}'.`))
			if (code === 0) return resolve(data.join('\n'))
			reject(error.join('\n'))
		})
	})
