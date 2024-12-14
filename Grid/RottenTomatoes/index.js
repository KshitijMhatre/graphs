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
const alive = 1
const rotten = 2

const getId = (i,j) => `${i}-${j}`;
const getPt = str => str.split('-').map((o)=>Number(o));
const CLASSES = {
  ALIVE: 'cell-alive',
  CELL: 'cell',
  CELL_ROW: 'cell-row',
  ROTTEN: 'cell-rotten'
}

function setup(){
  const fragment = document.createDocumentFragment();

  for(let i = 0; i < row; i++){
    const row = document.createElement('div');
    row.className = CLASSES.CELL_ROW ;
    for(let j = 0; j < col; j++){

      const isTomato = (Math.random()*10 > 6); // 40% chance

      const cell = document.createElement('div');
      cell.className = CLASSES.CELL;
      cell.id = getId(i,j);
      row.appendChild(cell);

      if(isTomato) {
        const isRotten = (Math.random()*10 > 8) // 20% chance of tomato being bad

        if(!isRotten) {
          cell.classList.add(CLASSES.ALIVE)
          model[i][j] = alive
        } else {
          cell.classList.add(CLASSES.ROTTEN)
          model[i][j] = rotten
        }
      }
    }
    fragment.appendChild(row);
  }

  const graph = document.getElementById('graph');
  graph.appendChild(fragment);

  bfs(model);
}

async function sleep(ms) {
  await new Promise((res)=>setTimeout(res, ms));
}

async function visit(i,j) {
  const cell = document.getElementById(getId(i,j))
  await sleep(10);
  cell.classList.remove(CLASSES.ALIVE);
  cell.classList.add(CLASSES.ROTTEN);
}

function showDay(day) {
  const dayEl = document.getElementById('days') 
  dayEl.innerText = `Day ${day}`
}

async function bfs(model) {
  
  const queue = []
  for(let i=0;i<row;i++){
    for(let j=0;j<col;j++){
      if(model[i][j]=== rotten) {
        queue.push([i,j])
      }
    }
  }

  let day = 0

  while(queue.length){
    let willRotToday = queue.length;
    showDay(day);
    while(willRotToday--) {
      const [cx,cy] = queue.shift()

      if (day === 0) {
        // these are already rotten just record next to rot
      } else {
        model[cx][cy] = rotten
        await visit(cx,cy)
      }

      for(let move of moves) {
        const nx = cx + move[0]
        const ny = cy + move[1]
        if(nx>-1 && nx<row && ny>-1 && ny<col 
          && model[nx][ny]===alive
        ) {
          queue.push([nx,ny]);
        }
      }
    }
    day+=1;
    // wait for next day
    await sleep(2000);
  }
}

document.addEventListener('DOMContentLoaded', setup);