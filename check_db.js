require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

const mongoUri = process.env.MONGO_URI;
const fallbackUri = process.env.MONGO_FALLBACK;

if (!mongoUri) {
  console.error('MONGO_URI is not set in .env');
  process.exit(1);
}

// Prefer reliable public DNS for SRV lookups (Cloudflare + Google)
dns.setServers(['1.1.1.1', '8.8.8.8']);

const tryConnect = async (uri) => {
  mongoose.set('strictQuery', true);
  // Do not pass deprecated driver options (driver v4+ ignores them)
  return mongoose.connect(uri);
};

(async () => {
  try {
    console.log('Attempting MongoDB connection to:', mongoUri.replace(/:(?:[^@]+)@/, ':*****@'));
    await tryConnect(mongoUri);

    const db = mongoose.connection.db;
    console.log('Connected to MongoDB');
    console.log('Database name:', db.databaseName || mongoose.connection.name);
    console.log('Host(s):', mongoose.connection.host || mongoose.connection.client.s.url || 'unknown');

    const collections = await db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('No collections found in this database.');
    } else {
      console.log('Collections:');
      collections.forEach((c) => console.log(' -', c.name));
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Initial connection error:', err.message || err);

    // If SRV/DNS lookup failed or connection refused, try a secondary strategy
    const isDnsSrvError = /querySrv|ENOTFOUND|ECONNREFUSED|ENODATA/i.test(err.message || err.code || '');

    if (isDnsSrvError) {
      if (fallbackUri) {
        try {
          console.log('Attempting fallback MongoDB URI from MONGO_FALLBACK');
          await tryConnect(fallbackUri);
          const db = mongoose.connection.db;
          console.log('Connected to MongoDB (fallback)');
          console.log('Database name:', db.databaseName || mongoose.connection.name);
          const collections = await db.listCollections().toArray();
          if (collections.length === 0) {
            console.log('No collections found in fallback database.');
          } else {
            console.log('Collections:');
            collections.forEach((c) => console.log(' -', c.name));
          }
          await mongoose.disconnect();
          process.exit(0);
        } catch (err2) {
          console.error('Fallback connection error:', err2.message || err2);
          process.exit(3);
        }
      }

      // Retry initial URI after ensuring DNS servers are set
      try {
        console.log('Retrying initial URI after resetting DNS servers...');
        dns.setServers(['1.1.1.1', '8.8.8.8']);
        await tryConnect(mongoUri);
        const db = mongoose.connection.db;
        console.log('Connected to MongoDB on retry');
        console.log('Database name:', db.databaseName || mongoose.connection.name);
        const collections = await db.listCollections().toArray();
        if (collections.length === 0) {
          console.log('No collections found in this database.');
        } else {
          console.log('Collections:');
          collections.forEach((c) => console.log(' -', c.name));
        }
        await mongoose.disconnect();
        process.exit(0);
      } catch (err3) {
        console.error('Retry connection error:', err3.message || err3);
        console.error('If SRV DNS lookups keep failing, set a non-SRV fallback using MONGO_FALLBACK in your .env, e.g.');
        console.error('MONGO_FALLBACK=mongodb://host1:27017,host2:27017/yourdbname?replicaSet=rs0&ssl=true');
        process.exit(4);
      }
    }

    process.exit(2);
  }
})();
