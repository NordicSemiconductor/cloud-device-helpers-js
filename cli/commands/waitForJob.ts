import { CommandDefinition } from './CommandDefinition'
import * as chalk from 'chalk'
import { Iot } from 'aws-sdk'
import { wait } from '../../job/wait'

const defaultTimeout = 300
const defaultInterval = 30

export const waitForJobCommand = ({
	region,
}: {
	region: string
}): CommandDefinition => ({
	command: 'wait <jobId>',
	options: [
		{
			flags: '-t, --timout <timeout>',
			description: `Timeout in seconds, default: ${defaultTimeout}`,
		},
		{
			flags: '-i, --interval <interval>',
			description: `Interval in seconds, default: ${defaultInterval}`,
		},
	],
	action: async (jobId, { timeout, interval }) => {
		console.log(chalk.gray('  Job ID:    '), chalk.yellow(jobId))
		console.log('')
		const iot = new Iot({
			region,
		})

		await wait({
			iot,
			interval: interval ?? defaultInterval,
			timeout: timeout ?? defaultTimeout,
			jobId,
		})
	},
	help: 'Wait for a job to complete',
})
