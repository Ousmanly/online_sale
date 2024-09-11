const pool = require ('./db')

async function paymentIdExists(id) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT 1 FROM payments WHERE id = ?', [id]);
        return rows.length > 0;
    } finally {
        connection.release();
    }
}

async function createPayment(payments) {
    const connection = await pool.getConnection();
    try {
        const query = 'INSERT INTO payments (date, amount, p_methode, purchase_id) VALUES (?, ?, ?, ?)';
        const [result] = await connection.execute(query, [payments.date, payments.amount, payments.p_methode, payments.purchase_id]);
        console.log(`Payement a été ajouter avec succes.`);
        return result.insertId;
    }catch(error){
        console.log(error.message);
    } finally {
        connection.release();
    }
}

async function updatePayment(id, payments) {
    const connection = await pool.getConnection();
    try {
      
        const query = 'UPDATE payments SET date = ?, amount = ?, p_methode = ?, purchase_id = ? WHERE id = ?';
        await connection.execute(query, [payments.date, payments.amount, payments.p_methode, payments.purchase_id, id]);    
        console.log(`Payement avec id: ${id} à été modifier avec succes.`);
         
    }catch (error){
        console.log(error.message);
    }finally {
        connection.release();
    }
}


async function deletePayment(id) {
    const connection = await pool.getConnection();
    try {

        const query = 'DELETE FROM payments WHERE id = ?';
        await connection.execute(query, [id]);
        console.log(`Payement avec id: ${id} à été supprumé.`)
       
    }catch (error){
        console.log(error.message);
    } finally {
        connection.release();
    }
}
async function listPayments() {
    const connection = await pool.getConnection();
    try {
        const query = 'SELECT * FROM payments';
        const [rows] = await connection.execute(query);
        return rows;
    }catch (error){
        console.log(error.message);
    } finally {
        connection.release();
    }
}

module.exports = {
    createPayment,
    updatePayment,
    deletePayment,
    listPayments,
    paymentIdExists
};