
// Enemies our player must avoid
var Enemy = function () {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.enemyStartY = [143, 226, 309];
  this.enemyStartX = -100;
  this.sprite = 'images/enemy-bug.png';
  this.initEnemy();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += this.speed * dt;
  if (this.x >= 500) {
    this.initEnemy();
  }
  if (this.hasCollision()) {
    player.reset();
    removeHeart();
  }
};

// check collision with player and enemy
Enemy.prototype.hasCollision = function () {
  if (
    Math.abs(this.x - player.x) < 60 &&
    Math.abs(this.y - player.y) < 40
  ) {
    return true;
  }
}

// Set the enemy starting location and speed
Enemy.prototype.initEnemy = function () {
  this.speed = Math.floor(Math.random() * 200) + 200;
  this.x = (Math.floor(Math.random() * 300) * -1) + this.enemyStartX;
  this.y = this.enemyStartY[Math.floor(Math.random() * this.enemyStartY.length)];
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.stopEnemy = function () {
  this.x = -500;
  this.y = -500;
  this.speed = 0;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
  this.x = 202;
  this.y = 458;
  this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function () {
};

Player.prototype.reset = function () {
  this.x = 202;
  this.y = 458;
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function (keyNum) {
  if (gameRunning) {
    switch (keyNum) {
      case 'left': {
        if (this.x > 100) {
          this.x -= 101;
        }
        return;
      }
      case 'right': {
        if (this.x < 400) {
          this.x += 101;
        }
        return;
      }
      case 'up': {
        if (this.y < 200) {
          this.reset();
          return;
        }
        this.y -= 83;
        return;
      }
      case 'down': {
        if (this.y < 400) {
          this.y += 83;
        }
        return;
      }
    }
  }
}

var Heart = function (x) {
  this.x = x;
  this.y = 40;
  this.sprite = 'images/Heart.png'
}

this.Heart.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

function removeHeart() {
  if (hearts.length > 0) {
    hearts.pop();
    if (hearts.length === 0) {
      gameOver();
    }
  }
}

function gameOver() {
  allEnemies.forEach(function (enemy) {
    enemy.stopEnemy();
  });
  gameRunning = false;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var allEnemies = [enemy1, enemy2, enemy3];

var heart1 = new Heart(400);
var heart2 = new Heart(300)
var heart3 = new Heart(200);
var hearts = [heart1, heart2, heart3];

var player = new Player();

var gameRunning = true;