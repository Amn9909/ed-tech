import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<any> {
    const existing = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { mobileNumber: createUserDto.mobileNumber }],
    });
    if (existing) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({ ...createUserDto, password: hashedPassword });
    const savedUser = await this.userRepository.save(user);

    return { message: 'User created successfully', userId: savedUser.id };
  }

  async login(loginDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ ...user });

    return { accessToken: token };
  }

  async verifyUser(id: number): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new BadRequestException('User not found');

    user.isVerified = true;
    await this.userRepository.save(user);

    return { message: 'User verified successfully' };
  }
}
