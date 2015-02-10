// http://chaijs.com/api/assert/

var iit = function() {};

describe('GAME.Game', function() {

    it('init field with random kinds', function() {

        var game = new GAME.Game();

        game.init();
        assert.equal(game.gridMaxHeight, game.grid.length - 1);

        for (var y = 0; y <= this.gridMaxHeight; y++) {

            assert.equal(game.gridMaxWidth, game.grid[y].length - 1);

            for (var x = 0; x <= this.gridMaxWidth; x++) {

                var cell = game.grid[y][x];

                if (game.leve.gridMap[y][x] == 0) {

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

        var game = new GAME.Game();

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

        game.init(kinds);

        assert.equal(game.gridMaxHeight, game.grid.length - 1);

        for (var y = 0; y <= this.gridMaxHeight; y++) {

            assert.equal(game.gridMaxWidth, game.grid[y].length - 1);

            for (var x = 0; x <= this.gridMaxWidth; x++) {

                var cell = game.grid[y][x];

                if (game.level.gridMap[y][x] == 0) {

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

    it('getChains', function() {

        var game = new GAME.Game();

        var assertChain = function(y, x, rows, cells, lbl) {
            var r = game.getChains(y, x, game.grid[y][x]);
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

        game.init(kinds);

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

    function touchAt(game, y, x) {
        game.touchDown({
            x: (game.cellSize * x + game.cellSize / 2),
            y: (game.cellSize * y + game.cellSize / 2)
        });
        game.touchUp();
    };

    /*
        Touch one cell and set the cell as selected one
        Touch one of the neighbors as second touch init swipe
        Touch one that is too far away reset the selected one
    */
    it('Handle input all invalids', function() {

        var game = new GAME.Game();

        //   0  1  2  3  4  5  6  7  8
        var kinds = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 1
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 2
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 3
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 4
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 5
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 6
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 7
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 8
        ];

        game.init(kinds);

        game.trySwap = function(cell1, cell2) {
            assert.isTrue(false);
        };

        // touch invalid cell
        touchAt(game, 0, 0);
        should.not.exist(game.cellFirst);


        // touch the 1/0 cell
        touchAt(game, 1, 0);
        should.exist(game.cellFirst);
        assert.equal(game.cellFirst.gridY, 1);
        assert.equal(game.cellFirst.gridX, 0);

        // touch the same cell again it should be still selected
        touchAt(game, 1, 0);
        should.exist(game.cellFirst);
        assert.equal(game.cellFirst.gridY, 1);
        assert.equal(game.cellFirst.gridX, 0);

        // touch one diagonal, it should be then selected
        touchAt(game, 2, 1);
        should.exist(game.cellFirst);
        assert.equal(game.cellFirst.gridY, 2);
        assert.equal(game.cellFirst.gridX, 1);

    });

    it('Handle valid input', function() {

        var game = new GAME.Game();

        //   0  1  2  3  4  5  6  7  8
        var kinds = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 1
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 2
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 3
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 4
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 5
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 6
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 7
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 8
        ];

        game.init(kinds);

        // touch one valid and then another one valid, should call trySwap
        game.trySwap = function(cell1, cell2) {
            assert.equal(cell1.gridY, 1);
            assert.equal(cell1.gridX, 0);
            assert.equal(cell2.gridY, 2);
            assert.equal(cell2.gridX, 0);
        };

        touchAt(game, 1, 0);
        touchAt(game, 2, 0);

    });

    iit('trySwap', function(done) {

        var game = new GAME.Game();

        //   0  1  2  3  4  5  6  7  8
        var kinds = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
            [1, 3, 2, 1, 1, 1, 1, 1, 1], // 1
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 2
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 3
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 4
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 5
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 6
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 7
            [1, 1, 1, 1, 1, 1, 1, 1, 1], // 8
        ];

        game.init(kinds);

        game.getChains = function() {
            return {
                cells: [],
                rows: 0
            };
        };

        game.clearRows = function() {

        };

        game.trySwap(game.field[1][1], game.field[1][2]);


        done();
    });

});
