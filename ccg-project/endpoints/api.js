"use strict"

/**
 *  This class handles api functions.
 *  @class
 */
class Api {

  /**
   *  @function index
   *  @memberof Api
   *  @description Sends user to api documentation.
   *  @param {req} Request - Http Request Object
   *  @param {res} Response - Http Response Object
   *  @instance
   */
  index(req, res) {

    //res.render('admin/users', {title: manage_users, user: req.user, users: users});
    res.render('./out/index');
  }


}
module.exports = exports = new Api();
