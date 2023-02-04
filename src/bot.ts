import * as process from 'node:process';
import dotenv from 'dotenv';
import { Bot } from 'grammy';
import type { UserFromGetMe } from 'grammy/out/types';

import { initTrainingChatComposer } from './composers';
import { initSwindlersTensorService } from './services';

dotenv.config();

// async iife
(async () => {
  const { swindlersTensorService } = await initSwindlersTensorService();
  const { trainingChatComposer } = initTrainingChatComposer(swindlersTensorService);

  // Create an instance of the `Bot` class and pass your authentication token to it.
  const bot = new Bot(process.env.BOT_TOKEN!); // <-- put your authentication token between the ""

  bot.use((context, next) => {
    console.info(context.update);
    return next();
  });

  // You can now register listeners on your bot object `bot`.
  // grammY will call the listeners when users send messages to your bot.

  // Handle the /start command.
  bot.command('start', (context) => context.reply('Welcome! Up and running.'));

  bot.use(trainingChatComposer);

  // Handle other messages.
  bot.on('message', async (context) => {
    const predictResult = await swindlersTensorService.predict(context.msg.text || '');

    if (predictResult.isSpam) {
      await context.deleteMessage();
      await context.reply('Ваше повідомлення видалено по причині спам');
    }
  });

  bot.catch((error) => {
    console.error(error);
  });

  // Now that you specified how to handle messages, you can start your bot.
  // This will connect to the Telegram servers and wait for messages.

  // Start the bot.
  await bot.start({
    onStart: () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const botInfo = bot.me as UserFromGetMe;
      console.info(`Bot @${botInfo.username} started!`, new Date().toString());
    },
  });
})().catch(() => {
  console.error('Bot has been stopped!');
});
