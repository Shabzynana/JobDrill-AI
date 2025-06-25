import { ApiHideProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

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
    @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((v: string) => v.trim())
      : value
    )
    @IsArray()
    @IsString({ each: true })
    jobSkills?: string[];

    @IsOptional()
    @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((v: string) => v.trim())
      : value
    )
    @IsArray()
    @IsString({ each: true })
    jobResponsibilities?: string[];
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    answer?: string;
}

export class startInterviewDto {
    @ApiHideProperty()
    @IsOptional()
    @IsString()
    sessionId?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    role?: string;

    @IsOptional()
    @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((v: string) => v.trim())
      : value
    )
    @IsArray()
    @IsString({ each: true })
    jobSkills?: string[];

    @IsOptional()
    @Transform(({ value }) =>
    typeof value === 'string'
      ? value
        .split('.')
        .map((v: string) => v.trim())
        .filter((v: string) => v.length > 0)
        .map((v: string) => (v.endsWith('.') ? v : v + '.'))
      : value
    )
    @IsArray()
    @IsString({ each: true })
    jobResponsibilities?: string[];
}

export class SubmitAnswerDto {
    @ApiHideProperty()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    sessionId: string;
    
    @ApiHideProperty()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    questionId: string;

    @IsString()
    @IsNotEmpty()
    answer: string;
}

export class nextQuestionDto {
    @ApiHideProperty()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    sessionId: string;
}



