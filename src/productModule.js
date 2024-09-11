const pool = require('./db')

async function productIdExists(id) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT 1 FROM products WHERE id = ?', [id]);
        return rows.length > 0;
    } catch (error) {
        console.log(error.message);
    } finally {
        connection.release();
    }
}

async function createProduct(product) {
    const connection = await pool.getConnection();
    try {
        const query = 'INSERT INTO products (name, description, stock, price, category, barcode, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await connection.execute(query, [product.name, product.description, product.stock, product.price, product.category, product.barcode, product.status]);
        console.log(`Produit à été ajouter avec succes.`);
        return result.insertId;
    } catch (error) {
        if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
            console.log(
                "Veillez verifiez les valeur saisi vous avez entrer une valeur invalide."
            );
        } else {
            console.error("Erreur lors de la d'insertion du produit :", error.message);
        }
        // console.log(error.message);
    } finally {
        connection.release();
    }
}

async function updateProduct(id, product) {
    const connection = await pool.getConnection();
    try {

        const query = 'UPDATE products SET name = ?, description = ?, stock = ?, price = ?, category = ?, barcode = ?, status = ?  WHERE id = ?';
        await connection.execute(query, [product.name, product.description, product.stock, product.price, product.category, product.barcode, product.status, id]);
        console.log(`Produit avec id: ${id} à été modifier avec succes.`);

    } catch (error) {
        if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
            console.log(
                "Veillez verifiez les valeur saisi vous avez entrer valeur invalide."
            );
        } else {
            console.error("Erreur lors de la de la modification du produit :");
        }
    } finally {
        connection.release();
    }
}


async function deleteProduct(id) {
    const connection = await pool.getConnection();
    try {
        const query = 'DELETE FROM products WHERE id = ?';
        await connection.execute(query, [id]);
        console.log(`Produit avec id: ${id} à été supprumé.`)
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            console.log(
                "Impossible de supprimer le produit car il est lié à des commandes existantes."
            );
        } else {
            console.error("Erreur lors de la suppression du produit :");
        }
    } finally {
        connection.release();
    }
}
async function listProducts() {
    const connection = await pool.getConnection();
    try {
        const query = 'SELECT * FROM products';
        const [rows] = await connection.execute(query);
        return rows;
    } catch (error) {
        console.log(error.message);
    } finally {
        connection.release();
    }
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    listProducts,
    productIdExists
};