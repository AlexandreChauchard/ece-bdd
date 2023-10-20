# Lab 6

## Auteur

Alexandre Chauchard

## Partie 1 - Modélisation orientée document avec JSON

###  1.1 - Réaliser le MCD en UML de ce problème.

Le MCD, Modèle conceptuel de données en UML est composé de 3 classes que voici :

```
+------------------+     +-------------------+
|     Étudiant     |     |       Cours       |
+------------------+     +-------------------+
| -nom: String     |     | -code: String     |
| -prénom: String  |     | -titre: String    |
| -adresse: Adresse|     | -description: Text|
|                  |     | -crédits: Int     |
+------------------+     | -prérequis: Cours*|
                         +-------------------+

+------------------+
|    Adresse       |
+------------------+
| -numRue: Int     |
| -rue: String     |
| -ville: String   |
| -codePostal: Int |
+------------------+
```

Pour les cardinalités :

 `1` cours peut avoir `n` étudiant.\
 `1` étudiant peut avoir `n` cours.

Il y a une relation many-to-many entre les étudiants et les cours.

 `1` étudiant peut avoir `1` adresse.\
 `1` adresse peut avoir `n` étudiant (frère/soeurs)

 ###  1.2 - Proposer un exemple de JSON équivalent à ce que l'on aurait fait en relationnel normalisé

 Voici l'exemple d'un json étudiant :

 ```json
 {
  "etudiants": [
    {
      "nom": "Chauchard",
      "prénom": "Alexnadre",
      "adresse": {
        "numRue": 16,
        "rue": "Avenue Lamartine",
        "ville": "La Celle-Saint-Cloud",
        "codePostal": 78170
      },
      "coursSuivis": ["abdd102", "webtech101"]
    },
    {
      "nom": "Durand",
      "prénom": "Marie",
      "adresse": {
        "numRue": 456,
        "rue": "Avenue des Étudiants",
        "ville": "Lyon",
        "codePostal": 69000
      },
      "coursSuivis": ["cs101"]
    }
  ]
}
 ```

Et voici un exemple de cours :

``` json
{
  "cours": [
    {
      "code": "abdd102",
      "titre": "DW et NOSQL",
      "description": "Cours sur la gestion de données et les bases de données NoSQL.",
      "crédits": 3,
      "prérequis": []
    },
    {
      "code": "math101",
      "titre": "Mathématiques avancées",
      "description": "Cours avancé de mathématiques.",
      "crédits": 4,
      "prérequis": []
    },
    {
      "code": "cs101",
      "titre": "Introduction à l'informatique",
      "description": "Cours d'introduction à l'informatique.",
      "crédits": 3,
      "prérequis": []
    }
  ]
}
```

Finalement voici un exemple d'adresse :

``` json
{
  "adresses": [
    {
      "numRue": 16,
      "rue": "Avenue Lamartine",
      "ville": "La Celle-Saint-Cloud",
      "codePostal": 78170
    },
    {
      "numRue": 456,
      "rue": "Avenue des Étudiants",
      "ville": "Lyon",
      "codePostal": 69000
    }
  ]
}
```

###  1.3 - Proposer un exemple JSON basé sur l'imbrication, quel en est le principal défaut, est-il toujours possible d'avoir une solution ne reposant que sur l'imbrication ?

Voici l'exemple de json :

```json
 {
  "etudiants": [
    {
      "nom": "Chauchard",
      "prénom": "Alexnadre",
      "adresse": {
        "numRue": 16,   
        "rue": "Avenue Lamartine",
        "ville": "La Celle-Saint-Cloud",
        "codePostal": 78170
      },
      "coursSuivis": [
        {
          "code": "abdd102",
          "titre": "DW et NOSQL",
          "description": "Cours sur la gestion de données et les bases de données NoSQL.",
          "crédits": 3,
          "prérequis": []
        },
        {
          "code": "math101",
          "titre": "Mathématiques avancées",
          "description": "Cours avancé de mathématiques.",
          "crédits": 4,
          "prérequis": []
        }
      ]
    },
    {
      "nom": "Durand",
      "prénom": "Marie",
      "adresse": {
        "numRue": 456,
        "rue": "Avenue des Étudiants",
        "ville": "Lyon",
        "codePostal": 69000
      },
      "coursSuivis": [
        {
          "code": "cs101",
          "titre": "Introduction à l'informatique",
          "description": "Cours d'introduction à l'informatique.",
          "crédits": 3,
          "prérequis": []
        }
      ]
    }
  ]
}
```

