-- Exercice 1 Partie 1
set autocommit = 0;
use Lab3;
start transaction;

insert into DEPT Values (100,'Test','Paris');

Select * from DEPT;
rollback;
Select * from DEPT;
-- Exercice 1 Partie 2
set autocommit = 0;
use Lab3;
start transaction;

insert into DEPT Values (100,'Test','Paris');

Select * from DEPT;
commit;
Select * from DEPT;
-- Exercice 2
set autocommit = 0;
use Lab3;
start transaction;

insert into DEPT Values (110,'Test','Paris');

Select * from DEPT;
-- Exercie 3 Partie 1 fenêtre 1
set autocommit = 0;
use Lab3;
start transaction;

insert into DEPT values(110,'test','test');

Select * from DEPT;
commit;
-- Exercie 3 Partie 1 fenêtre 2
set autocommit = 0;
use Lab3;
Select * from DEPT;
-- Exercice 3 Partie 2 fenêtre 1
set autocommit = 0;
use Lab3;
start transaction;

delete from DEPT where DID > 90;

Select * from DEPT;
commit;
-- Exercie 3 Partie 2 fenêtre 2
set autocommit = 0;
use Lab3;
Select * from DEPT;