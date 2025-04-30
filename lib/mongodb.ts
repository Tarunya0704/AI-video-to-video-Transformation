import { MongoClient, ServerApiVersion } from "mongodb";

// MongoDB connection URI (would be in environment variables in production)
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/video-transformation";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Check if we are in development mode
const isDevelopment = process.env.NODE_ENV === "development";

if (isDevelopment) {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  clientPromise = client.connect();
}

export async function createClient() {
  const client = await clientPromise;
  const db = client.db();
  return { client, db };
}

export default clientPromise;