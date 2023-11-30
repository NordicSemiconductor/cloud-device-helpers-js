# Device helpers [![npm version](https://img.shields.io/npm/v/@nordicsemiconductor/device-helpers.svg)](https://www.npmjs.com/package/@nordicsemiconductor/device-helpers)

[![GitHub Actions](https://github.com/NordicSemiconductor/cloud-device-helpers-js/workflows/Test%20and%20Release/badge.svg)](https://github.com/NordicSemiconductor/cloud-device-helpers-js/actions)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://api.mergify.com/v1/badges/NordicSemiconductor/cloud-device-helpers-js)](https://mergify.io)
[![@commitlint/config-conventional](https://img.shields.io/badge/%40commitlint-config--conventional-brightgreen)](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

Contains helper functions for interacting with the nRF9160:

[`connect`](./device/connect.ts) opens a serial connection to a device and
flashes the AT host, so cloud credentials can be provisioned using  
[`flashCredentials`](./device/flashCredentials.ts).

This is used by the nRF Asset Tracker
[AWS](https://github.com/NordicSemiconductor/asset-tracker-cloud-aws-js) and
[Azure](https://github.com/NordicSemiconductor/asset-tracker-cloud-azure-js) CLI
for flashing credentials to connected devices.

> :information_source:
> [Read the complete nRF Asset Tracker documentation](https://nordicsemiconductor.github.io/asset-tracker-cloud-docs/).

## Installation

    npm i --save --save-exact @nordicsemiconductor/device-helpers
