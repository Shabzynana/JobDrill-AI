import { ApiHideProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class updateQuestionDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    content?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    feedback?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    score?: number;

}
