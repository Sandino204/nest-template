import { TransactionService } from './transaction.service';
import { TRANSACTION_TYPE } from './entities/transaction.entity';
import { ConflictException } from '@nestjs/common';
import { Between, Like } from 'typeorm';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: any = jest.fn();
  let accountService: any = jest.fn();
  let createDataSource: any = {
    createQueryRunner: jest.fn,
  };

  beforeEach(async () => {
    createDataSource = {
      createQueryRunner: (): any => ({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        manager: {
          save: jest.fn().mockResolvedValue(undefined),
        },
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
      }),
    };

    service = new TransactionService(
      transactionRepository,
      accountService,
      createDataSource,
    );
  });

  describe('createTransaction', () => {
    it('should return success', async () => {
      accountService.updateBalance = jest.fn().mockResolvedValue(undefined);

      accountService.getMyAccount = jest.fn().mockResolvedValue({
        id: '123',
      });

      expect(
        await service.createTransaction('test', '123', {
          amount: 100,
          type: TRANSACTION_TYPE.DEPOSIT,
          description: 'test',
        }),
      ).toEqual({
        success: true,
      });
    });

    it('should return error', async () => {
      const error = new ConflictException('insufficient money on account');

      accountService.updateBalance = jest.fn().mockRejectedValue(error);

      accountService.getMyAccount = jest.fn().mockResolvedValue({
        id: '123',
      });

      await expect(
        async () =>
          await service.createTransaction('test', '123', {
            amount: 100,
            type: TRANSACTION_TYPE.DEPOSIT,
            description: 'test',
          }),
      ).rejects.toThrow(error);
    });
  });

  describe('getTransactions', () => {
    it('should return the transactions', async () => {
      transactionRepository.find = jest.fn().mockResolvedValue([
        {
          id: 1,
          amount: 100,
          type: TRANSACTION_TYPE.DEPOSIT,
          description: 'test',
          account: {
            id: 123,
          },
        },
      ]);

      accountService.getMyAccount = jest.fn().mockResolvedValue({
        id: '123',
      });

      const mockDate = new Date();

      expect(
        await service.getTransactions('test', '123', {
          type: TRANSACTION_TYPE.DEPOSIT,
          description: 'tes',
          maxValue: 100,
          minValue: 10,
          endDate: mockDate,
          startDate: mockDate,
        }),
      ).toEqual([
        {
          id: 1,
          amount: 100,
          type: TRANSACTION_TYPE.DEPOSIT,
          description: 'test',
          account: {
            id: 123,
          },
        },
      ]);

      expect(transactionRepository.find).toBeCalledWith({
        where: {
          account: {
            id: '123',
          },
          type: TRANSACTION_TYPE.DEPOSIT,
          description: Like(`%${'tes'}%`),
          createdAt: Between(mockDate, mockDate),
          amount: Between(10, 100),
        },
      });
    });
  });
});
