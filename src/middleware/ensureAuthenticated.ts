import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import auth from '../config/auth';
import { UserModel } from '../model/User';

interface Payload {
  id: string;
  exp: number;
  iat: number;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'Token faltando.' });
  }

  const token = authHeader.split(' ')[1];

  const user = verify(token, auth.secret_token) as Payload;

  request.user = await UserModel.findById(user.id);

  return next();
}
