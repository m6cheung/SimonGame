$(document).ready(function() { 
  var $red = $('#red');
  var $green = $('#green');
  var $blue = $('#blue');
  var $yellow = $('#yellow');
  $green.val('1');
  $red.val('2');
  $blue.val('3');
  $yellow.val('4');
  var gSound = $('#greenSound')[0];
  var rSound = $('#redSound')[0];
  var bSound = $('#blueSound')[0];
  var ySound = $('#yellowSound')[0];
  var wrong = $('#wrong')[0];
  var $start = $('.start');
  var $reset = $('.reset');
  var $easy = $('.easy');
  var $strict = $('.strict');
  var $win = $('.win');
  var $message = $('.message');
  var $level = $('.level');
  var int1, int2, int3, int4, int5, int6, int7;
  var time  = 1000;
  var strict = false;
  var playerTurn = false;
  var gameOn = false;
  var random = [
    {
      sound: gSound,
      color: $green
    },
    {
      sound: rSound,
      color: $red
    },
    {
      sound: bSound,
      color: $blue
    },
    {
      sound: ySound,
      color: $yellow
    }];
  var seqTimeouts = [];
  var cpuSeq = [];
  var cpuData = [];
  var playerData = [];
  var cpu = [];
  var player = [];
  
  $easy.toggle();
  $reset.toggle();
  
  function changeMode() {
    if(strict) {
      if(player.join('').substring(0) !== cpuData.join('').substring(0, player.length)) {
        $reset.click();
        $start.click();
      }
    }
  }
  
  function winner() {
    $win.html("YOU WIN!");
    setTimeout(function() {
      $win.html("");
    }, 2000);
    $reset.click();
    $start.click();
  }
  
  function resetGame() {
    wrong.play();
    player = [];
    cpu = [];
    time = 1000;
    $.each(cpuSeq, function(index, colorObj) {
      seqTimeouts.push(setTimeout(function() {
        colorObj.color.trigger('mousedown');
        colorObj.sound.play();
      }, time));
      seqTimeouts.push(int2 = setTimeout(function() {
        colorObj.color.trigger('mouseup');
      }, time + 200));
      time += 1000;
      cpu.push(colorObj.color.val());
      if(cpu[cpuData.length] != undefined) {
        cpuData.push(cpu[cpuData.length]);
      }
    });
    setTimeout(function() {
      playerTurn = true;;
    }, time);
  }
  
  function initialMove() {
    var randomPick = Math.floor(Math.random() * random.length);
    seqTimeouts.push(setTimeout(function() {
      random[randomPick].color.trigger('mousedown');
      random[randomPick].sound.play();
    }, time));
    seqTimeouts.push(setTimeout(function() {
      random[randomPick].color.trigger('mouseup');
      playerTurn = true;
    }, time + 500));
    cpu.push(random[randomPick].color.val());
    if(cpu[cpuData.length] != undefined) {
      cpuData.push(cpu[cpuData.length]);
    }
    cpuSeq.push(random[randomPick]);
  }
  
  function cpuMove() {
    playerTurn = false;
    time = 1000;
    player = [];
    cpu = [];
    $.each(cpuSeq, function(index, colorObj) {
      seqTimeouts.push(setTimeout(function() {
        colorObj.color.trigger('mousedown');
        colorObj.sound.play();
      }, time));
      seqTimeouts.push(setTimeout(function() {
        colorObj.color.trigger('mouseup');
      }, time + 200));
      time += 1000;
      cpu.push(colorObj.color.val());
      if(cpu[cpuData.length] != undefined) {
        cpuData.push(cpu[cpuData.length]);
      }
    });
    setTimeout(initialMove(), time);
    $level.html('Current Level: ' + cpuData.length);
    console.log(cpu);
  }
  
  $start.click(function() {
    gameOn = true;
    $start.hide();
    $reset.show();
    if(cpu.length === 0) {
      initialMove();
      $level.html('Current Level: ' + cpuData.length)
    }
  });
  
  $reset.click(function() {
    time = 1000;
    $.each(seqTimeouts, function(ind, timeouts) {
      clearTimeout(timeouts);
    });
    playerTurn = false;
    gameOn = false;
    seqTimeouts = [];
    $reset.hide();
    $start.show();
    cpuSeq  = [];
    player = [];
    cpu = [];
    cpuData = [];
    $level.html('Current Level: ' + cpuData.length)
  });
  
  function strictEasy() {
    $strict.toggle();
    $easy.toggle();
  }
  
  $strict.click(function() {
    if(!gameOn) {
      strictEasy();
      strict = true;
      $message.html("STRICT MODE - ONE life");
    } else {
      $win.html("Canot switch difficulty while game game is in session!");
      setTimeout(function() {
        $win.html('');
      }, 1000);
    }
  });
  
  $easy.click(function() {
    if(!gameOn) {
      strictEasy();
      strict = false;
      $message.html("EASY MODE - UNLIMITED lives");
    } else {
      $win.html("Canot switch difficulty while game game is in session!");
      setTimeout(function() {
        $win.html('');
      }, 1000);
    }
  });
  
  $green.mousedown(function() {
    if(gameOn) {
      $green.css('background-color', '#00FF00');
    }
  });
  
  $green.mouseup(function() {
    if(gameOn) {
      $green.css('background-color', '#00AA00');
    }
  });
  
  $red.mousedown(function() {
    if(gameOn) {
      $red.css('background-color', '#ff0000');
    }
  });
  
  $red.mouseup(function() {
    if(gameOn) {
      $red.css('background-color', '#CC0000');
    }
  });
  
  $blue.mousedown(function() {
    if(gameOn) {
      $blue.css('background-color', '#0000FF');
    }
  });
  
  $blue.mouseup(function() {
    if(gameOn) {
      $blue.css('background-color', '#000088');
    }
  });
  
  $yellow.mousedown(function() {
    if(gameOn) {
      $yellow.css('background-color', '#FFFF30');
    }
  });
  
  $yellow.mouseup(function() {
    if(gameOn) {
      $yellow.css('background-color', '#DDDD30');
    }
  });
 
  $green.click(function() {
    if(playerTurn && gameOn) {
      gSound.play();
      player.push($(this).val());
      if(player.join('').substring(0) !== cpuData.join('').substring(0, player.length) && !strict) {
        playerTurn = false;
        resetGame();
      } else if(strict && player.join('').substring(0) !== cpuData.join('').substring(0, player.length)) {
        wrong.play();
        $reset.click();
        $start.click();
      }
      if(player.length === 20) {
        winner();
      } else if (cpu.length === player.length) {
        cpuMove();
      }
    } else {
      return;
    }
  });
  
  $red.click(function() {
    if(playerTurn && gameOn) {
      rSound.play();
      player.push($(this).val());
      if(player.join('').substring(0) !== cpuData.join('').substring(0, player.length) && !strict) {
        playerTurn = false;
        resetGame();
      } else if(strict && player.join('').substring(0) !== cpuData.join('').substring(0, player.length)) {
        wrong.play();
        $reset.click();
        $start.click();
      }
      if(player.length === 20) {
        winner();
      } else if (cpu.length === player.length) {
        cpuMove();
      }
    } else {
      return;
    }
  });
  
  $blue.click(function() {
    if(playerTurn && gameOn) {
      bSound.play();
      player.push($(this).val());
      if(player.join('').substring(0) !== cpuData.join('').substring(0, player.length) && !strict) {
        playerTurn = false;
        resetGame();
      } else if(strict && player.join('').substring(0) !== cpuData.join('').substring(0, player.length)) {
        wrong.play();
        $reset.click();
        $start.click();
      }
      if(player.length === 20) {
        winner();
      } else if (cpu.length === player.length) {
        cpuMove();
      }
    } else {
      return;
    }
  });
  
  $yellow.click(function() {
    if(playerTurn && gameOn) {
      ySound.play();
      player.push($(this).val());
      if(player.join('').substring(0) !== cpuData.join('').substring(0, player.length) && !strict) {
        playerTurn = false;
        resetGame();
      } else if(strict && player.join('').substring(0) !== cpuData.join('').substring(0, player.length)) {
        wrong.play();
        $reset.click();
        $start.click();
      }
      if(player.length === 20) {
        winner();
      } else if (cpu.length === player.length) {
        cpuMove();
      }
    } else {
      return;
    }
  }); 
})