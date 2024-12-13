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

let row = 25;
let col = 25;

let src = [3, 4];
let dest = [row - 5, col - 7];

const getId = (i,j) => `${i}-${j}`;
const CLASSES = {
  ALIVE: 'cell-alive',
  VISITED: 'cell-visited',
  DEST: 'cell-dest',
  CELL: 'cell',
  CELL_ROW: 'cell-row',
}

function setup(){
  const fragment = document.createDocumentFragment();

  for(let i = 0; i < row; i++){
    const row = document.createElement('div');
    row.className = CLASSES.CELL_ROW ;
    for(let j = 0; j < col; j++){
      const cell = document.createElement('div');
      cell.className = CLASSES.CELL;
      cell.id = getId(i,j);
      row.appendChild(cell);

      if(i === src[0] && j === src[1]){
        cell.classList.add(CLASSES.ALIVE);
      } else if(i === dest[0] && j === dest[1]){
        cell.classList.add(CLASSES.DEST);
      }
    }
    fragment.appendChild(row);
  }

  const container = document.getElementById('graph');
  container.appendChild(fragment);

  const playButton = document.getElementById('play');
  playButton.addEventListener('click', play)

  const resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', reset)

  const shuffleButton = document.getElementById('shuffle');
  shuffleButton.addEventListener('click', shuffle);
}

function reset() {
  const cells = Array.from(document.getElementsByClassName(CLASSES.VISITED))
  cells.forEach(el=>el.classList.remove(CLASSES.VISITED));

  const srcEl = document.getElementById(getId(...src))
  srcEl.classList.add(CLASSES.ALIVE);

  const playButton = document.getElementById('play');
  playButton.removeAttribute('hidden');
  const resetButton = document.getElementById('reset');
  resetButton.setAttribute('hidden', true);
  const shuffleButton = document.getElementById('shuffle');
  shuffleButton.removeAttribute('hidden');

  // choose random moves sequence
  moves = Object.values(MOVES)[Math.round(Math.random()*3)]
}

async function visit(i,j) {
  const cell = document.getElementById(getId(i,j))
  cell.classList.add(CLASSES.ALIVE);
  await new Promise((res)=>setTimeout(res, 10));
  cell.classList.remove(CLASSES.ALIVE);
  cell.classList.add(CLASSES.VISITED);
}

async function play() {
  const playButton = document.getElementById('play');
  playButton.setAttribute('hidden', true);
  const shuffleButton = document.getElementById('shuffle');
  shuffleButton.setAttribute('hidden', true);
  
  const model = Array.from(Array(row), ()=>Array(col).fill(false))
  await bfs(src, model);
  
  const resetButton = document.getElementById('reset');
  resetButton.removeAttribute('hidden');
  shuffleButton.removeAttribute('hidden');
}

async function bfs([x,y], visited) {
  
  await visit(x,y);
  visited[x][y] = true;
  let exploreQueue = [[x,y]]

  while(exploreQueue.length) {
    // tracks completion of given depth
    // let depthSize = exploreQueue.length
    // while(depthSize--) {
      let current = exploreQueue.shift() // dequeue FIFO
      let [cx,cy] = current;
      if(cx===dest[0] && cy===dest[1]) {
        break;
      }
  
      for(let move of moves) {
        const nx = cx + move[0]
        const ny = cy + move[1]
  
        if (nx>-1 && nx<row && ny>-1 && ny<col && !visited[nx][ny]){
          await visit(nx,ny)
          visited[nx][ny] = true; // marked visited before exploring - as neighbors will try to visit same  
          exploreQueue.push([nx,ny])
        }
      }
    // }
  }
}

function shuffle() {
  reset()

  // clear old
  let srcEl = document.getElementById(getId(...src));
  let destEl = document.getElementById(getId(...dest));
  srcEl.classList.remove(CLASSES.ALIVE);
  destEl.classList.remove(CLASSES.DEST);

  src = [
    Math.round(Math.random()*(row-1)),
    Math.round(Math.random()*(col-1)),
  ]
  dest = [
    Math.round(Math.random()*(row-1)),
    Math.round(Math.random()*(col-1)),
  ]

  // set new
  srcEl = document.getElementById(getId(...src));
  destEl = document.getElementById(getId(...dest));
  srcEl.classList.add(CLASSES.ALIVE);
  destEl.classList.add(CLASSES.DEST);
}

document.addEventListener('DOMContentLoaded', setup);