Pour les principaux problèmes, les voicis :

La redondance de données, les informations concernant les cours sont répétées pour chaque élève participant à ces cours ce qui ajoute beacoup de redondance. Cela augmente beaucoup la taille du JSON et augmente le risque d'erreur en cas de modification d'un cours sans modifier tout les étudiants qui le suivent.

Difficultés à gerer les mises à jour, comme dit précédemment, si on doit mettre à jour les informations d'un cours, on doit le faire pour chaque occurence de ce cours dans le JSON. Cela augmente le risque d'erreurs

Dernièrement, le manque de normalisation, cette approche ne suit pas les principes de normalisation des bases de données, ce qui peut rendre la gestion de données plus complexe à mesure que le volume augmente.

Une approche exclusive basée sur l'imbrication peut causer des problèmes de performance et de maintenance à mesure que le système évolue. Il est généralement recommandé d'adopter une approche hybride en combinant l'imbrication avec des identifiants uniques (clés étrangères) pour assurer une meilleure normalisation et une gestion efficace des mises à jour. Cependant il est possible d'utiliser uniquement l'imbrication.

### 1.4 Proposer un JSON basé sur les références, quelles sont les principales différences avec le système relationnel ?

Voici le JSON étudiant :

``` json
{
  "etudiants": [
    {
      "nom": "Alexandre",
      "prénom": "Chauchard",
      "adresse": 1,
      "coursSuivis": [1, 2]
    },
    {
      "nom": "Durand",
      "prénom": "Marie",
      "adresse": 2,
      "coursSuivis": [3]
    }
  ]
}
```

Voici le JSON cours :

``` json
{
  "cours": [
    {
      "code": "abdd102",
      "titre": "DW et NOSQL",
      "description": "Cours sur la gestion de données et les bases de données NoSQL.",
      "crédits": 3,
      "prérequis": []
    },
    {
      "code": "math101",
      "titre": "Mathématiques avancées",
      "description": "Cours avancé de mathématiques.",
      "crédits": 4,
      "prérequis": []
    },
    {
      "code": "cs101",
      "titre": "Introduction à l'informatique",
      "description": "Cours d'introduction à l'informatique.",
      "crédits": 3,
      "prérequis": []
    }
  ]
}
```

Voici le JSON des adresses :

``` json
{
  "adresses": [
    {
      "numRue": 16,
      "rue": "Avenue Lamartine",
      "ville": "La Celle-Saint-Cloud",
      "codePostal": 78170
    },
    {
      "numRue": 456,
      "rue": "Avenue des Étudiants",
      "ville": "Lyon",
      "codePostal": 69000
    }
  ]
}
```

Dans cet exemple, des identifiants uniques (nombres) sont utilisés pour référencer des objets dans d'autres parties du JSON. Les étudiants font référence aux adresses et aux cours par le biais de ces identifiants.

Principales différences par rapport à un système relationnel :

Structure : Les systèmes relationnels utilisent des tables et des clés étrangères pour structurer les données, tandis que le JSON basé sur les références utilise des identifiants pour lier les objets, offrant ainsi une structure plus souple.

Normalisation : Les bases de données relationnelles privilégient la normalisation pour éviter la duplication des données, tandis que le JSON avec références peut inclure des redondances, car les données sont stockées avec leurs références.

