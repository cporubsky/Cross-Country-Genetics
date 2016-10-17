package com.ccg;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


import java.io.*;
import java.util.Optional;

public class Main {

    public static void main(String[] args) throws FileNotFoundException {
        String filePath = "/Users/ajcabanatuan/Documents/se-project/Kansas Cane Code Log 111815.xlsx";
        File file = new File(filePath);
        BufferedInputStream bir;
        BufferedReader reader;

        Workbook workbook = new XSSFWorkbook();

        String sheetName = "";
        int rowCounter = 0;
        int sheetNumber = 1;

        String line;

        try {

//            reader = new BufferedReader(new FileReader(file));
//
//            reader.readLine();
//            reader.readLine();
//
//            while ((line = reader.readLine()) != null) {
//                String[] split = line.split("\\t", -1);
//
//                if (split.length < 11) {
//                    System.out.println("OH NO! ITS BROKEN");
//                    break;
//                }
//
//                for (int i = 0; i < split.length; i++) {
//                    if (split[i].equals("") || split[i] == null) {
//                        System.out.print("null" + "\t\t\t");
//                    } else if ((i == 6 || i == 7 || i == 8 || i == 9) && !(split[i].toUpperCase().equals("X"))) {
//                        System.out.print(Integer.parseInt(split[i]) + "\t\t\t");
//                    } else if (split[i].contains("\"")) {
//                        System.out.print(split[i].substring(1, split[i].length() - 2) + "\t\t\t");
//                    }
//                    else System.out.print(split[i] + "\t\t\t");
//
//                }
//                System.out.println();
//            }

            FileInputStream fileInputStream = new FileInputStream(file);
            bir = new BufferedInputStream(fileInputStream);

            workbook = new XSSFWorkbook(bir);

            for (int h = 1; h < workbook.getNumberOfSheets(); h++) {
                Sheet sheet = workbook.getSheetAt(h);
                sheetName = sheet.getSheetName();
                System.out.println(sheetName);
                rowCounter = 2;
                for (int i = 2; i <= sheet.getLastRowNum(); i++) {

                    Row row = sheet.getRow(i);
                    Optional<Row> rowOptional = Optional.ofNullable(row);

                    if (rowOptional.isPresent()) {


                        if (Optional.ofNullable(row.getCell(0)).isPresent()) {
                            row.getCell(0).setCellType(CellType.STRING);

                            if (row.getCell(0).toString().equals("") || row.getCell(0).toString() == null) {

                                System.out.println("NO ID EXISTS!!!!!!!!!!!!!!!");
                                continue;
                            }
                        }

                        for (int j = 0; j < row.getLastCellNum(); j++) {

                            Cell cell = row.getCell(j);
                            // Check if ID exists
                            Optional<Cell> rowIdOptional = Optional.ofNullable(cell);
                            if (rowIdOptional.isPresent()) {

                                cell.setCellType(CellType.STRING);

                                System.out.print(cell.toString() + "\t\t\t");


                            } else System.out.print("null" + "\t\t\t");

                        }

                    }
                    System.out.println();
                    rowCounter++;
                }
                sheetNumber++;
            }

        } catch (Exception ex) {
            ex.printStackTrace();
            System.out.println("Error on sheet: " + sheetName);
            System.out.println("Error on line: " + rowCounter);
            System.out.println("Row data: " + workbook.getSheetAt(sheetNumber).getRow((rowCounter)).getCell(0).toString());
        }

    }
}
