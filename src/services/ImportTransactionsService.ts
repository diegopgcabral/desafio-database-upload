import path from 'path';
import csv from 'csvtojson';

import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

import uploadConfig from '../config/upload';

interface Request {
  fileName: string;
}

interface TransactionTDO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class ImportTransactionsService {
  async execute({ fileName }: Request): Promise<Transaction[]> {
    const filePath = path.join(uploadConfig.directory, fileName);

    const transactions = await csv().fromFile(filePath);

    /* eslint-disable no-await-in-loop */
    /* eslint-disable no-restricted-syntax */
    async function processTransactionsArray(
      transactionsArray: TransactionTDO[],
    ): Promise<void> {
      for (const transaction of transactionsArray) {
        const createTransactionService = new CreateTransactionService();
        const { title, type, value, category } = transaction;

        await createTransactionService.execute({
          title,
          type,
          value,
          category,
        });
      }
    }

    await processTransactionsArray(transactions);

    return transactions;
  }
}

export default ImportTransactionsService;
