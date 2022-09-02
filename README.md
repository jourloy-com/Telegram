<h1 align="center">
    Telegram
</h1>

<p align="center">
<a href="" target="_blank"><img src="https://img.shields.io/github/v/tag/jourloy/telegram-microservice?color=red&label=version&style=flat-square" alt="Version" /></a>
</p>

## Description

A microservice for my own backend for work with telegram

## Installation

```bash
$ yarn install
```

## ENV

Before running the app you should create `.env` file. Look into `.env.template` for help

## Running the app

### Docker
```bash
$ docker-compose up -d
```

### NPM / Yarn
```bash
# Development
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

### PM2

```bash
# Build
$ yarn build

# Production mode
$ pm2 start dist/main.js

# Watch mode
$ pm2 start dist/main.js --watch
```

## Test

![](https://img.shields.io/badge/-Not%20ready%20yet-red?style=flat-square)

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```