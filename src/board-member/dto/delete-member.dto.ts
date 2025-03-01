import { IsUUID } from 'class-validator';

export class DeleteMemberDto {
    @IsUUID()
    board_id: string;

    @IsUUID()
    user_id: string;
}

