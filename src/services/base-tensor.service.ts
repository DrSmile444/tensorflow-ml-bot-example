import * as fs from 'node:fs';
import * as path from 'node:path';
import type { ModelArtifacts } from '@tensorflow/tfjs-core/dist/io/types';
import type { LayersModel } from '@tensorflow/tfjs-node';
import * as tf from '@tensorflow/tfjs-node';
import { optimizeText } from 'ukrainian-ml-optimizer';

import type { TensorResult } from '../types';

export class BaseTensorService {
  private VOCAB: string[] = [];

  private MODEL: ModelArtifacts | null = null;

  private model!: LayersModel;

  DICTIONARY_EXTRAS = {
    PAD: 0,
    START: 1,
    UNKNOWN: 2,
  };

  modelLength = 0;

  constructor(public baseUrl: string, public vocabUrl: string, public threshold: number) {}

  loadMetadata() {
    this.VOCAB = JSON.parse(fs.readFileSync(path.join(__dirname, this.vocabUrl)).toString()) as string[];
    this.MODEL = JSON.parse(fs.readFileSync(path.join(__dirname, this.baseUrl)).toString()) as ModelArtifacts;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.modelLength = this.MODEL?.modelTopology?.model_config?.config.layers[1].config.input_length as number;
  }

  async loadModel() {
    const modelPath = path.join(__dirname, this.baseUrl);
    this.model = await tf.loadLayersModel(`file://${modelPath}`);
  }

  predict(message: string) {
    const tensor = this.tokenize(message);
    const predict = this.model?.predict(tensor);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    return predict?.data().then(
      (data: [number, number]) =>
        ({
          spamRate: data[1],
          isSpam: data[1] > this.threshold,
        } as TensorResult),
    ) as Promise<TensorResult>;
  }

  tokenize(message: string) {
    // Always start with the START token.
    const returnArray = [this.DICTIONARY_EXTRAS.START];

    const wordArray = optimizeText(message)
      .split(' ')
      .slice(0, this.modelLength - 1);

    let index = 0;

    // Loop through the words in the sentence you want to encode.
    // If word is found in dictionary, add that number else
    // you add the UNKNOWN token.
    wordArray.forEach((word) => {
      const encoding = this.VOCAB.indexOf(word);
      returnArray.push(encoding === -1 ? this.DICTIONARY_EXTRAS.UNKNOWN : encoding);
      index += 1;
    });

    // Finally if the number of words was < the minimum encoding length
    // minus 1 (due to the start token), fill the rest with PAD tokens.
    while (index < this.modelLength - 1) {
      returnArray.push(this.DICTIONARY_EXTRAS.PAD);
      index += 1;
    }

    // Convert to a TensorFlow Tensor and return that.
    return tf.tensor([returnArray]);
  }
}
