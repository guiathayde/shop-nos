import 'dotenv/config';
import express from 'express';
import multer from 'multer';

import uploadImageConfig from './config/uploadImage';
import {
  createProduct,
  deleteProduct,
  filterProducts,
  getAllProducts,
  updateProduct,
} from './controller/ProductsController';
import { signIn, signUp } from './controller/UsersController';
import { ensureAdmin } from './middleware/ensureAdmin';
import { ensureAuthenticated } from './middleware/ensureAuthenticated';
import { getDatabaseConnection } from './service/ConnectionDatabase';

getDatabaseConnection();

const app = express();

const uploadImage = multer(uploadImageConfig.multer);

app.use(express.json());

app.use('/images', express.static(`${process.cwd()}/images`));

app.post('/signup', signUp);
app.post('/signin', signIn);

app.post(
  '/products',
  ensureAuthenticated,
  ensureAdmin,
  uploadImage.single('image'),
  createProduct,
);
app.put(
  '/products/:id',
  ensureAuthenticated,
  ensureAdmin,
  uploadImage.single('image'),
  updateProduct,
);
app.delete('/products/:id', ensureAuthenticated, ensureAdmin, deleteProduct);
app.get('/products', getAllProducts);
app.post('/products/filter', filterProducts);

app.listen(3333, () => console.log('Server is running!'));
