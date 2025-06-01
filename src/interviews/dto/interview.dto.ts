import { ApiHideProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class InterviewDto {

    @IsNotEmpty()
    @IsString()
    prompt: string;
    
    @ApiHideProperty()
    @IsOptional()
    @IsString()
    sessionId?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    role?: string;
}
