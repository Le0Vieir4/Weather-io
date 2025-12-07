import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const session = require('express-session') as typeof import('express-session');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const passport = require('passport') as typeof import('passport');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Disables default body parser
  });

  // Configure body parser with increased limit (100MB for base64 images)
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  app.use(
    session({
      secret: process.env.SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, // 1 hour
      },
    }),
  );
  
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure user serialization for sessions
  passport.serializeUser((user: Express.User, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
