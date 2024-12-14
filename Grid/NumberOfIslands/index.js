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
const row = 25;
const col = 25;
const model = Array.from(Array(row), ()=>Array(col).fill(0));
const land = 1
const visited = 2

const getId = (i,j) => `${i}-${j}`;
const getPt = str => str.split('-').map((o)=>Number(o));
const CLASSES = {
  NEW: 'cell-new',
  CELL: 'cell',
  CELL_ROW: 'cell-row',
  VISITED: 'cell-visited',
  OCEAN: 'cell-ocean',
}

function setup(){
  const fragment = document.createDocumentFragment();

  for(let i = 0; i < row; i++){
    const row = document.createElement('div');
    row.className = CLASSES.CELL_ROW ;
    for(let j = 0; j < col; j++){

      const isIsland = (Math.random()*10 > 6); // 40% chance

      const cell = document.createElement('div');
      cell.className = CLASSES.CELL;
      cell.id = getId(i,j);
      row.appendChild(cell);

      if(isIsland) {
        cell.classList.add(CLASSES.NEW)
        model[i][j] = land
      } else {
        cell.classList.add(CLASSES.OCEAN)
      }
    }
    fragment.appendChild(row);
  }

  const graph = document.getElementById('graph');
  graph.appendChild(fragment);

  explore();
}

async function sleep(ms) {
  await new Promise((res)=>setTimeout(res, ms));
}

async function visit(i,j) {
  const cell = document.getElementById(getId(i,j))
  await sleep(10);
  cell.classList.remove(CLASSES.NEW);
  cell.classList.add(CLASSES.VISITED);
}

function showCount(count) {
  const countEl = document.getElementById('count') 
  countEl.innerText = `Count : ${count}`
}

async function dfs([x,y],model) {
  const stack = [[x,y]]

  while(stack.length){

    const [cx,cy] = stack.pop()

    model[cx][cy] = visited
    await visit(cx,cy)

    for(let move of moves){
      const nx = cx + move[0]
      const ny = cy + move[1]

      if(nx>-1 && nx<row && ny>-1 && ny<col && model[nx][ny]===land){
        await dfs([nx,ny], model)
      }
    }
  }
}

async function explore(){
  let count = 0
  for(let i=0;i<row;i++){
    for(let j=0;j<col;j++){
      if(model[i][j]===land) {
        await dfs([i,j], model)
        count += 1
        showCount(count)
        await sleep(1000)
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', setup);