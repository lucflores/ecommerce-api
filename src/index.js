import express from 'express';
import { ProductManager } from './managers/ProductManager.js';
import { CartManager }    from './managers/CartManager.js';

const app = express();
app.use(express.json());

const pm = new ProductManager('./data/products.json');
const cm = new CartManager('./data/carts.json');

// Products
app.get('/api/products',         async (req, res) => res.json(await pm.getProducts()));
app.get('/api/products/:pid',    async (req, res) => {
  const prod = await pm.getProductById(req.params.pid);
  return prod ? res.json(prod) : res.status(404).json({ error: 'No existe' });
});
app.post('/api/products',        async (req, res) => res.status(201).json(await pm.addProduct(req.body)));
app.put('/api/products/:pid',    async (req, res) => {
  const upd = await pm.updateProduct(req.params.pid, req.body);
  return upd ? res.json(upd) : res.status(404).json({ error: 'No existe' });
});
app.delete('/api/products/:pid', async (req, res) => {
  const ok = await pm.deleteProduct(req.params.pid);
  return ok ? res.json({ status: 'Eliminado' }) : res.status(404).json({ error: 'No existe' });
});

// Carts
app.post('/api/carts',                           async (req, res) => res.status(201).json(await cm.createCart()));
app.get('/api/carts/:cid',                       async (req, res) => {
  const c = await cm.getCartById(req.params.cid);
  return c ? res.json(c.products) : res.status(404).json({ error: 'No existe' });
});
app.post('/api/carts/:cid/product/:pid',         async (req, res) => {
  const updated = await cm.addProduct(req.params.cid, req.params.pid);
  return updated ? res.json(updated) : res.status(404).json({ error: 'No existe' });
});

app.listen(8080, () => console.log('Server en puerto 8080'));
