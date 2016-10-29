package com.ccg;

import com.ccg.db.SQLiteJDBC;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


import java.io.*;
import java.util.ArrayList;
import java.util.List;
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

        SQLiteJDBC sqLiteJDBC = new SQLiteJDBC();
        List<List<String>> rowList = new ArrayList<>();

        try {

            FileInputStream fileInputStream = new FileInputStream(file);
            bir = new BufferedInputStream(fileInputStream);

            workbook = new XSSFWorkbook(bir);

            for (int h = 1; h < workbook.getNumberOfSheets(); h++) {
                Sheet sheet = workbook.getSheetAt(h);
                sheetName = sheet.getSheetName();
                rowCounter = 2;
                for (int i = 2; i <= sheet.getLastRowNum(); i++) {

                    Row row = sheet.getRow(i);
                    Optional<Row> rowOptional = Optional.ofNullable(row);

                    if (rowOptional.isPresent()) {

                        Cell tagCell = row.getCell(0);
                        // Check if tag is null if so, continue to next row
                        if (Optional.ofNullable(tagCell).isPresent()) {
                            tagCell.setCellType(CellType.STRING);

                            if (tagCell.toString().trim().equals("") || tagCell.toString() == null) {
                                continue;
                            }
                            List<String> cellList = new ArrayList<>();
                            for (int j = 0; j < 11; j++) {

                                Cell cell = row.getCell(j);
                                // Check if ID exists
                                Optional<Cell> rowIdOptional = Optional.ofNullable(cell);
                                if (rowIdOptional.isPresent()) {

                                    cell.setCellType(CellType.STRING);
                                    cellList.add(cell.toString());

                                } else cellList.add(null);
                            }
                            if (cellList.get(0) != null && !cellList.get(0).equals("")) {
                                rowList.add(cellList);
                            }
                        }
                    }
                    rowCounter++;
                }
                sheetNumber++;
            }

            sqLiteJDBC.writeData(rowList);

            System.out.println("Successfully wrote data");

        } catch (Exception ex) {
            ex.printStackTrace();
            System.out.println("Error on sheet: " + sheetName);
            System.out.println("Error on line: " + rowCounter);
            System.out.println("Row data: " + workbook.getSheetAt(sheetNumber--).getRow((rowCounter)).getCell(0).toString());
            System.out.println("Row size: " + workbook.getSheetAt(sheetNumber).getRow((rowCounter)).getLastCellNum());
        }
    }
}
