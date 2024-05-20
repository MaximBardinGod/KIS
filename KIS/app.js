const express = require('express');
const cors = require('cors');
const { getAllStocks, getStockById, createStock, updateStock, deleteStock } = require('./Controllers/stock');
const { getAllSpecifications, getSpecificationById, createSpecification, updateSpecification, deleteSpecification} = require('./Controllers/Specifications');
const { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder} = require('./Controllers/order');
const { getStockBalance} = require('./Controllers/stockBalance');
const { getSpecificationBreakdown } = require('./Controllers/specificationBreakdown');
const { getStocksBreakdown } = require('./Controllers/stocksBreakdown');


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/get/specifications', getAllSpecifications);
app.get('/get/specifications/:id', getSpecificationById);
app.post('/post/specifications', createSpecification);
app.put('/put/specifications', updateSpecification);
app.delete('/delete/specifications/:id', deleteSpecification);

app.get('/get/orders', getAllOrders);
app.get('/get/orders/:id', getOrderById);
app.post('/post/orders', createOrder);
app.put('/put/orders', updateOrder);
app.delete('/delete/orders/:id', deleteOrder);

app.get('/get/stocks', getAllStocks);
app.get('/get/stocks/:id', getStockById);
app.post('/post/stocks', createStock);
app.put('/put/stocks', updateStock);
app.delete('/delete/stocks/:id', deleteStock);

app.get('/get/stockBalance', getStockBalance);

app.get('/get/specificationBreakdown/:id', getSpecificationBreakdown);

app.get('/get/stockBreakdown', getStocksBreakdown);


app.listen(port, () => {
    console.log(`Сервер запущен! Адрес сервера:http://localhost:${port}`);
});
