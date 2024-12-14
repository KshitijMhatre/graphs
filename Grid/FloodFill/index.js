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
let toColor = 1
const colored = 2

const getId = (i,j) => `${i}-${j}`;
const getPt = str => str.split('-').map((o)=>Number(o));
const CLASSES = {
  ALIVE: 'cell-alive',
  VISITED: 'cell-visited',
  CELL: 'cell',
  CELL_ROW: 'cell-row',
  BLOCKED: 'cell-blocked'
}

function setup(){
  const fragment = document.createDocumentFragment();

  for(let i = 0; i < row; i++){
    const row = document.createElement('div');
    row.className = CLASSES.CELL_ROW ;
    for(let j = 0; j < col; j++){

      const isBlocked = (Math.random()*10 > 6); // 40% chance

      const cell = document.createElement('div');
      cell.className = CLASSES.CELL;
      cell.id = getId(i,j);
      row.appendChild(cell);

      if(isBlocked) {
        cell.classList.add(CLASSES.BLOCKED)
        model[i][j] = toColor
      }
    }
    fragment.appendChild(row);
  }

  const graph = document.getElementById('graph');
  graph.appendChild(fragment);
  graph.addEventListener('click', async (e)=> { 
    e.stopPropagation(); 
    // console.log(e, model);
    if(e.target.id && getPt(e.target.id).length===2) // clicked on box
      await fill(e.target.id); 
  })
}

async function visit(i,j) {
  const cell = document.getElementById(getId(i,j))
  cell.classList.remove(CLASSES.BLOCKED);
  cell.classList.add(CLASSES.ALIVE);
  await new Promise((res)=>setTimeout(res, 10));
  cell.classList.remove(CLASSES.ALIVE);
  cell.classList.add(CLASSES.VISITED);
}

// DFS recursive
// async function dfs([x,y], visited) {
//   if (x===dest[0] && y===dest[1]){
//     return true;
//   }

//   await visit(x,y);
//   visited[x][y] = true;

//   for(let move of moves){
//     let nx = x + move[0]
//     let ny = y + move[1]
//     if(nx<col && nx>-1 && ny<row && ny>-1 && !visited[nx][ny]){
//       let reached = await dfs([nx,ny], visited)
//       if(reached) return true;
//     }
//   }
//   return false;
// }

// DFS iterative
async function dfs([x,y], graph) {
  const stack = [[x,y]]

  while(stack.length) {
    let [cx, cy] = stack.pop();

    graph[cx][cy] = colored;
    await visit(cx,cy);

    for(let move of moves) {
      const nx = cx + move[0]
      const ny = cy + move[1]
      if(nx<col && nx>-1 && ny<row && ny>-1 
        && graph[nx][ny] !== colored
        && graph[nx][ny] === toColor 
      ){
        stack.push([nx,ny]) 
      }
    }
  }
}

async function fill(id) {
  const [cx,cy] = getPt(id);

  if (model[cx][cy] !== colored)
    toColor = model[cx][cy];

  await dfs([cx,cy], model);
}

document.addEventListener('DOMContentLoaded', setup);