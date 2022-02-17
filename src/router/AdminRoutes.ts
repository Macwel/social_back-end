import express, { Request, Response } from 'express';
import AdminApi from '../api/admin-api';
import ValidateJWT from '../api/validateJWT';

export default class AdminRoutes {
  router = express.Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post('/sendReq', this.sendReq);
    this.router.post('/admin/sign-in', this.signIn);
    this.router.post('/admin/stats', ValidateJWT, this.stats);
    this.router.post('/admin/requests', ValidateJWT, this.requests);
    this.router.post('/admin/getAgents', ValidateJWT, this.getAgents);
    this.router.post('/admin/getContacts', ValidateJWT, this.getContacts);
  }

  private async getContacts(req: Request, res: Response) {
    try {
      const response = await AdminApi.getContacts();
      res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      res.status(e?.status || 500).json(e);
    }
  }

  private async getAgents(req: Request, res: Response) {
    try {
      const response = await AdminApi.getAgents();
      res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      res.status(e?.status || 500).json(e);
    }
  }

  private async sendReq(req: Request, res: Response) {
    try {
      const response = await AdminApi.sendReq(req.body);
      res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      res.status(e?.status || 500).json(e);
    }
  }

  private async signIn(req: Request, res: Response) {
    try {
      const response = await AdminApi.signIn(req.body);
      res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      res.status(e?.status || 500).json(e);
    }
  }

  private async stats(req: Request, res: Response) {
    try {
      const response = await AdminApi.stats();
      res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      res.status(e?.status || 500).json(e);
    }
  }

  private async requests(req: Request, res: Response) {
    try {
      const response = await AdminApi.requests();
      res.status(response.status).json(response);
    } catch (e) {
      console.log(e);
      res.status(e?.status || 500).json(e);
    }
  }
}
