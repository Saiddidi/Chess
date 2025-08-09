// يعتمد على chess.js
window.GameLogic = (function(){
  const game = new Chess();

  function newGame(){
    game.reset();
  }
  function move(from,to){
    const m = game.move({from, to, promotion: 'q'});
    return m;
  }
  function moves(square){
    return game.moves({square, verbose:true});
  }
  function fen(){ return game.fen(); }
  function pgn(){ return game.pgn(); }
  function loadFen(f){ return game.load(f); }
  function inCheck(){ return game.in_check(); }
  function gameOver(){ return game.game_over(); }
  function turn(){ return game.turn(); }

  return { newGame, move, moves, fen, pgn, loadFen, inCheck, gameOver, turn };
})();
