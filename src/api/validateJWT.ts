import { NextFunction, Request, Response } from 'express';
import AuthApi from './auth-api';
import CustomError from '../utils/CustomError';

export default async function validateJWT(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (!token) {
      throw new CustomError({
        status: 404,
        message: 'Token not defined.',
      });
    }

    const response = await AuthApi.ValidateJWTResponse({
      token,
    });

    req.body.token = response;
    next();
  } catch (e) {
    console.log(e);
    res.status(e?.status || 500).json(e);
  }
}
