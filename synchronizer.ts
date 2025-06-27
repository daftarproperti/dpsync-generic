import { createInstance } from 'daftar-properti-sync';
import { DaftarPropertiSyncOptions } from 'daftar-properti-sync/.d.ts/interfaces';
import { MongoClient } from "mongodb";

function getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (value === undefined) {
        throw new Error(`${key} environment variable is required`);
    }
    return value;
}

async function main() {
    const MONGO_URI = getRequiredEnv('MONGO_URI');
    const COLLECTION_NAME = getRequiredEnv('COLLECTION_NAME');
    const DP_CONTRACT_ADDRESS = getRequiredEnv('DP_CONTRACT_ADDRESS');
    const BLOCKCHAIN_PROVIDER_URL = getRequiredEnv('BLOCKCHAIN_PROVIDER_URL');
    const DP_ABI_VERSION = getRequiredEnv('DP_ABI_VERSION');
    const DB_DATABASE = process.env.DB_DATABASE;

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const listingCollection = client.db(DB_DATABASE).collection(COLLECTION_NAME);

    const options : DaftarPropertiSyncOptions = {
        port: 8050,
        address: DP_CONTRACT_ADDRESS,
        strictHash: true,
        providerHost: BLOCKCHAIN_PROVIDER_URL,
        fetchAll: false,
        abiVersion: Number(DP_ABI_VERSION),
        fromBlockNumber: 0,
        listingCollection: listingCollection,
        errorHandling: null,
    };

    const instance = createInstance(options);

    await instance.fetchMissedListings();
}

main();
