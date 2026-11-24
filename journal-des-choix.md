# Journal des choix – IVOIRE CACAO PLUS

## Choix 1 – Cas métier
Le cas A, coopérative de cacao, a été retenu car il permet de traiter le calcul d'un paiement, les refus et la mise à jour d'un stock.

## Choix 2 – Nom de l'entreprise
Le nom fictif « IVOIRE CACAO PLUS » a été choisi pour identifier clairement la coopérative dans la démonstration.

## Choix 3 – Personnalisation des tarifs
Le prix du cacao bonne qualité passe de 1 000 à 1 100 FCFA/kg et celui de la qualité moyenne de 800 à 850 FCFA/kg. Cela distingue les données de départ de celles d'un autre groupe.

## Choix 4 – Personnalisation de la retenue
La retenue est fixée à 4 % au lieu de 5 %. Le calcul utilise `Math.round` afin de respecter l'arrondi à l'entier le plus proche.

## Choix 5 – Règle supplémentaire
Une limite de trois livraisons par producteur et par jour est proposée. Le jour est passé en paramètre de la méthode `payer` pour éviter de dépendre de l'horloge réelle pendant les tests. Cette règle reste soumise à validation de l'enseignant.

## Choix 6 – Séparation des responsabilités
Les types et contrats sont dans `modele/`, les règles dans `metier/`, le stockage concret dans `donnees/` et les notifications dans `interface/`. Cette séparation facilite l'évolution du programme.

## Choix 7 – Injection des dépendances
`ServicePaiement` reçoit le dépôt, le notificateur et le magasin par son constructeur. Le service ne crée pas lui-même le stockage ou le système de notification.

## Choix 8 – Résultat de paiement
Une union discriminée `ResultatPaiement` distingue explicitement les paiements réussis des paiements refusés. Le code appelant doit vérifier `statut` avant d'accéder aux données spécifiques.

## Choix 9 – Protection des refus
Toutes les vérifications sont réalisées avant l'enregistrement. Ainsi, une livraison refusée ne modifie ni le dépôt ni le stock et ne déclenche pas de notification de paiement.

## Choix 10 – Tests et doublures
Les tests utilisent `DepotLivraisonsFactice` pour isoler le stockage et `NotificateurEspion` pour vérifier les notifications sans afficher de messages.

## Choix 11 – Refactorisation sous protection des tests
**Avant :** les calculs du brut, de la retenue et des frais étaient regroupés dans la méthode `payer`, ce qui mélangeait orchestration et calculs.
**Après :** ces calculs sont extraits dans `metier/calculs.ts`. `ServicePaiement` conserve l'ordre des contrôles et l'orchestration. Les tests unitaires vérifient les résultats et les seuils avant toute évolution ultérieure.
**Vérification :** exécuter `npm test` après la refactorisation et vérifier que tous les tests restent au vert.

## 12. Point à confirmer avec l'enseignant
Faire valider la règle supplémentaire et les valeurs personnalisées avant de considérer la fiche de choix comme définitivement approuvée.
