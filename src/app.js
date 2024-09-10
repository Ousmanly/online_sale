const readline = require('readline-sync');
const { clientIdExists, createClient, updateClient, deleteClient, listClients } = require('./customers');
const { listProducts, createProduct, updateProduct, deleteProduct, productIdExists } = require('./products');
const { createPurchaseOrderWithDetails } = require('./comandeDetails');


async function main() {
    let running = true; 
    while (running) {
        console.log(`
             1. Les clients
             2. Les produits
             3. Les commandes et ses details
             4. Quitter
           `);

        const choices = readline.question('Choisissez une option: ');
        try {
            if (choices == 1) {
                await clients()
            }else if (choices == 2) {
                await produits()
            }else if (choices == 3) {
                await comandeDetails()
            }else if (choices == 4) {
                process.exit()
            }
             else {
                console.log('Option est invalide');
            }
            
        } catch (err) {
            console.error('Erreur:', err.message);
        }
    }
}
async function clients() {
    while (true) {
        console.log(`
            1. Ajouter un nouveau client
            2. Mettre à jour les information d'un client
            3. Supprimer un client
            4. Liste tous les clients.
            5. Retour
            6. Quitter
          `);
        const choice = readline.question('Choisissez une option: ');
        switch (choice) {
            case '1':
                const name = readline.question('Nom : ');
                const address = readline.question('Adresse : ');
                const email = readline.question('Email : ');
                const phone = readline.question('Telephone : ');
                await createClient({ name, address, email, phone });
                break;
            case '2':
                let clientIdToUpdate;
                while (true) {
                    clientIdToUpdate = readline.questionInt('ID du client a modifier : ');

                    if (await clientIdExists(clientIdToUpdate)) {
                        break; 
                    } else {
                        console.log(`Client avec l'ID : ${clientIdToUpdate} n'existe pas. Veuillez essayer un autre ID.`);
                    }
                }
                const newName = readline.question('Nom : ');
                const newAddress = readline.question('Adresse : ');
                const newEmail = readline.question('Email : ');
                const newPhone = readline.question('Telephone : ');
                await updateClient(clientIdToUpdate, { name: newName, address: newAddress, email:newEmail, phone: newPhone });
                break;
            case '3':
                let clientIdToDelete;
                while (true) {
                    clientIdToDelete = readline.questionInt('ID du client a supprimer : ');
                    if (await clientIdExists(clientIdToDelete)) {
                        await deleteClient(clientIdToDelete);
                        break; 
                    } else {
                        console.log(`Client avec l'ID : ${clientIdToDelete} n'existe pas. Veuillez essayer un autre ID.`);
                    }
                }
                break; 
            case '4':
                const clients = await listClients();
                console.table(clients);
                break;
            case '5':
                return main();
            case '6':
                console.log('Au revoir!');
                process.exit(0);
            default:
                console.log('Choix invalide.');
        }
    }
}
async function produits() {
    while (true) {
        console.log(`
            1. Ajouter un nouveau produit
            2. Mettre à jour les information d'un produit
            3. Supprimer un produit
            4. Liste tous les produits.
            5. Retour
            6. Quitter
          `);
        const choice = readline.question('Choisissez une option: ');
        switch (choice) {
            case '1':
                const name = readline.question('Nom : ');
                const description = readline.question('Description : ');
                const stock = readline.question('Stock : ');
                const price = readline.question('Price : ');
                const category = readline.question('Category : ');
                const barcode = readline.question('Barcode : ');
                const status = readline.question('Status : ');
                await createProduct({ name, description, stock, price, category, barcode, status });
                break;
            case '2':
                let productIdToUpdate;
                while (true) {
                    productIdToUpdate = readline.questionInt('ID du produit a modifier : ');

                    if (await productIdExists(productIdToUpdate)) {
                        break; 
                    } else {
                        console.log(`Produit avec l'ID : ${productIdToUpdate} n'existe pas. Veuillez essayer un autre ID.`);
                    }
                }
                const newName = readline.question('Nom : ');
                const newDescription = readline.question('Description : ');
                const newStock = readline.question('Stock : ');
                const newPrice = readline.question('Prix : ');
                const newCategory = readline.question('Category : ');
                const newBarcode = readline.question('Barcode : ');
                const newStatus = readline.question('Status : ');
                await updateProduct(productIdToUpdate, { name: newName, description: newDescription, stock:newStock, price: newPrice, category: newCategory, barcode: newBarcode, status: newStatus });
                break;
            case '3':
                let productIdToDelete;
                while (true) {
                    productIdToDelete = readline.questionInt('ID du produit a supprimer : ');
                    if (await productIdExists(productIdToDelete)) {
                        await deleteProduct(productIdToDelete);
                        break; 
                    } else {
                        console.log(`Produit avec l'ID : ${productIdToDelete} n'existe pas. Veuillez essayer un autre ID.`);
                    }
                }
                break; 
            case '4':
                const products = await listProducts();
                console.table(products);
                break;
            case '5':
                return main();
            case '6':
                console.log('Au revoir!');
                process.exit(0);
            default:
                console.log('Choix invalide.');
        }
    }
}

