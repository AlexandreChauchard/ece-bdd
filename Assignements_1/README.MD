# Assignement 1

Ici le but est d'utilliser la database fournie pour remplir des requêtes.

Ne pas oublier la commande sivante pour mettre un mode spécial :

```sql
set session sql_mode = 'ONLY_FULL_GROUP_BY';
```

### Query 1

-- Les pays de résidence où le fournisseur a dû envoyer des produits en 2014

```sql
SELECT DISTINCT residence
FROM   customers
       natural JOIN orders
WHERE  customers.cid = orders.cid
       AND Year(odate) = 2014
       AND residence IS NOT NULL;
```

### Query 2

-- Pour chaque pays d'orgine connu, son nom, le nombre de produits de ce pays, leur plus bas prix, leur plus haut prix

```sql
SELECT origin     AS NomPays,
       Min(price) AS BasPrix,
       Max(price) AS HautPrix,
       Count(*)   AS NombreProduit
FROM   products
GROUP  BY origin;
```

### Query 3

-- Par client et par produit, le nom du client, le nom du produit, le montant total (prix total) de ce produit commandé par le client, trié par nom de client (ordre alphabétique), puis par montant total commandé (plus grance valeur d'abord), puis par id de produit (croissant)

```sql
SELECT c.cname              AS NomClient,
       p.pname              AS NomProduit,
       o.quantity * p.price AS PrixTotal
FROM   customers c
       natural JOIN orders o
       natural JOIN products p
WHERE  c.cid = o.cid
       AND o.pid = p.pid
ORDER  BY nomclient ASC,
          prixtotal DESC,
          p.pid ASC;
```

### Query 4

-- Les clients n'ayant commandé que des produits provenant de leur pays

```sql
SELECT DISTINCT C.cname AS NomClient
FROM   customers C
       natural JOIN orders O
WHERE  C.cid NOT IN(SELECT DISTINCT C1.cid
                    FROM   customers C1
                           natural JOIN orders O1
                           natural JOIN products P
                    WHERE  P.origin <> C1.residence)
       AND C.residence IS NOT NULL
       AND O.cid IS NOT NULL;
```

### Query 5

-- Les clients n'ayant commandé que des produits provenant de pays étrangers

```sql
SELECT C.cname AS NomClient
FROM   customers C
WHERE  C.cid IN(SELECT DISTINCT C1.cid
                    FROM   customers C1
                           natural JOIN orders O
                           natural JOIN products P
                    WHERE  P.origin <> C1.residence)
       AND C.residence IS NOT NULL;
```

### Query 6

-- La différence entre quantité moyenne par commande des clients résidant aux 'USA' et celle des clients résidant en 'France' (USA - France)

```sql
SELECT 'France'             AS Pays,
       Avg(orders.quantity) AS avgQTE
FROM   orders
       natural JOIN customers
WHERE  customers.residence = 'France'
UNION ALL
SELECT 'USA'                AS Pays,
       Avg(orders.quantity) AS avgQTE
FROM   orders
       natural JOIN customers
WHERE  customers.residence = 'USA';
```

### Query 7

-- Les produits commandés tout au long de 2014, i.e. commandés chaque mois de cette année

```sql
SELECT DISTINCT p.pname
FROM   products p
       natural JOIN orders o
WHERE  Year(o.odate) = 2014
GROUP  BY p.pname
HAVING Count(DISTINCT Month(o.odate)) = 12;
```

### Query 8

-- Les clients ayant commandé tous les produits de moins de $5

```sql
SELECT c.cid,
       c.cname
FROM   customers c
       JOIN orders o
         ON c.cid = o.cid
       JOIN products p
         ON o.pid = p.pid
WHERE  p.price < 5
GROUP  BY c.cid,
          c.cname
HAVING Count(DISTINCT p.pid) = (SELECT Count(*)
                                FROM   products
                                WHERE  price < 5);
```

### Query 9

-- Les clients ayant commandé le grand nombre de produits commums. Afficher 3 colonnes : cname1, cname2, nombre de produits communs, avec cname1 < cname2

```sql
SELECT C1.cname               AS cname1,
       C2.cname               AS cname2,
       Count(DISTINCT O1.pid) AS nombre_de_produits_communs
FROM   customers C1
       JOIN customers C2
         ON C1.cid < C2.cid
       JOIN orders O1
         ON C1.cid = O1.cid
       JOIN orders O2
         ON C2.cid = O2.cid
            AND O1.pid = O2.pid
GROUP  BY cname1,
          cname2
HAVING Count(DISTINCT O1.pid) > 0
ORDER  BY nombre_de_produits_communs DESC;
```

### Query 10

-- Les clients ayant commandé le plus grand nombre (quantité totale) de produits

```sql
SELECT c.cname,
       Sum(o.quantity) AS qteTot
FROM   customers c
       natural JOIN orders o
GROUP  BY c.cname
ORDER  BY qteTot DESC;
```

### Query 11

-- Les produits commandés par tous les clients vivant en 'France'

```sql
SELECT DISTINCT p.pname
FROM   products p
       natural JOIN orders o
       natural JOIN customers c
WHERE  p.pid IN(SELECT DISTINCT o1.pid
                FROM   orders o1
                       natural JOIN products p1
                       natural JOIN customers c1
                WHERE  c1.residence = 'France');
```

### Query 12

-- Les clients résidant dans les mêmes pays que les clients nommés 'Smith' (en excluant les Smith de la liste affichée)

```sql
SELECT cname AS VoisinSmith
FROM   customers
WHERE  residence IN (SELECT residence
                     FROM   customers
                     WHERE  cname = 'Smith')
       AND cname <> 'Smith';
```

### Query 13

-- Les clients ayant commandé pour le plus grand montant total (prix total) sur 2014

```sql
SELECT c.cname                   AS Nom,
       Sum(p.price * o.quantity) AS PrixTotal
FROM   customers c
       JOIN orders o
         ON c.cid = o.cid
       JOIN products p
         ON o.pid = p.pid
WHERE  Year(o.odate) = 2014
GROUP  BY c.cid,
          c.cname
HAVING Sum(p.price * o.quantity) = (SELECT Max(total_amount)
                                    FROM
       (SELECT
              Sum(p2.price * o2.quantity) AS total_amount
                                            FROM   customers c2
                                                   JOIN orders o2
                                                     ON c2.cid = o2.cid
                                                   JOIN products p2
                                                     ON o2.pid = p2.pid
                                            WHERE  Year(o2.odate) = 2014
                                            GROUP  BY c2.cid,
                                                      c2.cname) AS
       max_total_amount
                                   );
```

### Query 14

-- Les produits dont le montant (prix) moyen par commande est le plus élevé

```sql
SELECT p.pname                   AS NomProduit,
       Avg(p.price * o.quantity) AS PrixMoyen
FROM   products p
       JOIN orders o
         ON p.pid = o.pid
GROUP  BY p.pid,
          p.pname
HAVING Avg(p.price * o.quantity) = (SELECT Max(prixmoyen)
                                    FROM   (SELECT
              Avg(p2.price * o2.quantity) AS PrixMoyen
                                            FROM   products p2
                                                   JOIN orders o2
                                                     ON p2.pid = o2.pid
                                            GROUP  BY p2.pid) AS PrixMoyenMax);
```

### Query 15

-- Les produits commandés par les clients résidant aux 'USA'

```sql
SELECT DISTINCT p.pname
FROM   products p
       natural JOIN orders o
       natural JOIN customers c
WHERE  c.residence = "usa";
```

### Query 16

-- Les paires de client ayant commandé le même produit en 2014, et ce produit. Afficher 3 colonnes : cname1, cname2, pname, avec cname1 < cname2

```sql
SELECT DISTINCT C1.cname AS cname1,
                C2.cname AS cname2,
                P.pname
FROM   customers C1
       JOIN orders O1
         ON C1.cid = O1.cid
       JOIN products P
         ON O1.pid = P.pid
       JOIN orders O2
         ON P.pid = O2.pid
       JOIN customers C2
         ON O2.cid = C2.cid
WHERE  Year(O1.odate) = 2014
       AND Year(O2.odate) = 2014
       AND C1.cid < C2.cid
ORDER  BY C1.cname;
```

### Query 17

-- Les produits plus chers que tous les produits d'origine 'India'

```sql
SELECT pname
FROM   products
WHERE  price > (SELECT Max(price)
                FROM   products
                WHERE  origin = 'India');
```

### Query 18

-- Les produits commandés par le plus petit nombre de clients (les produits jamais commandés sont exclus)

```sql
SELECT p.pid,
       p.pname
FROM   products p
       JOIN orders o
         ON p.pid = o.pid
GROUP  BY p.pid,
          p.pname
HAVING Count(DISTINCT o.cid) = (SELECT Min(client_count)
                                FROM   (SELECT Count(DISTINCT o2.cid) AS
                                               client_count
                                        FROM   orders o2
                                        GROUP  BY o2.pid) AS client_counts);
```

### Query 19

-- Pour chaque pays listé dans les tables products ou customers, y compris les pays inconnus : le nom du pays, le nombre de clients résidant dans ce pays, le nombre de produits provenant de ce pays

```sql
SELECT country_name,
       Count(DISTINCT customers.cid) AS num_customers,
       Count(DISTINCT products.pid)  AS num_products
FROM   (SELECT DISTINCT residence AS country_name
        FROM   customers
        WHERE  residence IS NOT NULL
        UNION
        SELECT DISTINCT origin AS country_name
        FROM   products
        WHERE  origin IS NOT NULL) AS all_countries
       LEFT JOIN customers
              ON all_countries.country_name = customers.residence
       LEFT JOIN products
              ON all_countries.country_name = products.origin
GROUP  BY country_name;
```
