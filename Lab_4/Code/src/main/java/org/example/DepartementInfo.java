package org.example;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Jean-Michel Busca
 */
public class DepartementInfo {

    private final int id;
    private final String name;
    private final String location;

    public DepartementInfo(int id, String name, String location) {
        this.id = id;
        this.name = name;
        this.location = location;
    }

    @Override
    public String toString() {
        return "DepartmentInfo{" + "id=" + id + ", name=" + name + ", location=" + location + "}\n";
    }

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

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

}
