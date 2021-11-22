import { verifyKeygenResult } from './verifyKeygenResult'

describe('verifyKeygenResult', () => {
	it('should verify a known good CSR', () =>
		expect(
			verifyKeygenResult(
				'MIH2MIGaAgEAMBoxGDAWBgNVBAMMDzM1MjY1NjEwNjEwNzEwODBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABPE7iiMbvrxVJOHLv1HdM7seUM0nIjoyLomVCu8ZqGunyjlQkQtliYvNhmXUh26ISs3qWNYb7AvIa10oPutx3HagHjAcBgkqhkiG9w0BCQ4xDzANMAsGA1UdDwQEAwIDqDAMBggqhkjOPQQDAgUAA0kAMEYCIQCIps6dFe6GGW6s9LcLopCNVcFCrp4Ii4M9T8ZTAHZejgIhAOUQltwMYMfEpGn-lLFOIx1RhSC7xN7B21CdcoS1bI6H.0oRDoQEmoQRBIVhM2dn3hQlQUE5TUzgxTMSALhghsJ3xFkIYKlggcDVz8YvXJahgHWA42gsBu3GuBASHf7zrW_8n_AgoOelQ1fro7kUuK9J7-ux-2VoE7lhAXtINnQ1bjBZCnsLBsQTDAa15p_9_IlkXuVNrhbBVc3RgDtIwNyAyPAtSnPaiflV9g1qlF_dHGDhv4C0CVLrvkg',
			),
		).toEqual({
			verified: true,
			checksum:
				'703573f18bd725a8601d6038da0b01bb71ae0404877fbceb5bff27fc082839e9',
			signedChecksum:
				'703573f18bd725a8601d6038da0b01bb71ae0404877fbceb5bff27fc082839e9',
		}))
	it('should not verify a know bad CSR', () =>
		expect(
			verifyKeygenResult(
				'MIH1MIGaAgEAMBoxGDAWBgNVBAMMDzM1MjY1NjEwNjEwNzEwODBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABB1IVjwg8Pok0OY6_XX0o2N70zwItzRk_9hTwdYXcNjANP8bVF_b_zlKMpRZrBOmRR__45vLthvnWm5ttthKGvhNqAiEAkVNE9RykVdKRoWbJLHslKV7kLibnCnd7HzokhMaD_rc.0oRDoQEmoQRBIVhM2dn3hQlQUE5TUzgxTMSALhghsJ3xFkIYKlggl3oU8yQ1D58enl7w',
			),
		).toEqual({
			verified: false,
			error: 'CBOR: Insufficient data',
		}))
})
