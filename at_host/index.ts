import * as path from 'path'
import { realpathSync } from 'fs'

export const atHostHexfile = {
	thingy91: path.join(
		path.dirname(realpathSync(__filename)),
		'..',
		'..',
		'at_host',
		'thingy91_at_host_increased_buf.hex',
	),
	'9160dk': path.join(
		path.dirname(realpathSync(__filename)),
		'..',
		'..',
		'at_host',
		'91dk_at_host_increased_buf.hex',
	),
} as const
