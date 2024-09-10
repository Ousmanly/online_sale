const pool = require ('./db')

async function clientIdExists(id) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT 1 FROM customers WHERE id = ?', [id]);
        return rows.length > 0;
    } finally {
        connection.release();
    }
}

async function createClient(client) {
    const connection = await pool.getConnection();
    try {
        const query = 'INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)';
        const [result] = await connection.execute(query, [client.name, client.address, client.email, client.phone]);
        console.log(`Client à été ajouter avec succes.`);
        return result.insertId;
    } finally {
        connection.release();
    }
}

async function updateClient(id, client) {
    const connection = await pool.getConnection();
    try {
      
        const query = 'UPDATE customers SET name = ?, address = ?, email = ?, phone = ? WHERE id = ?';
        await connection.execute(query, [client.name, client.address, client.email, client.phone, id]);    
        console.log(`Client avec id: ${id} à été modifier avec succes.`);
         
    }catch (error){
        console.log(error);
    }finally {
        connection.release();
    }
}


async function deleteClient(id) {
    const connection = await pool.getConnection();
    try {

        const query = 'DELETE FROM customers WHERE id = ?';
        await connection.execute(query, [id]);
        console.log(`Client avec id: ${id} à été supprumé.`)
       
    }catch (error){
        console.log(error);
    } finally {
        connection.release();
    }
}
async function listClients() {
    const connection = await pool.getConnection();
    try {
        const query = 'SELECT * FROM customers';
        const [rows] = await connection.execute(query);
        return rows;
    } finally {
        connection.release();
    }
}

module.exports = {
    createClient,
    updateClient,
    deleteClient,
    listClients,
    clientIdExists
};