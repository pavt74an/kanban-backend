import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

export const GetUser = createParamDecorator(
  async (data: { userRepository: Repository<User> }, ctx: ExecutionContext): Promise<User> => {
    const request = ctx.switchToHttp().getRequest();
    const userRepository = data.userRepository;

    const payload = request.user; 
    const user = await userRepository.findOne({ where: { id: payload.sub } });

    if (!user) {
      throw new Error('User not found');
    }

    return user; 
  },
);
