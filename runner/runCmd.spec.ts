import { runCmd } from './runCmd'

describe('runCmd', () => {
	it('should run a command', async () => {
		expect(await runCmd({ cmd: 'echo "Hello World"' })).toEqual('Hello World')
	})
	it('should handle errors', async () =>
		expect(runCmd({ cmd: 'ls /foo/bar' })).rejects.toThrow(
			/No such file or directory/
		))
	it('should time out', async () =>
		expect(runCmd({ cmd: 'sleep 10', timeoutInSeconds: 1 })).rejects.toThrow(
			"Timeout while running command 'sleep 10'.",
		))
})
