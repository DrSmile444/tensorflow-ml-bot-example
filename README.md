# Tensorflow Machine Learning Telegram Bot Example

## Description

This repo contains an example of using tensorflow model
together with Telegram Bots to analyze messages from users.

## Requirements

You need to have [node.js 16+](https://nodejs.org/en/) installed.<br>
[Here is the instruction how to install it.](https://www.pluralsight.com/guides/getting-started-with-nodejs)

Here is the way you can check your node version by using any shell:
```shell
> node -v                    
v16.13.0
```

## Install

1. Clone the repository:
```shell
git clone git@github.com:DrSmile444/tensorflow-ml-bot-example.git
```

2. Install `node_modules` modules:
```shell
npm install
```

3. [Get bot token from bot father.](https://sendpulse.com/knowledge-base/chatbot/telegram/create-telegram-chatbot)
4. Create a copy of `.env.example` and name it `.env`.
5. Insert bot token into `BOT_TOKEN` in `.env`.

## Run the bot

To run the bot, you need to execute the following command:
```shell
npm start
```

## Branches

This project contains several branches with different stages of the bot:

1. [main](https://github.com/DrSmile444/tensorflow-ml-bot-example/tree/main) - basic bot setup without tensorflow logic
1. [feature/tensorflow](https://github.com/DrSmile444/tensorflow-ml-bot-example/tree/feature/tensorflow) - complete bot setup with tensorflow
