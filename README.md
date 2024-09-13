# Online Sale App 

Ce projet est une evolution d'une base de données existante et mise en place des composants d’accès aux données pour permettre les actions CRUD en mode console avec Node.js

### Prérequis

- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [MySQL](https://www.mysql.com/) (version 5.7 ou supérieure)

## Installation

Suivez ces étapes pour configurer le projet sur votre machine locale :

1. **Clonez le repository :**

    ```bash
    git clone https://github.com/Ousmanly/online_sale.git
    ```

2. **Accédez au dossier du projet :**

     ```bash
        cd online_sale
    ```

3. **Installez les dépendances :**

    ```bash
      npm install
    ```
4. **Configurer la base de données**

  - Assurez-vous que Mysql est en cours d'exécution sur votre machine locale.
  - Mettez les paramètres de connexion dans `db.js`.
 

## Utilisation

Pour démarrer l'application, exécutez la commande suivante :

```bash
  node .\src\app.js 
```

## Les modules et Fonctionnalités

- **orderModule**
  - Créer, lire, mettre à jour et supprimer des commandes avec ses details.

- **customerModule**
  - Créer, lire, mettre à jour et supprimer des clients.

- **paymentModule**
  - Créer, lire, mettre à jour et supprimer des payements.

- **productModule**
  - Créer, lire, mettre à jour et supprimer des produits.

## Author
- **GitHub** : [Ousmane Ly](https://github.com/Ousmanly)
- **LinkedIn** : [Ousmane Ly](www.linkedin.com/in/ousmane-ibrahima-ly-a270a4290)