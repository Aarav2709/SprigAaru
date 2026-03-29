/*
@title: Aaru's 2048
@author: Aarav Gupta
@tags: [Puzzle, Singleplayer]
@addedOn: 2026-03-28
@description: Combine matching blocks to build bigger numbers :)
*/

const bgblack = "-";
const bggrey = "_";
const bglight = "+";
const redblock = "r";
const orangeblock = "o";
const blueblock = "b";
const greenblock = "g";
const pinkblock = "p";
const yellowblock = "y";

let gamestate = "loop";
let moves = 0;
let score = 0;
let best = 0;

let level = map`
----------
--......--
--......--
--......--
--......--
--......--
--......--
----------`;

const grid_size = 6;
let grid = [];
let grid_values = [];

const core_legend = [
  [bgblack, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`],
  [bggrey, bitmap`
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL`],
  [bglight, bitmap`
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111`],
  [redblock, bitmap`
................
................
...3333333993...
..333333339933..
.0333333339933..
.0333333339933..
.0333333339933..
.0333333339933..
.0333333339933..
.0333333339933..
.0333333339933..
.0333333339933..
.0333333339933..
.003333333993...
..0000000000....
................`],
  [orangeblock, bitmap`
................
................
...9999999669...
..999999996699..
.0999999996699..
.0999999996699..
.0999999996699..
.0999999996699..
.0999999996699..
.0999999996699..
.0999999996699..
.0999999996699..
.0999999996699..
.009999999669...
..0000000000....
................`],
  [blueblock, bitmap`
................
................
...5555555775...
..555555557755..
.0555555557755..
.0555555557755..
.0555555557755..
.0555555557755..
.0555555557755..
.0555555557755..
.0555555557755..
.0555555557755..
.0555555557755..
.005555555775...
..0000000000....
................`],
  [greenblock, bitmap`
................
................
...DDDDDDD44D...
..DDDDDDDD44DD..
.0DDDDDDDD44DD..
.0DDDDDDDD44DD..
.0DDDDDDDD44DD..
.0DDDDDDDD44DD..
.0DDDDDDDD44DD..
.0DDDDDDDD44DD..
.0DDDDDDDD44DD..
.0DDDDDDDD44DD..
.0DDDDDDDD44DD..
.00DDDDDDD44D...
..0000000000....
................`],
  [pinkblock, bitmap`
................
................
...HHHHHHH88H...
..HHHHHHHH88HH..
.0HHHHHHHH88HH..
.0HHHHHHHH88HH..
.0HHHHHHHH88HH..
.0HHHHHHHH88HH..
.0HHHHHHHH88HH..
.0HHHHHHHH88HH..
.0HHHHHHHH88HH..
.0HHHHHHHH88HH..
.0HHHHHHHH88HH..
.00HHHHHHH88H...
..0000000000....
................`],
  [yellowblock, bitmap`
................
................
...6666666226...
..666666662266..
.0666666662266..
.0666666662266..
.0666666662266..
.0666666662266..
.0666666662266..
.0666666662266..
.0666666662266..
.0666666662266..
.0666666662266..
.006666666226...
..0000000000....
................`],
];

function centerTextX(text) {
  return Math.max(0, Math.floor((20 - text.length) / 2));
}

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function create_grid(empty = ".") {
  const empty_grid = [];
  for (let x = 0; x < grid_size; x++) {
    const new_grid = [];
    for (let y = 0; y < grid_size; y++) {
      new_grid.push(empty);
    }
    empty_grid.push(new_grid);
  }
  return empty_grid;
}

function clone_grid(source) {
  const copy = [];
  for (let x = 0; x < source.length; x++) {
    copy.push(source[x].slice());
  }
  return copy;
}

function update_level() {
  clearText();

  if (score > best) best = score;

  const title = "Aaru's 2048";
  const stats = `S:${score} B:${best}`;
    const bar = "====================";

    // Thin top/bottom bars (1 text row each)
    addText(bar, { x: 0, y: 1, color: color`1` });
    addText(bar, { x: 0, y: 14, color: color`1` });

    addText(title, { x: centerTextX(title), y: 0, color: color`2` });
  addText(stats, { x: centerTextX(stats), y: 15, color: color`2` });

    level = "----------\n";
  for (let y = 0; y < grid_size; y++) {
    level += "--";
    for (let x = 0; x < grid_size; x++) {
      level += grid[x][y];
      if (grid_values[x][y] !== 0) {
        addText(`${grid_values[x][y]}`, { x: (x * 2) + 4, y: (y * 2) + 3, color: color`2` });
      }
    }
    level += "--\n";
  }
    level += "----------\n";
  setMap(level);

  let gamewon = false;
  for (let x = 0; x < grid_size; x++) {
    const row = [];
    const column = [];
    for (let y = 0; y < grid_size; y++) {
      row.push(grid[x][y]);
      column.push(grid[y][x]);
    }

    const target = [blueblock, blueblock, blueblock, blueblock, blueblock, blueblock];
    if (JSON.stringify(row) === JSON.stringify(target) || JSON.stringify(column) === JSON.stringify(target)) {
      gamewon = true;
    }
  }

  if (gamewon) {
    gamewin();
  }
}

function add_obj(x, y, obj, value = 2) {
  grid[x][y] = obj;
  grid_values[x][y] = value;
  update_level();
}

function valueToBlock(value) {
  if (value === 64) return blueblock;
  if (value === 32) return yellowblock;
  if (value === 16) return pinkblock;
  if (value === 8) return greenblock;
  if (value === 4) return orangeblock;
  return redblock;
}

function shift_grid(is_vertical, down) {
  const direction = down ? -1 : 1;
  const start = down ? grid_size - 1 : 0;

  const new_grid = create_grid();
  const new_grid_values = create_grid(0);

  if (is_vertical) {
    for (let x = 0; x < grid_size; x++) {
      let lowest = start;
      for (let y = start; (direction > 0 ? y < grid_size : y >= 0); y += direction) {
        if (grid[x][y] !== ".") {
          if (lowest !== start) {
            if (grid_values[x][y] === new_grid_values[x][lowest - direction] && grid_values[x][y] !== 64) {
              lowest -= direction;
              grid_values[x][y] *= 2;
              score += grid_values[x][y];
              grid[x][y] = valueToBlock(grid_values[x][y]);
            }
          }
          new_grid[x][lowest] = grid[x][y];
          new_grid_values[x][lowest] = grid_values[x][y];
          lowest += direction;
        }
      }
    }
  } else {
    for (let y = 0; y < grid_size; y++) {
      let lowest = start;
      for (let x = start; (direction > 0 ? x < grid_size : x >= 0); x += direction) {
        if (grid[x][y] !== ".") {
          if (lowest !== start) {
            if (grid_values[x][y] === new_grid_values[lowest - direction][y] && grid_values[x][y] !== 64) {
              lowest -= direction;
              grid_values[x][y] *= 2;
              score += grid_values[x][y];
              grid[x][y] = valueToBlock(grid_values[x][y]);
            }
          }
          new_grid[lowest][y] = grid[x][y];
          new_grid_values[lowest][y] = grid_values[x][y];
          lowest += direction;
        }
      }
    }
  }

  grid = clone_grid(new_grid);
  grid_values = clone_grid(new_grid_values);
  update_level();
}

function spawn_block() {
  const available = [];
  for (let x = 0; x < grid_size; x++) {
    for (let y = 0; y < grid_size; y++) {
      if (grid[x][y] === ".") {
        available.push([x, y]);
      }
    }
  }

  if (available.length === 0) {
    gameover();
  } else {
    const chosen = available[randint(0, available.length - 1)];
    add_obj(chosen[0], chosen[1], redblock, 2);
  }
}

function startloop() {
  setLegend(...core_legend);
  grid = create_grid();
  grid_values = create_grid(0);
  moves = 0;
  score = 0;
  gamestate = "loop";

  setBackground(bggrey);
  setMap(level);
  spawn_block();
  spawn_block();
}

function gameover() {
  gamestate = "over";
  const overMap = map`
++++++++++
----------
----------
----------
----------
----------
----------
----------`;

  setMap(overMap);
  clearText();
  addText("GAME OVER", { x: 6, y: 1, color: color`2` });
  addText("Score: " + `${score}`, { x: 4, y: 7, color: color`2` });
  addText("Any key to restart", { x: 1, y: 9, color: color`2` });
}

function gamewin() {
  gamestate = "over";
  const winMap = map`
++++++++++
----------
----------
----------
----------
----------
----------
----------`;

  setMap(winMap);
  clearText();
  addText("!VICTORY!", { x: 6, y: 1, color: color`2` });
  addText("You beat the game", { x: 2, y: 7, color: color`2` });
  addText("Score: " + `${score}`, { x: 4, y: 9, color: color`2` });
  addText("Any key to restart", { x: 1, y: 11, color: color`2` });
}

onInput("s", () => {
  if (gamestate === "loop") {
    moves++;
    shift_grid(true, true);
    spawn_block();
  } else if (gamestate === "over") {
    startloop();
  }
});

onInput("w", () => {
  if (gamestate === "loop") {
    moves++;
    shift_grid(true, false);
    spawn_block();
  } else if (gamestate === "over") {
    startloop();
  }
});

onInput("a", () => {
  if (gamestate === "loop") {
    moves++;
    shift_grid(false, false);
    spawn_block();
  } else if (gamestate === "over") {
    startloop();
  }
});

onInput("d", () => {
  if (gamestate === "loop") {
    moves++;
    shift_grid(false, true);
    spawn_block();
  } else if (gamestate === "over") {
    startloop();
  }
});

startloop();
