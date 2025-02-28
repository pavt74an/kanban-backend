import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { Public } from 'src/config/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    console.log('AuthController initialized'); // Add this to see if it's being hit
  }
  
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(registerDto);
      return { message: 'User registered successfully', user };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const { accessToken } = await this.authService.login(loginDto);
      return { message: 'Login successful', accessToken };
    } catch (error) {
      return { message: error.message };
    }
  }
}
