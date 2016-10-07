package com.ccg;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


import java.io.*;
import java.util.Iterator;
import java.util.Optional;

public class Main {

    public static void main(String[] args) throws FileNotFoundException {
        String filePath = "/Users/ajcabanatuan/Documents/se-project/Kansas Cane Code Log 111815 Copy.xlsx";
        File file = new File(filePath);
        BufferedInputStream bir;

        try {

            FileInputStream fileInputStream = new FileInputStream(file);
            bir = new BufferedInputStream(fileInputStream);

            Workbook workbook = new XSSFWorkbook(bir);

            for (int h = 1; h < workbook.getNumberOfSheets(); h++) {
                Sheet sheet = workbook.getSheetAt(h);
                System.out.println(sheet.getSheetName());
                for (int i = 2; i <= sheet.getLastRowNum(); i++) {

                    Row row = sheet.getRow(i);
                    Optional<Row> rowOptional = Optional.ofNullable(row);

                    if (rowOptional.isPresent()) {

                        Cell cell = row.getCell(0);

                        // Check if ID exists
                        Optional<String> rowIdOptional = Optional.ofNullable(row.getCell(0).toString());
                        if (rowIdOptional.isPresent()) {

                            for (int k = 0; k < row.getLastCellNum(); k++) {
                                System.out.print(row.getCell(k) + " ");

                            }

                        }


                    }


                    System.out.println();
                }
            }



//            Iterator<Row> rowIterator = sheet.iterator();
//
//            while (rowIterator.hasNext()) {
//                Row nextRow = rowIterator.next();
//                Iterator<Cell> cellIterator = nextRow.cellIterator();
//
//                while(cellIterator.hasNext()) {
//
//                }
//
//            }



        } catch (Exception ex) {
            ex.printStackTrace();
        }

    }
}