Requêtes : Les bases de données relationnelles proposent des capacités avancées de requêtage pour des opérations complexes, tandis que l'accès aux données dans un modèle JSON basé sur les références peut nécessiter davantage de travail de programmation pour obtenir les mêmes résultats.

Performance : Les systèmes relationnels sont optimisés pour des requêtes complexes et la gestion de grandes quantités de données, tandis que le modèle JSON basé sur les références peut être plus simple mais moins performant pour certaines opérations.

En résumé, le choix entre un système relationnel et un modèle JSON basé sur les références dépend des besoins spécifiques de l'application, de la structure des données et des performances requises, chacun ayant ses avantages et inconvénients.

### 1.5 - Proposer une solution adaptée à ce problème mobilisant référence et imbrication

Voici le json final :

``` json
{
  "etudiants": [
    {
      "nom": "Alexandre",
      "prénom": "Chauchard",
      "adresse": {
        "numRue": 16,
        "rue": "Avenue Lamartine",
        "ville": "La Celle-Saint-Cloud",
        "codePostal": 78170
      },
      "coursSuivis": [
        {
          "code": "abdd102",
          "titre": "DW et NOSQL"
        },
        {
          "code": "math101",
          "titre": "Mathématiques avancées"
        }
      ]
    },
    {
      "nom": "Durand",
      "prénom": "Marie",
      "adresse": {
        "numRue": 456,
        "rue": "Avenue des Étudiants",
        "ville": "Lyon",
        "codePostal": 69000
      },
      "coursSuivis": [
        {
          "code": "cs101",
          "titre": "Introduction à l'informatique"
        }
      ]
    }
  ],
  
  "cours": [
    {
      "code": "abdd102",
      "titre": "DW et NOSQL",
      "description": "Cours sur la gestion de données et les bases de données NoSQL.",
      "crédits": 3,
      "prérequis": []
    },
    {
      "code": "math101",
      "titre": "Mathématiques avancées",
      "description": "Cours avancé de mathématiques.",
      "crédits": 4,
      "prérequis": []
    },
    {
      "code": "cs101",
      "titre": "Introduction à l'informatique",
      "description": "Cours d'introduction à l'informatique.",
      "crédits": 3,
      "prérequis": []
    }
  ]
}
```

Dans cette structure de données :

Les étudiants sont imbriqués avec des informations de base, y compris les cours qu'ils suivent. Cependant, les détails complets des cours ne sont pas inclus ici.

Les cours sont stockés séparément avec leurs détails complets.

Lorsque vous affichez la liste des étudiants, vous pouvez inclure les codes et les titres des cours qu'ils suivent, mais pas les détails complets des cours. Lorsque vous cliquez sur un code ou un titre de cours, vous pouvez alors faire référence aux données de cours stockées séparément pour obtenir les détails complets.

Cette approche combine l'imbrication pour une visualisation initiale simple des données des étudiants avec les cours qu'ils suivent, tout en utilisant des références pour accéder aux détails des cours de manière efficace uniquement lorsque cela est nécessaire.

## Partie 2 - SQL vs NoSQL

### 2.1 Quelle base de donnée utiliser, relationnel ou NoSQL ?

Le choix entre une base de données relationnelle (SQL) et une base de données NoSQL pour un site de commerce électronique avec des dizaines de millions d'utilisateurs dépend de plusieurs facteurs.

Utilisez une base de données relationnelle si vos données sont structurées, si l'intégrité et la cohérence des données sont essentielles, si vous avez besoin de prendre en charge des requêtes complexes, et si votre application gère des transactions complexes. Cependant, les bases de données relationnelles peuvent avoir des limitations en termes de montée en charge.

Optez pour une base de données NoSQL si vos données sont non structurées ou semi-structurées, si vous avez besoin de l'évolutivité horizontale pour gérer une charge importante, si la flexibilité du schéma est importante, si votre application nécessite des mises à jour en temps réel, et si vous prévoyez de gérer un volume massif de données.

