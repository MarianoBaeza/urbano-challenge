import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as bcrypt from 'bcrypt';
import { Role } from './enums/role.enum';
import { User } from './user/entities/user.entity';

async function createAdminOnFirstUse() {
  const admin = await User.findOne({ where: { username: 'admin' } });

  if (!admin) {
    await User.create({
      firstName: 'admin',
      lastName: 'admin',
      isActive: true,
      username: 'admin',
      role: Role.Admin,
      password: await bcrypt.hash('admin123', 10),
    }).save();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.setGlobalPrefix('api');

  await createAdminOnFirstUse();

  await app.listen(5000);
}

bootstrap();
