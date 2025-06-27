import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from 'src/user/entities/user.entity';
import { Token } from 'src/token/entities/token.entity';
import { InterviewSession } from 'src/interviews/entities/interview.entity';
import { Question } from 'src/QnA/entities/question.entity';
import { Answer } from 'src/QnA/entities/answer.entity';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

const dataSource = new DataSource({
  type: process.env.DB_TYPE as 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  entities: [User, Token, InterviewSession, Question, Answer],
  migrations: [process.env.DB_MIGRATIONS],
  synchronize: isDevelopment,
  migrationsTableName: 'migrations',
  ssl: process.env.DB_SSL === 'true',
});

export async function initializeDataSource() {
  if (!dataSource.isInitialized) {
    try {
      await dataSource.initialize();
      console.log('✅ DataSource initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing DataSource:', error);
      throw error;
    }
  }
  return dataSource;
}

export default dataSource;
