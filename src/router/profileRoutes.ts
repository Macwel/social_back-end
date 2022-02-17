import { Request, Response, Router } from 'express';
import ProfileApi from '../api/profile-api';
import validateJWT from '../api/validateJWT';

export default class ProfileRoutes {
  router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post('/profile/getUser', this.getUser);
    this.router.post('/profile/follows', validateJWT, this.getFollow);
    this.router.post('/profile/followToUser', validateJWT, this.followToUser);
  }

  // eslint-disable-next-line prettier/prettier
  private async getUser(req: Request, res: Response) {
    try {
      const response = await ProfileApi.getUser(req.body);
      res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      res.status(e?.status || 500).json(e);
    }
  }

  private async getFollow(req: Request, res: Response) {
    try {
      const response = await ProfileApi.getFollows(req.body);
      res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      res.status(e?.status || 500).json(e);
    }
  }

  private async followToUser(req: Request, res: Response) {
    try {
      const response = await ProfileApi.followToUser(req.body);
      res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      res.status(e?.status || 500).json(e);
    }
  }
}
