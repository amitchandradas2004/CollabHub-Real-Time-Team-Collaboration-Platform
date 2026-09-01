import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.DB_NAME as string;

// Preserve MongoClient instance across HMR in development
const globalForMongo = globalThis as unknown as {
    _mongoClient?: MongoClient;
};

const client = globalForMongo._mongoClient || new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
    globalForMongo._mongoClient = client;
}

const db = client.db(dbName);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "teamMember",
            },
        },
    },
    database: mongodbAdapter(db, {
        client,
        transaction: false,
    }),
});