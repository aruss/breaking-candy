// http://www.raywenderlich.com/66877/how-to-make-a-game-like-candy-crush-part-1

// root namespace
var GAME = {
    cellKindMax: 5,
    cellSize: 70,
    renderWidth: 650,
    renderHeight: 650,
    dragThreshold: 10,
    devicePixelRatio: window.devicePixelRatio,
};

GAME.noop = function() {};

GAME.Game = function() {


    this.score = 0;
    this.moves = 0;

    this.level = {
        moves: 15,
        score: 1000,
        gridMap: [
            [0, 1, 1, 0, 0, 0, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 0, 1, 1, 0, 0],
            [1, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 0, 0, 0, 1, 1, 0],
        ]
    };

    this.gridMaxHeight = this.level.gridMap[0].length - 1;
    this.gridMaxWidth = this.level.gridMap.length - 1;
    this.grid = [];

    this.stage = new PIXI.Stage(0xFFFFFF);

    this._getChainsCheck = function(y, x, targetCell, chain) {

        if (this.level.gridMap[y][x] !== 0) {

            var cell = this.grid[y][x];
            if (cell) {
                if (cell.kind !== targetCell.kind) {
                    return false;
                }

                chain.push(cell);
                return true;
            }
        }

        return false;
    };
};

GAME.Game.prototype.constructor = GAME.Game;



GAME.Game.prototype.init = function(kinds) {


    var halfSize = GAME.cellSize / 2;
    for (var y = 0; y <= this.gridMaxHeight; y++) {

        this.grid[y] = [];
        for (var x = 0; x <= this.gridMaxWidth; x++) {

            if (this.level.gridMap[y][x] == 0) {
                continue;
            }

            var kind = kinds ? kinds[y][x] : Math2.randomInt(0, GAME.cellKindMax);
            var cell = new GAME.Candy(kind);

            cell.gridX = x;
            cell.gridY = y;
            cell.position.x = halfSize + x * GAME.cellSize;
            cell.position.y = halfSize + y * GAME.cellSize;

            this.grid[y][x] = cell;
            this.stage.addChild(cell);

        }
    }
};

GAME.Game.prototype.loadLevel = function(lvl) {

};

GAME.Game.prototype.start = function() {

};

GAME.Game.prototype.shuffle = function() {

};

GAME.Game.prototype.isInBounds = function(y, x) {

    if (x >= 0 && y >= 0 && x <= this.gridMaxWidth & y <= this.gridMaxHeight) {

        return this.level.gridMap[y][x] !== 0;
    }

    return false;
};

GAME.Game.prototype.getChainsCheck = function(y, x, targetCell, chain) {

    if (this.level.gridMap[y][x] !== 0) {

        var cell = this.grid[y][x];
        if (cell) {
            if (cell.kind !== targetCell.kind) {
                return false;
            }

            chain.push(cell);
            return true;
        }
    }

    return false;
};

GAME.Game.prototype.getChains = function(atY, atX, targetCell) {

    var result = {
        cells: [],
        rows: 0
    };

    // vertical
    var chainv = [];

    for (var y = atY - 1; y >= 0 && this.getChainsCheck(y, atX, targetCell, chainv); y--) {}
    for (var y = atY + 1; y <= this.gridMaxHeight && this.getChainsCheck(y, atX, targetCell, chainv); y++) {}

    if (chainv.length >= 2) {
        result.cells = chainv;
        result.rows++;
    }

    // horizontal
    var chainh = [];

    for (var x = atX - 1; x >= 0 && this.getChainsCheck(atY, x, targetCell, chainh); x--) {}
    for (var x = atX + 1; x <= this.gridMaxWidth && this.getChainsCheck(atY, x, targetCell, chainh); x++) {}

    if (chainh.length >= 2) {
        result.cells = result.cells.concat(chainh);
        result.rows++;
    }

    if (result.cells.length >= 2) {
        result.cells.push(targetCell);
    }

    return result;
};

GAME.Game.prototype.run = function() {

    var self = this;

    // create a renderer instance.
    self.renderer = PIXI.autoDetectRenderer(
        GAME.renderWidth,
        GAME.renderHeight
    );

    // add the renderer view element to the DOM
    document.body.appendChild(self.renderer.view);

    self.animate = function() {

        requestAnimFrame(self.animate);

        // render the stage
        self.renderer.render(self.stage);
    }

    requestAnimFrame(self.animate);

    // add selected cell marker sprite
    self.marker = new PIXI.Sprite(PIXI.Texture.fromImage('images/selected.png'));
    self.marker.visible = false;
    self.marker.anchor.x = 0.5;
    self.marker.anchor.y = 0.5;
    self.stage.addChild(self.marker);

    // create game field
    self.init();

    // bind ui events
    var canvas = document.getElementsByTagName('canvas')[0];
    canvas.addEventListener('mousemove', function(e) {
        self.touchMove(e);
    }, false);
    canvas.addEventListener('mousedown', function(e) {
        self.touchDown(e);
    }, false);
    canvas.addEventListener('mouseup', function(e) {
        self.touchUp(e);
    }, false);
};

