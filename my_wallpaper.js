// constants
let SHUTTER_COLOUR = [100, 50, 50];
let FRAME_COLOUR = [255, 220, 200];
let MINSIZE = 60;
let MAXSIZE = 120;

// parameters
// note that while i do set these here, they are randomized in the my_symbol() function
// you can set the 'isRandom' flag to false to use these values instead
let isRandom = true;
let frameSize = 5;
let windowWidth = 100;
let windowHeight = 100;
let hasShutters = false;
let numHorizontalPanes = 2; // number of panes on the horizontal axis
let numVerticalPanes = 2; // number of panes on the vertical axis
let windowTint = [255, 230, 144];

let colorVariations = [
  [120, 88, 95],
  [110, 150, 170],
  [255, 100, 80],
  [255, 230, 144],
  [255, 180, 80],
];

function setup_wallpaper(pWallpaper) {
  pWallpaper.output_mode(GRID_WALLPAPER);
  pWallpaper.resolution(FIT_TO_SCREEN);
  pWallpaper.show_guide(false); // Set this to false when you're ready to print

  // Grid settings
  pWallpaper.grid_settings.cell_width = 200;
  pWallpaper.grid_settings.cell_height = 200;
  pWallpaper.grid_settings.row_offset = 50;
}

function wallpaper_background() {
  background(240, 255, 240);

  let brickWidth = 60;
  let brickHeight = 30;
  let mortarThickness = 2;

  for (let y = 0; y < height; y += brickHeight + mortarThickness) {
    let rowOffset =
      (y / (brickHeight + mortarThickness)) % 2 === 0 ? 0 : brickWidth / 2;
    for (
      let x = -brickWidth / 2 + rowOffset;
      x < width;
      x += brickWidth + mortarThickness
    ) {
      // randomize brick color
      let r = random(150, 190);
      let g = random(60, 100);
      let b = random(60, 100);

      fill(r, g, b);
      noStroke();
      rect(x - 2, y - 2, brickWidth + 2, brickHeight + 2);

      // draw brick border
      stroke(0, 0, 0);
      let brickX = x;
      let brickY = y;
      handDrawnLine(
        brickX + brickWidth,
        brickY,
        brickX + brickWidth,
        brickY + brickHeight
      ); 
      handDrawnLine(
        brickX,
        brickY + brickHeight,
        brickX + brickWidth,
        brickY + brickHeight
      ); 
    }
  }
}

function handDrawnLine(x1, y1, x2, y2) {
  let distance = dist(x1, y1, x2, y2);
  let pointSpacing = 1; // fixed distance between points for consistency
  let numPoints = distance / pointSpacing;
  let variation = 0.8; // maximum variation in position

  for (let i = 0; i <= numPoints; i++) {
    let lerpAmount = i / numPoints;
    let xCurrent = lerp(x1, x2, lerpAmount);
    let yCurrent = lerp(y1, y2, lerpAmount);

    // add a small random variation
    xCurrent += random(-variation, variation);
    yCurrent += random(-variation, variation);

    strokeWeight(random(0.5, 1.5)); // slightly varying stroke weight for a hand-drawn look
    point(xCurrent, yCurrent);
  }
}

function my_symbol() {
  let centerX = 100;
  let centerY = 100;

  if (isRandom) {
    // randomize window size
    windowWidth = random(MINSIZE, MAXSIZE);
    windowHeight = random(MINSIZE, MAXSIZE);

    // randomize window color
    let colorIndex = floor(random(colorVariations.length));
    windowTint = colorVariations[colorIndex];

    // does it have shutters
    hasShutters = random() > 0.8;

    // size of frame + windowsill
    frameSize = floor(random(4, 8));

    // randomize number of panes
    numVerticalPanes = floor(random(1, 4));
    numHorizontalPanes = floor(random(1, 4));
  }

  drawWindowDetails(centerX, centerY, windowWidth, windowHeight, windowTint);
}

