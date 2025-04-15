
import { MongoClient, ServerApiVersion } from 'mongodb';

// Connection URI
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/finance";

// Create a MongoClient with unified topology
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connection state
let isConnected = false;

// Connect to MongoDB
export async function connectToDatabase() {
  if (isConnected) {
    return client;
  }
  
  try {
    await client.connect();
    isConnected = true;
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Get database
export function getDb() {
  return client.db("finance");
}

// Collections
export const collections = {
  transactions: () => getDb().collection("transactions"),
  categories: () => getDb().collection("categories"),
  budgets: () => getDb().collection("budgets"),
};

// Disconnect from MongoDB
export async function disconnectFromDatabase() {
  if (!isConnected) {
    return;
  }
  
  try {
    await client.close();
    isConnected = false;
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
}
