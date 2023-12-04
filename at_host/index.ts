import { realpathSync } from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
const self = fileURLToPath(import.meta.url)

export const atHostHexfile = {
	thingy91: path.join(
		path.dirname(realpathSync(self)),
		'..',
		'..',
		'at_host',
		'thingy91_at_host_increased_buf.hex',
	),
	'9160dk': path.join(
		path.dirname(realpathSync(self)),
		'..',
		'..',
		'at_host',
		'91dk_at_host_increased_buf.hex',
	),
} as const
