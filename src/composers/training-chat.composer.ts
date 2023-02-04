import { Composer } from 'grammy';

import { TRAINING_CHAT_ID } from '../const';
import { getTrainingChatMessage } from '../messages';
import type { SwindlersTensorService } from '../services';

export const initTrainingChatComposer = (swindlersTensorService: SwindlersTensorService) => {
  const trainingChatComposer = new Composer();

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
    });
  });

  return { trainingChatComposer };
};
