import * as chalk from 'chalk'
import { Iot } from 'aws-sdk'
import { progress, success, warn } from '../runner/log'

export const wait = async ({
	iot,
	timeout,
	interval,
	jobId,
}: {
	iot: Iot
	timeout: number
	interval: number
	jobId: string
}): Promise<void> =>
	new Promise((resolve, reject) => {
		const t = setTimeout(() => reject(), timeout * 1000)
		let i: NodeJS.Timeout | undefined = undefined
		const checkJob = async () => {
			const { job } = await iot
				.describeJob({
					jobId,
				})
				.promise()

			if (job === undefined) {
				clearTimeout(t)
				if (i !== undefined) clearInterval(i)
				return reject(`Job ${jobId} not found.`)
			}
			if (job.status === 'COMPLETED') {
				progress(job.status)
				clearTimeout(t)
				if (i !== undefined) clearInterval(i)
				if ((job.jobProcessDetails?.numberOfFailedThings ?? 0) > 0) {
					warn(
						`${job.jobProcessDetails?.numberOfFailedThings} failed executions.`,
					)
					return reject(`Job ${jobId} failed!`)
				}
				success(
					`${job.jobProcessDetails?.numberOfFailedThings} failed executions.`,
				)
				return resolve()
			} else {
				progress(chalk.yellow(job.status))
			}
		}
		void checkJob()
		i = setInterval(checkJob, interval * 1000)
	})
