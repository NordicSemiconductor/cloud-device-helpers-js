export const anySeen = (matches: string[]): ((s: string) => boolean) => {
	let matchSeen = false
	return (line: string) => {
		if (matchSeen) return true
		const lineMatched = matches.reduce((seen, match) => {
			if (seen) return true
			return line.includes(match)
		}, false as boolean)
		if (lineMatched) {
			matchSeen = true
			return true
		}
		return false
	}
}
