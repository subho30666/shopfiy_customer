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



app.get('/api/customers/:index', async (req, res) => {
	try {
	  // Parse the index from the URL
	  const index = parseInt(req.params.index, 10);
  
	  // Validate the index
	  if (isNaN(index) || index < 0) {
		return res.status(400).json({ message: 'Invalid customer index' });
	  }
  
	  // Retrieve the customer by skipping documents and limiting the result to one document
	  const customersCursor = customersCollection.find({});
	  const customers = await customersCursor.skip(index).limit(1).toArray();
  
	  // If no customer is found, return a 404 error
	  if (customers.length === 0) {
		return res.status(404).json({ message: 'Customer not found' });
	  }
  
	  // Send back the found customer
	  res.json(customers[0]);
	} catch (err) {
	  // Handle server errors
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


app.get('/api/products/:index', async (req, res) => {
	try {
	  // Parse the index from the URL
	  const index = parseInt(req.params.index, 10);
  
	  // Validate the index
	  if (isNaN(index) || index < 0) {
		return res.status(400).json({ message: 'Invalid product index' });
	  }
  
	  // Retrieve the product by skipping documents and limiting the result to one document
	  const productsCursor = productsCollection.find({});
	  const products = await productsCursor.skip(index).limit(1).toArray();
  
	  // If no product is found, return a 404 error
	  if (products.length === 0) {
		return res.status(404).json({ message: 'Product not found' });
	  }
  
	  // Send back the found product
	  res.json(products[0]);
	} catch (err) {
	  // Handle server errors
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


app.get('/api/orders/:index', async (req, res) => {
	console.log("hello");
    try {
        // Parse the index from the URL
        const index = parseInt(req.params.index, 10);

		console.log("parsed",index);
        // Validate the index
        if (isNaN(index) || index < 0) {
            return res.status(400).json({ message: 'Invalid order index' });
        }

        // Ensure that you retrieve the document correctly
        const ordersCursor = ordersCollection.find({}); // Find all orders without filtering on `_id`
        const orders = await ordersCursor.skip(index).limit(1).toArray();

        // Check if an order was found
        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Return the found order
        res.json(orders[0]);
    } catch (err) {
        // Handle errors and return a 500 status if something goes wrong
        res.status(500).json({ message: err.message });
    }
});




app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

