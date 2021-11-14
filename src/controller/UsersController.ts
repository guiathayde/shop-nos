import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import validator from 'validator';

import auth from '../config/auth';
import { UserModel } from '../model/User';

export async function signUp(request: Request, response: Response) {
  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    return response.status(403).json({ error: 'Nome, e-mail ou senha vazia.' });
  }

  if (!validator.isEmail(email)) {
    return response.status(403).json({ error: 'E-mail inválido.' });
  }

  const verifyEmail = await UserModel.find({ email });
  if (verifyEmail.length) {
    return response.status(403).json({ error: 'E-mail já cadastrado.' });
  }

  const user = new UserModel({
    name,
    email,
    password,
  });
  await user.save();

  const userResponse = {
    _id: user.id,
    name,
    email,
    isAdmin: user.isAdmin,
  };

  return response.status(201).json(userResponse);
}

export async function signIn(request: Request, response: Response) {
  const { email, password } = request.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return response.status(403).json({ error: 'E-mail ou senha inválidos.' });
  }

  if (!user.validatePassword(password)) {
    return response.status(403).json({ error: 'E-mail ou senha inválidos.' });
  }

  const today = new Date();

  const token = jwt.sign(
    {
      id: user.id,
      exp: today.getTime() / 1000 + 1000 * 60 * 2,
    },
    auth.secret_token,
  );

  const userResponse = {
    _id: user.id,
    name: user.name,
    email,
    isAdmin: user.isAdmin,
    token,
  };

  return response.json(userResponse);
}
