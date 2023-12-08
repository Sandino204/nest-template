import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {SignUpDto} from "./dto/sign-up.dto";
import * as bcrypt from 'bcrypt';
import {LoginDto} from "./dto/login.dto";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async signUp(payload: SignUpDto) {
        const hash = await bcrypt.hash(payload.password, 10);

        const existsUser = await this.userRepository.findOne({
            where: {
                username: payload.username
            }
        })

        if (existsUser) {
            return new ConflictException('Username Already exists')
        }

        return this.userRepository.save({
            ...payload,
            password: hash,
        })
    }

    async login(payload: LoginDto) {
        console.log(payload)
        const existsUsername = await this.userRepository.findOne({
            where: {
                username: payload.username,
            }
        })

        console.log(existsUsername)

        if(!existsUsername) {
            throw new NotFoundException('User Not Found')
        }

        const isMatch = await bcrypt.compare(payload.password, existsUsername.password)

        if(isMatch) {
            return {
                access_token: await this.jwtService.signAsync({
                    userId: existsUsername.id
                }),
            }
        }

        throw new NotFoundException('User Not Found')
    }

}
