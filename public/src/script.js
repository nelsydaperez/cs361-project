// Citation for the following script
// Date: 10/29/2021
// Copied from: Image Manipulation with HTML5 Canvas: A Sliding Puzzle
// Source: https://www.sitepoint.com/image-manipulation-with-html5-canvas-a-sliding-puzzle-2/

var context = document.getElementById('puzzle').getContext('2d');
context.lineWidth = 2;

var query = function() {
  let params = (new URL(location)).searchParams;
  return {
    image: params.get('imageQuery'),
    difficulty: params.get('difficulty')
  };
}();

var img = new Image();

// Integration of image microservice
img.src = 'http://flip3.engr.oregonstate.edu:17778/getImage'
  + '?searchTerms=' + query.image
  + '&height=500'
  + '&response_type=file';

document.getElementById("solution").src = img.src;

img.addEventListener('load', drawTiles, false);

var boardSize = document.getElementById('puzzle').width;

// Breaks image into number of tiles based on selected difficulty
if (query.difficulty === 'easy'){
  tileCount = 3;
}
else if (query.difficulty === 'normal'){
  tileCount = 4;
}
else { tileCount = 5; };

var tileSize = boardSize / tileCount;

var clickLoc = new Object;
clickLoc.x = 0;
clickLoc.y = 0;

var emptyLoc = new Object;
emptyLoc.x = 0;
emptyLoc.y = 0;

var solved = false;

var boardParts;
setBoard();

document.getElementById('puzzle').onclick = function(e) {
  clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize);
  clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize);
  if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
    slideTile(emptyLoc, clickLoc);
    drawTiles();
  }
  if (solved) {
    setTimeout(function() {
      alert("Congratulations! You will be redirected to the title screen.");
      window.location.href = "index.html";
    }, 500);
  }
};

function setBoard() {
  boardParts = new Array(tileCount);
  for (var i = 0; i < tileCount; ++i) {
    boardParts[i] = new Array(tileCount);
    for (var j = 0; j < tileCount; ++j) {
      boardParts[i][j] = new Object;
      boardParts[i][j].x = (tileCount - 1) - i;
      boardParts[i][j].y = (tileCount - 1) - j;
    }
  }
  emptyLoc.x = boardParts[tileCount - 1][tileCount - 1].x;
  emptyLoc.y = boardParts[tileCount - 1][tileCount - 1].y;
  solved = false;
}

function drawTiles() {
  context.clearRect ( 0 , 0 , boardSize , boardSize );
  for (var i = 0; i < tileCount; ++i) {
    for (var j = 0; j < tileCount; ++j) {
      var x = boardParts[i][j].x;
      var y = boardParts[i][j].y;
      if(i != emptyLoc.x || j != emptyLoc.y || solved == true) {
        context.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize,
            i * tileSize, j * tileSize, tileSize, tileSize);
      }
    }
  }
}

function distance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function slideTile(toLoc, fromLoc) {
  if (!solved) {
    boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
    boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
    boardParts[fromLoc.x][fromLoc.y].x = tileCount - 1;
    boardParts[fromLoc.x][fromLoc.y].y = tileCount - 1;
    toLoc.x = fromLoc.x;
    toLoc.y = fromLoc.y;
    checkSolved();
  }
}

function checkSolved() {
  var flag = true;
  for (var i = 0; i < tileCount; ++i) {
    for (var j = 0; j < tileCount; ++j) {
      if (boardParts[i][j].x != i || boardParts[i][j].y != j) {
        flag = false;
      }
    }
  }
  solved = flag;
}

// Used for the display of the How to Play page.
function newPopup(url) {
	popupWindow = window.open(
		url,'popUpWindow','height=800,width=1350,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
}