function drawWindowDetails(x, y, w, h, col) {
  let sillExtension = 10;

  if (hasShutters) {
    drawWindowShutters(x, y, w, h);
  }

  rectMode(CENTER);
  fill(FRAME_COLOUR);
  noStroke();
  // frame fill
  rect(x, y, w + 2 * frameSize, h + 2 * frameSize, frameSize);
  // windowsill fill
  rect(x, y + h / 2 + frameSize / 2, w + 2 * sillExtension, frameSize);
  stroke(0, 0, 0);

  // fill in window
  fill(col[0], col[1], col[2]);
  noStroke();
  rect(x, y, w, h);
  stroke(0, 0, 0);

  // draw outer border
  handDrawnRect(
    x - w / 2 - frameSize,
    y - h / 2 - frameSize,
    w + 2 * frameSize,
    h + 2 * frameSize
  );

  // draw main window frame
  handDrawnRect(x - w / 2, y - h / 2, w, h);

  // draw window panes
  let verticalPaneSpacing = w / numVerticalPanes;
  let horizontalPaneSpacing = h / numHorizontalPanes;

  for (let i = 1; i <= numVerticalPanes; i++) {
    let paneX = x - w / 2 + i * verticalPaneSpacing;
    handDrawnLine(paneX, y - h / 2, paneX, y + h / 2);
  }
  for (let i = 1; i <= numHorizontalPanes; i++) {
    let paneY = y - h / 2 + i * horizontalPaneSpacing;
    handDrawnLine(x - w / 2, paneY, x + w / 2, paneY);
  }

  // draw windowsill
  handDrawnLine(
    x - w / 2 - sillExtension,
    y + h / 2,
    x + w / 2 + sillExtension,
    y + h / 2
  );
  handDrawnLine(
    x - w / 2 - sillExtension,
    y + h / 2 + frameSize,
    x + w / 2 + sillExtension,
    y + h / 2 + frameSize
  );
  handDrawnLine(
    x - w / 2 - sillExtension,
    y + h / 2,
    x - w / 2 - sillExtension,
    y + h / 2 + frameSize
  );
  handDrawnLine(
    x + w / 2 + sillExtension,
    y + h / 2,
    x + w / 2 + sillExtension,
    y + h / 2 + frameSize
  );

  drawWindowShadow(x, y, w, h, sillExtension, frameSize);
}

function handDrawnRect(x, y, w, h) {
  handDrawnLine(x, y, x + w, y); // top
  handDrawnLine(x + w, y, x + w, y + h); // right
  handDrawnLine(x + w, y + h, x, y + h); // bottom
  handDrawnLine(x, y + h, x, y); // left
}

function drawWindowShutters(x, y, w, h) {
  let shutterWidth = w / 3;
  let shutterHeight = h + 10; // slightly taller than the window

  let leftShutterX = x - w / 2 - shutterWidth;
  let rightShutterX = x + w / 2;

  // fill shutters
  fill(SHUTTER_COLOUR);
  noStroke();
  rectMode(CORNER);
  rect(
    leftShutterX - frameSize,
    y - shutterHeight / 2,
    shutterWidth,
    shutterHeight
  );
  rect(
    rightShutterX + frameSize,
    y - shutterHeight / 2,
    shutterWidth,
    shutterHeight
  );

  // draw shutter outline
  stroke(0, 0, 0);
  handDrawnRect(
    leftShutterX - frameSize,
    y - shutterHeight / 2,
    shutterWidth,
    shutterHeight
  );
  handDrawnRect(
    rightShutterX + frameSize,
    y - shutterHeight / 2,
    shutterWidth,
    shutterHeight
  );

  // add horizontal lines to shutters
  let numLines = 10;
  let lineSpacing = shutterHeight / (numLines + 1);
  for (let i = 1; i <= numLines; i++) {
    let lineY = y - shutterHeight / 2 + i * lineSpacing;
    handDrawnLine(
      leftShutterX - frameSize + 5,
      lineY,
      leftShutterX - frameSize + shutterWidth - 5,
      lineY
    );
    handDrawnLine(
      rightShutterX + frameSize + 5,
      lineY,
      rightShutterX + frameSize + shutterWidth - 5,
      lineY
    );
  }
}

function drawWindowShadow(x, y, w, h, sillExtension, frameSize) {
  let shadowHeight = 30;
  let maxDotsPerLine = 50; // max dots (nearest to window)
  let minDotsPerLine = 5; // min dots (furthest from window)

  for (
    let sy = y + h / 2 + frameSize;
    sy < y + h / 2 + frameSize + shadowHeight;
    sy += 2
  ) {
    let lerpAmount = (sy - (y + h / 2)) / shadowHeight;
    let numDots = lerp(maxDotsPerLine, minDotsPerLine, lerpAmount);

    for (let i = 0; i < numDots; i++) {
      let dotX = random(x - w / 2 - sillExtension, x + w / 2 + sillExtension);
      let dotY = sy;

      strokeWeight(random(0.5, 1.5));
      point(dotX, dotY);
    }
  }
}
