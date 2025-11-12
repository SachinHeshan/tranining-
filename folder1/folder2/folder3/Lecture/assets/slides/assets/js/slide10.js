/* JS: slide manager
 * initiates slide content and controls
 * slide | seek bar
 */
var preloaditems = {
  images: [],
  sounds: null,
  jsonURL: "./assets/data/slide10.json",
};
currentpageType = "summary";
// start point
window.onload = init;

function init() {
  "use strict";
  parent.surala.audio.stopAllNonLoopSounds();
  slideManager = slideManager();
  slideTutorial = slideTutorial;

  parent.surala.slideDuration = [];
  parent.surala.durationIndex = 0;
  slideTutorial.enableSeekbar = true;

  $.ajax({
    dataType: "json",
    url: preloaditems.jsonURL,
    success: function (data) {
      slideData = data.surala;
      preloaditems.sounds = slideData.sounds;
      preloaditems.images = slideData.images;
      preloaditems.content = slideData.content;
      parent.audioDur = [];
      slideManager.preLoadFromList(
        preloaditems.images,
        preloaditems.sounds,
        addContent,
        slideManager.progressBar
      );
    },
  });
}

// start method once elements preloaded
function addContent() {
  "use strict";
  parent.preloadStatus = true;
  $("img").on("dragstart", function (event) {
    event.preventDefault();
  });

  totalSequence = totalAudios = slideData.slideDuration.length;

  for (var i = 0; i < totalAudios; i++) {
    totalDuration += parseFloat(
      parseFloat(slideData.slideDuration[i].dur).toFixed(2)
    );
  }
  totalDuration = parseFloat(totalDuration.toFixed(2));

  setpixVal(totalDuration);
  setTimeout(function () {
    seekBarEnable();
    slideSequence(1);
    parent.surala.slideNavigation.playPauseState = true;
  }, 100);
}

function slideSequence(seqNo) {
  if (previousSeqNo != seqNo) {
    previousSeqNo = seqNo;
  } else if (parent.playbuttonClick == false) {
    return;
  }
  parent.playbuttonClick = false;
  parent.surala.disablecallOut();
  parent.surala.character.stopAllAnimation();
  parent.surala.character.teacherTalk(true);
  parent.surala.slideNavigation.blinkNextBtn(false);
  switch (seqNo) {
    case 1:
      $(".displayanswer").css("visibility", "visible");
        $(".displaySummeryFrame").css("visibility", "visible");
      timeOut = setTimeout(function () {
        parent.surala.audio.playSound("IPM_S10L01u02_045", null, function () {
        if (sliderChanged) {
          sliderChanged = false;
        } else {
          seqNo = 2;
          slideSequence(seqNo);
        }
      });
      }, speedcal(5000));
      break;
    case 2:
      parent.surala.audio.playSound("IPM_S10L01u05_095", null, function () {
        if (sliderChanged) {
          sliderChanged = false;
        } else {
          parent.surala.character.stopAllAnimation();
        }
      });
      break;
  }
}

function showcontent(num) {
  parent.surala.disablecallOut();
  clearInterval(interVal);
  clearTimeout(timeOut);
  switch (num) {
    case 1:
      break;
    case 2:
      $(".displayanswer").css("visibility", "visible");
      $(".displaySummeryFrame").css("visibility", "visible");
      break;
  }
}

function hidecontent(num) {
  switch (num) {
    case 1:
      $(".displayanswer").css("visibility", "hidden");
      $(".displaySummeryFrame").css("visibility", "hidden");
      break;
    case 2:
      break;
  }
}

// unload current playing audios on slide change
window.onunload = function () {
  parent.surala.disablecallOut();
  parent.surala.audio.stopAllNonLoopSounds();
  parent.surala.character.stopAllAnimation();
};
