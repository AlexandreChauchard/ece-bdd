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

Nous cherchons ici les déclarations qui pourraient briser la contrainte de la clé étrangère.

`Insert Into R` :

- Insérer un nouveau tuple dans la table `R` avec un valeur dans la colonne `B` qui n'existe pas dans la table `S`.
Soumis à la programmation de la contrainte de la clé étrangère de la DBMS.

`Update` :

- Modifier un tuple dans la table `R` avec un valeur dans la colonne `B` qui n'existe pas dans la table `S`.
Soumis à la programmation de la contrainte de la clé étrangère de la DBMS.

`Delete` : 

- Supprimer un tuple dans la table `S` qui est référencé pas un ou plusieurs tuples dans la table `R`.
L'effet dépend de la stratégie d'intégrité référentielle choisie.

`Alter Table` : 

- Altérer la talbe `R` en modifiant ou supprimant la contrainte de clé étrangère.

Si nous n'avons pas de contrainte de clé étrangère de base on peut les émuler de la manière suivante :

`Set Null policy` : 

On peut utiliser une combinaison d'une contrainte `unique` sur la colonne référencée et un trigger pour mettre la colonne de la clé étrangère à `null` quand un tuple référencé est supprimé ou modifé.

``` SQL
CREATE TABLE S (
    B INT PRIMARY KEY,
    C INT
);

CREATE TABLE R (
    A INT,
    B INT,
    CONSTRAINT fk_s FOREIGN KEY (B) REFERENCES S(B)
);

DELIMITER //
CREATE TRIGGER set_null_fk
BEFORE DELETE ON S
FOR EACH ROW
BEGIN
    UPDATE R SET B = NULL WHERE B = OLD.B;
END;
//
DELIMITER ;
```

`Cascade policy` :

Ici, on peut utiliser un trigger qui supprime le tuple dans la table qui référence quand un tuple référencé est supprimé.

```SQL
CREATE TABLE S (
    B INT PRIMARY KEY,
    C INT
);

CREATE TABLE R (
    A INT,
    B INT,
    FOREIGN KEY (B) REFERENCES S(B)
);

DELIMITER //
CREATE TRIGGER cascade_fk
BEFORE DELETE ON S
FOR EACH ROW
BEGIN
    DELETE FROM R WHERE B = OLD.B;
END;
//
DELIMITER ;
```

`Reject Default policy` :

On peut encore une fois utiliser la combinaison de contrainte `unique` sur la colonne référencée, et d'un trigger pour empêcher la deletion ou la modification d'un tuple référencé.

```sql
CREATE TABLE S (
    B INT PRIMARY KEY,
    C INT
);

CREATE TABLE R (
    A INT,
    B INT,
    CONSTRAINT fk_s FOREIGN KEY (B) REFERENCES S(B)
);

DELIMITER //
CREATE TRIGGER reject_fk
BEFORE DELETE ON S
FOR EACH ROW
BEGIN
    SET MESSAGE_TEXT = 'Referenced row cannot be deleted or updated due to foreign key constraint.';
END;
//
DELIMITER ;
```

## Exercice 3 : 

Nous devons modifier le script du `lab_2` pour ajouter des contraintes.

#### Le salaire d'un employer doit être positif.

Ici on inclut une contrainte `CHECK` comme ceci : 

Avant :

``` SQL
SAL decimal(6 , 2) not null
```

Après :

```SQL
SAL decimal(6 , 2) not null CHECK (SAL > 0)
```

Ceci fera en sorte que le salaire soit positif.

#### La date d'embauche d'un employé ne peut pas être dans le futur.

Ici aussi, on inclut un contrainte `CHECK` comme ceci :

Avant :

``` SQL
HIRED date not null
```

Après :

``` SQL
HIRED date not null CHECK (HIRED <= CURDATE())
```

#### Faire en sorte que le nom d'un employé soit en majuscule et non vide.

Il faut d'abord utiliser un trigger pour rendre le nom en majuscule en utilisant `Before Insert` comme ceci :

```SQL
DELIMITER //
CREATE TRIGGER uppercase_name
BEFORE INSERT ON EMP
FOR EACH ROW
BEGIN
    SET NEW.ENAME = UPPER(NEW.ENAME);
END;
//
DELIMITER ;
```

On utilise ensuite une contrainte `CHECK` pour vérifier que la chaine de caractère n'est pas vide.

``` SQL
 ENAME varchar(20) not null CHECK (ENAME <> '')
```

Les contraintes sont vérifié au moment des opérations de changement de données, commet `Insert`, `Delete` ou `Update`.

Les contraintes fonctionnent (il y a cependant un problème en fonction de la version de phpMyAdmin). 

## Exercice 4 : 

Ajout de nouvelles contraintes : 

#### Un employé doit gagner moins de 7500$ sauf si c'est le président.

Voici ce que l'on fait :

Avant :

``` SQL
SAL decimal(6 , 2) not null CHECK (SAL > 0)
```

Après : 

``` SQL
 SAL     decimal(6 , 2) not null CHECK (
        SAL > 0 AND
        ((SAL <= 7500.00 AND JOB <> 'PRESIDENT') OR JOB = 'PRESIDENT')
    ),
```

#### Le salaire moyen par département ne doit pas dépasser 5000$.

On peut utiliser un trigger pour faire ceci :

``` Sql
DELIMITER //
CREATE TRIGGER check_avg_salary
BEFORE INSERT ON EMP
FOR EACH ROW
BEGIN
    DECLARE dept_avg_salary DECIMAL(6, 2);

    SELECT AVG(SAL) INTO dept_avg_salary
    FROM EMP
    WHERE DID = NEW.DID;

    IF dept_avg_salary > 5000.00 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Average salary for the department cannot exceed $5,000.';
    END IF;
END;
//
DELIMITER ;
```

## Exercice 5 : 

On reprend la contrainte de l'exercice `3.a` et on utilise un trigger :

``` sql
DELIMITER //
CREATE TRIGGER positive_salary
BEFORE INSERT ON EMP
FOR EACH ROW
BEGIN
    IF NEW.SAl < 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Negative salary';
    END IF;
END;
//
DELIMITER ;
```

## Exercice 6 : 

Ici on peut utiliser le trigger créer pour l'exercice `3.c` : 

``` sql
DELIMITER //
CREATE TRIGGER uppercase_name
BEFORE INSERT ON EMP
FOR EACH ROW
BEGIN
    SET NEW.ENAME = UPPER(NEW.ENAME);
END;
//
DELIMITER ;
```

## Exercice 7 : 
