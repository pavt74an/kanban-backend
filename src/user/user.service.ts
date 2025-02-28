import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ค้นหาผู้ใช้จากอีเมล
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  // สร้างผู้ใช้ใหม่
  async create(registerDto: RegisterDto): Promise<User> {
    const newUser = this.userRepository.create({
      email: registerDto.email,
      fname: registerDto.fname,
      lname: registerDto.lname,
      password: registerDto.password, 
    });

    return this.userRepository.save(newUser);
  }
}
