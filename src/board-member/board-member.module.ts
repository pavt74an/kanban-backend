import { Module } from '@nestjs/common';
import { BoardMemberService } from './board-member.service';
import { BoardMemberController } from './board-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardMember } from './entities/board-member.entity';
import { User } from 'src/user/entities/user.entity';
import { Board } from 'src/boards/entities/board.entity';
import { BoardsModule } from 'src/boards/boards.module';

@Module({
  imports: [TypeOrmModule.forFeature([BoardMember, User, Board]), BoardsModule],
  controllers: [BoardMemberController],
  providers: [BoardMemberService],
})
export class BoardMemberModule {}
