import mongoose from 'mongoose';
class MongoPool {
  constructor(databases) {
    if (!databases) {
      databases = {
        c1: {
          url: 'mongodb://127.0.0.1:27017/c1',
        },
        c2: {
          url: 'mongodb://127.0.0.1:27017/c2'
        }
      }
    }
    this.databases = databases;
    this.pool = {}
  }
  addConnection(db) {
    try {
      const url = `mongodb://127.0.0.1:27017/${db}`;
      this.pool[db] = new MongoConnect(url);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }

  }
  initConnections() {
    console.log('inside init db', this.databases)
    const databases = Object.keys(this.databases);
    databases.forEach((eachDatabase) => {
      const database = this.databases[eachDatabase];
      this.pool[eachDatabase] = new MongoConnect(database.url);
    })
  }

}

class MongoConnect {
  constructor(url) {
    this.url = url;
    this.db = null;
    this.error = null;
    this.connect();
  }
  connect() {
    console.log('connection to ', this.url)
    this.db = mongoose.createConnection(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.db.on('error', function (error) {
      this.error = error;
      console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
      this.disconnect();
    });

    this.db.on('connected', function () {
      mongoose.set('debug', function (col, method, query, doc) {
        console.log(`MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(query)},${JSON.stringify(doc)})`);
      });
      console.log(`MongoDB :: connected ${this.name}`);
    });

    this.db.on('disconnected', function () {
      console.log(`MongoDB :: disconnected ${this.name}`);
    });
    return this.db;
  }
  disconnect() {
    this.db.close().catch(() => console.log(`MongoDB :: failed to close connection ${this.name}`));
  }
}


// const mongoose = require('mongoose');
// function makeNewConnection(uri) {
//   const db = mongoose.createConnection(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   db.on('error', function (error) {
//     console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
//     db.close().catch(() => console.log(`MongoDB :: failed to close connection ${this.name}`));
//   });

//   db.on('connected', function () {
//     mongoose.set('debug', function (col, method, query, doc) {
//       console.log(`MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(query)},${JSON.stringify(doc)})`);
//     });
//     console.log(`MongoDB :: connected ${this.name}`);
//   });

//   db.on('disconnected', function () {
//     console.log(`MongoDB :: disconnected ${this.name}`);
//   });

//   return db;
// }

const dbPool = new MongoPool();
dbPool.initConnections();
export default dbPool;