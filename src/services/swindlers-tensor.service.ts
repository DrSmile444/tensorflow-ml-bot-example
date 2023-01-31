import { BaseTensorService } from './base-tensor.service';

export class SwindlersTensorService extends BaseTensorService {
  constructor() {
    super('./temp/model.json', './temp/vocab.json', 0.8);
    this.loadMetadata();
  }
}

export const initSwindlersTensorService = async () => {
  const swindlersTensorService = new SwindlersTensorService();
  await swindlersTensorService.loadModel();

  return { swindlersTensorService };
};
