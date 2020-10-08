import { v4 } from 'uuid'
import * as chalk from 'chalk'
import { S3, Iot } from 'aws-sdk'
import { promises as fs } from 'fs'
import { FirmwareCIJobDocument } from '../runner/job'

const queryString = (s: Record<string, any>): string =>
	Object.entries(s)
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
		.join('&')

export const schedule = async ({
	firmwareUrl,
	certificateJSON,
	target,
	network,
	secTag,
	s3,
	bucketName,
	region,
	ciDeviceArn,
}: {
	s3: S3
	firmwareUrl: string
	certificateJSON: string
	target: string
	network: string
	secTag: number
	bucketName: string
	region: string
	ciDeviceArn: string
}): Promise<FirmwareCIJobDocument> => {
	const jobId = v4()
	console.log('')
	console.log(chalk.gray('  Job ID:    '), chalk.yellow(jobId))
	const { url, fields } = s3.createPresignedPost({
		Bucket: bucketName,
		Fields: {
			key: `${jobId}.json`,
		},
	})

	const { caCert, clientCert, privateKey } = JSON.parse(
		await fs.readFile(certificateJSON, 'utf-8'),
	)

	const jobDocument: FirmwareCIJobDocument = {
		reportPublishUrl: `${url}?${queryString(fields)}`,
		reportUrl: `https://${bucketName}.s3.${region}.amazonaws.com/${jobId}.json`,
		fw: firmwareUrl,
		target: `${target}:${network}`,
		credentials: {
			secTag,
			privateKey,
			clientCert,
			caCert,
		},
	}

	console.log(jobDocument)

	const iot = new Iot({
		region,
	})
	await iot
		.createJob({
			jobId,
			targets: [ciDeviceArn],
			document: JSON.stringify(jobDocument),
			description: `Firmware CI job for a ${target} with ${network}`,
			targetSelection: 'SNAPSHOT',
			timeoutConfig: {
				inProgressTimeoutInMinutes: 60,
			},
		})
		.promise()

	console.log(
		chalk.green('Job'),
		chalk.blueBright(jobId),
		chalk.green('created.'),
	)
	console.log()
	console.log(chalk.green('You can observe the job execution using:'))
	console.log(chalk.greenBright('node cli wait'), chalk.blueBright(jobId))
	return jobDocument
}
