'use strict';

// IIFE to hide from global scope
; (function (global) {

    // Window constants
    const RIGHT_EDGE_OF_SCREEN = 500;
    const HALF_BLOCK_WIDTH = 60;
    const HALF_BLOCK_HEIGHT = 40;
    const BLOCK_WIDTH = 101;
    const BLOCK_HEIGHT = 83;
    const NUM_ROWS = 3;
    const NUM_COLS = 5;
  
    // Enemy constants
    const ENEMY_BASE_SPEED = 200;
    const ENEMY_START_X = -100;
    const ENEMY_START_Y = [143, 226, 309];
    const ENEMY_RANDOM_X = 300;
  
    // Player constants
    const PLAYER_START_X = 202;
    const PLAYER_START_Y = 458;
  
    // Heart constants
    const HEART_START_Y = 40;
    const HEART_START_X = [400, 300, 200];
  
    // Gem constants
    const GEM_RANDOMNESS = 1000;
    const GEM_OFFSET = 134;
  
    // Point contants
    const POINT_GOAL = 10;
    const POINT_COLLISION = -5;
    const POINT_GREEN = 200;
    const POINT_BLUE = 100;
    const POINT_ORANGE = 50;
  
    // Score constants
    const SCORE_X = 0;
    const SCORE_Y = 120;
  
  // Common properties:
  // x, y, and sprite name
  // Common functions: 
  // render and collision detection
  var Entity = function ({ x, y, sprite }) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
  };

  // Common render method for all Entity objects
  Entity.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  // check for collisions between entities
  // by checking the absolute difference between
  // the two entities is less than half the width/height 
  // of a block size
  Entity.prototype.hasCollision = function (otherEntity) {
    if (
      Math.abs(this.x - otherEntity.x) < HALF_BLOCK_WIDTH &&
      Math.abs(this.y - otherEntity.y) < HALF_BLOCK_HEIGHT
    ) {
      return true;
    }
  };

  // Enemies our player must avoid
  var Enemy = function () {

    // these values are the constant Y values
    // that are equal to the values of the
    // rock blocks
    this.speed = Math.floor(Math.random() * ENEMY_BASE_SPEED) + ENEMY_BASE_SPEED;

    let x = (Math.floor(Math.random() * ENEMY_RANDOM_X) * -1) + ENEMY_START_X;
    let y = ENEMY_START_Y[Math.floor(Math.random() * ENEMY_START_Y.length)];

    Entity.call(this, { x, y, sprite: 'images/enemy-bug.png' });
  };

  // Attach the Enemy as a sublcass of Entity
  Enemy.prototype = Object.create(Entity.prototype);
  Enemy.prototype.constructor = Enemy;

  // Parameter: dt, a time delta between ticks
  Enemy.prototype.update = function (dt) {
    this.x += this.speed * dt;

    // if enemy runs off the screen
    // then reset themselves back to the left
    if (this.x >= RIGHT_EDGE_OF_SCREEN) {
      this.reset();
    }

    // if player collides remove a heart
    // subtract 5 points, reset gems,
    // and reset them back to beginning
    if (this.hasCollision(player)) {
      score.updateScore(POINT_COLLISION);
      player.reset();
      gems.forEach(function(gem) {
        gem.reset();
      });
      removeHeart();
    }
  };

  // Set the enemy random starting location and speed
  Enemy.prototype.reset = function () {
    this.speed = Math.floor(Math.random() * ENEMY_BASE_SPEED) + ENEMY_BASE_SPEED;
    this.x = (Math.floor(Math.random() * ENEMY_RANDOM_X) * -1) + ENEMY_START_X;
    this.y = ENEMY_START_Y[Math.floor(Math.random() * ENEMY_START_Y.length)];
  };

  // Player object that moves around the screen
  var Player = function () {
    Entity.call(this, { x: PLAYER_START_X, y: PLAYER_START_Y, sprite: 'images/char-boy.png' });
  };

  // Attach the Player as a subclass of Entity
  Player.prototype = Object.create(Entity.prototype);
  Player.prototype.constructor = Player;

  // if player makes it to the end
  // or gets hit by an enemy
  Player.prototype.reset = function () {
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
  };

  // handles the keyboard input
  // adding 10 to the score if they
  // make it to the end 
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
          score.updateScore(POINT_GOAL);
          gems.forEach(function(gem) {
            gem.reset();
          });
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
  };

  // Heart object used to display
  // the number of lives the player has left
  // They start with 3 lives.
  var Heart = function (x) {
    Entity.call(this, { x, y: HEART_START_Y, sprite: 'images/heart.png' });
  };

  // Attach the Heart as a sublcass of Entity
  Heart.prototype = Object.create(Entity.prototype);
  Heart.prototype.constructor = Heart;

  // Gems object that is used to
  // increase the players score
  // they randomly appear and move
  // around randomly
  var Gem = function () {
    this.inPlay = true;
    this.gemSprites = ['images/gem-blue.png', 'images/gem-green.png', 'images/gem-orange.png'];
    let sprite = this.gemSprites[Math.floor(Math.random() * this.gemSprites.length)];
    let x = Math.floor(Math.random() * NUM_COLS) * BLOCK_WIDTH;
    let y = GEM_OFFSET + Math.floor(Math.random() * NUM_ROWS) * BLOCK_HEIGHT;
    Entity.call(this, {x, y, sprite});
  };

  // Attach the Gem as a sublcass of Entity
  Gem.prototype = Object.create(Entity.prototype);
  Gem.prototype.constructor = Gem;

  Gem.prototype.reset = function () {
    this.inPlay = true;
    this.sprite = this.gemSprites[Math.floor(Math.random() * this.gemSprites.length)];
    this.x = Math.floor(Math.random() * NUM_COLS) * BLOCK_WIDTH;
    this.y = GEM_OFFSET + Math.floor(Math.random() * NUM_ROWS) * BLOCK_HEIGHT;
  };

  // Gems are randomly moved if 1/1000th chance
  // on every update
  // Gem points are setup as 
  // green = 200
  // blue = 100
  // orange = 50
  // If player makes it across to the
  // other side the gems reappear by 
  // updating the "inPlay" property
  Gem.prototype.update = function () {
    if (this.inPlay) {
      if (Math.floor(Math.random() * GEM_RANDOMNESS) === 0) {
        this.reset();
      }
      if (this.hasCollision(player)) {
        if (this.sprite === 'images/gem-blue.png') {
          score.blueGems++;
          score.updateScore(POINT_BLUE);
        } else if (this.sprite === 'images/gem-green.png') {
          score.greenGems++;
          score.updateScore(POINT_GREEN);
        } else {
          score.orangeGems++;
          score.updateScore(POINT_ORANGE);
        }
        this.removeGem();
      }
    }
  };

  // remove the gem by moving it off the page
  // instead of recreating the object
  Gem.prototype.removeGem = function () {
    this.x = 1000;
    this.inPlay = false;
  };

  // Score object used to display
  // the players current score
  // This object also keeps track of how 
  // many gems they have collected.
  var Score = function () {
    this.score = 0;
    this.greenGems = 0;
    this.blueGems = 0;
    this.orangeGems = 0;
  };

  // reset function if player wants
  // to play again
  Score.prototype.reset = function () {
    this.score = 0;
    this.greenGems = 0;
    this.blueGems = 0;
    this.orangeGems = 0;
  };

  Score.prototype.render = function () {
    ctx.font = 'bold 40px Arial';
    ctx.fillText(this.score, SCORE_X, SCORE_Y);
  };

  Score.prototype.updateScore = function (score) {
    this.score += score;
  };

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

  // function for when player runs out of hearts
  // 1.  it updates the local storage high score (if needed)
  // 2.  stops the updating of the game by changing the 
  //     isRunning variable within the "Engine"
  // 3.  it removes gems and enemies
  // 4.  Displays modal after updating the score/highscore
  function gameOver() {
    processHighScore();
    allEnemies.forEach(function (enemy) {
      enemy.reset();
    });
    gems.forEach(function (gem) {
      gem.removeGem();
    });
    document.querySelector('.modal__score').textContent = `Final Score: ${score.score}`;
    document.querySelector('.modal__background').style.display = "block";
    displayGems();
    stopGame();
  }

  // displays the number of gems the player collected on the
  // game over modal
  function displayGems() {
    document.querySelector('.modal__gems__green').textContent = score.greenGems;
    document.querySelector('.modal__gems__blue').textContent = score.blueGems;
    document.querySelector('.modal__gems__orange').textContent = score.orangeGems;
  }

  // function that updates the local storage high score (if available)
  // depending on if the player beats the high score, a different message
  // is displayed
  function processHighScore() {
    if (localStorage === undefined) {
      document.querySelector('.modal__message').textContent = 'Sorry, local storage is not enabled';
      return;
    }

    let currentHighScore;

    // check if the highscore variable has not be saved yet (first time playing)
    if (localStorage.getItem('highScore') !== null) {
      currentHighScore = Number.parseInt(localStorage.getItem('highScore'));
    } else {
      currentHighScore = score.score;
    }

    if (score.score >= currentHighScore) {
      createPositiveMessage(score.score);
      localStorage.setItem('highScore', "" + score.score);
    } else {
      createNegativeMessage(currentHighScore);
    }
  }

  function createPositiveMessage(score) {
    document.querySelector('.modal__message').textContent = `Nice!  You got the new High Score!`;
    document.querySelector('.modal__highscore').textContent = `High Score:  ${score}`;
  }

  function createNegativeMessage(score) {
    document.querySelector('.modal__message').textContent = `Keep trying!!`;
    document.querySelector('.modal__highscore').textContent = `High Score:  ${score}`;

  }

  // resets the hearts back to 3 when player wants to play again
  function resetHearts() {
    hearts = [heart1, heart2, heart3];
  }

  // starts the game back when player wants to play again
  function resetGame() {
    score.score = 0;
    player.reset();
    score.reset();
    document.querySelector('.modal__background').style.display = "none";
    resetHearts();
    reset();
  }

  // Objects created
  const enemy1 = new Enemy();
  const enemy2 = new Enemy();
  const enemy3 = new Enemy();

  // The argument is the Heart's X value
  const heart1 = new Heart(HEART_START_X[0]);
  const heart2 = new Heart(HEART_START_X[1]);
  const heart3 = new Heart(HEART_START_X[2]);
  const gem1 = new Gem();
  const gem2 = new Gem();
  const gem3 = new Gem();

  // objects that are shown to the global name space
  // this access is needed by the "Engine" to properly
  // render/update the objects
  global.hearts = [heart1, heart2, heart3];
  global.allEnemies = [enemy1, enemy2, enemy3];
  global.gems = [gem1, gem2, gem3];
  global.score = new Score();
  global.player = new Player();
  global.resetGame = resetGame;

})(this);

// attach a listener that will randomly change the background
// color of the modal on hover
// (colors are the colors of the gems)
(function randomButtonColor() {
  let button = document.querySelector('.modal__button');
  button.addEventListener('mouseover', function (event) {
    const colors = ['orange', 'blue', 'green'];
    this.className = `${colors[Math.floor(Math.random() * colors.length)]}-gem modal__button`;
  });
})();