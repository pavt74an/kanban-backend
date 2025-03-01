import { IsUUID } from 'class-validator';

export class CreateBoardMemberDto {
    @IsUUID()
    board_id: string;

    @IsUUID()
    user_id: string;
}
