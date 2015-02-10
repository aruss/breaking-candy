// http://chaijs.com/api/assert/

var iit = function() {};

describe('GAME', function() {

    it('init field with random kinds', function() {

        GAME.init();

        assert.equal(GAME.gridMaxHeight, GAME.grid.length - 1);

        for (var y = 0; y <= this.gridMaxHeight; y++) {

            assert.equal(GAME.gridMaxWidth, GAME.grid[y].length - 1);

            for (var x = 0; x <= this.gridMaxWidth; x++) {

                var cell = GAME.grid[y][x];

                if (GAME.gridMap[y][x] == 0) {

                    should.not.exist(cell);
                } else {

                    should.exist(cell);
                    assert.equal(cell.active, true);
                    assert.equal(cell.gridX, x);
                    assert.equal(cell.gridY, y);
                }
            }
        }
    });

    it('init field with given kinds', function() {

        //   0  1  2  3  4  5  6  7  8
        var kinds = [
            [0, 1, 1, 0, 0, 0, 1, 1, 0], // 0
            [1, 1, 1, 4, 5, 6, 1, 1, 1], // 1
            [2, 2, 2, 4, 5, 6, 2, 2, 2], // 2
            [2, 3, 3, 4, 5, 6, 3, 3, 3], // 3
            [0, 0, 1, 1, 1, 1, 1, 0, 0], // 4
            [2, 1, 1, 1, 1, 1, 1, 1, 1], // 5
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 6
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 7
            [0, 1, 1, 0, 0, 0, 1, 1, 0], // 8
        ];

        GAME.init(kinds);

        assert.equal(GAME.gridMaxHeight, GAME.grid.length - 1);

        for (var y = 0; y <= this.gridMaxHeight; y++) {

            assert.equal(GAME.gridMaxWidth, GAME.grid[y].length - 1);

            for (var x = 0; x <= this.gridMaxWidth; x++) {

                var cell = GAME.grid[y][x];

                if (GAME.gridMap[y][x] == 0) {

                    should.not.exist(cell);
                } else {

                    should.exist(cell);
                    assert.equal(cell.kind, kinds[y][x]);
                    assert.equal(cell.active, true);
                    assert.equal(cell.gridX, x);
                    assert.equal(cell.gridY, y);
                }
            }
        }
    });


    it('isInBounds', function() {

        var game = new GAME.Game();

        game.init();

        assert.isFalse(game.isInBounds(-1, -1));
        assert.isFalse(game.isInBounds(-1, 0));
        assert.isFalse(game.isInBounds(0, -1));

        assert.isFalse(game.isInBounds(game.gridMaxHeight + 1, game.gridMaxWidth + 1));
        assert.isFalse(game.isInBounds(game.gridMaxHeight + 1, 0));
        assert.isFalse(game.isInBounds(0, game.gridMaxWidth + 1));

        assert.isFalse(game.isInBounds(0, 4));
    });


    it('trololo', function() {
        var g = new GAME.Game();

        g.init = null;
    });

    it('getChains', function() {

        var assertChain = function(y, x, rows, cells, lbl) {
            var r = GAME.getChains(y, x, GAME.grid[y][x]);
            assert.equal(r.cells.length, cells, lbl + ' cell length');
            assert.equal(r.rows, rows, lbl + ' row length');
        };

        //   0  1  2  3  4  5  6  7  8
        var kinds = [
            [0, 1, 1, 0, 0, 0, 1, 1, 0], // 0
            [1, 1, 1, 4, 5, 6, 1, 1, 1], // 1
            [3, 2, 2, 4, 5, 6, 1, 2, 2], // 2
            [2, 3, 3, 4, 0, 6, 3, 3, 2], // 3
            [0, 0, 1, 1, 0, 1, 3, 0, 0], // 4
            [2, 3, 1, 4, 0, 1, 1, 1, 2], // 5
            [1, 2, 3, 4, 1, 1, 1, 1, 2], // 6
            [1, 1, 3, 4, 4, 4, 1, 1, 1], // 7
            [0, 1, 3, 0, 0, 0, 1, 1, 0], // 8
        ];

        GAME.init(kinds);

        // horizontal
        assertChain(1, 0, 1, 3, 'h valid left to right');
        assertChain(1, 8, 1, 3, 'h valid right to left');
        assertChain(2, 2, 0, 0, 'h invalid left to right');
        assertChain(1, 1, 1, 3, 'h valid from middle to both sides');
        assertChain(4, 2, 0, 0, 'h invalid left to right through barrier');

        // vertical
        assertChain(0, 6, 1, 3, 'v valid top to down');
        assertChain(2, 6, 1, 3, 'v valid down to top');
        assertChain(7, 1, 0, 0, 'v invalid top to down');
        assertChain(2, 6, 1, 3, 'v valid from middle to both sides');
        assertChain(2, 8, 0, 0, 'v invalid top to down through barrier');

        // chross
        assertChain(6, 6, 2, 7, 'x impossible one');

        // corner
        assertChain(7, 3, 2, 5, 'L 2 rows with 5 cells');
    });


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