import { Menu } from '@grammyjs/menu';
import type { Context, NextFunction } from 'grammy';
import { Composer } from 'grammy';

import { TRAINING_CHAT_ID } from '../const';
import { getTrainingChatMessage } from '../messages';
import type { SwindlersTensorService } from '../services';

export const initTrainingChatComposer = (swindlersTensorService: SwindlersTensorService) => {
  const trainingChatComposer = new Composer();

  const trainingChatButtonHandler = (isSpam: boolean) => async (context: Context, next: NextFunction) => {
    if (!context.msg?.reply_to_message || !context.chat) {
      return next();
    }

    const { text, message_id } = context.msg.reply_to_message;

    await context.api.deleteMessage(context.chat.id, message_id);
    await context.deleteMessage();

    await context.reply(`${text || ''}\nYou pressed ${isSpam.toString()}`);
  };

  /**
   * Training menu
   * */
  const trainingChatMenu = new Menu('my-menu-identifier')
    .text('✅ Спам', trainingChatButtonHandler(true))
    .text('⛔️ Не спам', trainingChatButtonHandler(false));

  /**
   * Main composer
   * */
  const composer = trainingChatComposer.filter((context) => context.chat?.id === TRAINING_CHAT_ID);

  composer.on('message', async (context, next) => {
    const { text, message_id } = context.msg;

    if (!text) {
      await context.deleteMessage();
      return next();
    }

    const predictResult = await swindlersTensorService.predict(text || '');

    await context.reply(getTrainingChatMessage(predictResult), {
      reply_to_message_id: message_id,
      reply_markup: trainingChatMenu,
    });
  });

  return { trainingChatComposer, trainingChatMenu };
};
