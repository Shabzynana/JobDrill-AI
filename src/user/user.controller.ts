import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpadateUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @ApiOperation({ summary: 'Get user profile' })
  @Get('profile')
  async getUserProfile(@Req() req) {
    const { sub } = req.user;
    return this.userService.getUserById(sub);
  }
  
  @ApiOperation({ summary: 'Update user profile' })
  @Patch('profile')
  async updateUserProfile(@Req() req, @Body() dto: UpadateUserDto) {
    const { sub } = req.user;
    return this.userService.updateProfile(sub, dto);
  }
  
  @ApiOperation({ summary: 'Get user by id' })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  
}
