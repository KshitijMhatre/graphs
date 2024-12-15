const MOVES = {
  CLOCKWISE_START_RIGHT : [
    [0,1],
    [1,0],
    [0,-1],
    [-1,0]
  ],
  CLOCKWISE_START_TOP : [
    [-1,0],
    [0,1],
    [1,0],
    [0,-1]
  ],
  CLOCKWISE_START_BOTTOM : [
    [1,0],
    [0,-1],
    [-1,0],
    [0,1],
  ],
  CLOCKWISE_START_LEFT : [
    [0,-1],
    [-1,0],
    [0,1],
    [1,0],
  ],
}

let moves = MOVES.CLOCKWISE_START_LEFT; 
const heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
const maxHeight = Math.max(...heights.flatMap(row=>row))
const ROW = heights.length;
const COL = heights[0].length;

const getId = (i,j) => `${i}-${j}`;
const getPt = str => str.split('-').map((o)=>Number(o));
const CLASSES = {
  NEW: 'cell-new',
  CELL: 'cell',
  CELL_ROW: 'cell-row',
  VISITED: 'cell-visited',
  OCEAN: 'cell-ocean',
  INPROGRESS: 'cell-in-progress'
}

function getColorValue(value, maxValue, hue, saturation) {
  const normalizedValue = value / maxValue; // %

  // higher the value higher the darkness
  // const darkness = 10 + (normalizedValue * 60) // 35 to 65
  // const lightness = 100 - darkness;
  
  // deeper land needs to be darker
  // higher ground made lighter
  const lightness = 10 + (normalizedValue * 60) // 10 - 60

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

function setup(){
  const fragment = document.createDocumentFragment();

  for(let i = 0; i < ROW; i++){
    const row = document.createElement('div');
    row.className = CLASSES.CELL_ROW ;
    for(let j = 0; j < COL; j++){
      const cell = document.createElement('div');
      cell.className = CLASSES.CELL;
      cell.id = getId(i,j);
      row.appendChild(cell);

      cell.style.backgroundColor = getColorValue(heights[i][j], maxHeight, 240, 0);
    }
    fragment.appendChild(row);
  }

  const graph = document.getElementById('graph');
  graph.appendChild(fragment);
}

async function sleep(ms) {
  await new Promise((res)=>setTimeout(res, ms));
}

async function visit(i,j, islandId) {
  const cell = document.getElementById(getId(i,j))
  cell.classList.add(islandId)
  await sleep(10);
  cell.classList.remove(CLASSES.NEW);
  cell.classList.add(CLASSES.VISITED);
  
  setTimeout(()=>{
    cell.classList.remove(CLASSES.VISITED);
    cell.classList.add(CLASSES.NEW);
  }, 600)
}

document.addEventListener('DOMContentLoaded', setup);