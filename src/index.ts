// import modules
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
// import app module
import App from './App';

// imoprt routes
// import TicketRoutes from './router/ticketsRouter';
import AuthRouter from './router/authRoutes';
import ProfileRouter from './router/profileRoutes';

dotenv.config();

const app = new App({
  port: Number(process.env.PORT) || 3040,
  middlewares: [
    express.json({
      limit: '10mb',
    }),
    express.urlencoded({ extended: true }),
    cors(),
    morgan('dev'),
  ],
  routes: [new AuthRouter(), new ProfileRouter()],
});

app.listen();
