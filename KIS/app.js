const express = require('express');
const { getAllStocks, getStockById, createStock, updateStock, deleteStock } = require('./Controllers/stock');
const { getAllSpecifications, getSpecificationById, createSpecification, updateSpecification, deleteSpecification} = require('./Controllers/Specifications');
const { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder} = require('./Controllers/order');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/specifications', getAllSpecifications);
app.get('/specifications/:id', getSpecificationById);
app.post('/specifications', createSpecification);
app.put('/specifications', updateSpecification);
app.delete('/specifications/:id', deleteSpecification);

app.get('/orders', getAllOrders);
app.get('/orders/:id', getOrderById);
app.post('/orders', createOrder);
app.put('/orders', updateOrder);
app.delete('/orders/:id', deleteOrder);

app.get('/stocks', getAllStocks);
app.get('/stocks/:id', getStockById);
app.post('/stocks', createStock);
app.put('/stocks', updateStock);
app.delete('/stocks/:id', deleteStock);

app.listen(port, () => {
    console.log(`Сервер запущен! Адрес сервера:http://localhost:${port}`);
});
