// let row = 30;
// let col = 30;

// let src = [3, 4];
// let dest = [row - 5, col - 7];
let row = 30;
let col = 30;

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

  // TODO: don't allow reset when game in progress
  const resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', reset)
}

function reset() {
  const cells = Array.from(document.getElementsByClassName(CLASSES.VISITED))
  cells.forEach(el=>el.classList.remove(CLASSES.VISITED));

  const srcEl = document.getElementById(getId(...src))
  srcEl.classList.add(CLASSES.ALIVE);
}

async function visit(i,j) {
  const cell = document.getElementById(getId(i,j))
  cell.classList.add(CLASSES.ALIVE);
  await new Promise((res)=>setTimeout(res, 10));
  cell.classList.remove(CLASSES.ALIVE);
  cell.classList.add(CLASSES.VISITED);
}

async function play() {
  const model = Array.from(Array(row), ()=>Array(col).fill(false))
  await dfs(src, model);
}

async function dfs([x,y], visited) {
  const moves = [
    [0,1],
    [1,0],
    [0,-1],
    [-1,0]
  ]

  if (x===dest[0] && y===dest[1]){
    window.alert('Reached');
    return true;
  }

  await visit(x,y);
  visited[x][y] = true;

  for(let move of moves){
    let nx = x + move[0]
    let ny = y + move[1]
    if(nx<col && nx>-1 && ny<row && ny>-1 && !visited[nx][ny]){
      let reached = await dfs([nx,ny], visited)
      if(reached) return true;
    }
  }
  return false;
}

document.addEventListener('DOMContentLoaded', setup);