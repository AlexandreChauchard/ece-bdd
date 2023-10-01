# LAB 3

## Exercice 1 : 

Dans le cas de notre table, `A` est la clé primaire. Par conséquent, la valeur dans cette colonne doit être unique et non nulle. Pour outrepasser la contrainte de clé primaire il faudrait faire une action qui duplique une valeur de la colonne `A` ou qui la rendrait nulle.

Voici les requête qui pourrait outrepasser les contraintes de la clé primaire :

`Insert` :

- Insérer un tuple avec une valeur `A` déà existante.
- Insérer un tuple avec une valeur `A` nulle.

`Update` :

- Modifier la valeur `A` d'un tuple avec une valeur déjà existante.
- Modifier la valeur `A` d'un tuple avec une valleur nulle.

`Merge` :

- Utiliser la commande pour fusionner deux tables avec des valeurs `A` dupliquées ou nulles.

`Insert Into ... Select` : 

- Séléctionner et insérer une valeur `A` dupliquée ou nulle.

`Alter Table` :

- Modifier la structure de la table pour accepter les valeurs nulles.

Pour émuler la contrainte de clé primaire avec d'autres moyens on peut utiliser les suivants :

`Unique Constraint` :

En utilisante la commande `UNIQUE` on peut s'assurer qu'il n'y ait pas de double. 

``` SQL
CREATE TABLE R (
    A INT,
    B INT,
    UNIQUE (A)
);
``` 

`Trigger for null value` :

On peut aussi utiliser un trigger pour empêcher l'insertion d'un tuple avec une valeur `A` nulle.

```SQL  
DELIMITER //
CREATE TRIGGER check_null_A
BEFORE INSERT ON R
FOR EACH ROW
BEGIN
    IF NEW.A IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Column A cannot be NULL';
    END IF;
END;
//
DELIMITER ;
 ```

## Exercice 2 : 



## Exercice 3 : 
## Exercice 4 : 
## Exercice 5 : 
## Exercice 6 : 
## Exercice 7 : 
