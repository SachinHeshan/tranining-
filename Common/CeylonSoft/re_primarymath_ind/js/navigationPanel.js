 /* JS: navigation panel */
 var playbuttonClick = false;
 var preloadStatus = false;

 // disable backspace return
 $(window).on('keydown', function(e) {
     var $target = $(e.target || e.srcElement);
     if (e.keyCode == 8 && !$target.is('input,[contenteditable="true"],textarea')) {
         e.preventDefault();
     }
 });

 $(parent.document.body).unbind('keydown').bind('keydown', function(event) {
     if (event.keyCode === 8) {
         var doPrevent = true;
         var types = ["text", "password", "file", "search", "email", "number", "date", "color", "datetime", "datetime-local", "month", "range", "search", "tel", "time", "url", "week"];
         var d = $(event.srcElement || event.target);
         var disabled = d.prop("readonly") || d.prop("disabled");
         if (!disabled) {
             if (d[0].isContentEditable) {
                 doPrevent = false;
             } else if (d.is("input")) {
                 var type = d.attr("type");
                 if (type) {
                     type = type.toLowerCase();
                 }
                 if (types.indexOf(type) > -1) {
                     doPrevent = false;
                 }
             } else if (d.is("textarea")) {
                 doPrevent = false;
             }
         }
         if (doPrevent) {
             event.preventDefault();
             return false;
         }
     }
 });

 function slideNavigation() {
     'use strict';
     var interval = null;
     var blinkFlag = false;
     var currentIndex;
     this.playPauseState = false;
     this.reloadSlideState = false;
     this.playStatus = "play";
     $('#currentSlideNo').html(surala.currentSlide);
     $('#totalslideNo').html(surala.totalSlides);

     //console.log = function() {};
     this.prevSlide = function() {
         /* speed control */
         $('.lecture-controls-box').css("pointer-events", "none");
         if (preloadStatus) {
             /* Spot function: load previous slides from disp page */
             //console.log(disp_page_array.length+':'+disp_page_array);
             if (disp_page_array.length > 0) {
                 if (surala.currentSlide > parseInt(disp_page_array[0])) {
                     currentIndex = disp_page_array.indexOf(surala.currentSlide);
                     surala.currentSlide = disp_page_array[currentIndex - 1];

                     this.blinkNextBtn(false);
                     this.playPauseState = false;
                     this.reloadSlideState = false;
                     $('#playPause').attr('class', 'pause_w');
                     surala.iOSflag = false;
                     surala.slideTutorial.tutorialQueue = [];
                     surala.audio.stopAllNonLoopSounds();
                     surala.character.stopAllAnimation();
                     surala.audio.stopAllNonLoopSounds();
                     loadPrevSlide(surala.currentSlide);
                     checkBookmarkPos(surala.currentSlide);

                     if (surala.currentSlide == disp_page_array[0]) {
                         //disable the button.
                     }
                 } else {
					 /* Spot previous navigation button fix : 10-July-21 */
					 window.location = "main.html";
				 }
             } else {

                 if (surala.currentSlide == parseInt(current_page)) {
                     return;
                 }

                 this.blinkNextBtn(false);
                 this.playPauseState = false;
                 this.reloadSlideState = false;
                 $('#playPause').attr('class', 'pause_w');
                 surala.iOSflag = false;
                 surala.currentSlide--;
                 surala.slideTutorial.tutorialQueue = [];
                 surala.audio.stopAllNonLoopSounds();
                 if (surala.currentSlide !== 0) {
                     surala.character.stopAllAnimation();
                     surala.audio.stopAllNonLoopSounds();
                     loadPrevSlide(surala.currentSlide);
                 } else {
                     //surala.reset_title();
                     window.location = "main.html";
                 }
             }
             $('#currentSlideNo').html(surala.currentSlide);
             $('#totalslideNo').html(surala.totalSlides);
             preloadStatus = false;
         }
     };
     this.nextSlide = function() {
         /* speed control */
         $('.lecture-controls-box').css("pointer-events", "none");
         /* Spot function: load next slides from disp page */
         if (disp_page_array.length > 0) {
             if (preloadStatus) {
                 if (surala.currentSlide >= parseInt(disp_page_array[0]) && surala.currentSlide < parseInt(disp_page_array[disp_page_array.length - 1])) {
                     currentIndex = disp_page_array.indexOf(surala.currentSlide);
                     surala.currentSlide = disp_page_array[currentIndex + 1];

                     this.playPauseState = false;
                     this.reloadSlideState = false;
                     $('#playPause').attr('class', 'pause_w');
                     surala.disablecallOut();
                     surala.slideTutorial.tutorialQueue = [];
                     surala.audio.stopAllNonLoopSounds();
                     this.blinkNextBtn(false);
                     surala.character.stopAllAnimation();
                     surala.slideTutorial.tutorialQueue = [];
                     loadNextSlide(surala.currentSlide);
                     surala.slidecontainer.src = 'assets/slides/slide' + surala.currentSlide + '.html';
                     $('#currentSlideNo').html(surala.currentSlide);
                     $('#totalslideNo').html(surala.totalSlides);
                     checkBookmarkPos(surala.currentSlide)
                 } else {
                     this.blinkNextBtn(false);
                     //console.log('Lecture Ended | Need to call LMS method here!');
                     window.location = next_sco_url;
                 }
                 preloadStatus = false;
             }
         } else {
             if (preloadStatus) {
                 if (surala.currentSlide < surala.totalSlides) {
                     this.playPauseState = false;
                     this.reloadSlideState = false;
                     $('#playPause').attr('class', 'pause_w');
                     surala.iOSflag = false;
                     surala.disablecallOut();
                     surala.slideTutorial.tutorialQueue = [];
                     surala.audio.stopAllNonLoopSounds();
                     this.blinkNextBtn(false);
                     surala.character.stopAllAnimation();
                     surala.currentSlide++;
                     surala.slideTutorial.tutorialQueue = [];
                     loadNextSlide(surala.currentSlide);
                     surala.slidecontainer.src = 'assets/slides/slide' + surala.currentSlide + '.html';
                     $('#currentSlideNo').html(surala.currentSlide);
                     $('#totalslideNo').html(surala.totalSlides);
                 } else if (surala.currentSlide == surala.totalSlides) {
                     this.blinkNextBtn(false);
                     //console.log('Lecture Ended | Need to call LMS method here!');
                     window.location = next_sco_url;
                 }
                 preloadStatus = false;
             }
         }
     };
     this.blinkNextBtn = function(value) {
         if (value && blinkFlag === false) {
             blinkFlag = true;
             interval = setInterval(function() {
                 if ($('.next_w').hasClass('blink')) {
                     $('.next_w').removeClass('blink');
                     $('.next_w').css('background-position', '-195px -49px');
                 } else {
                     $('.next_w').addClass('blink');
                     $('.next_w').css('background-position', '-195px -0px');
                 }
             }, 500);
         } else if (!value) {
             blinkFlag = false;
             clearInterval(interval);
             $('.next_w').css('background-position', '-195px -49px');
         }
     };
     this.playPause = function() {
         //console.log(this.playPauseState);

         if (!this.playPauseState) {
             return;
         }

         //Audio overlapping issue on click of Speed control button - 26Mar2021
         document.getElementById("slidecontainer").contentWindow.stopAllTimeOut();

         if ($('#playPause').hasClass("play_w")) {
             playbuttonClick = true;
             surala.audio.resume();
             $('#playPause').attr('class', 'pause_w');
             this.playStatus = "play";
             document.getElementById("slidecontainer").contentWindow.playSlide("play");
         } else if ($('#playPause').hasClass("pause_w")) {
             surala.audio.pause();
             $('#playPause').attr('class', 'play_w');
             this.playStatus = "pause";
             document.getElementById("slidecontainer").contentWindow.playSlide("pause");
             //surala.character.stopAllAnimation();
         }
     };
     this.reloadSlide = function() {
         /* speed control */
         $('.lecture-controls-box').css("pointer-events", "none");
         if (!preloadStatus) {
             return;
         }
         preloadStatus = false;
         /* clear the screen on click of reload button */
         surala.slidecontainer.src = '';
         this.reloadSlideState = false;
         $('.speech_bubble').css('visibility', 'hidden');
         surala.disablecallOut();
         setTimeout(function() {
             surala.slidecontainer.src = 'assets/slides/slide' + surala.currentSlide + '.html';
         }, 100);
         playbuttonClick = true;
         $('#playPause').attr('class', 'pause_w');
         this.playStatus = "play";
         document.getElementById("slidecontainer").contentWindow.playSlide("play");
     };
     this.updateSlideNo = function() {
         $('#currentSlideNo').html(surala.currentSlide);
         $('#totalslideNo').html(surala.totalSlides);
     };
     if (surala.support.desktop) {
         $('.next_w').hover(function() {
             $('.next_w').css('background-position', '-195px -0px');
         }, function() {
             $('.next_w').css('background-position', '-195px -49px');
         });
     }
 }

 /* speed control */
 $('#playPause').click(function() {
     if ($('#playPause').hasClass("play_w")) {
         $('.lecture-controls-box').css("pointer-events", "none");
     } else if ($('#playPause').hasClass("pause_w")) {
         $('.lecture-controls-box').css("pointer-events", "auto");
     }
 });