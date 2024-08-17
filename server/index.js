import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://db_user_read:LdmrVA5EDEv4z3Wr@cluster0.n10ox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

let customersCollection, productsCollection, ordersCollection;

async function connectToDatabase() {
	console.log("hello pop");
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('RQ_Analytics');
    customersCollection = db.collection('shopifyCustomers');
    productsCollection = db.collection('shopifyProducts');
    ordersCollection = db.collection('shopifyOrders');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}


connectToDatabase();

// Routes for customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await customersCollection.find().toArray();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const customer = await customersCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routes for products
app.get('/api/products', async (req, res) => {
  try {
    const products = await productsCollection.find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await productsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routes for orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await ordersCollection.find().toArray();
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err.message); // Log the error message
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await ordersCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

/* process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
 */