async function comandeDetails() {
    while (true) {
        console.log(`
            1. Ajouter un nouveau comande avec ses details
            2. Mettre à jour les information d'un produit
            3. Supprimer un produit
            4. Liste tous les produits.
            5. Retour
            6. Quitter
          `);
        const choice = readline.question('Choisissez une option: ');
        switch (choice) {
            case '1':
            const date = readline.question('Date de la commande (YYYY-MM-DD) : ');
            const deliveryAddress = readline.question('Adresse de livraison : ');
            let customerId;
                while (true) {
                    customerId = readline.questionInt('ID du client : ');

                    if (await clientIdExists(customerId)) {
                        break; 
                    } else {
                        console.log(`Client avec l'ID : ${customerId} n'existe pas. Veuillez essayer un autre ID.`);
                    }
                }
            const trackNumber = readline.question('Numero de suivi : ');
            const status = readline.question('Statut de la commande : ');

            const order = {
                date,
                deliveryAddress,
                customerId,
                trackNumber,
                status
            };

            const details = [];
                const quantity = readline.questionInt('Quantite du produit : ');
                const price = parseFloat(readline.question('Prix du produit : '));
                let productId;
                while (true) {
                    productId = readline.questionInt('ID du produit : ');

                    if (await productIdExists(productId)) {
                        break; 
                    } else {
                        console.log(`Produit avec l'ID : ${productId} n'existe pas. Veuillez essayer un autre ID.`);
                    }
                }
                details.push({ quantity, price, productId });

            await createPurchaseOrderWithDetails(order, details);
            break;

            // case '2':
            //     let productIdToUpdate;
            //     while (true) {
            //         productIdToUpdate = readline.questionInt('ID du produit a modifier : ');

            //         if (await productIdExists(productIdToUpdate)) {
            //             break; 
            //         } else {
            //             console.log(`Produit avec l'ID : ${productIdToUpdate} n'existe pas. Veuillez essayer un autre ID.`);
            //         }
            //     }
            //     const newName = readline.question('Nom : ');
            //     const newDescription = readline.question('Description : ');
            //     const newStock = readline.question('Stock : ');
            //     const newPrice = readline.question('Prix : ');
            //     const newCategory = readline.question('Category : ');
            //     const newBarcode = readline.question('Barcode : ');
            //     const newStatus = readline.question('Status : ');
            //     await updateProduct(productIdToUpdate, { name: newName, description: newDescription, stock:newStock, price: newPrice, category: newCategory, barcode: newBarcode, status: newStatus });
            //     break;
            // case '3':
            //     let productIdToDelete;
            //     while (true) {
            //         productIdToDelete = readline.questionInt('ID du produit a supprimer : ');
            //         if (await productIdExists(productIdToDelete)) {
            //             await deleteProduct(productIdToDelete);
            //             break; 
            //         } else {
            //             console.log(`Produit avec l'ID : ${productIdToDelete} n'existe pas. Veuillez essayer un autre ID.`);
            //         }
            //     }
            //     break; 
            // case '4':
            //     const products = await listProducts();
            //     console.table(products);
            //     break;
            case '5':
                return main();
            case '6':
                console.log('Au revoir!');
                process.exit(0);
            default:
                console.log('Choix invalide.');
        }
    }
}
main().catch(err => console.error('Erreur initiale:', err));
