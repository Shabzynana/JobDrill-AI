import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpadateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    
  ) {}

  async createUser(dto: CreateUserDto) {

    const user = await this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }

  async getAllUsers() {
    return await this.userRepository.find({
      select: {
        id: true,
        first_name: true, 
        last_name: true,
        email: true,
        is_verified: true
      }
    });
  }

  public async getUserById(id: string) {
    const user = await this.userRepository.findOne({ 
      where: { id : id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        is_verified: true
      } 
    });
    return user;
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email : email } });
    return user;
  }

  public async updateProfile(id: string, dto: UpadateUserDto) {
    
    const userExists = await this.getUserById(id);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }
    const user = Object.assign(userExists, dto);
    return await this.userRepository.save(user);
  }

  public async deleteUser(id: string) {

    const userExists = await this.getUserById(id);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }
    return await this.userRepository.remove(userExists);
    
  }
}
