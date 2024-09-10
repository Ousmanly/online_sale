const pool = require('./db')

async function comandeIdExists(id) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT 1 FROM purchase_orders WHERE id = ?', [id]);
        return rows.length > 0;
    } finally {
        connection.release();
    }
}

// async function createPurchaseDetails(order, details) {
//     const connection = await pool.getConnection();
//     try {
//         const [result] = await connection.execute(
//             'INSERT INTO purchase_orders (date, delivery_address, customer_id, track_number, status) VALUES (?, ?, ?, ?, ?)',
//             [order.date, order.deliveryAddress, order.customerId, order.trackNumber, order.status]
//         );

//         const purchaseId = result.insertId;

//         for (const productId of details.products) {
//             await connection.execute(
//                 'INSERT INTO order_details (quantity, price, purchase_id, product_id) VALUES (?, ?, ?, ?)',
//                 [details.quantity, details.price, purchaseId, productId]
//             );
//         }

//         console.log('Commande et détails créés avec succès.');
//     } catch (error) {
//         console.error('Erreur lors de la création de la commande et des détails :', error);
//     } finally {
//         connection.release();
//     }
// }
async function createPurchaseDetails(order, productDetails) {
    const connection = await pool.getConnection();
    try {
        // Insérer la commande
        const [result] = await connection.execute(
            'INSERT INTO purchase_orders (date, delivery_address, customer_id, track_number, status) VALUES (?, ?, ?, ?, ?)',
            [order.date, order.deliveryAddress, order.customerId, order.trackNumber, order.status]
        );

        const purchaseId = result.insertId;

        // Insérer les détails de chaque produit
        for (const detail of productDetails) {
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


// async function listPurchaseDetails() {
//     const connection = await pool.getConnection();
//     try {
//         const query = 'SELECT po.id AS purchase_id, po.date, po.delivery_address, po.customer_id, po.track_number, po.status, od.id AS detail_id, od.quantity, od.price, od.product_id FROM purchase_orders po JOIN order_details od ON po.id = od.purchase_id;';
//         const [rows] = await connection.execute(query);
//         // const query = 'SELECT * FROM purchase_orders';
//         // const [rows] = await connection.execute(query);

//         // const detail = 'SELECT * FROM order_details';
//         // const [result] = await connection.execute(detail);
//         // const tab = [rows, result ]
//         // return tab ;
//         return rows ;
//     } finally {
//         connection.release();
//     }
// }

// async function listPurchaseDetails() {
//     const connection = await pool.getConnection();
//     try {
//         const purchaseQuery = 'SELECT * FROM purchase_orders';
//         const [purchaseRows] = await connection.execute(purchaseQuery);

//         const result = [];

//         for (const purchase of purchaseRows) {
//             const detailsQuery = 'SELECT * FROM order_details WHERE purchase_id = ?';
//             const [detailsRows] = await connection.execute(detailsQuery, [purchase.id]);
            
//             result.push({
//                 purchase,
//                 details: detailsRows
//             });
//         }

//         return result;
//     } catch (error) {
//         console.error('Erreur lors de la récupération des commandes et des détails :', error.message);
//         throw error;
//     } finally {
//         connection.release();
//     }
// }

async function listPurchaseDetails(purchaseId) {
    const connection = await pool.getConnection();
    try {
        const purchaseQuery = 'SELECT * FROM purchase_orders WHERE id = ?';
        const [purchaseRows] = await connection.execute(purchaseQuery, [purchaseId]);
        const purchase = purchaseRows[0]; 

        if (!purchase) {
            throw new Error(`Commande avec l'ID ${purchaseId} n'existe pas.`);
        }
        const detailsQuery = 'SELECT quantity, price, product_id FROM order_details WHERE purchase_id = ?';
        const [detailsRows] = await connection.execute(detailsQuery, [purchaseId]);
        const details = detailsRows; 

        return {
            purchase,
            details
        };
    } catch (error) {
        console.error('Erreur lors de la récupération de la commande et des détails :', error.message);
        throw error;
    } finally {
        connection.release();
    }
}


async function deletePurchaseDetails(purchaseId) {
    const connection = await pool.getConnection();
    try {
        await connection.execute(
            'DELETE FROM order_details WHERE purchase_id = ?',
            [purchaseId]
        );

        await connection.execute(
            'DELETE FROM purchase_orders WHERE id = ?',
            [purchaseId]
        );

        console.log('Commande et détails supprimés avec succès.');
    } catch (error) {
        console.error('Erreur lors de la suppression de la commande et des détails ');
    } finally {
        connection.release();
    }
}

async function updatePurchaseDetails(purchaseId, order, details) {
    const connection = await pool.getConnection();
    try {
        await connection.execute(
            'UPDATE purchase_orders SET date = ?, delivery_address = ?, customer_id = ?, track_number = ?, status = ? WHERE id = ?',
            [order.date, order.deliveryAddress, order.customerId, order.trackNumber, order.status, purchaseId]
        );

        console.log(`Commande avec l'ID : ${purchaseId} a été modifiée avec succès.`);
        await connection.execute(
            'UPDATE order_details SET quantity = ?, price = ? WHERE purchase_id = ? AND product_id = ?',
            [details.quantity, details.price, purchaseId, details.productId]
        );

        console.log(`Détails de la commande pour le produit avec l'ID : ${details.productId} ont été modifiés avec succès.`);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la commande et des détails :', error.message);
    } finally {
        connection.release();
    }
}


module.exports = {
    createPurchaseDetails,
    listPurchaseDetails,
    deletePurchaseDetails,
    comandeIdExists,
    updatePurchaseDetails
}