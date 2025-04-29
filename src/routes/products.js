import { Router } from 'express';
import { ProductManager } from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager('data/products.json');

// LISTAR todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await manager.getProducts();    
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error al leer productos' });
  }
});

// TRAER un producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await manager.getProductById(req.params.pid);  
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error al leer producto' });
  }
});

// CREAR un producto
router.post('/', async (req, res) => {
  try {
    const newProduct = await manager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// ACTUALIZAR un producto
router.put('/:pid', async (req, res) => {
  try {
    const updated = await manager.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// ELIMINAR un producto
router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await manager.deleteProduct(req.params.pid);
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;
