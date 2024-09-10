const mysql = require ('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ousmane12042061mysql',
  database: 'online_sale',
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout:300000
});
pool.getConnection().then(() => {
    console.log("CONNECTED")
})
.catch(() =>{
  console.log("ERROR CONNECTION")
})
module.exports = pool;