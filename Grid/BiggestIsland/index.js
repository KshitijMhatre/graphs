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
const row = 20;
const col = 20;
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
  INPROGRESS: 'cell-in-progress'
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

function highlightIsland(islandId) {
  Array.from(document.getElementsByClassName(islandId)).forEach(el=>{
    el.classList.add(CLASSES.VISITED)
    el.classList.remove(CLASSES.NEW)
  });
}

async function bfs([x,y], model, islandId){
  const queue = [[x,y]]
  model[x][y] = visited
  let area = 1
  await visit(x,y,islandId)

  while(queue.length){
    const [cx,cy] = queue.shift()


    for(let move of moves) {
      const nx = cx + move[0]
      const ny = cy + move[1]

      if(nx>-1 && nx<row && ny>-1 && ny<col && model[nx][ny]===land){
        model[nx][ny] = visited
        area +=1
        await visit(nx,ny,islandId)
        queue.push([nx,ny])
      }
    }
  }
  return area;
}

function log(text) {
  const infoEl = document.getElementById('info')
  infoEl.innerText += `\n${text}`;
}

async function explore() {
  let islandCtr = 0;
  let maxAreaSoFar = 0;
  let maxIslandId = null;

  for(let i=0;i<row;i++){
    for(let j=0;j<col;j++){
      if(model[i][j]===land) {
        islandCtr += 1;
        const islandId = `ild_${islandCtr}`
        const area = await bfs([i,j], model, islandId)
        
        if (area > maxAreaSoFar){
          maxAreaSoFar = area;
          maxIslandId = islandId
        }
        // wait before exploring next island
        await sleep(1000)
        log(`Checked island ${islandCtr}, area = ${area}`)
      }
    }
  }
  if(maxAreaSoFar) {
    // highlight biggest
    highlightIsland(maxIslandId);
    log(`Biggest island is ${islandCtr} with area = ${maxAreaSoFar}`)
    console.log({maxIslandId, maxAreaSoFar})
  }
}

document.addEventListener('DOMContentLoaded', setup);