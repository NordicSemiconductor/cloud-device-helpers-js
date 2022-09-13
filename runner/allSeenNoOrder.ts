/**
 * Find the tokens, ignoring the order
 */
export const allSeenNoOrder = (
	matches: string[],
	debug?: (...args: string[]) => void,
): ((s: string) => boolean) => {
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
