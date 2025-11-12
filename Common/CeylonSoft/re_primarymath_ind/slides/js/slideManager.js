 /* JS: slide manager
  * initiates slide content and controls
  * slide | seek bar 
  */

 $(document).on('keydown', function(e) {
     var $target = $(e.target || e.srcElement);
     if (e.keyCode == 8 && !$target.is('input,[contenteditable="true"],textarea')) {
         e.preventDefault();
     }
 });

 function slideManager() {
     'use strict';
     //console.log = function() {};
     var slideManager = {
         loadBar: null, // determined below
         loadBarBG: null, // determined below
         loadBarBGin: null, // determined below
         arcVal: 0,
         arcProgressVal: 0,
         start: 4.72,
         loadBarWidth: 0, // determined below
         loadBarHight: 0, // determined below
         acrLinearGradient: null,
         init: function() {},
         progressBar: function(progressVal) {
             progressVal = progressVal * 320;
             slideManager.arcProgressVal = progressVal * 100 / 320;
             //$('#loadBar').css('width', progressVal);
             //console.log("slideManager.arcProgressVal : " + slideManager.arcProgressVal + " %");

             slideManager.loadBarBG.clearRect(0, 0, slideManager.loadBarWidth, slideManager.loadBarHight);
             slideManager.loadBarBG.lineWidth = 18;
             slideManager.loadBarBG.fillStyle = '#ccc';
             slideManager.loadBarBG.strokeStyle = '#ccc';
             slideManager.loadBarBG.beginPath();
             slideManager.loadBarBG.arc(60, 60, 50, 0, 2 * Math.PI, false);
             slideManager.loadBarBG.stroke();


             slideManager.loadBarBGin.lineWidth = 13;
             slideManager.loadBarBGin.fillStyle = '#333';
             slideManager.loadBarBGin.strokeStyle = '#333';
             slideManager.loadBarBGin.beginPath();
             slideManager.loadBarBGin.arc(60, 60, 50, 0, 2 * Math.PI, false);
             slideManager.loadBarBGin.stroke();

             slideManager.arcVal = ((slideManager.arcProgressVal / 100) * Math.PI * 2 * 10).toFixed(2);
             slideManager.acrLinearGradient = slideManager.loadBar.createLinearGradient(0, 110, 0, 0);
             slideManager.acrLinearGradient.addColorStop(0, "#862507");
             slideManager.acrLinearGradient.addColorStop(1, "#CCA173");
             slideManager.loadBar.lineWidth = 13;
             slideManager.loadBar.fillStyle = '#000';
             slideManager.loadBar.strokeStyle = '#000';
             slideManager.loadBar.textAlign = 'center';
             slideManager.loadBar.font = "25px Times New Roman";
             slideManager.loadBar.fillText(slideManager.arcProgressVal + '%', slideManager.loadBarWidth * .5, slideManager.loadBarHight * .58, slideManager.loadBarWidth);
             slideManager.loadBar.fillStyle = slideManager.acrLinearGradient;
             slideManager.loadBar.strokeStyle = slideManager.acrLinearGradient;
             slideManager.loadBar.beginPath();
             slideManager.loadBar.arc(60, 60, 50, slideManager.start, slideManager.arcVal / 10 + slideManager.start, false);
             slideManager.loadBar.stroke();
             $('#preload p').css('display', 'block');
             if (progressVal === 320) {
                 setTimeout(function() {
                     $('#loadBarCanvas').css('width', 0);
                     $('#preload, #loadBarCanvas').css('display', 'none');
                     parent.surala.slideNavigation.reloadSlideState = true;
                     /* speed control */
                     parent.$('.lecture-controls-box').css("pointer-events", "auto");
                 }, 100);
             }
         },
         playNextAnimation: function(audio, callback) {
             parent.surala.audio.playSound(audio, null, function() {
                 parent.surala.character.stopAllAnimation();
                 parent.surala.character.teacherTalk(true);
                 //slideTutorial.tutorialQueue = [];
                 callback();
             });
         },
         preLoadFromList: function(images, sounds, donecallback, progresscallback) {
             "use strict";
             var imagesDone = 0,
                 soundsDone = 0,
                 imgParent,
                 audioParent,
                 i,
                 img_id,
                 audio_id,
                 img,
                 onLoadFunction,
                 onErrorFunction,
                 j,
                 progress = 0;

             if (images === undefined || images === null) {
                 images = [];
             }
             if (sounds === undefined || sounds === null) {
                 sounds = [];
             }

             if (parent.flash_problem_num != null) {
                 sounds = [];
             } else if (!(typeof parent.flash_problem_num === "undefined")) {
                 sounds = [];
             }

             if (images.length + sounds.length === 0) {
                 donecallback();
                 return;
             }

             function checkDone() {
                 try {
                     if (progresscallback !== undefined && progresscallback !== null) {
                         progress = ((imagesDone + soundsDone) / (images.length + sounds.length)).toFixed(1);
                         progresscallback(progress);
                     }

                     if (imagesDone === images.length && soundsDone === sounds.length) {
                         if (donecallback !== null) {
                             donecallback();
                             //parent.preloadStatus = true;
                         }
                     }
                 } catch (e) {
                     //console.log('Asset Loader JS : checkDone');
                 }
             }

             function imageLoadDone() {
                 imagesDone = imagesDone + 1;
                 //console.log('imagesDone: ' + imagesDone);
                 checkDone();
             }
             imgParent = parent.document.getElementById('slideImages');

             function SoundLoadDone() {
                 soundsDone = soundsDone + 1;
                 checkDone();
             }

             function loadAudioAssets(sounds, j) {
                 var soundpath = "./../../assets/sound/" + sounds[j].src + '.mp3';
                 var soundName = sounds[j].name;

                 parent.surala.audio.sounds[soundName] = new Howl({
                     src: [soundpath],
                     preload: true,
                     onload: function() {
                         //console.log("Loaded sound: - " + soundpath);
                         SoundLoadDone();
                     },
                     onloaderror: function() {
                         console.log("Audio not loaded : " + soundpath);
                     }
                 });
             }

             onLoadFunction = function() {
                 imageLoadDone();
             };

             onErrorFunction = function(evt) {
                 imageLoadDone();
             };

             try {
                 for (i = 0; i < images.length; i = i + 1) {
                     img_id = 'image_' + images[i].name;

                     if (document.getElementById(img_id) !== null) { // Skip images that exist already...
                         imageLoadDone();
                     } else {
                         img = new Image();
                         img.onload = onLoadFunction;
                         img.onerror = onErrorFunction;
                         img.src = images[i].src;
                         imgParent.appendChild(img);
                         img.setAttribute('id', img_id);
                         img.anim = images[i].anim;
                     }
                 }
                 for (j = 0; j < sounds.length; j = j + 1) {
                     if (parent.surala.support.webAudio) {
                         parent.surala.audio.loadSound(sounds[j].name, sounds[j].src, sounds[j].type, 1, SoundLoadDone);
                     } else {
                         loadAudioAssets(sounds, j);
                     }
                 }
                 var soundPath = null;
                 for (i = 0; i < sounds.length; i++) {
                     soundPath = sounds[i].src.split('/')[sounds[i].src.split('/').length - 1];
                     if (soundPath !== sounds[i].name) {
                         console.error("Difference in name and audio path\nSound name: " + sounds[i].name + " | Sound path: " + soundPath);
                     }
                 }
             } catch (e) {
                 //console.log('load asset error: '+ e);
             }
         }
     };

     // Does the browser support canvas?
     var canvas = document.getElementById('loadBarCanvas');
     try {
         slideManager.loadBarWidth = canvas.width,
             slideManager.loadBarHight = canvas.height,
             slideManager.loadBar = canvas.getContext('2d'); // S60
         slideManager.loadBarBG = canvas.getContext('2d'); // S60
         slideManager.loadBarBGin = canvas.getContext('2d'); // S60

     } catch (e) {
         //console.log('canvas support: '+e);
     }

     slideManager.init();
     return slideManager;
 }