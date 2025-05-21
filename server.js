import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import productsRouter from './src/routes/products.js';
import viewsRouter    from './src/routes/views.js';
import cartsRouter    from './src/routes/carts.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);


const app = express();
const httpServer = createServer(app);
const io = new IOServer(httpServer);


app.use(express.json());
app.use(
  '/socket.io',
  express.static(path.resolve(__dirname, 'node_modules', 'socket.io', 'client-dist')
  )
);
app.use(express.static(path.resolve(__dirname, './public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve('src', 'views'));

app.use('/api/products', productsRouter(io));  
app.use('/api/carts',    cartsRouter);
app.use('/',             viewsRouter);

io.on('connection', socket => {
  console.log('Nuevo cliente conectado');

  // Al conectarse, enviamos lista actual de productos
  socket.emit('updateProducts', /* función para leer todos */);

  // (Opcional) escuchar eventos desde el cliente:
  socket.on('newProduct', async prodData => {
    await 
    io.emit('updateProducts', /* pm.getProducts() */);
  });

  socket.on('deleteProduct', async id => {
    await /* pm.deleteProduct(id) */
    io.emit('updateProducts', /* pm.getProducts() */);
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
