import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://doadmin:6RW7PO2035nh8Q4x@ra-dev-mongodb-70405eb0.mongo.ondigitalocean.com/ra-core-nidhi?replicaSet=ra-dev-mongodb&tls=true&authSource=admin';
const MONGODB_DB = process.env.MONGODB_DB || 'ra-core-nidhi';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(MONGODB_DB);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function getIncomeData(year?: number) {
  const { db } = await connectToDatabase();
  const collection = db.collection('income');

  if (year) {
    return await collection.findOne({ Year: year });
  }

  // Get all years, sorted by year descending
  return await collection.find({}).sort({ Year: -1 }).toArray();
}

export async function getAssetsData(year?: number) {
  const { db } = await connectToDatabase();
  const collection = db.collection('assets');

  if (year) {
    return await collection.findOne({ Year: year });
  }

  // Get all years, sorted by year descending
  return await collection.find({}).sort({ Year: -1 }).toArray();
}

export async function getLatestFinancialData() {
  const { db } = await connectToDatabase();

  // Get the most recent year's data
  const latestIncome = await db.collection('income').findOne({}, { sort: { Year: -1 } });
  const latestAssets = await db.collection('assets').findOne({}, { sort: { Year: -1 } });

  return {
    income: latestIncome,
    assets: latestAssets
  };
}

// Utility functions to parse the string values with commas
export function parseThousands(value: string | number): number {
  if (typeof value === 'number') return value;
  if (!value || value === '') return 0;

  // Remove commas and convert to number
  const cleaned = value.toString().replace(/,/g, '');
  return parseInt(cleaned, 10) || 0;
}

export function parsePercentage(value: string): number {
  if (!value || value === '') return 0;

  // Remove % sign and convert to number (e.g., "15%" becomes 15)
  const cleaned = value.replace('%', '');
  return parseFloat(cleaned) || 0;
}