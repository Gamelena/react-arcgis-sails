/**
 * DonorsController
 *
 * @description :: Server-side logic for managing Donors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: function(req, res, next) {
        var params = req.params.all();
        params.ip = req.ip;
        sails.models.donors.create(params, function (err, donor) {
            if (err) return next(err);
            res.status(201);
            res.json(donor);
            sails.sockets.broadcast('donors-change', donor);
        });
    }
};


