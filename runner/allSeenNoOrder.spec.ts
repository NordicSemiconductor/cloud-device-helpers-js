import { readFileSync } from 'fs'
import * as os from 'os'
import * as path from 'path'

const tokens = [
	'CLOUD_WRAP_EVT_PGPS_DATA_RECEIVED',
	'aws_iot_integration: cloud_wrap_init:  Version:     572316ca6df7e76c1cd580380773fcab758a238e-nrf9160dk_nrf9160_ns-992cd03a-fd3b-43b1-980e-52707e27cc33-upgraded',
	'"appV"',
	'"572316ca6df7e76c1cd580380773fcab758a238e-nrf9160dk_nrf9160_ns-992cd03a-fd3b-43b1-980e-52707e27cc33-upgraded"',
	'cloud_module: cloud_wrap_event_handler: CLOUD_WRAP_EVT_DATA_ACK',
	'CLOUD_WRAP_EVT_AGPS_DATA_RECEIVED',
]

const logs = readFileSync(
	path.join(process.cwd(), 'test-data', 'devicelog.txt'),
	'utf-8',
).split(os.EOL)

describe('allSeenNoOrder()', () => {
	it('should find the tokens in the example', () => {
		const abortOn = allSeenNoOrder(tokens)

		const found = logs.find(abortOn)

		expect(found).not.toBeUndefined()
	})

	it('should not succeed if a token is missing', () => {
		const [token1, token2, ...rest] = tokens
		const abortOn = allSeenNoOrder([
			token1,
			token2,
			'SOME TOKEN THAT DOES NOT EXIST',
			...rest,
		])

		const found = logs.find(abortOn)

		expect(found).toBeUndefined()
	})
})

/**
 * Find the tokens, ignoring the order
 */
const allSeenNoOrder = (
	matches: string[],
	debug?: (...args: string[]) => void,
) => {
	const matchesFound: Record<string, boolean> = matches.reduce(
		(map, line) => ({ ...map, [line]: false }),
		{},
	)
	const allMatched = (): boolean =>
		Object.values(matchesFound).reduce(
			(allFound, found) => (found === true ? allFound : false),
			true,
		)
	return (line: string): boolean => {
		for (const needsMatch of matches) {
			if (line.includes(needsMatch)) {
				matchesFound[needsMatch] = true
				debug?.(`Matched`, needsMatch, `in line`, line)
			}
			if (allMatched()) {
				return true
			}
		}
		return false
	}
}
