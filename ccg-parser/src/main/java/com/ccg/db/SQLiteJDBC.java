package com.ccg.db;

import java.sql.*;
import java.util.List;
import java.util.Optional;

public class SQLiteJDBC {

    private Connection conn;
    private Statement stmt;

    public SQLiteJDBC() {
        try {
            Class.forName("org.sqlite.JDBC");
            conn = DriverManager.getConnection("jdbc:sqlite:development.db");
            stmt = conn.createStatement();
            System.out.println("Opened database successfully");
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }

    public void writeData(List<List<String>> data) throws SQLException {

        String sql = "INSERT INTO cane_log (tag_id, loc, freeze_date, client, donor, sire, g1, g2, g3, total, age) values (?,?,?,?,?,?,?,?,?,?,?)";

        try {

//            for (List<String> row : data) {
//
//                String sql = "INSERT INTO cane_log (tag_id, loc, freeze_date, client, donor, sire, g1, g2, g3, total, age) values (";
//
//                for (int i = 0; i < row.size(); i++) {
//
//
//                    if (i >= 6 && i <= 9) {
//                        sql += row.get(i) + ",";
//                    } else sql += "'" + row.get(i) + "'" + ",";
//
//                }
//
//                String insert = sql.substring(0, sql.length() - 1) + ");";
//                stmt.executeUpdate(insert);
//                System.out.println(insert);
//            }

            for (List<String> row : data) {

                PreparedStatement pstmt = conn.prepareStatement(sql);

                pstmt.setString(1, row.get(0));
                pstmt.setString(2, row.get(1));
                // TODO: Needs to be date
                // TODO: Last 6 years
//                DateFormat df = new SimpleDateFormat("MM/dd/yyyy");
//                Date startDate;
//                try {
//                    startDate = df.parse(startDateString);
//                    String newDateString = df.format(startDate);
//                    System.out.println(newDateString);
//                } catch (ParseException e) {
//                    e.printStackTrace();
//                }

                pstmt.setString(3, row.get(2));
                pstmt.setString(4, row.get(3));
                pstmt.setString(5, row.get(4));
                pstmt.setString(6, row.get(5));

                boolean g1Present = Optional.ofNullable(row.get(6)).isPresent();
                boolean g2Present = Optional.ofNullable(row.get(7)).isPresent();
                boolean g3Present = Optional.ofNullable(row.get(8)).isPresent();
                boolean totalPresent = Optional.ofNullable(row.get(9)).isPresent();

                // TODO: VLOOKUP of characters in all sheets
                if (g1Present) {
                    pstmt.setInt(7, Integer.parseInt(row.get(6)));
                } else pstmt.setNull(7, Types.INTEGER);

                if (g2Present) {
                    pstmt.setInt(8, Integer.parseInt(row.get(7)));
                } else pstmt.setNull(8, Types.INTEGER);

                if (g3Present) {
                    pstmt.setInt(9, Integer.parseInt(row.get(8)));
                } else pstmt.setNull(9, Types.INTEGER);

                if (totalPresent) {
                    pstmt.setInt(10, Integer.parseInt(row.get(9)));
                } else pstmt.setNull(10, Types.INTEGER);

                pstmt.setString(11, row.get(10));

                pstmt.executeUpdate();

            }

        } catch (Exception ex) {

            System.out.println(ex.getMessage());
            System.out.println("Error writing");
            ex.printStackTrace();
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException ex) {
                System.out.println(ex.getMessage());
            }
        }
    }

    private void closeConnection() throws SQLException {
        stmt.close();
        conn.close();
    }
}
