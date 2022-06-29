export default class Controller{
    constructor(game, view, ws, control){
        this.game = game;
        this.view = view;
        this.ws = ws
        this.control = control;
        this.isPlaying = false;
        this.isIntervalId = null;

        if(control){
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
            document.addEventListener('keyup', this.handleKeyUp.bind(this));
        }

        this.view.renderStartScreen();
    }

    update(){
        if(this.control){
            this.game.movePieceDown();
            this.updateView();
                this.ws.send(JSON.stringify(this.game.getState()))
        }
    }

    startTimer(){
        const speed = 1000 - this.game.getState().level * 100;
        if(!this.isIntervalId){
                this.isIntervalId = setInterval(()=>{
                this.update();
            },speed > 0 ? speed : 100);
        }
    }

    stopTimer(){
        if(this.isIntervalId){
            clearInterval(this.isIntervalId);
            this.isIntervalId = null;
        }
    }

    play(){
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
    }

    pause(){
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
    }

    updateView(stat){
        const state = stat || this.game.getState();
        if(state.isGameOver){
            this.view.renderEndScreen(state);
        }else if(!this.isPlaying){
            this.view.renderPauseScreen();
        }else{
            this.view.render(state);
        }
    }

    handleKeyDown(event){
        const state = this.game.getState();
        switch(event.keyCode){
            case 13://enter
                if(this.isPlaying){
                    this.pause();
                }else{
                    this.play();
                }
                break;
            case 37: //Left
                this.game.movePieceLeft();
                this.view.render(this.game.getState());
                this.updateView();
                break;
            case 38: //Rotate
                this.game.rotatePiece();
                this.view.render(this.game.getState());
                this.updateView();
                break;    
            case 39: //Right
                this.game.movePieceRight();
                this.view.render(this.game.getState());
                this.updateView();
                break;
            case 40: //Down
                this.stopTimer(); 
                this.game.movePieceDown();
                this.view.render(this.game.getState());
                this.updateView();
                break;
        }
    }

    handleKeyUp(event){
        switch(event.keyCode){
            case 40: //Down
                this.startTimer();
                break;
        }
    }
}