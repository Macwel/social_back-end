import { Router, Request, Response } from 'express';
import AuthApi from '../api/auth-api';

export default class AuthRoutes {
  router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post('/auth/sign-up', this.signUp);
    this.router.post('/auth/sign-in', this.signIn);
  }

  private async signUp(req: Request, res: Response) {
    try {
      const response = await AuthApi.signUp(req.body);
      res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      res.status(e?.status || 500).json(e);
    }
  }

  private async signIn(req: Request, res: Response) {
    try {
      const response = await AuthApi.signIn(req.body);
      res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      res.status(e?.status || 500).json(e);
    }
  }
}
