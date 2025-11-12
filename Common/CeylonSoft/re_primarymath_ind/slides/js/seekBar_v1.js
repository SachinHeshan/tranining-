/* JS: seek Bar */
/* global methods for seek bar */

// constant values
var seekbarWidth = 720; // 15px start position
var seekbarLength = 717;
var currentSliderPos = 0;
var seekBarStatus = "inprogress";
var sliderChanged = false;
var timeOut,
  interVal = null;
var disableSeekBar = false;
var pauseSeekbar = false;
var onSliderDrag = false;

var previousSeqNo = 0;

$(function () {
  $("img").on("dragstart", function (event) {
    if (slideTutorial.enableSeekbar) {
      event.preventDefault();
    }
  });
  window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  /* 10-Apr-2020: disable browser next and back */
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
  };
  //this line will disable the right click funtionality for main html
  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });

  parent.surala.slideNavigation.playStatus = "play";
  parent.surala.slideNavigation.playPauseState = false;

  if (parent.surala.support.desktop) {
    $("head").append(
      '<link rel="stylesheet" type="text/css" href="../../../../../../common/CeylonSoft/re_primarymath_ind/slides/css/hoverEffects.css">'
    );
  }
  parent.$(".speech_bubble").css("visibility", "visible");
});

var seekBarTimer = null;
function playSeekbar() {
  try {
    clearTimeout(seekBarTimer);
    var timeOutDur = parseFloat(
      ((totalDuration * 1000) / seekbarLength).toFixed(2)
    );
    var pixMoveDur = 5;
    if (!parent.surala.support.webAudio) {
      pixMoveDur = 5.16;
    }
    $("#seekBarSlider").css("cursor", "pointer");
    seekBarTimer = setTimeout(function () {
      if (
        currentSliderPos < seekbarLength &&
        slideTutorial.enableSeekbar &&
        !pauseSeekbar
      ) {
        currentSliderPos += 5;
        if (currentSliderPos > seekbarLength) {
          currentSliderPos = seekbarLength;
        }

        if (!onSliderDrag) {
          $("#sliderVal").css({ width: currentSliderPos + "px" });
          $("#seekBarSlider").css({ left: currentSliderPos + "px" });
        }
        playSeekbar();
        if (currentSliderPos > seekbarLength - 15) {
          parent.surala.slideNavigation.playPauseState = false;
        }
      } else if (currentSliderPos >= seekbarLength) {
        parent.surala.character.stopAllAnimation();
        seekBarStatus = "ended";
        onSliderDrag = false;
        currentSliderPos = seekbarLength;
        $("#seekBarSlider").css({ left: currentSliderPos + "px" });
        $("#sliderVal").css({ width: currentSliderPos + "px" });

        $("#seekBarSlider").css("cursor", "default");

        parent.surala.slideNavigation.blinkNextBtn(true);

        parent.surala.slideNavigation.playPauseState = true;
        parent.surala.slideNavigation.playStatus = "pause";
        parent.surala.slideNavigation.playPause();
        //playSlide("pause");
        updateSlideContent(totalSequence);
        currentSliderPos = 0;
        seqNo = 1;
      }
    }, timeOutDur * pixMoveDur);
  } catch (e) {
    //console.log('error caught at seeBar.js - playSeekbar() : ' + e);
  }
}

function seekBarEnable() {
  slideTutorial.enableSeekbar = true;
  disableSeekBar = false;

  parent.surala.enableBookmark = true;

  // seekbar pointer on drag
  $(".seekBarSlider_1").draggable({
    axis: "x",
    left: 0,
    containment: ".seeBarDrag",
    scroll: false,
    start: function (e, ui) {
      if (slideTutorial.enableSeekbar && disableSeekBar === false) {
        onSliderDrag = true;
        clearInterval(interVal);
        clearTimeout(timeOut);
        clearTimeout(seekBarTimer);
        sliderChanged = true;
        parent.surala.audio.clearAllSounds();
        parent.surala.character.teacherTalk(false);
        parent.surala.slideNavigation.blinkNextBtn(false);
        pauseSeekbar = true;
      }
    },
    drag: function (e, ui) {
      if (slideTutorial.enableSeekbar && disableSeekBar === false) {
        currentSliderPos = e.clientX;
        $("#seekBarSlider").css({ left: currentSliderPos + "px" });
        if (e.clientX > seekbarWidth) currentSliderPos = seekbarWidth;

        $("#sliderVal").css({ width: currentSliderPos - 16 + "px" });
        parent.surala.character.stopAllAnimation();

        //console.log('currentSliderPos: '+currentSliderPos);
      }
    },
    stop: function (e, ui) {
      parent.playbuttonClick = true;
      parent.surala.disablecallOut();
      if (slideTutorial.enableSeekbar && e.clientX < seekbarLength) {
        onSliderDrag = false;
        currentSliderPos = e.clientX;
        $("#seekBarSlider").css({ left: currentSliderPos + "px" });
        $("#sliderVal").css({ width: currentSliderPos + "px" });
        updateSlide();
        if (e.clientX >= 710 && e.clientX < seekbarLength) {
          endSeekbar();
          //console.log('Ended seekbar : e.clientX - ' + e.clientX);
        }
      } else if (e.clientX >= seekbarLength) {
        endSeekbar();
      }
    },
  });

  $(".seekBarSlider_1").draggable("enable");
  playSeekbar();
}

