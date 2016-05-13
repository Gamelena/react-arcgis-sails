/**
 * Donors.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    first_name: {
      type: 'string',
      required: true
    },
    last_name: {
      type: 'string',
      required: true
    },
    contact_number: {
      type: 'integer',
      required: true
    },
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    address: {
      type: 'string',
      required: true
    },
    blood_group: {
      type: 'string',
      enum : ['O-', 'O+', 'B-', 'B+', 'A-', 'A+', 'AB-', 'AB+'],
      required: true
    },
    ip: {
      type: 'string',
      required: true
    },
    address: {
      type: 'string',
      required: true
    },
    coord_x: {
      type: 'float',
      required: true
    },
    coord_y: {
      type: 'float',
      required: true
    },
    afterCreate: function(donor, next) {
      Sails.io.sockets.emit('donors-change', donor);
      console.log('sockect emit afterCreate');
      next();
    },
    afterUpdate: function(donor, next) {
      Sails.io.sockets.emit('donors-change', donor);
      console.log('sockect emit afterUpdate');
      next();
    },
    afterDestroy: function(donor, next) {
      Sails.io.sockets.emit('donors-change', donor);
      console.log('sockect emit afterDestroy');
      next();
    }
  }
};

