'use strict';

// Game math
(function (math2) {

  math2.random = function (from, to) {
    return Math.random() * (to - from) + from;
  };

  math2.map = function (val, inputMin, inputMax, outputMin, outputMax) {
    return ((outputMax - outputMin) * ((val - inputMin) / (inputMax - inputMin))) + outputMin;
  };

  math2.randomPlusMinus = function (chance) {
    chance = chance ? chance : 0.5;
    return (Math.random() > chance) ? -1 : 1;
  };

  math2.randomInt = function (from, to) {
    to += 1;
    return Math.floor(Math.random() * (to - from) + from);
  };

  math2.randomBool = function (chance) {
    chance = chance ? chance : 0.5;
    return (Math.random() < chance) ? true : false;
  };



}(window.Math2 = window.Math2 || {}));
