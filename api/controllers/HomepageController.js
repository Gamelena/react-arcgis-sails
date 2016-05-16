/**
 * HomepageController
 *
 * @description :: Server-side logic for managing homepages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     *
     * Using raw socket.io functionality from a Sails.js controller
     *
     */

    index: function (req,res) {
        return res.view();
    }
};

