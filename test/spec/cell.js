// http://chaijs.com/api/assert/


describe('GAME.Cell', function() {

    it('Candy moveTo', function(done) {

        var candy = new GAME.Candy(0);
        // without callback
        candy.moveTo(30, 30);
        candy.moveTo(30, 40, function() {

            assert.equal(candy.position.x, 30);
            assert.equal(candy.position.y, 40);

            done();
        });
    });

    it('Candy explode', function(done) {

        var candy = new GAME.Candy(0);

        // without callback
        candy.explode();
        candy.explode(function() {

            assert.equal(candy.alpha, 0);
            done();
        });
    });
});
