$(document).ready(function() {
  var playerName = 'Player One';
  var rivalName = 'Gary';

function pokeMap() {

  var $body = $('body');
  var $pokeMap = $('.pokeMap');
  var $connectFour = $('.connectFour');
  var $player = $('#player');
  var $submitName = $('.submitButton');

  $submitName.click(function() {
    playerName = $('#playerNameVal').val();
    rivalName = $('#rivalNameVal').val();
  });

  // map is an array of all 144 pixels
  var $map = $('.map .row div');

  $body.keypress(pokeMapKeys);

    function pokeMapKeys(event) {
    var playerIndex = 0;
    for (var i = 0; i < $map.length; i++) {
      if ($map[i].id === 'player') {
        playerIndex = i;
      }
    }
    if (event.which == 119 && $map[playerIndex - 12].style.backgroundColor !== 'rgb(0, 0, 0)') {
      $map[playerIndex].id = '';
      playerIndex -= 12;
      $map[playerIndex].id = 'player';
    } else if (event.which == 115 && $map[playerIndex + 12].style.backgroundColor !== 'rgb(0, 0, 0)') {
      $map[playerIndex].id = '';
      playerIndex += 12;
      $map[playerIndex].id = 'player';
    } else if (event.which == 97 && $map[playerIndex - 1].style.backgroundColor !== 'rgb(0, 0, 0)') {
      $map[playerIndex].id = '';
      playerIndex -= 1;
      $map[playerIndex].id = 'player';
    } else if (event.which == 100 && $map[playerIndex + 1].style.backgroundColor !== 'rgb(0, 0, 0)') {
      $map[playerIndex].id = '';
      playerIndex += 1;
      $map[playerIndex].id = 'player';
    }

    if ($map[playerIndex].className.split(' ')[2] === 'grass') {
      var randomPokemonBattle = randEncounter();
      if (randomPokemonBattle) {
        switchScreen(true);
      }
    } else if ($map[playerIndex].className.split(' ')[2] === 'rival') {
      switchScreen(false);
    }

  }

  function randEncounter(){
    var randNum = Math.floor(Math.random() * 8);
    if (randNum === 7) {
      return true;
    } else {
      return false;
    }
  }

  function switchScreen(isSinglePlayer) {
    $body.off('keypress', pokeMapKeys);
    document.querySelector('audio').pause();
    if (isSinglePlayer) {
      document.querySelector('audio').innerHTML = '<audio src="107-battle-vs-wild-pokemon-.mp3" autoplay loop></audio>';
    } else {
      document.querySelector('audio').innerHTML = '<audio src="115-battle-vs-trainer-.mp3" autoplay loop></audio>';
    }
    var timeoutID = window.setTimeout(flash, 2000);
    function flash() {
      var secondTimeoutID = window.setTimeout(flashing, 200);
      function flashing(){
        document.querySelector('.pokeMap').style.backgroundColor = 'rgba(0, 0, 0, 0)';
      }
      $pokeMap.css('display', 'none');
      $connectFour.css('display', 'block');
    }
    connectFourAPICall(isSinglePlayer);
  }
}



pokeMap();

function connectFourAPICall(isSinglePlayer) {
  function randNum() {
    var num = Math.floor(Math.random() * 151 + 2);
    return num.toString();
  }

  var randomPokemon = randNum();
  if (isSinglePlayer) {
    request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status < 400) {
        // var sprite = JSON.parse(this.responseText).image;
        // console.log(sprite);
        var name = JSON.parse(this.responseText).pokemon.name.charAt(0).toUpperCase() + JSON.parse(this.responseText).pokemon.name.slice(1);
        var img = $('<img class = "wiggler" src="./pokeImg/' +(randomPokemon - 1)+ '.png">');
        $('.wrapper').append(img);
        connectFourApp(name, isSinglePlayer);
      }
    };

    request.open('GET', 'https://jsonp.afeld.me/?url=http%3A%2F%2Fpokeapi.co%2Fapi%2Fv1%2Fsprite%2F'+randomPokemon+'%2F');
    request.send();
  } else {
    var img = $('<img class = "wiggler" src="./pokeImg/Gary.png">');
    $('.wrapper').append(img);
    connectFourApp(rivalName, isSinglePlayer);
  }
  }


