# LAB 4

## Exercice 1 

Ici nous devons créer la méthode de connection. Voici le code utilisé :

``` java
    public static Connection connect() {
        Connection conn = null;

        try {
            String username = "root";
            String password = "";
            String url = "jdbc:mysql://localhost:3306/company";

            Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
            conn = DriverManager.getConnection(url, username, password);

            System.out.println("Connected to the database");
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
        return conn;
    }
```

On rentre l'URL, le mot de passe et finalement le nom d'utilisateur et cela établi la connexion.

## Exercice 2 

Ici l'objectif est de créer un code pour afficher les informations des employés que nous avons récupéré.

Voici le code :

`EmployeeInfo` : 

```java
    public static List<EmployeeInfo> getEmployee(){

        List<EmployeeInfo> list = new ArrayList<>();

        try (Connection conn = SQL.connect();

            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM EMP")){

            while(rs.next()){
                int id = rs.getInt("EID");
                String name = rs.getString("ENAME");
                float salary = rs.getFloat("SAL");

                EmployeeInfo employee = new EmployeeInfo(id, name, salary);
                list.add(employee);
            }
        }
        catch (SQLException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
        return list;
    }
```

`Main` :

```java
        List<EmployeeInfo> list = new ArrayList<>();
        list = EmployeeInfo.getEmployee();
        for (EmployeeInfo employee : list) {
            System.out.println(employee);
        }
```

## Exercice 3 

Ici on doit créer une méthode pour augmenter le salaire d'un certain métier et d'un certain nombre.

Voici le code :

`EmployeeInfo` : 

```java
static boolean raiseSalary(String job, float amount)
    {
        try(Connection conn = SQL.connect();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM EMP WHERE JOB = '" + job + "'"))
        {
            while(rs.next()){
                float salary = rs.getFloat("SAL");
                salary += amount;
                stmt.executeUpdate("UPDATE EMP SET SAL = " + salary + " WHERE JOB = '" + job + "'");
            }
        }
        catch(SQLException e)
        {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
        return true;
    }
```

## Exercice 4

Ici on doit refaire l'exercie 2 et 3 en utilisant des "preparedStatement". Voici les codes :

```java
    public static List<EmployeeInfo> getEmployeePS() {

        List<EmployeeInfo> list = new ArrayList<>();

        try (Connection conn = SQL.connect();
             PreparedStatement preparedStatement = conn.prepareStatement("SELECT * FROM EMP");
             ResultSet rs = preparedStatement.executeQuery()) {

            while (rs.next()) {
                int id = rs.getInt("EID");
                String name = rs.getString("ENAME");
                float salary = rs.getFloat("SAL");

                EmployeeInfo employee = new EmployeeInfo(id, name, salary);
                list.add(employee);
            }
        } catch (SQLException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
        return list;
    }
```

```java
static boolean raiseSalary(String job, float amount) {
    try (Connection conn = SQL.connect();
         PreparedStatement selectStatement = conn.prepareStatement("SELECT * FROM EMP WHERE JOB = ?");
         PreparedStatement updateStatement = conn.prepareStatement("UPDATE EMP SET SAL = ? WHERE JOB = ?")) {

        selectStatement.setString(1, job);
        ResultSet rs = selectStatement.executeQuery();

        while (rs.next()) {
            float salary = rs.getFloat("SAL");
            salary += amount;
            
            updateStatement.setFloat(1, salary);
            updateStatement.setString(2, job);
            updateStatement.executeUpdate();
        }
    } catch (SQLException e) {
        System.err.println("Error: " + e.getMessage());
        e.printStackTrace();
        return false;
    }
    return true;
}
```

## Exercice 5 

Ici on doit créer une méthode qui nous renvoie les départements en fonction de plusieurs paramètres.

Voici le code : 

```Java
public static List<DepartementInfo> getDepartements(Integer id, String name, String location) {
        List<DepartementInfo> departmentList = new ArrayList<>();

        try (Connection conn = SQL.connect()) {
            StringBuilder query = new StringBuilder("SELECT * FROM dept WHERE 1=1");

            if (id != null) {
                query.append(" AND DID = ?");
            }
            if (name != null) {
                query.append(" AND DNAME = ?");
            }
            if (location != null) {
                query.append(" AND DLOC = ?");
            }

            try (PreparedStatement preparedStatement = conn.prepareStatement(query.toString())) {
                int parameterIndex = 1;

                if (id != null) {
                    preparedStatement.setInt(parameterIndex++, id);
                }
                if (name != null) {
                    preparedStatement.setString(parameterIndex++, name);
                }
                if (location != null) {
                    preparedStatement.setString(parameterIndex, location);
                }

                ResultSet resultSet = preparedStatement.executeQuery();

                while (resultSet.next()) {
                    int departmentId = resultSet.getInt("DID");
                    String departmentName = resultSet.getString("DNAME");
                    String departmentLocation = resultSet.getString("DLOC");

                    DepartementInfo department = new DepartementInfo(departmentId, departmentName, departmentLocation);
                    departmentList.add(department);
                }
            }
        } catch (SQLException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }

        return departmentList;
    }
```