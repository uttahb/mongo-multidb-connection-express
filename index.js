import dbs from './connections.js';
import { getModel } from './models.js';
import express from 'express';
const app = express();

app.get('/users/:db', async (req, res) => {
  if (!req.params && !req.params.db) {
    res.json({ error: true });
    return false;
  }
  const db = req.params.db;
  let userModel;
  if (dbs.pool[db]) {
    userModel = getModel(dbs.pool[db]);
  } else {
    if (dbs.addConnection(db)) {
      userModel = getModel(dbs.pool[db]);
    }
  }
  console.log('user model = ', userModel)
  const users = await userModel.create({ name: `${db}_user` });

  res.json(users);
});


const port = 3000;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));