Dans certains cas, une approche hybride combinant des bases de données SQL et NoSQL peut être la solution la plus adaptée pour répondre à différents besoins au sein de votre application. Il est recommandé de consulter un expert en bases de données pour prendre une décision éclairée en fonction de vos besoins spécifiques.

### 2.2 Proposez une représentation de ces informations sous forme de document structuré 

En privilégiant l'accès par utilisateur :

``` json
{
  "utilisateurs": [
    {
      "id": 1,
      "email": "s@cname.fr",
      "nom": "Serge",
      "visites": [
        {
          "page": "http://cnam.fr/A",
          "nbVisite": 2
        },
        {
          "page": "http://cnam.fr/B",
          "nbVisite": 1
        }
      ]
    },
    {
      "id": 2,
      "email": "b@cnam.fr",
      "nom": "Benoit",
      "visites": [
        {
          "page": "http://cnam.fr/A",
          "nbVisite": 1
        }
      ]
    }
  ]
}
```

Dans cette structure les utilisateurs sont les objets principaux et chaque utilisateur contient des informations sur ses visites, y compris les pages visitées et le nombre de visites.

En privilégiant l'accès par les pages visitées :

``` JSON
{
  "pages": [
    {
      "url": "http://cnam.fr/A",
      "visites": [
        {
          "idUtil": 1,
          "nbVisite": 2
        },
        {
          "idUtil": 2,
          "nbVisite": 1
        }
      ]
    },
    {
      "url": "http://cnam.fr/B",
      "visites": [
        {
          "idUtil": 1,
          "nbVisite": 1
        }
      ]
    }
  ],
  "utilisateurs": [
    {
      "id": 1,
      "email": "s@cname.fr",
      "nom": "Serge"
    },
    {
      "id": 2,
      "email": "b@cnam.fr",
      "nom": "Benoit"
    }
  ]
}
```

Dans cette structure, les pages visitées sont des objets principaux, et chaque page contient des informations sur les utilisateurs qui les ont visitées et le nombre de visites.

###  2.3 Sachant que les documents sont produits à l'aide d'une base relationelle, reconstituez le schéma de cette base et indiquez le contenu des tables correspondant aux documents ci-dessus.

Pour reconstituer le schéma de la base de données relationnelle à partir des documents donnés, nous pouvons identifier deux tables principales : une table pour les étudiants et une table pour les Unités d'Enseignement (UE). Les documents représentent les données des étudiants et les UE qu'ils suivent. Voici le schéma de la base de données relationnelle :

Table "Etudiants":

Colonnes :
"_id" (clé primaire)\
"nom"\
Table "UE":

Colonnes :
"id" (clé primaire)\
"titre"\
Table "Inscriptions":

Colonnes :
"idEtudiant" (clé étrangère vers la table "Etudiants")\
"idUE" (clé étrangère vers la table "UE")\
"note"

Voici le contenu des tables correspondantes : 

Tables `Etudiants` :

| _id |     nom       |
|-----|---------------|
| 978 | Jean Dujardin |
| 476 |Vanessa Paradis|

Table `UE` :

|   id   |       titre         |
|--------|---------------------|
| ue:11  |        Java         |
| ue:27  | Bases de données    |
| ue:37  |      Réseaux        |
| ue:13  |    Méthodologie     |
| ue:76  |  Conduite projet    |

Table `Inscription` :

| idEtudiant |  idUE  | note |
|------------|--------|------|
|    978     |  ue:11 |  12  |
|    978     |  ue:27 |  17  |
|    978     |  ue:37 |  14  |
|    476     |  ue:13 |  17  |
|    476     |  ue:27 |  10  |
|    476     |  ue:76 |  11  |

Les documents JSON donnés représentent les données des étudiants, les UE qu'ils suivent et les notes associées. Ces données sont reconstituées dans les tables "Etudiants", "UE" et "Inscriptions" de la base de données relationnelle.
