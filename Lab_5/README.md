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

Le but ici est de montrer que les modifications apportée ne sont visible que depuis la transaction actuelle.

Pour faire l'insertion, on ouvre 2 pages de connexion sur `MySQLWorkbench` avec les codes suivants : 

``` sql
set autocommit = 0;
use Lab3;
start transaction;

insert into DEPT values(110,'test','test');

Select * from DEPT;
```

Et

```sql
set autocommit = 0;
use Lab3;
Select * from DEPT;
```

On peut voir lorsque l'on utilise la première fenêtre apparaître la ligne `110` tandis qu'on ne la vois pas sur la deuxième fenêtre.

On fait ensuite la même chose pour la suppression : 

``` sql
set autocommit = 0;
use Lab3;
start transaction;

delete from DEPT where DID > 90;

Select * from DEPT;
```

``` sql
set autocommit = 0;
use Lab3;
Select * from DEPT;
```

On ne voit plus aucun département avec un `ID` > 90 dans la première fenêtre tandis que dans la seconde on peut toujours en voir.

# Partie 4 - Niveau d'isolation

En premier lieu on change le niveau d'isolation avec la ligne suivante :

``` sql
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
```

Puis on réutilise le code d'insertion de la question précédente et on se rend compte que maintenant la deuxième connexion peut voir le nouvel élément ajouté. Ceci car on a fait en sorte qu'il puisse y avoir une lecture de notre transction même si il n'y a pas eu de commit.

Cependant, la deuxième fenêtre ne voit pas la délétion. Cela confirme bien que la permession permet uniquement la lecture de nouvelle insertion.

## Partie 5 - Niveau d'isolation suite

On passe maintenant le niveau d'isolation en "serializable" via la commande suivante :

``` sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

Après des tests on voit que on ne peut plus rien observer sur la deuxième transaction. Le rôle de ce niveau d'isolation est de protéger au maximum les informations.