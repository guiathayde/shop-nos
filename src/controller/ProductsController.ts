import { Request, Response } from 'express';

import { categoriesAllowed, ProductModel } from '../model/Product';

export async function createProduct(request: Request, response: Response) {
  const { name, price, category } = request.body;

  if (!name || !price || !category) {
    return response
      .status(403)
      .json({ error: 'Nome, preço ou categoria vazia.' });
  }

  if (!categoriesAllowed.includes(category)) {
    return response.status(403).json({ error: 'Categoria não não permitida.' });
  }

  const product = new ProductModel({
    name,
    price,
    category,
  });
  await product.save();

  return response.status(201).json(product);
}

export async function updateProduct(request: Request, response: Response) {
  const { id } = request.params;
  const { name, price, category } = request.body;

  if (!categoriesAllowed.includes(category)) {
    return response.status(403).json({ error: 'Categoria não não permitida.' });
  }

  const product = await ProductModel.updateOne(
    { _id: id },
    { name, price, category },
  );

  return response.status(204).json(product);
}

export async function deleteProduct(request: Request, response: Response) {
  const { id } = request.params;

  const status = await ProductModel.deleteOne({ _id: id });

  if (status) {
    return response
      .status(200)
      .json({ message: 'Produto deletado com sucesso.' });
  }

  return response
    .status(403)
    .json({ error: 'Produto não deletado. Revise o id do produto.' });
}

export async function getAllProducts(request: Request, response: Response) {
  const allProducts = await ProductModel.find();

  return response.json(allProducts);
}

export async function filterProducts(request: Request, response: Response) {
  const { name, category, min, max } = request.body;

  if (name) {
    const products = await ProductModel.find({ name });
    return response.json(products);
  }
  if (category) {
    const products = await ProductModel.find({ category });
    return response.json(products);
  }
  if (min) {
    const products = await ProductModel.find({ price: { $gte: min } });
    return response.json(products);
  }
  if (max) {
    const products = await ProductModel.find({ price: { $lte: max } });
    return response.json(products);
  }

  return response
    .status(403)
    .json({ error: 'Nenhum parâmetro para filtro enviado.' });
}
