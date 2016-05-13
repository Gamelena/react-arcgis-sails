describe('DonorsModel', function() {

    describe('#find()', function() {
        it('should check find function', function (done) {
            Donors.find()
                .then(function(results) {

                    done();
                })
                .catch(done);

        });
    });

});