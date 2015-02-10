// http://www.raywenderlich.com/66877/how-to-make-a-game-like-candy-crush-part-1

// root namespace
var GAME = {};

GAME.noop = function() {};

GAME.Game = function() {

    this.cellKindMax = 5;
    this.gridSize = 70;
    this.renderWidth = 650;
    this.renderHeight = 650;
    this.score = 0;
    this.moves = 0;
    this.dragThreshold = 10;

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

    this.devicePixelRatio = window.devicePixelRatio;
    this.grid = [];

};

GAME.Game.prototype.constructor = GAME.Game;

GAME.Game.prototype.init = function(kinds) {

    var halfSize = this.gridSize / 2;
    for (var y = 0; y <= this.gridMaxHeight; y++) {

        this.grid[y] = [];
        for (var x = 0; x <= this.gridMaxWidth; x++) {

            if (this.gridMap[y][x] == 0) {
                continue;
            }

            var kind = kinds ? kinds[y][x] : Math2.randomInt(0, this.cellKindMax);
            var cell = new GAME.Candy(kind);

            cell.gridX = x;
            cell.gridY = y;
            cell.position.x = halfSize + x * this.gridSize;
            cell.position.y = halfSize + y * this.gridSize;

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

        return this.gridMap[y][x] !== 0;
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

    for (var y = atY - 1; y >= 0 && this._getChainsCheck(y, atX, targetCell, chainv); y--) {}

    for (var y = atY + 1; y <= this.gridMaxHeight && this._getChainsCheck(y, atX, targetCell, chainv); y++) {}

    if (chainv.length >= 2) {
        result.cells = chainv;
        result.rows++;
    }

    // horizontal
    var chainh = [];

    for (var x = atX - 1; x >= 0 && this._getChainsCheck(atY, x, targetCell, chainh); x--) {}

    for (var x = atX + 1; x <= this.gridMaxWidth && this._getChainsCheck(atY, x, targetCell, chainh); x++) {}

    if (chainh.length >= 2) {
        result.cells = result.cells.concat(chainh);
        result.rows++;
    }

    if (result.cells.length >= 2) {
        result.cells.push(targetCell);
    }

    return result;
};













// Config
GAME.cellKindMax = 5;
GAME.gridSize = 70;
GAME.renderWidth = 650;
GAME.renderHeight = 650;
GAME.score = 0;
GAME.moves = 0;
GAME.dragThreshold = 10;

GAME.movesMax = 15;
GAME.scoreMax = 1000;
GAME.gridMap = [
    [0, 1, 1, 0, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1],
    [0, 0, 1, 1, 0, 1, 1, 0, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 0, 0, 0, 1, 1, 0],
];

GAME.gridMaxHeight = GAME.gridMap[0].length - 1;
GAME.gridMaxWidth = GAME.gridMap.length - 1;

GAME.devicePixelRatio = window.devicePixelRatio;
GAME.grid = [];

GAME.noop = function() {};

GAME.init = function(kinds) {

    var halfSize = this.gridSize / 2;
    for (var y = 0; y <= this.gridMaxHeight; y++) {

        this.grid[y] = [];
        for (var x = 0; x <= this.gridMaxWidth; x++) {

            if (this.gridMap[y][x] == 0) {
                continue;
            }

            var kind = kinds ? kinds[y][x] : Math2.randomInt(0, this.cellKindMax);
            var cell = new this.Candy(kind);

            cell.gridX = x;
            cell.gridY = y;
            cell.position.x = halfSize + x * this.gridSize;
            cell.position.y = halfSize + y * this.gridSize;

            this.grid[y][x] = cell;
            this.stage.addChild(cell);

        }
    }
};

GAME.stage = new PIXI.Stage(0xFFFFFF);

GAME.run = function() {

    var self = this;

    // create a renderer instance.
    self.renderer = PIXI.autoDetectRenderer(
        self.renderWidth,
        self.renderHeight
    );

    // add the renderer view element to the DOM
    document.body.appendChild(self.renderer.view);

    self.animate = function() {

        requestAnimFrame(self.animate);

        // render the stage
        self.renderer.render(self.stage);
    }

    requestAnimFrame(self.animate);

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

GAME.touchMove = function(e) {
    if (this.touchFirst && this.touching) {
        // TODO: add dragging support
    }
};

GAME.touchUp = function(e) {
    this.touching = false;
};

GAME.touchDown = function(e) {
    this.touching = true;

    if (this.cellFirst) {
        var y = Math.floor(e.y / this.gridSize);
        var x = Math.floor(e.x / this.gridSize);

        if (this.isInBounds(y, x)) {
            if (this.cellFirst.gridX === x && this.cellFirst.gridY === y) {

                console.log('cancel selection');

            } else {

                console.log('swap with: ' + y + ' ' + x);

                this.trySwap(this.cellFirst, this.grid[y][x]);
            }

            this.cellFirst = null;
            this.touchFirst = null;
        }

    } else {
        var y = Math.floor(e.y / this.gridSize);
        var x = Math.floor(e.x / this.gridSize);

        if (this.isInBounds(y, x)) {
            this.cellFirst = this.grid[y][x];
            this.touchFirst = e;

            console.log('touch start: ' + this.cellFirst.gridY + ' ' + this.cellFirst.gridX);
        }
    }
};

GAME.handleInput = function(e1, e2) {

    var diffX = e1.x - e2.x;
    var diffY = e1.y - e2.y;
    var changeY = Math.abs(diffY) >= this.dragThreshold;
    var changeX = Math.abs(diffX) >= this.dragThreshold;

    if (changeY || changeX) {

        var x1 = Math.floor(e1.y / this.gridSize);
        var y1 = Math.floor(e1.x / this.gridSize);

        this.touchFirst = null;

        console.log(x1 + ' ' + y1);
    }

};

GAME.isInBounds = function(y, x) {

    if (x >= 0 && y >= 0 && x <= this.gridMaxWidth & y <= this.gridMaxHeight) {
        return this.gridMap[y][x] !== 0;
    }

    return false;
};

GAME._getChainsCheck = function(y, x, targetCell, chain) {

    if (this.gridMap[y][x] !== 0) {

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

GAME.getChains = function(atY, atX, targetCell) {

    var result = {
        cells: [],
        rows: 0
    };

    // vertical
    var chainv = [];

    for (var y = atY - 1; y >= 0 && this._getChainsCheck(y, atX, targetCell, chainv); y--) {}

    for (var y = atY + 1; y <= this.gridMaxHeight && this._getChainsCheck(y, atX, targetCell, chainv); y++) {}

    if (chainv.length >= 2) {
        result.cells = chainv;
        result.rows++;
    }

    // horizontal
    var chainh = [];

    for (var x = atX - 1; x >= 0 && this._getChainsCheck(atY, x, targetCell, chainh); x--) {}

    for (var x = atX + 1; x <= this.gridMaxWidth && this._getChainsCheck(atY, x, targetCell, chainh); x++) {}

    if (chainh.length >= 2) {
        result.cells = result.cells.concat(chainh);
        result.rows++;
    }

    if (result.cells.length >= 2) {
        result.cells.push(targetCell);
    }

    return result;
};

GAME.trySwap = function(cell1, cell2) {

    var self = this;

    // check if there will be valid rows
    var chains1 = this.getChains(cell1.gridY, cell1.gridX, cell2);
    var chains2 = this.getChains(cell2.gridY, cell2.gridX, cell1);

    cell1.moveTo(cell2.position.x, cell2.position.y);
    cell2.moveTo(cell1.position.x, cell1.position.y, function() {

        if (chains1.length === 0 && chains2.length === 0) {
            // invalid move, swap back
            cell1.moveTo(cell2.position.x, cell2.position.y);
            cell2.moveTo(cell1.position.x, cell1.position.y);
        } else {

            // valid move, swap cells
            self.grid[cell1.gridX][cell1.gridY] = cell2;
            self.grid[cell2.gridX][cell2.gridY] = cell1;

            // and switch coordinate values
            var tmpX = cell1.gridX;
            var tmpY = cell1.gridY;
            cell1.gridX = cell2.gridX;
            cell1.gridY = cell2.gridY;
            cell2.gridX = tmpX;
            cell2.gridY = tmpY;


            // EXTERMINATE!!!
            self.clearRows(chains1.concat(chains2));
        }
    });
};

GAME.clearRows = function(chain) {

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
