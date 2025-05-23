import { Router } from 'express';
import { ProductManager } from '../managers/ProductManager.js';

export default function productRouter(io) {
  const router = Router();
  const manager = new ProductManager('data/products.json');

  router.get('/', async (req, res) => {
    try {
      const products = await manager.getProducts();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Error al leer productos' });
    }
  });

  router.get('/:pid', async (req, res) => {
    try {
      const product = await manager.getProductById(req.params.pid);
      if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: 'Error al leer producto' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const {
        title,
        description,
        code,
        price,
        stock,
        category,
        status = true,
        thumbnails = []
      } = req.body;

      if (!title || !description || !code || price == null || stock == null || !category) {
        return res.status(400).json({
          error: 'Faltan datos: titulo, descripción, código, precio, stock y categoria son requeridos.'
        });
      }

      const all = await manager.getProducts();
      if (all.some(p => p.code === code)) {
        return res.status(400).json({ error: `Ya existe un producto con código="${code}".` });
      }

      const newProduct = await manager.addProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
      });

      const updatedList = await manager.getProducts();
      io.emit('updateProducts', updatedList);

      return res.status(201).json(newProduct);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al crear producto' });
    }
  });

  router.put('/:pid', async (req, res) => {
    try {
      const updated = await manager.updateProduct(req.params.pid, req.body);
      if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
      return res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  });

  router.delete('/:pid', async (req, res) => {
    try {
      const deleted = await manager.deleteProduct(req.params.pid);
      if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });

      const updatedList = await manager.getProducts();
      io.emit('updateProducts', updatedList);

      return res.json({ message: 'Producto eliminado' });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  });

  return router;
}

