package org.example;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Jean-Michel Busca
 */
public class EmployeeInfo {

    private final int id;
    private final String name;
    private final float salary;

    public EmployeeInfo(int id, String name, float salary) {
        this.id = id;
        this.name = name;
        this.salary = salary;
    }

    @Override
    public String toString() {
        return "EmployeeInfo{" + "id=" + id + ", name=" + name + ", salary=" + salary + "}\n";
    }

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

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public float getSalary() {
        return salary;
    }

}
