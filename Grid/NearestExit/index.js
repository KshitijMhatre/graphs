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

const maze = [
  [".",".",".",".",".","+",".",".","."],
  [".","+",".",".",".",".",".",".","."],
  [".",".","+",".","+",".","+",".","+"],
  [".",".",".",".","+",".",".",".","."],
  ["+",".",".",".","+","+",".",".","."],
  ["+",".",".",".",".",".",".",".","."],
  [".",".",".","+",".",".",".",".","."],
  [".",".",".","+",".",".",".",".","+"],
  ["+",".",".","+",".","+","+",".","."]
]
const ROW = maze.length
const COL = maze[0].length

const getId = (i,j) => `${i}-${j}`;
const getPt = str => str.split('-').map((o)=>Number(o));

const CLASSES = {
  BRICK: 'cell-brick',
  VISITED: 'cell-visited',
  DEST: 'cell-dest',
  CELL: 'cell',
  CELL_ROW: 'cell-row',
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

      if (maze[i][j]==='+'){
        cell.innerText = '+'
        cell.classList.add(CLASSES.BRICK)
      }
    }
    fragment.appendChild(row);
  }

  const container = document.getElementById('graph');
  container.appendChild(fragment);

  container.addEventListener('click',(e)=>{
    if(getPt(e.target.id).length === 2 && !e.target.classList.contains(CLASSES.BRICK)) {
      clear()
      moves = Object.values(MOVES)[Math.round(Math.random()*3)]
      e.target.classList.add('entrance'); // marker class id already used
      e.target.innerText = '💁🏽‍♂️'
      solve(getPt(e.target.id))
      e.stopPropagation()
    }
  })
}

function clear() {
  const oldEntry = document.getElementsByClassName('entrance')[0]
  if(oldEntry){
    oldEntry.classList.remove('entrance')
    oldEntry.innerText = ''
    Array.from(document.getElementsByClassName(CLASSES.VISITED)).forEach(el=>el.classList.remove(CLASSES.VISITED))
  }
}

async function visit(i,j, delay=10) {
  const cell = document.getElementById(getId(i,j))
  cell.classList.add(CLASSES.VISITED);
  await sleep(delay)
}

async function solve([x,y]) {

  const visited = Array.from(Array(ROW), () => Array(COL).fill(false))
  visited[x][y] = true
  const queue = [[x,y]]

  // aux storage to reconstruct path - can be m*n matrix but too sparse
  const parents = {}

  let steps = -1
  while(queue.length) {
    let breadth = queue.length
    steps +=1
    while(breadth--) {
      const [cx,cy] = queue.shift()
      await visit(cx,cy)  // color in when exploring

      if(cx===0 || cx===ROW-1 || cy===0 || cy===COL-1){
        await highlightPath([cx,cy], parents)
        return steps
      }

      for(let move of moves){
        const nx = cx + move[0]
        const ny = cy + move[1]

        if(nx>-1 && nx<ROW && ny>-1 && ny<COL && !visited[nx][ny] && maze[nx][ny]!=='+'){
          visited[nx][ny] = true  // mark visited to not land on same
          queue.push([nx,ny])
          parents[getId(nx,ny)] = [cx,cy]
        }
      }
    }
  }
  return -1
}

async function sleep(ms) {
  await new Promise((res)=>setTimeout(res, ms));
}

async function highlightPath([cx,cy], parents) {
  let path = [
    [cx,cy] // exit
  ]        
  while(cx!==null && cy!==null){
    [cx,cy] = parents[getId(cx,cy)] || [null,null]
    path.unshift([cx,cy]) // add to start 
  }
  path.shift() // remove null termination
  await sleep(1000)

  Array.from(document.getElementsByClassName(CLASSES.VISITED)).forEach(el=>el.classList.remove(CLASSES.VISITED))
  // console.log(path)
  for(step of path){
    await visit(...step, 100)
  }
}

document.addEventListener('DOMContentLoaded', setup);