function connectFourApp(name, isSinglePlayer) {

  var $pokeMap = $('.pokeMap');
  var $connectFour = $('.connectFour');

  // Column Variables
  var $space = $('.col');
  var $columnOne = $('.colOne');
  var $columnTwo = $('.colTwo');
  var $columnThree = $('.colThree');
  var $columnFour = $('.colFour');
  var $columnFive = $('.colFive');
  var $columnSix = $('.colSix');
  var $columnSeven = $('.colSeven');

  // Row Variables
  var $rowOne = $('.rowOne');
  var $rowTwo = $('.rowTwo');
  var $rowThree = $('.rowThree');
  var $rowFour = $('.rowFour');
  var $rowFive = $('.rowFive');
  var $rowSix = $('.rowSix');

  // column object
  var columnObject = {
    0: '.colOne',
    1: '.colTwo',
    2: '.colThree',
    3: '.colFour',
    4: '.colFive',
    5: '.colSix',
    6: '.colSeven'
  };

  // row object
  var rowObject = {
    0: '.rowOne',
    1: '.rowTwo',
    2: '.rowThree',
    3: '.rowFour',
    4: '.rowFive',
    5: '.rowSix'
  };

  // Color Variables
  var currColor = 'rgb(255, 0, 0)';
  var prevColor = 'rgb(255, 255, 0)';
  var placeColor = '#000000';


  // Player Variables
  var currPlayer = playerName;
  var prevPlayer = 0;

  if (isSinglePlayer) {
    prevPlayer = name;
  } else {
    prevPlayer = rivalName;
  }
  var placePlayer = 'Empty';

  // DOM manipulation for clarity
  document.querySelector('.titleRow h1').innerHTML = currPlayer + ' VS ' + prevPlayer + '!!!';
  document.querySelector('.textRow p').innerHTML = currPlayer + '\'s turn!';
  document.querySelector('.textRow p').style.backgroundColor = currColor;

  var isBoardFull = 0;
  // Click function for placing pieces and determining if there is a winner.
  $space.click(spaceClick);
  function spaceClick() {
    var iterator = 5;

    var $location = $(this);

    if ($location.is($columnOne)) {
      placePiece($columnOne, iterator, currColor);
    } else if ($location.is($columnTwo)) {
      placePiece($columnTwo, iterator, currColor);
    } else if ($location.is($columnThree)) {
      placePiece($columnThree, iterator, currColor);
    } else if ($location.is($columnFour)) {
      placePiece($columnFour, iterator, currColor);
    } else if ($location.is($columnFive)) {
      placePiece($columnFive, iterator, currColor);
    } else if ($location.is($columnSix)) {
      placePiece($columnSix, iterator, currColor);
    } else if ($location.is($columnSeven)) {
      placePiece($columnSeven, iterator, currColor);
    }
  }

  function placePiece(eventColumn, iterator, currentColor) {
    placer = true;

    while(placer) {
      // .className #id tagName <element>
      var $curr = $(eventColumn[iterator]);

      if (eventColumn[iterator].style.backgroundColor === 'rgb(255, 255, 255)') {
        eventColumn[iterator].style.backgroundColor = currentColor;
        placer = false;
        var placedTarget = eventColumn[iterator];

        isGameOverVertical(eventColumn, currentColor);
        isGameOverHorizontal(placedTarget, currentColor);
        var targetClassCol = targetEnumeratorCol(placedTarget);
        var targetClassRow = targetEnumeratorRow(placedTarget);

        var northEast = isGameOverDiagonals(targetClassCol, targetClassRow, -1, 1, currentColor);
        var southWest = isGameOverDiagonals(targetClassCol, targetClassRow, 1, -1, currentColor);
        var northWest = isGameOverDiagonals(targetClassCol, targetClassRow, -1, -1, currentColor);
        var southEast = isGameOverDiagonals(targetClassCol, targetClassRow, 1, 1, currentColor);

        var northWestSouthEastArray = arrayUnionPlusCenter(northWest, southEast);
        var northEastSouthWestArray = arrayUnionPlusCenter(northEast, southWest);

        checkDiagonals(northWestSouthEastArray);
        checkDiagonals(northEastSouthWestArray);

        placeColor = currColor;
        currColor = prevColor;
        prevColor = placeColor;

        placePlayer = currPlayer;
        currPlayer = prevPlayer;
        prevPlayer = placePlayer;

        isBoardFull++;
        if (isBoardFull !== 42) {
          document.querySelector('.textRow p').innerHTML = currPlayer + '\'s turn!';
          document.querySelector('.textRow p').style.backgroundColor = currColor;
        } else {
          winAlert(isBoardFull);
        }

        if (currPlayer == name && isSinglePlayer === true) {
          var moves = computerChoiceOptions();
          var bestLocations = computerPlaceValueCrossSection(moves);
          var determinedMove = makeComputerMove(bestLocations);
          var newIterator = 5;
          if (determinedMove === 0) {
            placePiece($columnOne, newIterator, currColor);
          } else if (determinedMove === 1) {
            placePiece($columnTwo, newIterator, currColor);
          }  else if (determinedMove === 2) {
            placePiece($columnThree, newIterator, currColor);
          }  else if (determinedMove === 3) {
            placePiece($columnFour, newIterator, currColor);
          }  else if (determinedMove === 4) {
            placePiece($columnFive, newIterator, currColor);
          }  else if (determinedMove === 5) {
            placePiece($columnSix, newIterator, currColor);
          }  else if (determinedMove === 6) {
            placePiece($columnSeven, newIterator, currColor);
          }
        }
      }
      iterator -= 1;
      if (iterator < 0) {
        placer = false;
      }
    }
  }

  function isGameOverVertical(eventColumn, currentColor) {
    var inARow = 0;
    for (var i = eventColumn.length - 1; i >= 0; i--) {
      if (eventColumn[i].style.backgroundColor === currentColor) {
        inARow++;
        if (inARow === 4) {
          console.log('Winner');
          winAlert();
        }
      } else {
        inARow = 0;
      }
    }
  }

  function isGameOverHorizontal(target, currentColor) {
    var targetClass = target.className.split(' ')[2];
    if (targetClass === 'rowOne') {
      checkHorizontal($rowOne, currentColor);
    } else if (targetClass === 'rowTwo') {
      checkHorizontal($rowTwo, currentColor);
    } else if (targetClass === 'rowThree') {
      checkHorizontal($rowThree, currentColor);
    } else if (targetClass === 'rowFour') {
      checkHorizontal($rowFour, currentColor);
    } else if (targetClass === 'rowFive') {
      checkHorizontal($rowFive, currentColor);
    } else if (targetClass === 'rowSix') {
      checkHorizontal($rowSix, currentColor);
    }
  }

  function checkHorizontal(row, currentColor) {
    var inARow = 0;
    for (var i = 0; i < row.length; i++) {
      if (row[i].style.backgroundColor === currentColor) {
        inARow++;
        if (inARow === 4) {
          console.log('Winner');
          winAlert();
        }
      } else {
        inARow = 0;
      }
    }
  }

  function targetEnumeratorCol(target) {
    var targetClass = target.className.split(' ');
    var targetClassCol = targetClass[1];

    if (targetClassCol === 'colOne') {
      targetClassCol = 0;
    } else if (targetClassCol === 'colTwo') {
      targetClassCol = 1;
    } else if (targetClassCol === 'colThree') {
      targetClassCol = 2;
    } else if (targetClassCol === 'colFour') {
      targetClassCol = 3;
    } else if (targetClassCol === 'colFive') {
      targetClassCol = 4;
    } else if (targetClassCol === 'colSix') {
      targetClassCol = 5;
    } else if (targetClassCol === 'colSeven') {
      targetClassCol = 6;
    }
    return targetClassCol;
}

  function targetEnumeratorRow(target, currentColor) {
    var targetClass = target.className.split(' ');
    var targetClassRow = targetClass[2];

    if (targetClassRow === 'rowOne') {
      targetClassRow = 0;
    } else if (targetClassRow === 'rowTwo') {
      targetClassRow = 1;
    } else if (targetClassRow === 'rowThree') {
      targetClassRow = 2;
    } else if (targetClassRow === 'rowFour') {
      targetClassRow = 3;
    } else if (targetClassRow === 'rowFive') {
      targetClassRow = 4;
    } else if (targetClassRow === 'rowSix') {
      targetClassRow = 5;
    }
    return targetClassRow;
  }

  function isGameOverDiagonals(col, row, verticalMove, horizontalMove, currentColor) {
    var looping = true;
    var positionArray = [];

    if (rowObject[row + verticalMove] !== undefined && columnObject[col + horizontalMove] !== undefined) {
      while(looping) {
        col = col + horizontalMove;
        row = row + verticalMove;
        if ($(rowObject[row])[col].style.backgroundColor === currentColor) {
          positionArray.push(1);
        } else if ($(rowObject[row])[col].style.backgroundColor === prevColor) {
          positionArray.push(2);
        } else {
          positionArray.push(0);
        }

        if (rowObject[row + verticalMove] === undefined || columnObject[col + horizontalMove] === undefined) {
          looping = false;
        }
      }
    }
    return positionArray;
  }

  function arrayUnionPlusCenter(arrayOne, arrayTwo) {
    arrayOne.reverse();
    arrayOne.push(1);
    for (var i = 0; i < arrayTwo.length; i++) {
      arrayOne.push(arrayTwo[i]);
    }
    return arrayOne;
  }

  function checkDiagonals(diagonalArray) {
    var inARow = 0;
    for (var i = 0; i < diagonalArray.length; i++) {
      if (diagonalArray[i] === 1) {
        inARow++;
        if (inARow === 4) {
          console.log('Winner!');
          winAlert();
        }
      } else {
        inARow = 0;
      }
    }
  }

  function winAlert(isBoardFull) {
    if (isBoardFull === 42) {
      document.querySelector('h1').innerHTML = "It's a Draw!!!";
    } else {
      document.querySelector('h1').innerHTML = currPlayer + ' Wins!!!';
    }
    $space.off('click', spaceClick);
    document.querySelector('.textRow').innerHTML = '<button class = "btn btn-default" id = "again">Keep Going!</button>';
    document.querySelector('audio').pause();
    if (isSinglePlayer) {
      document.querySelector('audio').innerHTML = '<audio src="108-victory-vs-wild-pokemon-.mp3" autoplay loop></audio>';
    } else {
      document.querySelector('audio').innerHTML = '<audio src="116-victory-vs-trainer-.mp3" autoplay loop></audio>';
    }
    $('#again').click(function() {
      $pokeMap.css('display', 'block');
      $connectFour.css('display', 'none');
      $('.col').css('background-color', '#fff');
      document.querySelector('.wrapper').innerHTML = '';
      document.querySelector('.textRow').innerHTML = '<div class = "col-xs-6 col-xs-offset-3"><p></p></div>';
      document.querySelector('audio').pause();
      document.querySelector('audio').innerHTML = '<audio src="106-the-road-to-viridian-city-from-palette.mp3" autoplay loop></audio>';
      pokeMap();
    });
  }

  function computerChoiceOptions() {
    var computerChoiceArray = [];

    for (var col in columnObject) {
      for (var i = $(columnObject[col]).length - 1; i >= 0; i--) {
        if ($(columnObject[col])[i].style.backgroundColor === 'rgb(255, 255, 255)') {
          var columnNum = targetEnumeratorCol($(columnObject[col])[i]);
          var rowNum = targetEnumeratorRow($(columnObject[col])[i]);
          computerChoiceArray.push([columnNum, rowNum]);
          break;
        }
      }
    }
    return(computerChoiceArray);
  }

  function computerPlaceValueCrossSection(computerChoiceArray) {
    var valueArray = [];
    for (var i = 0; i < computerChoiceArray.length; i++) {
      var horizReturn = isHorizWin(computerChoiceArray[i]);
      var vertReturn = isVertWin(computerChoiceArray[i]);

      var northEast = isGameOverDiagonals(computerChoiceArray[i][0], computerChoiceArray[i][1], -1, 1, currColor);
      var southWest = isGameOverDiagonals(computerChoiceArray[i][0], computerChoiceArray[i][1], 1, -1, currColor);
      var northWest = isGameOverDiagonals(computerChoiceArray[i][0], computerChoiceArray[i][1], -1, -1, currColor);
      var southEast = isGameOverDiagonals(computerChoiceArray[i][0], computerChoiceArray[i][1], 1, 1, currColor);

      var northWestSouthEastArray = arrayUnionComputerPlusCenter(northWest, southEast);
      var northEastSouthWestArray = arrayUnionComputerPlusCenter(northEast, southWest);

      var thisValue = placeValueAssessment(horizReturn, vertReturn, northEastSouthWestArray, northWestSouthEastArray);
      if (thisValue === undefined || thisValue === null || thisValue === 0) {
        valueArray.push(0);
      } else {
        valueArray.push(thisValue);
      }
    }
    return(valueArray);
  }

  function isHorizWin(location) {
    var thisRow = $(rowObject[location[1]]);
    var col = location[0];

    var valueArray = [];

    for (var i = 0; i < thisRow.length; i++) {
      if (thisRow[i].style.backgroundColor === currColor) {
        valueArray.push(1);
      } else if (thisRow[i].style.backgroundColor === prevColor){
        valueArray.push(2);
      } else {
        valueArray.push(0);
      }
    }
    valueArray[col] = 3;
    return(valueArray);
  }


  function isVertWin(location) {
    var thisCol = $(columnObject[location[0]]);
    var row = location[1];
    var valueArray = [];

    for (var i = 0; i < thisCol.length; i++) {
      if (thisCol[i].style.backgroundColor === currColor) {
        valueArray.push(1);
      } else if (thisCol[i].style.backgroundColor === prevColor){
        valueArray.push(2);
      } else {
        valueArray.push(0);
      }
    }
    valueArray[row] = 3;
    return(valueArray);
  }

  function arrayUnionComputerPlusCenter(arrayOne, arrayTwo) {
    arrayOne.reverse();
    arrayOne.push(3);
    for (var i = 0; i < arrayTwo.length; i++) {
      arrayOne.push(arrayTwo[i]);
    }
    return arrayOne;
  }

  function placeValueAssessment(horizArray, vertArray, northEastArray, northWestArray) {
    console.log('space');
    var horizValue = arrayAssess(horizArray);
    var vertValue = arrayAssess(vertArray);
    var northEastValue = arrayAssess(northEastArray);
    var northWestValue = arrayAssess(northWestArray);
    var totalPositionValue = horizValue + vertValue + northWestValue + northEastValue;

    return totalPositionValue;
  }

  function arrayAssess(assessedArray) {
    console.log(assessedArray);
    var inARow = 0;
    var opponentInARow = 0;
    var opponentStop = false;
    var canWin = false;
    var connectionValue = 0;

    for (var i = 0; i < assessedArray.length; i++) {
      if (assessedArray[i] === 1 && (assessedArray[i + 1] === 3 || assessedArray[i - 1] === 3 || assessedArray[i + 2] === 3 || assessedArray[i - 2] === 3 || assessedArray[i + 3] === 3 || assessedArray[i -  3] === 3)) {
        inARow++;
        opponentInARow = 0;
        connectionValue++;
        if (inARow === 4) {
          canWin = true;
        }
      } else if (assessedArray[i] === 2 && (assessedArray[i + 1] === 3 || assessedArray[i - 1] === 3 || assessedArray[i + 2] === 3 || assessedArray[i - 2] === 3 || assessedArray[i + 3] === 3 || assessedArray[i -  3] === 3)) {
        opponentInARow++;
        inARow = 0;
        connectionValue += 2;
        if (opponentInARow === 3) {
          opponentStop = true;
        }
      } else if (assessedArray[i] === 3) {
        opponentInARow = 0;
        inARow++;
        connectionValue++;
        if (inARow === 4) {
          canWin = true;
        }
      } else if (assessedArray[i] === 0 && (assessedArray[i + 1] === 3 || assessedArray[i - 1] === 3 || assessedArray[i + 2] === 3 || assessedArray[i - 2] === 3 || assessedArray[i + 3] === 3 || assessedArray[i -  3] === 3)) {
        opponentInARow = 0;
        inARow = 0;
      }
    }
    if (canWin) {
      return 1000;
    } else if (opponentStop) {
      return 100;
    } else {
      return connectionValue;
    }
  }

  function makeComputerMove(bestLocations) {
    var bestPick = [];
    var largestValue = 0;
    for (var i = 0; i < bestLocations.length; i++) {
      if (bestLocations[i] === largestValue) {
        bestPick.push(i);
      } else if (bestLocations[i] > largestValue) {
        bestPick = [];
        bestPick.push(i);
        largestValue = bestLocations[i];
      }
    }

    var moveAssignmentIndex = Math.floor(Math.random() * bestPick.length);
    return bestPick[moveAssignmentIndex];
  }

}
});
