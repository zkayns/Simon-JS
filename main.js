class SimonGame {
    constructor() {};
    create() {
        this.gameCanvas=document.createElement("canvas");
        this.gameCanvas.width=480;
        this.gameCanvas.height=480;
        this.gameContext=this.gameCanvas.getContext("2d");
        document.body.appendChild(this.gameCanvas);
        this.gameCanvas.addEventListener("mousedown", (e)=>this.mouseDown(e));
        this.gameCanvas.addEventListener("mousemove", (e)=>this.mouseMove(e));
        this.start();
        setInterval(()=>this.update(this), 1000/60);
    };
    update() {
        switch (this.state) {
            case 1: // FLASHING
                if (Date.now()-this.flashStart>=1000) {
                    this.lastFlashEnd=Date.now();
                    this.state=2;
                };
                break;
            case 2: // BETWEEN FLASHES
                if (Date.now()-this.lastFlashEnd>=1000) {
                    if (this.progress<this.memory.length) this.flash();
                    else {
                        this.state=3;
                        this.progress=0;
                    };
                };
                break;
            case 3: // SELECTION
                break;
        };
        this.draw();
    };
    start() {
        this.memory=new Array();
        this.add();
        this.state=0;
        this.progress=0;
        this.lastSelect=0;
        this.score=0;
    };
    flash() {
        this.flashStart=Date.now();
        this.c=this.memory[this.progress];
        this.progress++;
        this.state=1;
    };
    draw() {
        this.gameContext.fillStyle="#800";
        this.gameContext.fillRect(0, 0, this.gameCanvas.width/2, this.gameCanvas.height/2);
        this.gameContext.fillStyle="#080";
        this.gameContext.fillRect(this.gameCanvas.width/2+1, 0, this.gameCanvas.width/2, this.gameCanvas.height/2);
        this.gameContext.fillStyle="#008";
        this.gameContext.fillRect(0, this.gameCanvas.height/2+1, this.gameCanvas.width/2, this.gameCanvas.height/2);
        this.gameContext.fillStyle="#880";
        this.gameContext.fillRect(this.gameCanvas.width/2+1, this.gameCanvas.height/2+1, this.gameCanvas.width/2, this.gameCanvas.height/2);
        switch (this.state) {
            case 0: // PRESTART
                this.gameContext.fillStyle="#000b";
                this.gameContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
                this.gameContext.fillStyle="#fff";
                this.gameContext.textAlign="center";
                this.gameContext.textBaseline="top";
                this.gameContext.font="32px monospace";
                this.gameContext.fillText("CLICK TO START", this.gameCanvas.width/2, this.gameCanvas.height/2);
                break;
            case 1: // FLASHING
                this.gameContext.fillStyle=["#f00", "#0f0", "#00f", "#ff0"][this.c];
                this.gameContext.fillRect((this.c%2)*(this.gameCanvas.width/2+1), (+(this.c>=2))*(this.gameCanvas.height/2+1), this.gameCanvas.width/2, this.gameCanvas.height/2);
                break;
            case 3:
                let c=this.getCAtPos(this.mouseX, this.mouseY);
                if (Date.now()-this.lastSelect>255) {
                    this.gameContext.fillStyle=["#f00", "#0f0", "#00f", "#ff0"][c];
                    this.gameContext.fillRect((c%2)*(this.gameCanvas.width/2+1), (+(c>=2))*(this.gameCanvas.height/2+1), this.gameCanvas.width/2, this.gameCanvas.height/2);
                } else {
                    this.gameContext.fillStyle=`${["#ff0000", "#00ff00", "#0000ff", "#ffff00"][this.c]}${(Date.now()-this.lastSelect).toString(16).padStart(2, "0")}`;
                    this.gameContext.fillRect((this.c%2)*(this.gameCanvas.width/2+1), (+(this.c>=2))*(this.gameCanvas.height/2+1), this.gameCanvas.width/2, this.gameCanvas.height/2);
                };
                break;
            case 4: // FAILURE
                this.gameContext.fillStyle="#0008";
                this.gameContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
                this.gameContext.fillStyle="#fff";
                this.gameContext.textAlign="center";
                this.gameContext.textBaseline="top";
                this.gameContext.font="32px monospace";
                this.gameContext.fillText(`FAILURE! FINAL SCORE: ${this.score}`, this.gameCanvas.width/2, this.gameCanvas.height/2);
                break;
        };
        this.lastDraw=Date.now();
    };
    mouseMove(e) {
        this.mouseX=e.layerX;
        this.mouseY=e.layerY;
    };
    mouseDown(e) {
        switch (this.state) {
            case 0: // PRESTART
                this.state=2;
                this.lastFlashEnd=Date.now();
                break;
            case 3: // SELECTION
                if (this.getCAtPos(e.layerX, e.layerY)==this.memory[this.progress]) {
                    this.progress++;
                    this.score=this.progress+1;
                    this.lastSelect=Date.now();
                    this.c=this.getCAtPos(e.layerX, e.layerY);
                    if (this.progress>=this.memory.length) {
                        this.add();
                        this.progress=0;
                        this.state=2;
                        this.lastFlashEnd=Date.now();
                    };
                } else this.state=4;
                break;
            case 4: // FAILURE
                this.start();
                break;
        };
    };
    getCAtPos(x, y) {
        if (x<this.gameCanvas.width/2) {
            if (y>this.gameCanvas.height/2) return 2;
            return 0;
        };
        if (y>this.gameCanvas.height/2) return 3;
        return 1;
    };
    add() {
        this.memory.push(Math.floor(Math.random()*32767)%4);
    };
};
new SimonGame().create();
