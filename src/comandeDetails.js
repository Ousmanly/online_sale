const pool = require ('./db')

async function createPurchaseOrderWithDetails(order, details) {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            'INSERT INTO purchase_orders (date, delivery_address, customer_id, track_number, status) VALUES (?, ?, ?, ?, ?)',
            [order.date, order.deliveryAddress, order.customerId, order.trackNumber, order.status]
        );
        
        const purchaseId = result.insertId;
        
        for (const detail of details) {
            await connection.execute(
                'INSERT INTO order_details (quantity, price, purchase_id, product_id) VALUES (?, ?, ?, ?)',
                [detail.quantity, detail.price, purchaseId, detail.productId]
            );
        }

        console.log('Commande et détails créés avec succès.');
    } catch (error) {
        console.error('Erreur lors de la création de la commande et des détails :', error.message);
    } finally {
        connection.release();
    }
}
module.exports = {
    createPurchaseOrderWithDetails
}