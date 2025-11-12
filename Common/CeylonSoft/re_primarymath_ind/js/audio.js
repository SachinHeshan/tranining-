/* JS: audio */

/* speed control */
var global_Rate = 1;
var speed_rate = 1;
var audioDur = [];

function AlternateAudio() {
    'use strict';
    var soundsDuration = {},
        resumeSounds = {},
        AlternateAudioManager,
        fadeOutInterval,
        sounds = {};


    AlternateAudioManager = {
        sounds: [],
        slideDuration: 0,
        soundsDuration: sounds,
        loadSound: function(name, path, type, volume, callback) {
            var soundpath = "./assets/sound/",
                request;

            soundpath += path + ".mp3";

            if (surala.audio.sounds[name] !== undefined) {
                //console.log("sound with this name already exists");
                callback();
                return;
            }

            surala.audio.sounds[name] = new Howl({
                src: [soundpath],
                preload: true,
                volume: 1
            });

            surala.audio.sounds[name].once('load', function() {
                //console.log("Loaded sound: - " + soundpath);			

                if (callback !== undefined) {
                    callback();
                }
            });

            surala.audio.sounds[name].once('loaderror', function(e, msg) {
                //console.log('Unable to load file: ' + name);

                if (callback !== undefined) {
                    //callback();
                }
            });


            surala.audio.sounds[name].type = type;
            surala.audio.sounds[name].playing = false;
            surala.audio.sounds[name].pausestate = false;
        },
        unload: function(name) {
            if (surala.audio.sounds[name] !== undefined) {
                surala.audio.sounds[name].unload();
                surala.audio.sounds[name] = undefined;
                //console.log("unload : " + surala.audio.sounds[name]);
            }
        },
        playSound: function(name, loop, callback) {

            try {
                console.log("playing audio: " + name);

                if (loop || surala.audio.sounds[name].type === "effect") {
                    //surala.audio.sounds[name].volume(0.2);
                }

                surala.audio.sounds[name].playing = true;
                surala.audio.sounds[name].callback = callback;
                surala.audio.sounds[name].play(); //surala.audio.sounds[name].loop = true;
                if (surala.audio.sounds[name].callback !== undefined && surala.audio.sounds[name].playing !== undefined) {
                    surala.audio.sounds[name].once('end', function() {
                        try {
                            surala.audio.sounds[name].playing = false;
                            surala.audio.sounds[name].callback();
                        } catch (e) {
                            console.log("caught at : " + e);
                        }
                    });
                }
            } catch (e) {
                //console.log('play sound method: ' + e);
            }
        },
        stopSound: function(name) {

            try {
                surala.audio.sounds[name].stop();

                if (surala.audio.sounds[name].timeout !== undefined && surala.audio.sounds[name].timeout !== null) {
                    clearTimeout(surala.audio.sounds[name].timeout);
                }
            } catch (e) {
                //console.log('stop Sound method: ' + e);
            }

        },
        currentAudioStop: function() {
            var item;
            for (item in surala.audio.sounds) {
                if (surala.audio.sounds[item].playing === true) {
                    surala.audio.sounds[item].stop();
                }
            }
        },
        stopAllNonLoopSounds: function() {
            var item;
            for (item in surala.audio.sounds) {

                if (surala.audio.sounds.hasOwnProperty(item)) {
                    if (surala.audio.sounds[item] !== undefined)
                        if (surala.audio.sounds[item].type !== "effect") {
                            //console.log('stop sound: ' + surala.audio.sounds[item]);
                            surala.audio.sounds[item].stop();
                            surala.audio.stopSound(item);
                            delete surala.audio.sounds[item];
                        }
                }
            }
        },
        clearAllSounds: function() {
            var item;
            for (item in surala.audio.sounds) {

                if (surala.audio.sounds.hasOwnProperty(item)) {
                    if (surala.audio.sounds[item] !== undefined)
                        if (!surala.audio.sounds[item].looping) {
                            //console.log('stop sound: ' + surala.audio.sounds[item]);
                            surala.audio.sounds[item].stop();
                            surala.audio.stopSound(item);
                            //sounds[item].unload();
                        }
                }
            }
        },
        fadeOutVolume: function(name, vol, timeout) {
            try {
                fadeOutInterval = setInterval(function() {
                    if (surala.audio.sounds[name] !== undefined) {
                        if (surala.audio.sounds[name]._volume > (vol - 0.0125) && surala.audio.sounds[name]._volume > 0.0125) { // (vol - 0.05)
                            //console.log('BG music audio volume reduced to 50% : ' + surala.audio.sounds[name]._volume);
                            surala.audio.sounds[name].volume(surala.audio.sounds[name]._volume - 0.025);
                        } else {
                            clearInterval(fadeOutInterval);
                        }
                    }
                }, timeout);
            } catch (e) {
                //console('fadeout volume: '+ e);
            }
        },
        pause: function() {
            var sound;
            for (sound in surala.audio.sounds) {
                if (surala.audio.sounds.hasOwnProperty(sound)) {
                    if (surala.audio.sounds[sound] !== undefined) {
                        if (surala.audio.sounds[sound].playing) {
                            surala.audio.sounds[sound].stop();
                        }
                    }
                }
            }
        },
        resume: function() {
            var sound;
            for (sound in resumeSounds) {
                if (resumeSounds.hasOwnProperty(sound)) {
                    //sounds[sound].pausestate = false;
                    //sounds[sound].play();
                    //this.playSound(sound, sounds[sound].looping, sounds[sound].callback); 
                }
            }
            resumeSounds = [];
        }
    };
    return AlternateAudioManager;
}

