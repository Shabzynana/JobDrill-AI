import {
    Injectable,
    ForbiddenException,
    UnauthorizedException,
    ConflictException,
    NotFoundException,
    NotAcceptableException,
    BadRequestException,
  } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppUtilities } from 'src/app.utilities';
import * as querystring from 'querystring';
import { googleAccessToken, googleProfile } from './interfaces/google.interface';
import { googleTokenAPI } from 'src/common/constants';
import axios from 'axios';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

const { GOOGLE_TOKEN_URL, GOOGLE_USER_INFO_URL } = googleTokenAPI;

@Injectable()
export class GoogleAuthService {
    private accessToken: string;
    private client_ID: string;
    private client_secret: string;
    private scope: string;
    private callback: string;
    private auth_url: string;
    private scope_userInfo: string;
    private api_key: string;
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    this.client_ID = this.configService.get<string>('google.id');
    this.client_secret = this.configService.get<string>('google.secret');
    this.scope = `${this.configService.get<string>('google.scope.manage')}`;
    this.callback = this.configService.get<string>('google.callback');
    this.auth_url = this.configService.get<string>('google.auth_url');
    this.api_key = this.configService.get<string>('google.api_key');
  }

  async login(): Promise<any> {

    console.log(this.scope, 'scope')
    const queryParams = querystring.stringify({
      client_id: this.client_ID,
      redirect_uri: this.callback,
      response_type: 'code',
      scope: this.scope,
      access_type: 'offline',
      state: AppUtilities.generateShortCode(),
      include_granted_scope: 'true',
      prompt: 'consent',
    });

    return { url: `${this.auth_url}?${queryParams}` };
  }

  async requestAccessToken(code: any): Promise<googleAccessToken> {
    try {
      const response = await axios.post(
        GOOGLE_TOKEN_URL,
        {
          code,
          redirect_uri: this.callback,
          client_id: this.client_ID,
          client_secret: this.client_secret,
          grant_type: 'authorization_code',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000,
        },
      );

      if (response) {
        const userData = response.data;
        return userData;
      }

      return null;
    } catch (err) {
      console.log(err.response.data, 'error');
      throw new BadRequestException('Failed to get access token');
    }
  }

  async refreshToken(refresh_token: string): Promise<googleAccessToken> {
    try {
      const response = await axios.post(
        GOOGLE_TOKEN_URL,
        {
          refresh_token,
          client_id: this.client_ID,
          client_secret: this.client_secret,
          grant_type: 'refresh_token',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000,
        },
      );

      if (response) {
        const userData = response.data;
        return userData;
      }

      return null;
    } catch (err) {
      console.log(err.response.data, 'error');
      throw new BadRequestException('Failed to get access token');
    }
  }

  async getUserInfo(token: string): Promise<any> {
    try {
      const response = await axios.get(
        GOOGLE_USER_INFO_URL,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        },
      );

      if (response) {
        const userData = response.data;
        return userData;
      }

      return null;
    } catch (err) {
      console.log(err.response.data, 'error');
      throw new BadRequestException('Failed to user info');
    }
  }

  async createGoogleUser(data: googleProfile): Promise<any> {

    const userExist = await this.userService.getUserByEmail(data.email);
    if (userExist) return userExist
      
    const newUser = await this.userService.createUser({
      email: data.email,
      first_name: data.given_name,
      last_name: data.family_name,
      password: null,
    })
    newUser.is_verified = data.verified_email === 'true';
    await this.userRepository.save(newUser)

    return await this.userService.getUserById(newUser.id);
  }  


}