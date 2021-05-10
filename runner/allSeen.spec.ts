import { allSeen } from './allSeen'

describe('allSeen', () => {
	describe('should handle singular abort criterion', () => {
		const abortOn = allSeen([
			`aws_fota: Error (-7) when trying to start firmware download`,
		])
		it('should not abort on an unmatched line', () =>
			expect(
				abortOn(
					'<dbg> aws_fota.job_update_accepted: Start downloading firmware from firmware-ci-runner-firmw-firmwarecibucket2502fbd5-1jcr3doqtwx59.s3.amazonaws.com/8ec4108e-d8ad-4436-964d-0327f4c12d5f.bin',
				),
			).toEqual(false))

		it('should abort on a matched line', () =>
			expect(
				abortOn(
					'<err> aws_fota: Error (-7) when trying to start firmware download',
				),
			).toEqual(true))

		it('should abort on subsequent lines', () =>
			expect(
				abortOn(
					'<dbg> aws_fota.update_job_execution: update_job_execution, state: 3, version_number: 2',
				),
			).toEqual(true))
	})
	describe('should handle multiple abort criteria on order', () => {
		const abortOn = allSeen([
			`Version:     0.0.0-development-nrf9160dk_nrf9160ns-ltem-e36b3589-9b2b-4fb4-87b2-2aaf9d792d76-upgraded`,
			`"appV": "0.0.0-development-nrf9160dk_nrf9160ns-ltem-e36b3589-9b2b-4fb4-87b2-2aaf9d792d76-upgraded"`,
			'MQTT_EVT_SUBACK',
		])
		it('should not abort until the last criteria was seen', () => {
			expect(
				abortOn(
					`Version:     0.0.0-development-nrf9160dk_nrf9160ns-ltem-e36b3589-9b2b-4fb4-87b2-2aaf9d792d76-upgraded`,
				),
			).toEqual(false)
			expect(
				abortOn(
					`"appV": "0.0.0-development-nrf9160dk_nrf9160ns-ltem-e36b3589-9b2b-4fb4-87b2-2aaf9d792d76-upgraded"`,
				),
			).toEqual(false)
			expect(abortOn('MQTT_EVT_SUBACK')).toEqual(true)
		})
		it('should honor the required order', () => {
			expect(
				abortOn(
					`Version:     0.0.0-development-nrf9160dk_nrf9160ns-ltem-e36b3589-9b2b-4fb4-87b2-2aaf9d792d76-upgraded`,
				),
			).toEqual(false)
			expect(abortOn('MQTT_EVT_SUBACK')).toEqual(false)
			expect(
				abortOn(
					`"appV": "0.0.0-development-nrf9160dk_nrf9160ns-ltem-e36b3589-9b2b-4fb4-87b2-2aaf9d792d76-upgraded"`,
				),
			).toEqual(false)
			expect(abortOn('MQTT_EVT_SUBACK')).toEqual(true)
		})
	})
	describe('multiple matches per line', () => {
		const l = `"appV": "134387f674ba67e13c986f4f46c09f6f959d996e-nrf9160dk_nrf9160ns-ltem-4de5e5e5-403e-480b-b6dd-2320387b44f4-upgraded"`

		it('should support multiple matches per line', () => {
			const abortOn = allSeen([
				'appV',
				`134387f674ba67e13c986f4f46c09f6f959d996e-nrf9160dk_nrf9160ns-ltem-4de5e5e5-403e-480b-b6dd-2320387b44f4-upgraded`,
				`cloud_module.data_send: Data sent`,
			])
			expect(abortOn(l)).toEqual(false)
			expect(abortOn(l)).toEqual(false)
			expect(abortOn(`cloud_module.data_send: Data sent`)).toEqual(true)
		})
		it('should honor the order', () => {
			const abortOn = allSeen([
				`134387f674ba67e13c986f4f46c09f6f959d996e-nrf9160dk_nrf9160ns-ltem-4de5e5e5-403e-480b-b6dd-2320387b44f4-upgraded`,
				'appV',
				`cloud_module.data_send: Data sent`,
			])
			expect(abortOn(l)).toEqual(false)
			expect(abortOn(l)).toEqual(false)
			expect(abortOn(`cloud_module.data_send: Data sent`)).toEqual(false)
		})
	})
})
