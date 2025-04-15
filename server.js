
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/finance";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Get database and collections
const db = client.db("finance");
const transactions = db.collection("transactions");
const categories = db.collection("categories");
const budgets = db.collection("budgets");

// Routes

// Transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const result = await transactions.find({}).toArray();
    res.json(result);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const transaction = {
      ...req.body,
      id: new ObjectId().toString()
    };
    await transactions.insertOne(transaction);
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = req.body;
    await transactions.updateOne({ id }, { $set: transaction });
    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await transactions.deleteOne({ id });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await categories.find({}).toArray();
    res.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const category = {
      ...req.body,
      id: new ObjectId().toString()
    };
    await categories.insertOne(category);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = req.body;
    await categories.updateOne({ id }, { $set: category });
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await categories.deleteOne({ id });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Budgets
app.get('/api/budgets', async (req, res) => {
  try {
    const result = await budgets.find({}).toArray();
    res.json(result);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

app.post('/api/budgets', async (req, res) => {
  try {
    const budget = {
      ...req.body,
      id: new ObjectId().toString()
    };
    await budgets.insertOne(budget);
    res.status(201).json(budget);
  } catch (error) {
    console.error('Error adding budget:', error);
    res.status(500).json({ error: 'Failed to add budget' });
  }
});

app.put('/api/budgets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const budget = req.body;
    await budgets.updateOne({ id }, { $set: budget });
    res.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

app.delete('/api/budgets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await budgets.deleteOne({ id });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

// Start the server
async function startServer() {
  await connectToMongoDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);

// Handle process termination
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
