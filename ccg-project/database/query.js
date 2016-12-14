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
   *  @param {string} columns - Database columns, and operators
   *  @returns {string} Database query
   *  @instance
   */
  selectAll(table, columns) {

    var query = 'SELECT * FROM ' + table;
    if((columns === '')) return query;
    else {

      var col = columns.split(',');
      var colCount = col.length;

      query += ' WHERE ';
      for(var i = 0; i < colCount; i++) {
        if (i < colCount - 1) {
          if ((i % 2) == 0) {
            query += col[i] + ' = ? '
          }
          else {
            query += col[i].toUpperCase().trim();
          }
        }
        else {
          query += col[i] + ' = ?';
        }
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

  /**
   *  @function update
   *  @memberof Query
   *  @description Updates 'table'.
   *  @param {string} table - Database table
   *  @param {string} columns - Database columns
   *  @param {string} search - Databse column to search on, and operators
   *  @returns {string} Database query
   *  @instance
   */
  update(table, columns, search) {

    var col = columns.split(',');
    var colCount = col.length;
    var srch = search.split(',');
    var srchCount = srch.length;

    var query = 'UPDATE ' + table + ' SET ';
    for(var i = 0; i < colCount; i++) {
      if (i < colCount - 1) {
        query += col[i] + ' = ?,'
      }
      else {
        query += col[i] + ' = ? WHERE ';
        for (var ii = 0; ii < srchCount; ii++){
          if (ii < srchCount - 1){
            if ((ii % 2) == 0) {
              query += srch[ii] + ' = ?';
            }
            else {
              query += srch[ii];
            }
          }
          else {
            query += srch[ii] + ' = ?';
          }
        }
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

  //TODO: Make DELETE flexible


}
module.exports = exports = new Query();
