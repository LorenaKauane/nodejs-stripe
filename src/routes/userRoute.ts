import UserController from '@/controller/userController';
import { NextFunction, Request, Response, Router } from 'express';

class UserRouter {
  public static create(router: Router) {
    const endpoint = new UserController();

    router.get('/user', (req: Request, res: Response, next: NextFunction) => {
      endpoint.getAll(req, res, next);
    });

    router.post('/user', (req: Request, res: Response, next: NextFunction) => {
      endpoint.save(req, res, next);
    });

    router.get(
      '/user/:id',
      (req: Request, res: Response, next: NextFunction) => {
        endpoint.getById(req, res, next);
      }
    );
  }
}

export { UserRouter };
