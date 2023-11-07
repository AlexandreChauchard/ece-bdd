//
// Database: company.js
//
// Write the MongoDB queries that return the information below:
//

// all the employees
var allEmployees = db.employees.find();
allEmployees.forEach(printjson);

// the number of employees
var employeeCount = db.employees.count();
print("Number of employees: " + employeeCount);

// one of the employees, with pretty printing (2 methods)
var oneEmployee = db.employees.findOne();
printjson(oneEmployee);

// --

// all the information about employees, except their salary, commission and missions
var employeesInfo = db.employees.find(
  {},
  {
    salary: 0, // Exclure le champ "salary"
    commission: 0, // Exclure le champ "commission"
    missions: 0, // Exclure le champ "missions"
  }
);
employeesInfo.forEach(printjson);

// the name and salary of all the employees (without the field _id)
var employeesNameAndSalary = db.employees.find(
  {},
  {
    _id: 0, // Exclure le champ "_id"
    name: 1, // Inclure le champ "name"
    salary: 1, // Inclure le champ "salary"
  }
);
employeesNameAndSalary.forEach(printjson);

// the name, salary and first mission (if any) of all the employees (without the field _id)
var employeesNameSalaryFirstMission = db.employees.aggregate([
  {
    $project: {
      _id: 0, // Exclure le champ "_id"
      name: 1, // Inclure le champ "name"
      salary: 1, // Inclure le champ "salary"
      firstMission: { $arrayElemAt: ["$missions", 0] }, // Récupérer la première mission
    },
  },
]);
employeesNameSalaryFirstMission.forEach(printjson);

// --

// the name and salary of the employees with a salary in the range [1,000; 2,500[
var employeesInRange = db.employees.find(
  {
    salary: { $gte: 1000, $lt: 2500 },
  },
  {
    _id: 0, // Exclure le champ "_id"
    name: 1, // Inclure le champ "name"
    salary: 1, // Inclure le champ "salary"
  }
);
employeesInRange.forEach(printjson);

// the name and salary of the clerks with a salary in the range [1,000; 1,500[ (2 methods)
var clerksInRange1 = db.employees.find(
  {
    salary: { $gte: 1000, $lt: 1500 },
    job: "clerk",
  },
  {
    _id: 0, // Exclure le champ "_id"
    name: 1, // Inclure le champ "name"
    salary: 1, // Inclure le champ "salary"
  }
);
clerksInRange1.forEach(printjson);

// the employees whose manager is 7839 or whose salary is less than 1000
var employeesWithManagerOrLowSalary = db.employees.find({
    $or: [
      { manager: 7839 },
      { salary: { $lt: 1000 } }
    ]
  }, {
    _id: 0, // Exclure le champ "_id"
    name: 1, // Inclure le champ "name"
    salary: 1 // Inclure le champ "salary"
  });
  employeesWithManagerOrLowSalary.forEach(printjson);
  
// the clerks and the analysts (2 methods)
var clerksAndAnalysts1 = db.employees.find({
    job: { $in: ["clerk", "analyst"] }
  }, {
    _id: 0, // Exclure le champ "_id"
    name: 1, // Inclure le champ "name"
    job: 1 // Inclure le champ "job"
  });
  clerksAndAnalysts1.forEach(printjson);
  
// --

// the name, job and salary of the employees, sorted first by job (ascending) and then by salary (descending)
var employeesSorted = db.employees.find({}, {
    _id: 0, // Exclure le champ "_id"
    name: 1, // Inclure le champ "name"
    job: 1, // Inclure le champ "job"
    salary: 1 // Inclure le champ "salary"
  }).sort({
    job: 1, // Trier d'abord par poste (ascendant)
    salary: -1 // Ensuite, trier par salaire (descendant)
  });
  
  employeesSorted.forEach(printjson);
  

// one of the employees with the highest salary
var highestSalaryEmployee = db.employees.find().sort({ salary: -1 }).limit(1);
printjson(highestSalaryEmployee[0]);

// --

// the employee names that begin with 'S' and end with 't' (2 methods)
var employeesSStartTEnd1 = db.employees.find({
    name: /^S.*t$/
  }, {
    _id: 0, // Exclure le champ "_id"
    name: 1 // Inclure le champ "name"
  });
  employeesSStartTEnd1.forEach(printjson);
  
// the employee names that contain a double 'l'
var employeesDoubleL = db.employees.find({
    name: /ll/
  }, {
    _id: 0, // Exclure le champ "_id"
    name: 1 // Inclure le champ "name"
  });
  employeesDoubleL.forEach(printjson);
  
// the employee names that begins with 'S' and contains either 'o' or 'm' (2 methods)
var employeesSStartOorM1 = db.employees.find({
    $or: [
      { name: /^S.*o/ },
      { name: /^S.*m/ }
    ]
  }, {
    _id: 0, // Exclure le champ "_id"
    name: 1 // Inclure le champ "name"
  });
  employeesSStartOorM1.forEach(printjson);
  
// --

// the name and the commission of the employees whose commission is not specified
// (the field "commission" does not exists or it has a null value)
var employeesWithoutCommission = db.employees.find({
    $or: [
      { commission: { $exists: false } },
      { commission: null }
    ]
  }, {
    _id: 0, // Exclure le champ "_id"
    name: 1, // Inclure le champ "name"
    commission: 1 // Inclure le champ "commission"
  });
  employeesWithoutCommission.forEach(printjson);
  
// the name and the commission of the employees whose commission is specified
// (the field "commission" does exist and it has a non-null value)
var employeesWithCommission = db.employees.find({
    $and: [
      { commission: { $exists: true } }, // Vérifier si le champ "commission" existe
      { commission: { $ne: null } } // Vérifier si le champ "commission" n'est pas égal à null
    ]
  }, {
    _id: 0, // Exclure le champ "_id"
    name: 1, // Inclure le champ "name"
    commission: 1 // Inclure le champ "commission"
  });
  employeesWithCommission.forEach(printjson);
  
// the name and the commission of the employees with a field "commission"
// (regardless of its value)

// the name and the commission of the employees whose commission is null
// (the field "commission" does exist but it has a null value)

// --

// the employees who work in Dallas

// the employees who don't work in Chicago (2 methods)

// the employees who did a mission in Chicago

// the employees who did a mission in Chicago or Dallas  (2 methods)

// the employees who did a mission in Lyon and Paris (2 methods)

// the employees who did all their missions in Chicago

// the employees who did a mission for IBM in Chicago

// the employees who did their first mission for IBM

// the employees who did exactly two missions

// --

// the jobs in the company

// the name of the departments

// the cities in which the missions took place

// --

// the employees with the same job as Jones'
