import type { TensorResult } from '../types';

export const getTrainingChatMessage = ({ isSpam, spamRate }: TensorResult) =>
  `
${isSpam ? '✅ Я вважаю це' : '⛔️ Я вважаю це не'} спам з шансом ${(spamRate * 100).toFixed(2)}%
`.trim();
