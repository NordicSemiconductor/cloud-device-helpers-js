# Firmware CI runner device helpers

[![GitHub Actions](https://github.com/NordicSemiconductor/cloud-firmware-ci-device-helpers-js/workflows/Test%20and%20Release/badge.svg)](https://github.com/NordicSemiconductor/cloud-firmware-ci-device-helpers-js/actions)
[![Known Vulnerabilities](https://snyk.io/test/github/NordicSemiconductor/cloud-firmware-ci-device-helpers-js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/NordicSemiconductor/cloud-firmware-ci-device-helpers-js?targetFile=package.json)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://gh.mergify.io/badges/NordicSemiconductor/cloud-firmware-ci-device-helpers-js)](https://mergify.io)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

Contains helper functions for interacting with the nRF9160 used during
end-to-end tests:

[`connect`](./device/connect.ts) opens a serial connection to a device and
flashes the AT client, so cloud credentials can be provisioned using  
[`flashCredentials`](./device/flashCredentials.ts).

This is used by the
[AWS](https://github.com/NordicSemiconductor/cloud-aws-firmware-ci-runner-js)
and
[Azure](https://github.com/NordicSemiconductor/cloud-azure-firmware-ci-runner-js)
Firmware CI runners.

> :information_source:
> [Read the complete Asset Tracker Cloud Example documentation](https://nordicsemiconductor.github.io/asset-tracker-cloud-docs/).
