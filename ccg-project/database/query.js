"use strict"

/**
 *  This class handles query functions.
 *  @class
 */
class Query {

  /**
   *  @function selectAll
   *  @memberof Query
   *  @description Selects all from 'table'.
   *  @param {string} table - Database table
   *  @returns {string} Database query
   *  @instance
   */
  selectAll(table) {
    return 'SELECT * FROM ' + table;
  }

  /**
   *  @function selectAllConditions
   *  @memberof Query
   *  @description Selects all from 'table' with conditions.
   *  @param {string} table - Database table
   *  @param {string} columns - Database columns
   *  @param {string} operators - SQL Operators
   *  @returns {string} Database query
   *  @instance
   */
  selectAllConditions(table, columns, operators) {

    var col = columns.split(',');
    var opr = operators.toUpperCase().split(',');
    var count = col.length;

    var query = 'SELECT * FROM ' + table + ' WHERE ';
    for(var i = 0; i < count; i++) {
      if (i < count - 1) {
        query += col[i] + ' = ? ' + opr[i].trim();
      }
      else {
        query += col[i] + ' = ?';
      }
    }
    return query;
  }

  /**
   *  @function delete
   *  @memberof Query
   *  @description Delete from 'table'.
   *  @param {string} table - Database table
   *  @param {string} search - Databse column to search on
   *  @returns {string} Database query
   *  @instance
   */
  delete(table, search) {
    return 'DELETE FROM ' + table + ' WHERE ' + search + ' = ?';
  }

  /**
   *  @function update
   *  @memberof Query
   *  @description Updates 'table'.
   *  @param {string} table - Database table
   *  @param {string} columns - Database columns
   *  @param {string} search - Databse column to search on
   *  @returns {string} Database query
   *  @instance
   */
  update(table, columns, search) {

    var col = columns.split(',');
    var count = col.length;

    var query = 'UPDATE ' + table + ' SET ';
    for(var i = 0; i < count; i++) {
      if (i < count - 1) {
        query += col[i] + ' = ?,'
      }
      else {
        query += col[i] + ' = ? WHERE ' + search + ' = ?';
      }
    }
    return query;
  }

  /**
   *  @function insert
   *  @memberof Query
   *  @description Inserts into 'table'.
   *  @param {string} table - Database table
   *  @param {string} columns - Database columns
   *  @returns {string} Database query
   *  @instance
   */
  insert(table, columns) {

    var col = columns.split(',');
    var count = col.length;

    var query = 'INSERT INTO ' + table + ' (';
    var question = '';
    for(var i = 0; i < count; i++) {

      if (i < count - 1) {
        question += '?,';
        query += col[i] + ','
      }
      else {
        question += '?';
        query += col[i] + ') VALUES (' + question + ')';
      }

    }
    return query;
  }

  //"SELECT * FROM donor a
  //INNER JOIN embryo_recovery b ON b.donor_id = a.id
  //INNER JOIN client c ON c.id = a.client_id
  //AND a.tag_tattoo = ?
  //AND a.client_id = ?"

  //table 1 = donor a
  //table 2 = embryo_recovery b
  //table 3 = client c

  //column 1 = a.id
  //column 2 = b.donor_id
  //column 3 = a.client_id
  //column 4 = c.id

  //operator 1 = AND
  //operator 2 = AND

  //column5 = a.tag_tattoo
  //column6 = a.client_id


  //SELECT * FROM donor a
  //INNER JOIN embryo_recovery b
  //ON a.id = b.donor_id
  //INNER JOIN client c
  //ON a.client_id = c.id
  //AND a.tag_tattoo = ?
  //AND a.client_id = ?

  //SELECT * FROM 'table1' a
  //INNER JOIN 'table2' b
  //ON a.'column1' = b.'column2'
  //INNER JOIN 'table3' c
  //ON a.'column3' = c.'column4'
  //AND a.'column5' = ?
  //AND a.'column6' = ?


  //innerJoin('donor', 'embryo_recovery,')
  /*innerJoin(table, ){

  }*/

}
module.exports = exports = new Query();
