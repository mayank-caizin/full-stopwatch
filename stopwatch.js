export class StopWatch {
    startTime = 0;
    elapsedTime = 0;
    timerInterval;
    playing = false;

    constructor(name, timer, controls) {
        this.name = document.getElementById(name);
        this.time = document.getElementById(timer).querySelector('.time');
        this.toggleButton = document.getElementById(controls).querySelector('.toggle-btn');
        this.resetButton = document.getElementById(controls).querySelector('.reset-btn');

        this.toggleButton.addEventListener('click', this.toggle.bind(this));
        this.resetButton.addEventListener('click', this.reset.bind(this));
    }

    start() {
        this.startTime = Date.now() - this.elapsedTime;

        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.print(this.timeToString(this.elapsedTime));
        }, 10);
    }

    pause() {
        clearInterval(this.timerInterval);
    }

    reset() {
        clearInterval(this.timerInterval);
        this.print("00:00:00");
        this.elapsedTime = 0;
        this.playing = false;

        this.changeButtonImage();
    }

    toggle() {
        this.playing = !this.playing;

        if(this.playing) this.start();
        else this.pause();

        this.changeButtonImage();
    }

    changeButtonImage() {
        let src = this.playing ? "icons/pause-button.svg" : "icons/play-button.svg";

        this.toggleButton.querySelector('.toggle').src = src;
    }

    print(txt) {
        this.time.innerHTML = txt;
    }

    timeToString(time) {
        let diffInHrs = time / 3600000;
        let hh = Math.floor(diffInHrs);

        let diffInMin = (diffInHrs - hh) * 60;
        let mm = Math.floor(diffInMin);

        let diffInSec = (diffInMin - mm) * 60;
        let ss = Math.floor(diffInSec);

        let diffInMs = (diffInSec - ss) * 100;
        let ms = Math.floor(diffInMs);

        let formattedHH = hh.toString().padStart(2, "0");
        let formattedMM = mm.toString().padStart(2, "0");
        let formattedSS = ss.toString().padStart(2, "0");
        let formattedMS = ms.toString().padStart(2, "0");

        return `${formattedHH}:${formattedMM}:${formattedSS}.<span class="small">${formattedMS}</span>`;
    }
}