const { MongoClient, ServerApiVersion } = require('mongodb');

process.loadEnvFile()
const uri = process.env.URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Conectado a mongoDB");
    return client
  } catch (err) {
    console.error('Error conectando a MongoDB')
    return null
  }
}

async function disconnectFromMongoDB() {
  try {
    await client.close();
    console.log("desconectado de mongoDB");
  } catch (err) {
    console.error('Error al desconectarse a MongoDB')
  }
}

module.exports = { connectToMongoDB, disconnectFromMongoDB }

