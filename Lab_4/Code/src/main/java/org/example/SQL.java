package org.example;

import java.sql.Connection;
import java.sql.DriverManager;

public class SQL {

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
}
