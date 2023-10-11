# LAB 5

## Partie 1 - Commit & Rollback

Ici le but est de tester les fonctions `Rollback` et `Commit`.

Voici le code pour `Rollback` :

``` sql
set autocommit = 0;
use Lab3;
start transaction;

insert into DEPT Values (100,'Test','Paris');

Select * from DEPT;
rollback;
Select * from DEPT;
```

En utilisant ce code on voit que lors du premier `Select` on peut voir notre nouvelle insertion, puis après le `rollback`, cette dernière n'est plus là.

On peut donc conclure que `Rollback` annule les actions effectué précédemment et revient à l'état initial.

Voici le code pour `Commit` :

```sql
set autocommit = 0;
use Lab3;
start transaction;

insert into DEPT Values (100,'Test','Paris');

Select * from DEPT;
commit;
Select * from DEPT;
 ```

En utilisant ce code, on peut voir lors du premier `Select` que notre insertion est bien présente et que grâce à `commit`, cette dernière est validée et on peut alors la voir sur notre instancec `PhpMyAdmin`.

Le rôle de commit est donc de valider la transaction.

## Partie 2 - Client Failure

Si on ajoute une entrée dans la ligne département avant de fermer l'application de manière normale, ce département n'est plus là à la réouverture.

## Partie 3 - Transaction Isolation

Dans un premier temps nous devons déterminer le niveau d'isolation par défaut de notre transaction grâce à la commande suivante :

``` sql
show variables like '%isolation%'
```

On obtient alors le résultat suivant :

``` cli
Variable_Name                   Value 
transaction_isolation           REPEATABLE-READ
tx_isolation                    REPEATABLE-READ
```
