import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { GoogleAuthService } from './goggle-auth.service';


@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [],
    providers: [GoogleAuthService, UserService],
    exports: [GoogleAuthService],
})
export class GoogleAuthModule {}