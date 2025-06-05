import { ApiHideProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class InterviewDto {
    
    @ApiHideProperty()
    @IsOptional()
    @IsString()
    sessionId?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    role?: string;
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    answer?: string;
}
