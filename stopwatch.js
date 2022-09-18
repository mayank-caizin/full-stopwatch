export class StopWatch {
    startTime = 0;
    elapsedTime = 0;
    timerInterval;
    playing = false;
    laps = [];

    constructor(name, timer, controls, lapsInfo) {
        this.name = document.getElementById(name);
        this.time = document.getElementById(timer).querySelector('.time');
        this.toggleButton = document.getElementById(controls).querySelector('.toggle-btn');
        this.resetButton = document.getElementById(controls).querySelector('.reset-btn');
        this.lapButton = document.getElementById(controls).querySelector('.lap-btn');

        this.toggleButton.addEventListener('click', this.toggle.bind(this));
        this.resetButton.addEventListener('click', this.reset.bind(this));
        this.lapButton.addEventListener('click', this.lap.bind(this));

        this.lapsContainer = document.getElementById(lapsInfo);
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

        if(this.laps.length > 0) {
            let average = this.average_time(this.str_array_to_time_array(this.laps));
            let txt = this.formatTime(average.hours, average.minutes, average.seconds, average.milliseconds);

            let newP = document.createElement('p');
            newP.classList.add('gold');
            let newText = document.createTextNode('Average: ' + txt);
            newP.appendChild(newText);
            this.lapsContainer.prepend(newP);
        }
    }

    reset() {
        clearInterval(this.timerInterval);
        this.print("00:00:00");
        this.elapsedTime = 0;
        this.playing = false;
        this.laps = [];

        this.changeButtonImage();
        this.lapsContainer.replaceChildren();
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

        return this.formatTime(hh, mm, ss, ms);
    }

    formatTime(hh, mm, ss, ms) {
        let formattedHH = hh.toString().padStart(2, "0");
        let formattedMM = mm.toString().padStart(2, "0");
        let formattedSS = ss.toString().padStart(2, "0");
        let formattedMS = ms.toString().padStart(2, "0");

        return `${formattedHH}:${formattedMM}:${formattedSS}:${formattedMS}`;
    }

    // Laps Logic
    lap() {
        this.laps.push(this.time.innerText);

        let newP = document.createElement('p');
        let length = this.laps.length;
        let newText = document.createTextNode(length + ". " + this.laps[length - 1]);
        newP.appendChild(newText);
        this.lapsContainer.prepend(newP);
    }

    str_to_time (time_str) {
        let pieces = time_str.split(':');
        return {
            hours: parseInt(pieces[0], 10),
            minutes: parseInt(pieces[1], 10),
            seconds: parseInt(pieces[2], 10),
            milliseconds: parseInt(pieces[3], 10)
        };
    };

    str_array_to_time_array (str_array) {
        return str_array.map(this.str_to_time);
    };

    average_time (time_array) {
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        let milliseconds = 0;

        for (let i = 0; i < time_array.length; i++) {
            hours += time_array[i].hours;
            minutes += time_array[i].minutes;
            seconds += time_array[i].seconds;
            milliseconds += time_array[i].milliseconds;
        }

        hours /= time_array.length;
        minutes /= time_array.length;
        seconds /= time_array.length;
        milliseconds /= time_array.length;

        // Hours, minutes and seconds may be fractional. Carry the fractions down.
        minutes += (hours - Math.floor(hours)) * 60;
        hours = Math.floor(hours);
        seconds += (minutes - Math.floor(minutes)) * 60;
        minutes = Math.floor(minutes);
        milliseconds += (seconds - Math.floor(seconds)) * 100;
        seconds = Math.floor(seconds);
        milliseconds = Math.round(milliseconds);
        // if milliseconds is >= 1000, add a second.
        seconds += Math.floor(milliseconds / 100);
        milliseconds %= 100;
        // If seconds >= 60, add a minute.
        minutes += Math.floor(seconds / 60);
        seconds %= 60;
        // If minutes >= 60, add an hr
        hours += Math.floor(minutes / 60);
        minutes %= 60;

        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            milliseconds: milliseconds
        };
      };
}