import express from 'express';
import productsRouter from './src/routes/products.js';
import cartsRouter    from './src/routes/carts.js';

const app = express();
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts',    cartsRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
