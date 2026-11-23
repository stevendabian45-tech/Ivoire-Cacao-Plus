# IVOIRE CACAO PLUS

## 1. Présentation
IVOIRE CACAO PLUS est une coopérative fictive de collecte de cacao. Le programme constitue le noyau métier de l'entreprise : il calcule le paiement des producteurs, applique les retenues et frais Mobile Money, enregistre les livraisons acceptées et met à jour le stock.

Le programme n'est pas un site web et n'utilise aucune base de données.

## 2. Prérequis et commandes
- Node.js installé
- npm installé

```bash
npm install
npm run build
npm start
npm test
```

`npm test` compile le projet puis exécute les tests avec le module natif `node:test`.

## 3. Organisation
- `modele/` : types métier et contrats.
- `metier/` : règles de calcul, magasin et service de paiement.
- `donnees/` : stockage en mémoire utilisé par le programme.
- `interface/` : notification console.
- `doublures/` : dépôt factice, notificateur espion et tests.
- `index.ts` : point unique d'assemblage et démonstration.

## 4. Règles métier retenues
Valeurs personnalisées proposées :
- cacao de bonne qualité : 1 100 FCFA/kg ;
- cacao de qualité moyenne : 850 FCFA/kg ;
- cacao rejeté : 0 FCFA/kg ;
- retenue de cotisation : 4 % ;
- poids minimum : 10 kg.

Règles :
1. Le brut est égal au poids multiplié par le prix de la qualité.
2. Une livraison rejetée n'est pas payée.
3. Une retenue de 4 % du brut est appliquée, arrondie à l'entier le plus proche.
4. Les frais Mobile Money sont calculés sur le net : 250 FCFA jusqu'à 50 000 FCFA ; 500 FCFA jusqu'à 200 000 FCFA ; au-delà, 1 % arrondi. Ils sont supportés par la coopérative.
5. Un producteur inactif ne peut pas être payé.
6. Une livraison de moins de 10 kg est refusée.
7. Règle supplémentaire proposée : un producteur ne peut effectuer plus de trois livraisons par jour.

**Important :** la règle supplémentaire et les valeurs personnalisées doivent être soumises à l'enseignant pour validation avant la remise définitive.

## 5. Décisions de conception
- Les unions littérales limitent les qualités, opérateurs et résultats possibles.
- `ResultatPaiement` est une union discriminée par `statut`.
- `DepotLivraisons` permet de remplacer le stockage sans modifier le métier.
- `Notificateur` isole les notifications de la logique métier.
- Les dépendances sont injectées dans le constructeur de `ServicePaiement`.
- `Magasin` protège son stock avec un attribut `private`.
- Les refus sont traités avant tout enregistrement : ils ne modifient ni le dépôt ni le stock.

## 6. Tests
Le projet comporte plus de 12 tests : calcul du brut, retenue, frais aux seuils, qualité rejetée, producteur inactif, poids minimum, règle journalière, stock, dépôt et notifications. Les tests utilisent un dépôt factice et un notificateur espion.

## 7. Limites
Le stockage est en mémoire : les données disparaissent à la fermeture du programme. Le jour de livraison est fourni comme paramètre afin de rendre les règles temporelles déterministes. Les valeurs de départ sont fictives et propres à cet exercice.
