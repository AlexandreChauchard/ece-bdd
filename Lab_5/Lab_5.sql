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