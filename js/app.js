

; (function (global) {


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
      score.updateScore(-5);
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

  // Now write your own player class
  // This class requires an update(), render() and
  // a handleInput() method.
  var Player = function () {
    this.sprite = 'images/char-boy.png';
    this.init();
  }

  Player.prototype.init = function () {
    this.x = 202;
    this.y = 458;
  }

  Player.prototype.reset = function () {
    gems.forEach(function (gem) {
      gem.init();
    });
    this.x = 202;
    this.y = 458;
  };

  Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  Player.prototype.handleInput = function (keyNum) {
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
          score.updateScore(10);
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

  var Heart = function (x) {
    this.x = x;
    this.y = 40;
    this.sprite = 'images/Heart.png'
  }

  Heart.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  var Score = function () {
    this.score = 0;
  }

  Score.prototype.render = function () {
    ctx.font = 'bold 40px Arial';
    ctx.fillText(this.score, 0, 120);
  }

  Score.prototype.updateScore = function (score) {
    this.score += score;
  }

  var Gem = function () {
    this.inPlay = true;
    this.init();
  }

  Gem.prototype.init = function () {
    this.inPlay = true;
    this.gemSprites = ['images/gem-blue.png', 'images/gem-green.png', 'images/gem-orange.png'];
    this.sprite = this.gemSprites[Math.floor(Math.random() * this.gemSprites.length)];
    this.x = Math.floor(Math.random() * 5) * 101;
    this.y = 134 + Math.floor(Math.random() * 3) * 83;
  }

  Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  Gem.prototype.update = function () {
    if (this.inPlay) {
      if (Math.floor(Math.random() * 1000) === 500) {
        this.init();
      }
      if (this.hasCollision()) {
        if (this.sprite === 'images/gem-blue.png') {
          score.updateScore(100);
        } else if (this.sprite === 'images/gem-green.png') {
          score.updateScore(200);
        } else {
          score.updateScore(50);
        }
        this.removeGem();
      }
    }
  }

  Gem.prototype.hasCollision = function () {
    if (
      Math.abs(this.x - player.x) < 50 &&
      Math.abs(this.y - player.y) < 41
    ) {
      return true;
    }
  }

  Gem.prototype.removeGem = function () {
    this.x = 1000;
    inPlay = false;
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
    processHighScore();
    allEnemies.forEach(function (enemy) {
      enemy.initEnemy();
    });
    gems.forEach(function (gem) {
      gem.removeGem();
    });
    document.querySelector('.modal__score').textContent = score.score;
    document.querySelector('.modal__background').style.display = "block";
    stopGame();
  }

  function processHighScore() {
    if (localStorage === undefined) {
      document.querySelector('.modal__message').textContent = 'Sorry, local storage is not enabled';
      return;
    }

    let currentHighScore;
    if (localStorage.getItem('highScore') !== null) {
      currentHighScore = Number.parseInt(localStorage.getItem('highScore'));
    } else {
      currentHighScore = score.score;
    }

    if (score.score >= currentHighScore) {
      createPositiveMessage(score.score);
    } else {
      createNegativeMessage(currentHighScore);
    }
  }

  function createPositiveMessage(score) {
    document.querySelector('.modal__message').textContent = `Nice!  You got the new High Score!`;
    document.querySelector('.modal__highscore').textContent = `High Score:  ${score}`;
  }

  function createNegativeMessage(score) {
    document.querySelector('.modal__message').textContent = `Sorry!  Keep trying!`;
    document.querySelector('.modal__highscore').textContent = `High Score:  ${score}`;

  }

  function resetHearts() {
    hearts = [heart1, heart2, heart3];
  }

  function resetGems() {
    gems.forEach(function (gem) {
      gem.init();
    });
  }

  function resetGame() {
    score.score = 0;
    player.init();
    document.querySelector('.modal__background').style.display = "none";
    resetHearts();
    resetGems();
    reset();
  }

  const enemy1 = new Enemy();
  const enemy2 = new Enemy();
  const enemy3 = new Enemy();
  const heart1 = new Heart(400);
  const heart2 = new Heart(300);
  const heart3 = new Heart(200);
  const gem1 = new Gem();
  const gem2 = new Gem();
  const gem3 = new Gem();

  global.hearts = [heart1, heart2, heart3];
  global.allEnemies = [enemy1, enemy2, enemy3];
  global.gems = [gem1, gem2, gem3];
  global.score = new Score();
  global.player = new Player();
  global.resetGame = resetGame;

})(this);