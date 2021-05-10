export const allSeen = (matches: string[]): ((s: string) => boolean) => {
	let n = 0
	const seen = matches.reduce(
		(seen, s) => ({
			...seen,
			[s]: {
				line: -Number.MAX_SAFE_INTEGER,
				pos: -1,
			},
		}),
		{} as Record<string, { line: number; pos: number }>,
	)
	return (line: string) => {
		n++
		matches.forEach((match) => {
			const pos = line.indexOf(match)
			if (pos >= 0)
				seen[match] = {
					line: n,
					pos,
				}
		})
		return (
			matches
				.map(
					(match, k) =>
						seen[match].line >= (seen[matches[k - 1]]?.line ?? 0) &&
						(seen[match].line !== (seen[matches[k - 1]]?.line ?? 0) || // if they matche the same line
							seen[match].pos >= (seen[matches[k - 1]]?.pos ?? 0)), // honor their order
				)
				.find((m) => m === false) === undefined
		)
	}
}
