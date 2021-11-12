import 'dotenv/config';
import express from 'express';

import {
  createProduct,
  deleteProduct,
  filterProducts,
  getAllProducts,
  updateProduct,
} from './controller/ProductsController';
import { getConnection } from './service/ConnectionDatabase';

getConnection();

const app = express();

app.use(express.json());

app.post('/products', createProduct);
app.put('/products/:id', updateProduct);
app.delete('/products/:id', deleteProduct);
app.get('/products', getAllProducts);
app.post('/products/filter', filterProducts);

app.listen(3333, () => console.log('Server is running!'));
