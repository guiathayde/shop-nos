import { Document, Schema, model } from 'mongoose';

interface Product extends Document {
  name: string;
  price: number;
  category: 'clothing' | 'food' | 'eletronic';
}

const schema = new Schema<Product>(
  {
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    category: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);

export const ProductModel = model<Product>('products', schema);

export const categoriesAllowed = ['clothing', 'food', 'eletronic'];
