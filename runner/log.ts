import * as chalk from 'chalk'

const notEmpty = (s?: any) => s !== undefined

const stringify = (a: any) =>
	typeof a === 'object' ? JSON.stringify(a) : `${a}`.trim()

export type LogFN = (...text: unknown[]) => void

const logWriter =
	(
		colorFn: (...text: unknown[]) => string,
		logFN: LogFN,
		withTimestamp = false,
	) =>
	(...args: unknown[]): void => {
		logFN(
			...[
				withTimestamp ? chalk.grey(`[${new Date().toISOString()}]`) : undefined,
				...args.map((arg) => colorFn(stringify(arg))),
			].filter(notEmpty),
		)
	}

export const log = ({
	prefixes,
	withTimestamp,
}: {
	prefixes?: string[]
	withTimestamp?: boolean
} = {}): {
	warn: (...args: any[]) => void
	progress: (...args: any[]) => void
	success: (...args: any[]) => void
	debug: (...args: any[]) => void
	error: (...args: any[]) => void
} => ({
	warn: (...args: any[]) =>
		logWriter(
			chalk.yellow,
			console.warn,
			withTimestamp,
		)(...[...(prefixes ?? []), ...args]),
	progress: (...args: any[]) =>
		logWriter(
			chalk.blue,
			console.info,
			withTimestamp,
		)(...[...(prefixes ?? []), ...args]),
	success: (...args: any[]) =>
		logWriter(
			chalk.green,
			console.info,
			withTimestamp,
		)(...[...(prefixes ?? []), ...args]),
	debug: (...args: any[]) =>
		logWriter(
			chalk.magenta,
			console.debug,
			withTimestamp,
		)(...[...(prefixes ?? []), ...args]),
	error: (...args: any[]) =>
		logWriter(
			chalk.red,
			console.error,
			withTimestamp,
		)(...[...(prefixes ?? []), ...args]),
})
