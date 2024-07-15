const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct} = require('./Controllers/product');
const { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder} = require('./Controllers/order');
const { getAllChecks, getCheckById, createCheck, updateCheck, deleteCheck} = require('./Controllers/check');
const { getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient} = require('./Controllers/client');
const { getItemMenuByCheckId, createItemMenu} = require('./Controllers/itemMenu');
const { getItemOrderByOrderId, createItemOrder} = require('./Controllers/itemOrder');
const ordersRouter = require('./Controllers/createClientOrder');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/get/Products', getAllProducts);
app.get('/get/Product/:id', getProductById);
app.post('/post/Product', createProduct);
app.put('/put/Product', updateProduct);
app.delete('/delete/Product/:id', deleteProduct);

app.get('/get/checks', getAllChecks);
app.get('/get/check/:id', getCheckById);
app.post('/post/check', createCheck);
app.put('/put/check', updateCheck);
app.delete('/delete/check/:id', deleteCheck);

app.get('/get/Clients', getAllClients);
app.get('/get/client/:id', getClientById);
app.post('/post/client', createClient);
app.put('/put/client/:id', updateClient);
app.delete('/delete/client/:id', deleteClient);

app.get('/get/orders', getAllOrders);
app.get('/get/order/:id', getOrderById);
app.post('/post/order', createOrder);
app.put('/put/order', updateOrder);
app.delete('/delete/order/:id', deleteOrder);

app.get('/get/itemmenu/:checkId', getItemMenuByCheckId);
app.post('/post/itemmenu', createItemMenu);

app.get('/get/itemorder/:orderId', getItemOrderByOrderId);
app.post('/post/itemOrder', createItemOrder);

app.use(bodyParser.json());

app.get('/test-db', async (req, res) => {
    try {
      const result = await pool.query('SELECT NOW()');
      res.send(result.rows[0]);
    } catch (error) {
      res.status(500).send('Database connection failed: ' + error.message);
    }
  });
  

app.use('/api/orders', ordersRouter);

app.listen(port, () => {
    console.log(`Сервер запущен! Адрес сервера:http://localhost:${port}`);
});