GAME.Game.prototype.touchMove = function(e) {

    if (this.touchFirst && this.touching) {
        // TODO: add dragging support
    }
};

GAME.Game.prototype.touchUp = function(e) {

    this.touching = false;
};

GAME.Game.prototype.touchDown = function(e) {

    this.touching = true;

    var y = Math.floor(e.y / GAME.cellSize);
    var x = Math.floor(e.x / GAME.cellSize);

    if (this.isInBounds(y, x)) {

        if (this.cellFirst) {

            if (Math.abs(Math.abs(this.cellFirst.gridX - x) -
                    Math.abs(this.cellFirst.gridY - y)) === 1) {

                this.trySwap(this.cellFirst, this.grid[y][x]);

                this.setMarker(null);
                this.touchFirst = null;
                return;
            }
        }

        this.setMarker(this.grid[y][x]);
        this.touchFirst = e;
    }
};

GAME.Game.prototype.setMarker = function(cell) {

    this.cellFirst = cell;
    this.marker.visible = cell != null;

    if (this.marker.visible) {

        this.marker.position.x = cell.position.x;
        this.marker.position.y = cell.position.y;
        this.marker.visible = true;
    }
}

GAME.Game.prototype.trySwap = function(cell1, cell2) {

    var self = this;

    // check if there will be valid rows
    var chain1 = this.getChains(cell1.gridY, cell1.gridX, cell2);
    var chain2 = this.getChains(cell2.gridY, cell2.gridX, cell1);

    cell1.moveTo(cell2.position.x, cell2.position.y);
    cell2.moveTo(cell1.position.x, cell1.position.y, function() {

        if (chain1.cells.length === 0 && chain2.cells.length === 0) {

            console.log('invalid move, swap back');
            cell1.moveTo(cell2.position.x, cell2.position.y);
            cell2.moveTo(cell1.position.x, cell1.position.y);
        } else {

            console.log('valid move, swap cells');

            self.grid[cell1.gridX][cell1.gridY] = cell2;
            self.grid[cell2.gridX][cell2.gridY] = cell1;

            // and switch coordinate values
            var tmpX = cell1.gridX;
            var tmpY = cell1.gridY;
            cell1.gridX = cell2.gridX;
            cell1.gridY = cell2.gridY;
            cell2.gridX = tmpX;
            cell2.gridY = tmpY;


            for (var i = 0; i < chain1.cells.length; i++) {
                console.log(chain1.cells[i].gridY + ' : ' + chain1.cells[i].gridY);
            };

            console.log('----------------');

            for (var i = 0; i < chain2.cells.length; i++) {
                console.log(chain2.cells[i].gridY + ' : ' + chain2.cells[i].gridY);
            };


            // EXTERMINATE!!!
            self.clearRows();
        }
    });
};

GAME.Game.prototype.clearRows = function(chain) {

    console.log(chain);

    for (var i = 0; i < chain.length; i++) {
        for (var j = 0; j < chain[i].length; j++) {
            var cell = chain[i][j];

            if (cell) {
                cell.inactive = false;
                cell.explode();
            }
        }
    }

    // drop new candies

};


// Candy --------------------------------------------------------

GAME.Candy = function(kind) {

    PIXI.Sprite.call(this, PIXI.Texture.fromImage('images/candy_' + kind + '.png'));

    this.kind = kind;
    this.active = true;
    this.selected = false;

    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    // DEBUG
    /*var infoText = new PIXI.Text('x/y', {
        font: '9px Arial',
        fill: '#000000',
        dropShadow: true,
        dropShadowColor: '#FFFFFF',
        dropShadowDistance: 1
    });
    infoText.x = -GAME.cellSize / 2;
    infoText.y = -GAME.cellSize / 2;
    this.addChild(infoText);*/
}

GAME.Candy.prototype = Object.create(PIXI.Sprite.prototype);
GAME.Candy.prototype.constructor = GAME.Candy;

GAME.Candy.prototype.moveTo = function(xTo, yTo, next) {

    TweenLite.to(this.position, 0.2, {
        x: xTo,
        y: yTo,
        onComplete: next || GAME.noop
    });
};

GAME.Candy.prototype.explode = function(next) {

    TweenLite.to(this, 0.5, {
        alpha: 0,
        onComplete: next || GAME.noop
    });
};
