import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToMongoDB(uri: string): Promise<Db> {
  if (db) {
    return db;
  }

  client = new MongoClient(uri);

  await client.connect();

  db = client.db("shopsphere");

  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new Error("Mongo not connected — call connectToMongoDB() first");
  }

  return db;
}