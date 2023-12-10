import { AccountService } from './account.service';
import { Account, ACCOUNT_TYPE } from './entities/account.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('AccountService', () => {
  let service: AccountService;
  let accountRepository: any = jest.fn();

  beforeEach(async () => {
    service = new AccountService(accountRepository);
  });

  describe('createAccount', () => {
    it('should create with value CONTA_CORRENTE', async () => {
      accountRepository.save = jest.fn().mockResolvedValue({
        type: ACCOUNT_TYPE.CONTA_CORRENTE,
        account_holder: {
          id: 'test',
        },
        account_number: 123,
        balance: 0,
      });

      service.createHashNumber = jest.fn().mockReturnValue('123');

      expect(
        await service.createAccount('test', {
          accountType: ACCOUNT_TYPE.CONTA_CORRENTE,
        }),
      ).toEqual({
        type: ACCOUNT_TYPE.CONTA_CORRENTE,
        account_holder: {
          id: 'test',
        },
        account_number: 123,
        balance: 0,
      });

      expect(accountRepository.save).toBeCalledWith({
        type: ACCOUNT_TYPE.CONTA_CORRENTE,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 0,
      });
    });

    it('should create with value POUPANCA', async () => {
      accountRepository.save = jest.fn().mockResolvedValue({
        type: ACCOUNT_TYPE.POUPANCA,
        account_holder: {
          id: 'test',
        },
        account_number: 123,
        balance: 0,
      });

      service.createHashNumber = jest.fn().mockReturnValue('123');

      expect(
        await service.createAccount('test', {
          accountType: ACCOUNT_TYPE.POUPANCA,
        }),
      ).toEqual({
        type: ACCOUNT_TYPE.POUPANCA,
        account_holder: {
          id: 'test',
        },
        account_number: 123,
        balance: 0,
      });

      expect(accountRepository.save).toBeCalledWith({
        type: ACCOUNT_TYPE.POUPANCA,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 0,
      });
    });
  });

  describe('getMyAccounts', () => {
    it('should get my accounts', async () => {
      accountRepository.find = jest.fn().mockResolvedValue([
        {
          type: ACCOUNT_TYPE.CONTA_CORRENTE,
          account_holder: {
            id: 'test',
          },
          account_number: '123',
          balance: 0,
        },
      ]);

      expect(await service.getMyAccounts('test')).toEqual([
        {
          type: ACCOUNT_TYPE.CONTA_CORRENTE,
          account_holder: {
            id: 'test',
          },
          account_number: '123',
          balance: 0,
        },
      ]);

      expect(accountRepository.find).toBeCalledWith({
        where: {
          account_holder: {
            id: 'test',
          },
          deletedAt: null,
        },
      });
    });
  });

  describe('getMyAccount', () => {
    it('should get my account', async () => {
      accountRepository.findOne = jest.fn().mockResolvedValue({
        type: ACCOUNT_TYPE.CONTA_CORRENTE,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 0,
      });

      expect(await service.getMyAccount('test', '123')).toEqual({
        type: ACCOUNT_TYPE.CONTA_CORRENTE,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 0,
      });

      expect(accountRepository.findOne).toBeCalledWith({
        where: {
          account_holder: {
            id: 'test',
          },
          account_number: '123',
          deletedAt: null,
        },
      });
    });

    it('should get error', async () => {
      accountRepository.findOne = jest.fn().mockResolvedValue(null);

      const error = new NotFoundException('account not found');

      await expect(
        async () => await service.getMyAccount('test', '123'),
      ).rejects.toThrow(error);

      expect(accountRepository.findOne).toBeCalledWith({
        where: {
          account_holder: {
            id: 'test',
          },
          account_number: '123',
          deletedAt: null,
        },
      });
    });
  });

  describe('updateAccount', () => {
    it('should update', async () => {
      accountRepository.findOne = jest.fn().mockResolvedValue({
        type: ACCOUNT_TYPE.CONTA_CORRENTE,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 0,
      });

      accountRepository.save = jest.fn().mockResolvedValue({
        type: ACCOUNT_TYPE.POUPANCA,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 0,
      });

      expect(
        await service.updateAccount('test', '123', {
          accountType: ACCOUNT_TYPE.POUPANCA,
        }),
      ).toEqual({
        type: ACCOUNT_TYPE.POUPANCA,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 0,
      });

      expect(accountRepository.save).toBeCalledWith({
        type: ACCOUNT_TYPE.POUPANCA,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 0,
      });
    });

    it('should return error because account not found', async () => {
      accountRepository.findOne = jest.fn().mockResolvedValue(null);

      const error = new NotFoundException('account not found');

      accountRepository.save = jest.fn().mockResolvedValue({
        type: ACCOUNT_TYPE.POUPANCA,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 0,
      });

      await expect(
        async () =>
          await service.updateAccount('test', '123', {
            accountType: ACCOUNT_TYPE.POUPANCA,
          }),
      ).rejects.toThrow(error);

      expect(accountRepository.save).toBeCalledTimes(0);
    });
  });

  describe('updateBalance', () => {
    it('should update add to the balance', async () => {
      const queryRynner: any = jest.fn();

      queryRynner.manager = {
        findOne: jest.fn(),
        save: jest.fn(),
      };

      queryRynner.manager.findOne = jest.fn().mockResolvedValue({
        type: ACCOUNT_TYPE.POUPANCA,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 0,
      });

      queryRynner.manager.save = jest.fn().mockResolvedValue({
        type: ACCOUNT_TYPE.POUPANCA,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 100,
      });

      expect(await service.updateBalance(queryRynner, 'test', 100)).toEqual(
        undefined,
      );

      expect(queryRynner.manager.save).toBeCalledWith(Account, {
        type: ACCOUNT_TYPE.POUPANCA,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 100,
      });
    });

    it('should update subtract to the balance', async () => {
      const queryRynner: any = jest.fn();

      queryRynner.manager = {
        findOne: jest.fn(),
        save: jest.fn(),
      };

      queryRynner.manager.findOne = jest.fn().mockResolvedValue({
        type: ACCOUNT_TYPE.POUPANCA,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 100,
      });

      queryRynner.manager.save = jest.fn().mockResolvedValue({
        type: ACCOUNT_TYPE.POUPANCA,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 0,
      });

      expect(await service.updateBalance(queryRynner, 'test', -100)).toEqual(
        undefined,
      );

      expect(queryRynner.manager.save).toBeCalledWith(Account, {
        type: ACCOUNT_TYPE.POUPANCA,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 0,
      });
    });

    it('should not update because value below 0', async () => {
      const queryRynner: any = jest.fn();

      queryRynner.manager = {
        findOne: jest.fn(),
        save: jest.fn(),
      };

      queryRynner.manager.findOne = jest.fn().mockResolvedValue({
        type: ACCOUNT_TYPE.POUPANCA,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 90,
      });

      const error = new ConflictException('insufficient money on account');

      await expect(
        async () => await service.updateBalance(queryRynner, 'test', -100),
      ).rejects.toThrow(error);

      expect(queryRynner.manager.save).toBeCalledTimes(0);
    });
  });

  describe('deleteAccount', () => {
    it('should delete', async () => {
      accountRepository.findOne = jest.fn().mockResolvedValue({
        type: ACCOUNT_TYPE.CONTA_CORRENTE,
        account_holder: {
          id: 'test',
        },
        account_number: '123',
        balance: 0,
        id: '123',
      });

      accountRepository.softDelete = jest.fn().mockResolvedValue(undefined);

      expect(await service.deleteMyAccount('test', '123')).toEqual({
        success: true,
      });

      expect(accountRepository.softDelete).toBeCalledWith('123');
    });

    it('should return error because account not found', async () => {
      accountRepository.findOne = jest.fn().mockResolvedValue(null);

      const error = new NotFoundException('account not found');

      accountRepository.softDelete = jest.fn().mockResolvedValue(undefined);

      await expect(
        async () => await service.deleteMyAccount('test', '123'),
      ).rejects.toThrow(error);

      expect(accountRepository.softDelete).toBeCalledTimes(0);
    });
  });
});
