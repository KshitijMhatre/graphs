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
// const heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
// const maxHeight = Math.max(...heights.flatMap(row=>row))
const maxHeight = 30
const heights = Array.from(Array(15), () => Array.from(Array(15), () => Math.ceil(Math.random()*(maxHeight-1))))
const ROW = heights.length;
const COL = heights[0].length;

function buildPipe() {
  for(let i=0;i<ROW && i<COL;i++){
    heights[i][i] = 1
    if((i-1) > -1) {
      heights[i-1][i] = 1
      heights[i][i-1] = 1
    }
  }
}

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

  if(Math.random()*10 > 5)  // 50% chance of a diagonal pipe
    buildPipe()

  solve()
}

async function sleep(ms) {
  await new Promise((res)=>setTimeout(res, ms));
}

async function visit(i,j, value) {
  const cell = document.getElementById(getId(i,j))
  await sleep(10);
  cell.style.backgroundColor = value;
}

async function solve() {

  const isPacificReachable = Array.from(Array(ROW), ()=> Array(COL).fill(false))
  const isAtlanticReachable = Array.from(Array(ROW), ()=> Array(COL).fill(false))

  const pacificHue = 120;
  const atlanticHue = 240;
  const overlapHue = 180;

  async function dfs([x,y], visited, hue) {
    const stack = [[x,y]]
    while(stack.length) {
      const [cx,cy] = stack.pop()
      visited[cx][cy] = true
      await visit(cx,cy, getColorValue(heights[cx][cy], maxHeight, hue, 100));

      for(let move of moves){
        const nx = cx + move[0]
        const ny = cy + move[1]
        if(
          nx > -1 && nx < ROW && ny > -1 && ny < COL
          && !visited[nx][ny]
          && heights[nx][ny]>=heights[cx][cy]
        ){
          stack.push([nx,ny])
        }
      }
    } 
  }

  for(i=0;i<ROW;i++){
    await dfs([i, 0], isPacificReachable, pacificHue) // left edge
    await dfs([i, COL-1], isAtlanticReachable, atlanticHue) // right edge
  }

  for(let j=0;j<COL;j++) {
    await dfs([0, j], isPacificReachable, pacificHue) // top edge
    await dfs([ROW-1, j], isAtlanticReachable, atlanticHue) // top edge
  }

  for(let i=0;i<ROW;i++){
    for(let j=0;j<COL;j++){
      if(isAtlanticReachable[i][j] && isPacificReachable[i][j]){
        await visit(i,j, getColorValue(heights[i][j], maxHeight, overlapHue, 100));
        // BFS from these points to show flow to both :)
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', setup);