function endSeekbar() {
  parent.surala.character.stopAllAnimation();
  onSliderDrag = false;
  currentSliderPos = seekbarLength;
  clearTimeout(seekBarTimer);
  $("#seekBarSlider").css({ left: currentSliderPos + "px" });
  $("#sliderVal").css({ width: currentSliderPos + "px" });
  $("#seekBarSlider").css("cursor", "default");
  parent.surala.audio.clearAllSounds();

  setTimeout(function () {
    parent.surala.audio.clearAllSounds();
    parent.surala.slideNavigation.blinkNextBtn(true);
    parent.surala.slideNavigation.playStatus = "pause";
    parent.surala.slideNavigation.playPause();
    seekBarStatus = "ended";
    updateSlideContent(totalSequence);
    currentSliderPos = 0;
    seqNo = 1;
  }, 50);
}

function seekBarDisable() {
  $(".seekBarSlider_1").draggable("disable");
  disableSeekBar = true;
}

function updateSlide() {
  "use strict";

  for (var i = 0; i < slideData.slideDuration.length; i++) {
    if (currentSliderPos < parseFloat(slideData.slideDuration[i].pixVal)) {
      sliderChanged = true;

      if (i > 0) {
        currentSliderPos = parseFloat(slideData.slideDuration[i - 1].pixVal);
        seqNo = i + 1;
      } else {
        seqNo = 1;
        currentSliderPos = 0;
      }
      parent.surala.audio.clearAllSounds();

      //for play pause functioning
      if (parent.surala.slideNavigation.playStatus === "play") {
        playSlide("play");
      }

      //play seekbar, on drag from the position of seekbar end
      if (seekBarStatus === "ended") {
        seekBarStatus = "inprogress";
        sliderChanged = false;
        playSeekbar();
        parent.surala.slideNavigation.blinkNextBtn(false);
      }
      break;
    }
  }
}

// UI play/pause method
function playSlide(playStatus) {
  if (playStatus === "play") {
    if (!slideTutorial.enableSeekbar || pauseSeekbar) {
      slideTutorial.enableSeekbar = true;
      pauseSeekbar = false;
      clearTimeout(seekBarTimer);
      $(".seekBarSlider_1").draggable("enable");
      playSeekbar();
    }
    setTimeout(function () {
      sliderChanged = false;
      slideSequence(seqNo);
    }, 50);
    seekBarStatus = "inprogress";
    disableSeekBar = false;
    parent.surala.audio.clearAllSounds();
    updateSlideContent(seqNo);
    parent.surala.slideNavigation.blinkNextBtn(false);
    $("#seekBarSlider").css({ left: currentSliderPos + "px" });
    $("#sliderVal").css({ width: currentSliderPos + "px" });
  } else {
    $(".judgement_btn").css("pointer-events", "none");
    $(".answerBtn").css("pointer-events", "none");
    clearInterval(interVal);
    clearTimeout(timeOut);
    updateSlide();
    sliderChanged = true;
    parent.surala.character.teacherTalk(false);
    slideTutorial.enableSeekbar = false;
    seekBarDisable();
  }
}

// update slide content on seekbar change
function updateSlideContent(seq) {
  for (var i = seq; i <= totalSequence; i++) {
    hidecontent(i);
  }
  for (i = 1; i <= seq; i++) {
    showcontent(i);
  }
}

// seekbar audio pixel value calculation
function setpixVal(totalDuration) {
  var avgPixVal = (totalDuration * 1000) / 710;
  for (var i = 0; i < totalAudios; i++) {
    if (i > 0) {
      slideData.slideDuration[i].pixVal = parseFloat(
        (
          slideData.slideDuration[i - 1].pixVal +
          parseFloat(
            ((slideData.slideDuration[i].dur * 1000) / avgPixVal).toFixed(2)
          )
        ).toFixed(2)
      );
    } else {
      slideData.slideDuration[i].pixVal = parseFloat(
        ((slideData.slideDuration[i].dur * 1000) / avgPixVal).toFixed(1)
      );
    }
    //console.log('pixVal: ' + slideData.slideDuration[i].pixVal);
  }
  // JSON audio duration update
  /*var index = null;
	 var jsonVal = [];
	 for(var j=0; j< Object.keys(parent.audioDur).length; j++){
		 if(slideData.slideDuration.findIndex(x => x.audio==parent.audioDur[j].name) > -1){
			 index = slideData.slideDuration.findIndex(x => x.audio==parent.audioDur[j].name);
			 jsonVal[index] = ( '{"audio": "' + parent.audioDur[j].name + '", "dur": "'+parent.audioDur[j].dur + '"},\n');
		 }
	 }
	 console.log(jsonVal.toString().replace(/,{"audio"/g,'{"audio"'));*/
}
