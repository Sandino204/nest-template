import { AccountService } from '../account/account.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: any = jest.fn();
  let jwtService: any = jest.fn();

  beforeEach(async () => {
    service = new AuthService(userRepository, jwtService);
  });

  describe('signUp', () => {
    it('should create the user', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);

      userRepository.save = jest.fn().mockResolvedValue({
        id: '12345678912',
        document: 'test',
        password: 'test',
      });

      expect(
        await service.signUp({
          document: '12345678912',
          password: 'test',
          address: 'test',
          phone: 'test',
        }),
      ).toEqual({
        id: '12345678912',
        document: 'test',
        password: 'test',
      });
    });

    it('should return error because username already exists', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue({
        id: '123',
        document: '12345678912',
        password: 'test',
      });

      const error = new ConflictException('Username Already exists');

      userRepository.save = jest.fn().mockResolvedValue({
        id: '123',
        document: '12345678912',
        password: 'test',
      });

      await expect(
        async () =>
          await service.signUp({
            document: '12345678912',
            password: 'test',
            address: 'test',
            phone: 'test',
          }),
      ).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    it('should succeed', async () => {
      const hash = await bcrypt.hash('123', 10);

      userRepository.findOne = jest.fn().mockResolvedValue({
        id: '123',
        document: '12345678912',
        password: hash,
      });

      jwtService.signAsync = jest.fn().mockResolvedValue('token');

      expect(
        await service.login({
          document: '123',
          password: '123',
        }),
      ).toEqual({
        access_token: 'token',
      });
    });

    it('should fail because user not found', async () => {
      const error = new NotFoundException('User Not Found');

      userRepository.findOne = jest.fn().mockResolvedValue(null);

      jwtService.signAsync = jest.fn().mockResolvedValue('token');

      await expect(
        async () =>
          await service.login({
            document: '123',
            password: '123',
          }),
      ).rejects.toThrow(error);
    });

    it('should fail because user not match pasword', async () => {
      const error = new NotFoundException('User Not Found');

      const hash = await bcrypt.hash('123', 10);

      userRepository.findOne = jest.fn().mockResolvedValue({
        id: '123',
        document: '12345678912',
        password: hash,
      });

      jwtService.signAsync = jest.fn().mockResolvedValue('token');

      await expect(
        async () =>
          await service.login({
            document: '123',
            password: '1234',
          }),
      ).rejects.toThrow(error);
    });
  });
});
