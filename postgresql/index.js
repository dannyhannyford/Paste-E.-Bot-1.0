const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'paste',
  password: '1337',
  port: 5432,
});

const upsertID = (req, res) => {
  const user_id = Number(req.params.id);
  const { karma, username } = req.body;
  pool.query(`Insert into users (user_id, karma, username)
  Values ($1, $2, $3)
  On conflict (user_id) do update
  set karma = users.karma + 1;`, [user_id, karma, username], (err, results) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send('user updated');
    }
  });
};

const downsertID = (req, res) => {
  const user_id = Number(req.params.id);
  const { karma, username } = req.body;
  pool.query(`Insert into users (user_id, karma, username)
  Values ($1, $2, $3)
  On conflict (user_id) do update
  set karma = users.karma - 1;`, [user_id, karma, username], (err, results) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send('user updated');
    }
  });
};

const topTen = (req, res) => {
  pool.query('select * from users order by karma desc fetch first 10 rows only',
    (err, results) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(200).send(results.rows);
      }
    });
};

module.exports = {
  upsertID,
  downsertID,
  topTen,
};
