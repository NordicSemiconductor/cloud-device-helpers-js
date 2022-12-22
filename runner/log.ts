const notEmpty = (s?: any) => s !== undefined

const stringify = (a: any) =>
	typeof a === 'object' ? JSON.stringify(a) : `${a}`.trim()

export type LogFN = (...text: unknown[]) => void

const logWriter =
	(logFN: LogFN, withTimestamp = false) =>
	(...args: unknown[]): void => {
		logFN(
			...[
				withTimestamp ? `[${new Date().toISOString()}]` : undefined,
				...args.map((arg) => stringify(arg)),
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
		logWriter(console.warn, withTimestamp)(...[...(prefixes ?? []), ...args]),
	progress: (...args: any[]) =>
		logWriter(console.info, withTimestamp)(...[...(prefixes ?? []), ...args]),
	success: (...args: any[]) =>
		logWriter(console.info, withTimestamp)(...[...(prefixes ?? []), ...args]),
	debug: (...args: any[]) =>
		logWriter(console.debug, withTimestamp)(...[...(prefixes ?? []), ...args]),
	error: (...args: any[]) =>
		logWriter(console.error, withTimestamp)(...[...(prefixes ?? []), ...args]),
})
