import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid';
const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';


@Injectable()
export class AppUtilities {
  public static hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  public static comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  public static generateToken(len?: number): string {
    return crypto.randomBytes(len || 32).toString('hex');
  }

  public static hashToken(token: string, userId?: string): string {
    return crypto
      .createHash('sha256')
      .update(token + (userId || ''))
      .digest('hex');
  }

  public static exp1hr(): number {
    return Date.now() + 3600 * 1000;
  }

  public static exp5hr(): number {
    return Date.now() + 3600 * 5 *1000;
  }

  public static exp7d(): number {
    return Date.now() + 3600 * 24 * 7 * 1000;
  }

  public static genUuid() {
    return v4();
  }

  public static readFile(filePath: string) {
    return fs.readFileSync(filePath, 'utf8');
  }

  public static compareString(value1: string, value2: string) {
    if (value1 === value2) return true;
    return false;
  }

  public static cleanText(text: string) {
    const clean = text
      .replace(/\t|\u0085|\u2028|\u2029/g, '    ')
      .replace(/[\b\v]/g, '')
      .replace(/\r\n|\r/g, '\n')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .trim();
    return clean;
  }

  public static generateShortCode(charLen = 6): string {
    const nanoid = customAlphabet(CHARS, charLen);
    return nanoid(charLen);
  }
}