function initAudio() {
    'use strict';

    if (!surala.support.webAudio) {
        return new AlternateAudio();
    }

    var context = null,
        sounds = {},
        soundsDuration = {},
        resumeSounds = {},
        nodes = {},
        fadeOutvolumeInterval,
        AudioManager;

    function audioError() {
        console.log("Audio error...");
    }

    AudioManager = {
        slideDuration: 0,
        soundsDuration: sounds,
        currentPlayingAudio: null,
        init: function() {
            try {
                // Fix up for prefixing
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                context = new AudioContext();

                nodes.gain = context.createGain();

                nodes.gain.connect(context.destination);
            } catch (e) {
                alert('Web Audio API is not supported in this browser ' + e);
            }
        },
        loadSound: function(name, path, type, volume, callback) {
            var soundpath = "./assets/sound/",
                request;

            soundpath += path + ".mp3";

            //console.log("Loading sound: - " + soundpath);

            if (sounds[name] !== undefined) {
                //console.log("sound with this name already exists");
                callback();
                return;
            }

            sounds[name] = {
                ready: false,
                buffer: null,
                volume: context.createGain(),
                type: type
            };

            if (volume !== undefined && volume !== null) {
                sounds[name].volume.gain.value = volume;
            }

            request = new XMLHttpRequest();
            request.open('GET', soundpath, true);
            request.responseType = 'arraybuffer';

            // Decode asynchronously
            request.onload = function() {
                if (request.status === 200) {
                    context.decodeAudioData(request.response, function(buffer) {
                        sounds[name].buffer = buffer;
                        sounds[name].ready = true;
                        sounds[name].looping = false;
                        sounds[name].audioDuration = buffer.duration;
                        surala.slideDuration[surala.durationIndex] = name + ' | ' + parseFloat(sounds[name].audioDuration.toFixed(1));
                        console.log(name + ': ' + parseFloat(sounds[name].audioDuration.toFixed(1)));
                        var obj = { "name": name, "dur": parseFloat(sounds[name].audioDuration.toFixed(1)) }
                        audioDur.push(obj);
                        surala.durationIndex++;
                        sounds[name].volume.connect(nodes.gain); // connect track volume before master volume
                        if (callback !== undefined && callback !== null) {
                            callback();
                        }
                    }, audioError);
                } else {
                    audioError();
                }
            };
            request.send();
        },
        playSound: function(name, loop, callback) {
            if (sounds[name] === undefined || sounds[name] === null) {
                console.log("playSound-> sound doesn't exist: " + name);
                return;
            }

            if (!sounds[name].ready) {
                console.log("playSound-> sound not ready: " + name);
                return;
            }

            if (loop || sounds[name].type === "effect") {
                //sounds[name].volume.gain.value = 0.3;
            }

            sounds[name].callback = callback;
            sounds[name].isPlaying = true;
            var endCallback = function() {
                try {
                    if (sounds[name].callback !== undefined) {
                        sounds[name].callback();
                    }

                    sounds[name].isPlaying = false;
                } catch (e) {
                    console.log('error caught: ' + e);
                }
            };

            sounds[name].source = context.createBufferSource();
            sounds[name].source.start = sounds[name].source.start || sounds[name].source.noteOn;
            sounds[name].source.stop = sounds[name].source.stop || sounds[name].source.noteOff;
            sounds[name].source.loop = loop || false;
            sounds[name].looping = sounds[name].source.loop;
            sounds[name].source.buffer = sounds[name].buffer;
            sounds[name].source.connect(sounds[name].volume);

            AudioManager.slideDuration = sounds[name].source.buffer.duration;

            //Adding alternative for callback since source.onended does not exist on all platforms.

            if (sounds[name].source.onended !== undefined) {
                sounds[name].source.onended = endCallback;
            } else {
                //convert duration to ms
                sounds[name].timeout = setTimeout(endCallback, sounds[name].buffer.duration * 1000);
            }

            try {
                sounds[name].source.start(0);
                AudioManager.currentPlayingAudio = sounds[name];
                /* speed control */
                AudioManager.currentPlayingAudio.source.playbackRate.value = global_Rate;
            } catch (e) {
                console.log('audio js | at play ' + e);
            }
            console.log('playing audio: ' + name);
        },
        currentAudioStop: function() {
            AudioManager.currentPlayingAudio.source.stop(0);
        },
        stopSound: function(name) {

            if (sounds[name] === undefined || sounds[name] === null) {
                console.log("stopSound-> sound doesn't exist " + name);
                return;
            }

            if (!sounds[name].ready) {
                console.log("stopSound-> sound not ready");
                return;
            }

            if (sounds[name].source === undefined || sounds[name].source === null) {
                // Sound is not actually playing.
                return;
            }

            try {
                sounds[name].source.stop(0);
                if (sounds[name].timeout !== undefined && sounds[name].timeout !== null) {
                    clearTimeout(sounds[name].timeout);
                }
            } catch (e) {
                console.log(e.message);
            }

        },
        stopAllNonLoopSounds: function() {
            var item;
            for (item in sounds) {

                if (sounds.hasOwnProperty(item)) {
                    if (sounds[item] !== undefined)
                        if (!sounds[item].looping) {
                            //console.log('stop sound: ' + item);
                            surala.audio.stopSound(item);
                            sounds[item].volume.gain.value = 0;
                            sounds[item].buffer = null;
                            sounds[item] = undefined;
                        }
                }
            }
        },
        clearAllSounds: function() {
            var item;
            for (item in sounds) {

                if (sounds.hasOwnProperty(item)) {
                    if (sounds[item] !== undefined)
                        if (!sounds[item].looping) {
                            //console.log('stop sound: ' + item);
                            surala.audio.stopSound(item);
                        }
                }
            }
        },
        fadeOutVolume: function(name, vol, timeout) {
            try {
                fadeOutvolumeInterval = setInterval(function() {
                    if (sounds[name].volume.gain.value > vol) {
                        sounds[name].volume.gain.value -= 0.05;
                        //console.log('BG music audio volume reduced to 50% : ' + sounds[name].volume.gain.value);
                    } else {
                        clearInterval(fadeOutvolumeInterval);
                    }
                }, timeout);
            } catch (e) {
                console.log('fadeout method : ' + e);
            }
        },
        pause: function() {
            var sound;
            for (sound in sounds) {
                if (sounds.hasOwnProperty(sound)) {
                    if (sounds[sound] !== undefined) {
                        if (sounds[sound].isPlaying) {
                            this.stopSound(sound);
                            if (sounds[sound].type === "music" || sounds[sound].type === "effect") {
                                resumeSounds[sound] = sounds[sound];
                            }
                        }
                    }
                }
            }
        },
        resume: function() {
            var sound;
            for (sound in resumeSounds) {
                if (resumeSounds.hasOwnProperty(sound)) {
                    //this.playSound(sound, sounds[sound].looping, sounds[sound].callback);
                }
            }
            resumeSounds = [];
        }
    };
    AudioManager.init();
    return AudioManager;
}