import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}


  async register(regisDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(regisDto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(regisDto.password, 10);

    const user = await this.userService.create({
      ...regisDto,
      password: hashedPassword, 
    });

    // Return user without password 
    const { password, ...result } = user;
    return result;  
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
