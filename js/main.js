import { buildModel, loadModelIfExists } from './neural-network.js';

// واجهة بسيطة: إنشاء الرقعة، رسم المربعات والقطع، تفعيل السحب والإفلات
const boardEl = document.getElementById('board');
const movesLog = document.getElementById('movesLog');
const aiStatus = document.getElementById('aiStatus');

let boardSize = 8;
let selected = null;
let piecesMap = {}; // square -> piece notation (e.g. 'wP')

function createBoard(){
  boardEl.innerHTML='';
  const files = ['h','g','f','e','d','c','b','a']; // rtl layout
  for(let r=8;r>=1;--r){
    for(let f=0;f<8;++f){
      const sq = files[f]+r;
      const div = document.createElement('div');
      div.className='square '+(((r+f)%2)?'dark':'light');
      div.dataset.square = sq;
      boardEl.appendChild(div);

      div.addEventListener('pointerdown', onPointerDown);
    }
  }
}

function onPointerDown(e){
  const sq = e.currentTarget.dataset.square;
  const moves = window.GameLogic.moves(sq);
  if(moves && moves.length>0){
    // highlight possible moves
    highlight(moves.map(m=>m.to));
    selected = sq;
  } else if (selected){
    const mv = window.GameLogic.move(selected, sq);
    if(mv){
      updateUI();
      selected = null;
    }
    clearHighlights();
  }
}

function highlight(list){
  clearHighlights();
  list.forEach(sq=>{
    const el = boardEl.querySelector(`[data-square='${sq}']`);
    if(el) el.style.outline='3px solid rgba(16,185,129,0.6)';
  });
}
function clearHighlights(){
  boardEl.querySelectorAll('.square').forEach(el=>el.style.outline='');
}

function updateUI(){
  // رسم القطع من fen
  const fen = window.GameLogic.fen();
  // تحويل fen إلى مصفوفة بسيطة
  boardEl.querySelectorAll('.square').forEach(sqEl => sqEl.innerHTML='');
  // بسيط: استخدام chess.js لقراءة الوضع
  const game = new Chess(window.GameLogic.fen());
  const board = game.board();
  for(let r=0;r<8;r++){
    for(let f=0;f<8;f++){
      const cell = board[r][f];
      if(!cell) continue;
      const sqIndex = (7-r)*8 + (7-f); // لأن التخطيط rtl
      const squareEl = boardEl.children[sqIndex];
      const img = document.createElement('img');
      img.className='piece';
      const code = (cell.color=='w'? 'w':'b') + cell.type.toUpperCase();
      img.src = `assets/pieces/${code}.svg`;
      squareEl.appendChild(img);
    }
  }

  movesLog.textContent = window.GameLogic.pgn();
  if(window.GameLogic.inCheck()){
    boardEl.style.boxShadow = '0 0 0 6px rgba(255,0,0,0.12)';
  } else boardEl.style.boxShadow='0 6px 18px rgba(0,0,0,0.6)';
}

// تحكمات
document.getElementById('newGameBtn').addEventListener('click', ()=>{ window.GameLogic.newGame(); updateUI(); });
document.getElementById('undoBtn').addEventListener('click', ()=>{ /* تراجع بسيط */ });

// تحميل نموذج إن وجد
(async ()=>{
  aiStatus.textContent = 'جاري فحص النموذج...';
  const m = await loadModelIfExists();
  if(m){ aiStatus.textContent = 'نموذج محمّل'; }
  else aiStatus.textContent = 'لا يوجد نموذج محلي';
})();

createBoard();
window.GameLogic.newGame();
updateUI();
