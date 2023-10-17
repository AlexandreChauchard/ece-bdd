package org.example;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import static org.example.DepartementInfo.getDepartements;

public class Main {
    public static void main(String[] args) {

        List<EmployeeInfo> list = new ArrayList<>();
        list = EmployeeInfo.getEmployee();
        for (EmployeeInfo employee : list) {
            System.out.println(employee);
        }

        EmployeeInfo.raiseSalary("*", 1000);

        List<DepartementInfo> departments = getDepartements(null, "RESEARCH", "DALLAS");
        for (DepartementInfo department : departments) {
            System.out.println("ID: " + department.getId() + ", Name: " + department.getName() + ", Location: " + department.getLocation());
        }
    }

}