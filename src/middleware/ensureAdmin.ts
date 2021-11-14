import { NextFunction, Request, Response } from 'express';

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (!request.user.isAdmin) {
    return response.status(403).json({ error: 'Usuário não é administrador.' });
  }

  return next();
}
