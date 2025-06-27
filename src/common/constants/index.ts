import * as dotenv from 'dotenv';
dotenv.config();

export const CONSTANT = {
  AuthQ: 'authQueue',
};

export const AUTH_MAIL = {
  confirmMail: ' Email Verification',
  welcomeMail: ' Welcome Onboard',
  passswordChangeMail: 'Password Changed',
  forgotPasswordMail: 'Reset Password',
};

export const file_type = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/webm', 'audio/x-m4a'];

export const MAX_QUESTIONS_PER_SESSION = 5;

export const googleTokenAPI = {
  GOOGLE_TOKEN_URL: 'https://oauth2.googleapis.com/token',
  GOOGLE_USER_INFO_URL: 'https://www.googleapis.com/oauth2/v1/userinfo',
};
