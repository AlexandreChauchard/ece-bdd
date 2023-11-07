//
// Database: company.js
//
// Write the MongoDB queries that return the information below. Find as many solutions as possible for each query.
//

print("Query 01");
// the highest salary of clerks
db.employees.aggregate([
  { $match: { job: "clerk" } }, // Filtrer les employés dont le poste est "clerk"
  { $group: { _id: null, maxSalary: { $max: "$salary" } } }, // Trouver le salaire maximum
]);

print("Query 02");
// the total salary of managers
db.employees.aggregate([
  { $match: { job: "manager" } }, // Filtrer les employés dont le poste est "manager"
  { $group: { _id: null, totalSalary: { $sum: "$salary" } } }, // Calculer le salaire total
]);

print("Query 03");
// the lowest, average and highest salary of the employees
db.employees.aggregate([
  {
    $group: {
      _id: null,
      lowestSalary: { $min: "$salary" }, // Salaire le plus bas
      averageSalary: { $avg: "$salary" }, // Salaire moyen
      highestSalary: { $max: "$salary" }, // Salaire le plus élevé
    },
  },
]);

print("Query 04");
// the name of the departments
var departmentNamesAggregate = db.employees.aggregate([
  {
    $group: {
      _id: "$department.name" // Regrouper par nom de département
    }
  },
  {
    $project: {
      _id: 0, // Exclure le champ "_id"
      departmentName: "$_id" // Renommer le champ "_id" en "departmentName"
    }
  }
]);
departmentNamesAggregate.forEach(printjson);


print("Query 05");
// for each job: the job and the average salary for that job
db.employees.aggregate([
  {
    $group: {
      _id: "$job", // Regrouper par poste
      averageSalary: { $avg: "$salary" }, // Calculer le salaire moyen pour chaque poste
    },
  },
]);

print("Query 06");
// for each department: its name, the number of employees and the average salary in that department (null departments excluded)
db.employees.aggregate([
  {
    $match: {
      "department.name": { $ne: null }, // Exclure les départements "null"
    },
  },
  {
    $group: {
      _id: "$department.name", // Regrouper par le nom du département
      departmentName: { $first: "$department.name" }, // Obtenir le nom du département
      employeeCount: { $sum: 1 }, // Compter le nombre d'employés dans le département
      averageSalary: { $avg: "$salary" }, // Calculer le salaire moyen
    },
  },
]);

print("Query 07");
// the highest of the per-department average salary (null departments excluded)
db.employees.aggregate([
  {
    $match: {
      "department.name": { $ne: null }, // Exclure les départements "null"
    },
  },
  {
    $group: {
      _id: "$department.name", // Regrouper par le nom du département
      averageSalary: { $avg: "$salary" }, // Calculer le salaire moyen par département
    },
  },
  {
    $sort: {
      averageSalary: -1, // Trier par ordre décroissant de salaire moyen
    },
  },
  {
    $limit: 1, // Limiter les résultats à un seul département avec le salaire moyen le plus élevé
  },
]);

print("Query 08");
// the name of the departments with at least 5 employees (null departments excluded)
db.employees.aggregate([
  {
    $match: {
      "department.name": { $ne: null }, // Exclure les départements "null"
    },
  },
  {
    $group: {
      _id: "$department.name", // Regrouper par le nom du département
      employeeCount: { $sum: 1 }, // Compter le nombre d'employés dans chaque département
    },
  },
  {
    $match: {
      employeeCount: { $gte: 5 }, // Filtrer les départements avec au moins 5 employés
    },
  },
]);

print("Query 09");
// the cities where at least 2 missions took place
db.employees.aggregate([
  {
    $unwind: "$missions", // Déplier le tableau de missions pour les employés
  },
  {
    $group: {
      _id: "$missions.location",
      missionCount: { $sum: 1 },
    },
  },
  {
    $match: {
      missionCount: { $gte: 2 },
    },
  },
]);

print("Query 10");
// the highest salary
db.employees.aggregate([
  {
    $group: {
      _id: null,
      highestSalary: { $max: "$salary" }, // Salaire le plus élevé
    },
  },
]);

print("Query 11");
// the name of _one_ of the employees with the highest salary
var highestSalaryEmployee = db.employees.find().sort({ salary: -1 }).limit(1);
print(highestSalaryEmployee[0].name);

print("Query 12");
// the name of _all_ of the employees with the highest salary
var highestSalary = db.employees.aggregate([
    {
      $group: {
        _id: null,
        maxSalary: { $max: "$salary" } // Trouver le salaire maximum
      }
    }
  ]).next().maxSalary;
  
  var highestSalaryEmployees = db.employees.find({ salary: highestSalary });
  
  highestSalaryEmployees.forEach(function(employee) {
    print(employee.name);
  });
  
print("Query 13");
// the name of the departments with the highest average salary
db.employees.aggregate([
    {
      $match: {
        "department.name": { $ne: null } // Exclure les départements "null"
      }
    },
    {
      $group: {
        _id: "$department.name", // Regrouper par le nom du département
        averageSalary: { $avg: "$salary" } // Calculer le salaire moyen par département
      }
    },
    {
      $sort: {
        averageSalary: -1 // Trier par ordre décroissant de salaire moyen
      }
    },
    {
      $limit: 1 // Limiter les résultats à un seul département avec le salaire moyen le plus élevé
    }
  ]);  

print("Query 14");
// for each city in which a mission took place, its name (output field "city") and the number of missions in that city
db.employees.aggregate([
    {
      $unwind: "$missions" // Déplier le tableau de missions pour les employés
    },
    {
      $group: {
        _id: "$missions.location", // Regrouper par emplacement de mission
        city: { $first: "$missions.location" }, // Obtenir le nom de la ville
        missionCount: { $sum: 1 } // Compter le nombre de missions dans chaque ville
      }
    }
  ]);
  
print("Query 15");
// the name of the employees who did a mission in the city they work in
db.employees.aggregate([
    {
      $unwind: "$missions" // Déplier le tableau de missions pour les employés
    },
    {
      $match: {
        "department.location": "$missions.location" // Comparer la ville de la mission avec la ville du département
      }
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" }
      }
    }
  ]);
  