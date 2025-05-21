// src/routes/views.router.js
import { Router } from 'express';
import { ProductManager } from '../managers/ProductManager.js';

const router = Router();
const pm = new ProductManager('./data/products.json');

// Vista estática (home) con la lista actual
router.get('/', async (req, res) => {
  const products = await pm.getProducts();
  res.render('home', { products });
});

// Vista en tiempo real
router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts'); 
  // Esta plantilla hará la conexión vía Socket.io en el cliente
});

export default router;
