import { Router } from 'express';
import { CartManager } from '../managers/CartManager.js';

const router = Router();
const manager = new CartManager('data/carts.json');

router.post('/', async (req, res) => {
  const cart = await manager.createCart();
  res.status(201).json(cart);
});

router.get('/:cid', async (req, res) => {
  const cart = await manager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const updatedCart = await manager.addProduct(parseInt(req.params.cid), parseInt(req.params.pid));
  if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(updatedCart);
});

export default router;