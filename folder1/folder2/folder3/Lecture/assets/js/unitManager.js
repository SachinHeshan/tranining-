﻿/* Surala Japanese */
/* unit Manager | entry point */
/* global variables */

// Entry point for the application
var flash_problem_num_list = "1-1,1-2,3-1,3-2";
// Bookmarking Range
var bookmarkRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var timeOut = null;
// For testing LMS locally

// var flash_problem_num = "2-1";
// var flash_answer = "11";
// var flash_success = "1";
// var type = "lecture_page";

// current_page = "3";

var surala = {
  currentSlide: 0,
  totalSlides: 10,
  bookmarkLength: 10,
  bgContainer: new createjs.Container(),
  loadcontainer: new createjs.Container(),
  stage: new createjs.Stage("gameCanvas"),
  progressVal: 0,
  loadBar: new createjs.Shape(),
  loadBarBG: new createjs.Shape(),
  loadBarGrayBG: new createjs.Shape(),
  arcVal: 0,
  arcProgressVal: 0,
  start: 4.72,
  loadBarWidth: 0,
  loadBarHight: 0,
  acrLinearGradient: null,
  loadText: new createjs.Text("Loading...", "18px Time New Roman", "#fff"),
  progressText: new createjs.Text("0%", "25px Time New Roman", "#fff"),
  loaderBg: new createjs.Shape(),
  preloaditems: null,
  skipIntro: false,
  slideDuration: [],
  durationIndex: 0,
  currentAudio: null,
  slidecontainer: document.getElementById("slidecontainer"),
};
var images = {
  intro_bg: {
    src: "../../../../common/CeylonSoft/re_primarymath_ind/images/intro_bganimation3/intro_7.png",
  },
  intro_anim3: {
    src: "../../../../common/CeylonSoft/re_primarymath_ind/images/intro_bganimation3/intro_3.png",
  },
  intro_anim4: {
    src: "../../../../common/CeylonSoft/re_primarymath_ind/images/intro_bganimation3/intro_4.png",
  },
  intro_anim5: {
    src: "../../../../common/CeylonSoft/re_primarymath_ind/images/intro_bganimation3/intro_5.png",
  },
  intro_anim6: {
    src: "../../../../common/CeylonSoft/re_primarymath_ind/images/intro_bganimation3/intro_6.png",
  },
  intro_anim7: {
    src: "../../../../common/CeylonSoft/re_primarymath_ind/images/intro_bganimation3/intro_7.png",
  },
  intro_titleBg: {
    src: "../../../../common/CeylonSoft/re_primarymath_ind/images/intro_titleBg.png",
  },
};

var introData = null;

function updateView() {
  setTimeout(function () {
    var windowSize = $("#content")[0].getClientRects(),
      windowRatio = windowSize[0].width / windowSize[0].height,
      gameRatio = 1000 / 700,
      scale =
        windowRatio > gameRatio
          ? windowSize[0].height / 700
          : windowSize[0].width / 1000;
    if (scale > 1) {
      scale = 1;
      $("#contentCenter").css("top", "0%");
    }
    $("#contentCenter")[0].setAttribute(
      "style",
      "transform: scale(" + scale + "); -webkit-transform: scale(" + scale + ")"
    );
  }, 500);
}

function init() {
  "use strict";
  document.body.onorientationchange = updateView;
  window.onresize = updateView;
  updateView();
  $(window).resize(function () {
    updateView();
  });

  surala.support = new detectPlatform();
  surala.slideTutorial = slideTutorial;
  surala.audio = initAudio();
  surala.character = characterAnimation();
  surala.assetLoader = new assetLoader();
  surala.slideNavigation = new slideNavigation();

  generateBookmark();

  surala.preloaditems = {
    images: [],
    sounds: null,
  };

  $.ajax({
    dataType: "json",
    url: "assets/slides/assets/data/intro.json",
    success: function (data) {
      surala.preloaditems.sounds = data.surala.sounds;
      surala.preloaditems.images = data.surala.images;
      surala.preloaditems.content = data.surala.content;
      if (surala.support.mobile) {
        surala.audio.loadSound(
          "click",
          "../../../../../../common/CeylonSoft/re_primarymath_ind/sound/effects/click",
          "effect",
          1,
          function () {
            $("#touchBtn").show();
          }
        );
        return;
      } else {
        surala.stage.addChild(surala.loadcontainer);
        surala.assetLoader.PreLoadFromList(
          surala.preloaditems.images,
          surala.preloaditems.sounds,
          surala.introAnimation,
          surala.progressBar
        );
      }
    },
  });

  if (surala.support.desktop) {
    $("head").append(
      '<link rel="stylesheet" type="text/css" href="../../../../common/CeylonSoft/re_primarymath_ind/css/hoverEffects.css">'
    );
  }

  surala.loaderBg.graphics.beginFill("#000").drawRect(300, 450, 400, 21);
  surala.loaderBorder = new createjs.Shape();
  surala.loaderBorder.graphics
    .setStrokeStyle(2)
    .beginStroke("#000")
    .drawRect(300, 450, 400, 21);

  surala.loadText.x = 465;
  surala.loadText.y = 415;
  surala.progressText.x = surala.stage.canvas.width / 2 - 25;
  surala.progressText.y = surala.stage.canvas.height / 2 - 10;
  surala.loadcontainer.x = 0;
  surala.loadcontainer.y = 0;
  surala.loadcontainer.addChild(surala.loadText, surala.progressText);

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick", tick);
}

/* To trigger touch event for mobile devices */
function touchClick() {
  "use strict";
  $("#touchBtn").hide(10);

  surala.stage.addChild(surala.loadcontainer);
  surala.audio.playSound(
    "click",
    false,
    surala.assetLoader.PreLoadFromList(
      surala.preloaditems.images,
      surala.preloaditems.sounds,
      surala.introAnimation,
      surala.progressBar
    )
  );
}

window.onload = init; // initialize on load

// assets loading progress bar
surala.progressBar = function (progressVal) {
  "use strict";
  progressVal = progressVal * 400;
  surala.arcProgressVal = (progressVal * 100) / 400;
  surala.arcVal = ((surala.arcProgressVal / 100) * Math.PI * 2 * 10).toFixed(2);

  var gGray = surala.loadBarGrayBG.graphics;
  gGray.clear();
  gGray
    .setStrokeStyle(15)
    .beginLinearGradientStroke(["#ccc", "#ccc"], [0, 1], 0, 110, 0, 0)
    .arc(60, 60, 50, 0, 2 * Math.PI, false);
  surala.loadBarGrayBG.x = surala.stage.canvas.width / 2 - 60;
  surala.loadBarGrayBG.y = surala.stage.canvas.height / 2 - 60;
  surala.loadcontainer.addChild(surala.loadBarGrayBG);

  var g = surala.loadBarBG.graphics;
  g.clear();
  g.setStrokeStyle(15)
    .beginLinearGradientStroke(["#862507", "#CCA173"], [0, 1], 0, 110, 0, 0)
    .arc(60, 60, 50, surala.start, surala.arcVal / 10 + surala.start, false);
  surala.loadBarBG.x = surala.stage.canvas.width / 2 - 60;
  surala.loadBarBG.y = surala.stage.canvas.height / 2 - 60;
  surala.loadcontainer.addChild(surala.loadBarBG);

  surala.progressText.text = surala.arcProgressVal + "%";
  surala.loadcontainer.addChild(surala.progressText);

  surala.stage.addChild(surala.loadcontainer);
  surala.stage.update();
};

/*
 * unit Intro animation entry point,
 * background animation and intro title
 */
surala.introAnimation = function () {
  "use strict";
  setTimeout(function () {
    $("#preloadBGimage").hide();
  }, 1000); // on assets load, hide the preload background image

  surala.intro_bg = new createjs.Bitmap(images.intro_bg.src);
  surala.intro_bg.visible = false;

  surala.intro_titleBg = new createjs.Bitmap(images.intro_titleBg.src);
  surala.intro_titleBg.visible = false;

  surala.intro_anim3 = new createjs.Bitmap(images.intro_anim3.src);
  surala.intro_anim3.visible = false;
  surala.intro_anim4 = new createjs.Bitmap(images.intro_anim4.src);
  surala.intro_anim4.visible = false;
  surala.intro_anim5 = new createjs.Bitmap(images.intro_anim5.src);
  surala.intro_anim5.visible = false;
  surala.intro_anim6 = new createjs.Bitmap(images.intro_anim6.src);
  surala.intro_anim6.visible = false;
  surala.intro_anim7 = new createjs.Bitmap(images.intro_anim7.src);
  surala.intro_anim7.visible = false;

  surala.slide_mainbg = new createjs.Bitmap(images.intro_anim6.src);
  surala.slide_mainbg.visible = false;

  surala.teacher = new createjs.Sprite(teacher._SpriteSheet);
  surala.teacher.x = 45;
  surala.teacher.y = 150;
  surala.teacher.alpha = 0;

  surala.student = new createjs.Sprite(student._SpriteSheet);
  surala.student.x = 875;
  surala.student.y = 508;

  surala.student.scaleX = 0.8;
  surala.student.scaleY = 0.8;
  /*surala.student = new createjs.Sprite(intro_student._SpriteSheet);
    surala.student.x = 884;
    surala.student.y = 545;*/

  surala.student.alpha = 0;
  surala.student.alpha = 0;

  surala.bgContainer.addChild(
    surala.intro_bg,
    surala.slide_mainbg,
    surala.intro_anim3,
    surala.intro_anim4,
    surala.intro_anim5,
    surala.intro_anim6,
    surala.intro_anim7,
    surala.intro_titleBg,
    surala.teacher,
    surala.student
  );
  surala.stage.addChild(surala.bgContainer);

  /* Spot function: Load current page from LMS  */
  if (flash_problem_num != null) {
    surala.slide_mainbg.visible = true;
    surala.currentSlide = flash_problem_num.split("-")[0];
    $(".titlescreen").css("display", "none");
    $("#skipBtn, #replayBtn, .footerBtns, .slideNumber").css("display", "none");
    $(".slidecontainer").css("display", "block");
    createjs.Tween.get(surala.slide_mainbg).to(
      { alpha: 1 },
      100,
      createjs.Ease.sineOut
    );
    document.getElementById("slidecontainer").src =
      "assets/slides/slide" + surala.currentSlide + ".html";
    $(".slidecontainer").css({ width: "1250px" });
  } else {
    //createjs.Tween.get(surala.cave).wait(500).to({x: 0, y: 0, scaleX:1, scaleY: 1}, 5000, createjs.Ease.sineOut);
    var page0_log_url = log_url.replace("../../", "");
    sendMassage(page0_log_url, iniParam);
    if (current_page == null || current_page == "" || current_page == 0) {
      surala.intro_bg.visible = true;
      surala.audio.playSound("opening", true);
      surala.introBgAnim();
    } else {
      surala.currentSlide = current_page;
      surala.slide_mainbg.visible = true;
      surala.slide_mainbg.alpha = 1;
      surala.teacher.alpha = 1;
      surala.student.alpha = 1;
      surala.teacher.x = 758;
      surala.teacher.y = 50;
      surala.teacher.gotoAndPlay("normal");
      surala.student.gotoAndPlay("normal");
      checkBookmarkPos(surala.currentSlide);
      $(".titlescreen").css("display", "none");
      $("#skipBtn, #replayBtn").css("display", "none");
      $(".slidecontainer, .footerBtns, .slideNumber").fadeIn(1000);
      surala.slideNavigation.updateSlideNo();
      document.getElementById("slidecontainer").src =
        "assets/slides/slide" + surala.currentSlide + ".html";
    }
    disableBookmark();
  }
  /* //Spot function: */
};

var anim = 0;
surala.introBgAnim = function () {
  $("#skipBtn").css("display", "block");
  switch (anim) {
    case 0:
      surala.intro_anim3.visible = true;
      break;
    case 1:
      surala.intro_anim3.visible = true;
      break;
    case 2:
      surala.intro_anim4.visible = true;
      break;
    case 3:
      surala.intro_anim4.visible = true;
      break;
    case 4:
      surala.intro_anim5.visible = true;
      break;
    case 5:
      surala.intro_anim6.visible = true;
      break;
    case 6:
      surala.intro_anim6.visible = true;
      break;
    case 7:
      surala.intro_anim6.visible = false;
      break;
    case 8:
      surala.intro_anim6.visible = false;
      break;
    case 9:
      surala.intro_anim7.visible = true;
      break;
    case 10:
      surala.intro_anim7.visible = true;
      break;
    case 11:
      surala.intro_anim7.visible = true;
      break;
    case 12:
      surala.intro_anim7.visible = true;
      break;
    case 13:
      surala.intro_anim7.visible = true;
      break;
  }
  if (anim != 8) {
    anim++;
    timeOut = setTimeout(surala.introBgAnim, 500);
  } else if (anim >= 8 && anim < 13) {
    anim++;
    timeOut = setTimeout(surala.introBgAnim, 300);
  }
  if (anim == 13) {
    //surala.audio.fadeOutVolume('opening', 0.15, 300); // reduce volume to 50%
    surala.intro_titleBg.visible = true;
    // $('#skipBtn').css('display', 'block');
    if (!surala.skipIntro) {
      surala.start_title();
    }
  }
};

// Teacher callout
surala.enablecallOut_teacher = function (calloutTxt, lines) {
  "use strict";
  $(".speech_bubble_teacher").css("display", "block").html(calloutTxt);
  switch (lines) {
    case 1:
      $(".speech_bubble_teacher").css("padding-top", "25px");
      break;
    case 2:
      $(".speech_bubble_teacher").css("padding-top", "44px");
      break;
    case 3:
      $(".speech_bubble_teacher").css("padding-top", "38px");
      break;
    case 4:
      $(".speech_bubble_teacher").css("padding-top", "24px");
      break;
    default:
      $(".speech_bubble_teacher").css("padding-top", "54px");
      break;
  }
};
surala.disablecallOut_teacher = function () {
  $(".speech_bubble_teacher").css("display", "none");
};

// Student callout
surala.enablecallOut = function (calloutTxt, lines) {
  "use strict";
  $(".speech_bubble").css("display", "block").html(calloutTxt);
  switch (lines) {
    case 1:
      /**for one line */
      $(".speech_bubble").css("padding-top", "35px");
      break;
    case 2:
      /**for two line */
      $(".speech_bubble").css("padding-top", "25px");
      break;
    case 3:
      $(".speech_bubble").css("padding-top", "14px");
      break;
    case 4:
      /**for four line */
      $(".speech_bubble").css("padding-top", "1px");
      break;
    case 5:
      $(".speech_bubble").css("padding-top", "83px");
      break;
    case 6:
      $(".speech_bubble")
        .css("padding-left", "16px")
        .css("padding-top", "84px")
        .css("font-size", "16px")
        .css("width", "180px");
      break;
    default:
      $(".speech_bubble").css("padding-top", "54px");
      break;
  }
};
surala.disablecallOut = function () {
  $(".speech_bubble").css("display", "none");
};
surala.stopAllAnimation = function () {
  surala.teacher.gotoAndStop(0);
  surala.student.gotoAndStop(0);
};
var timeOut = null;

surala.start_title = function () {
  "use strict";
  clearTimeout(timeOut);
  createjs.Tween.get(surala.teacher).to(
    { alpha: 1 },
    800,
    createjs.Ease.sineOut
  );
  createjs.Tween.get(surala.student).to(
    { alpha: 1 },
    800,
    createjs.Ease.sineOut
  );
  surala.teacher.gotoAndPlay("normal_speak");
  surala.student.gotoAndPlay("normal");
  surala.audio.fadeOutVolume("opening", 0.15, 50);
  surala.slideTutorial.trigger(
    "IPM_S10L01u02_001",
    ["stageTitle"],
    function () {
      surala.character.teacherTalk(false);
      surala.student.gotoAndPlay("normal_speak");
      surala.enablecallOut(
        "Halo, aku juga senang bertemu Master Geometri lagi★",
        3
      );
      surala.slideTutorial.playNext();
    }
  );
  surala.slideTutorial.trigger("IPM_S10L03u03_S001", null, function () {
    surala.disablecallOut();
    surala.character.stopAllAnimation();
    surala.character.teacherTalk(true);
    surala.slideTutorial.playNext();
  });
  surala.slideTutorial.trigger("IPM_S10L04u010_001");
  surala.slideTutorial.trigger("IPM_S10L04u010_002");
  surala.slideTutorial.trigger("IPM_S10L04u010_003" ,["titleText"]);
  surala.slideTutorial.trigger("IPM_S10L04u010_004");
  surala.slideTutorial.trigger("IPM_S10L01u02_007", null, function () {
    skipIntro();
  });
};

surala.reset_title = function () {
  window.location.reload();
};

function skipIntro() {
  "use strict";
  surala.slide_mainbg.visible = true;
  surala.slideTutorial.tutorialQueue = [];
  surala.audio.stopSound("opening");
  surala.audio.stopAllNonLoopSounds();
  surala.bgContainer.removeChild(
    surala.intro_anim3,
    surala.intro_anim4,
    surala.intro_anim5,
    surala.intro_anim6,
    surala.intro_anim7,
    surala.intro_titleBg
  );
  createjs.Tween.get(surala.teacher)
    .wait(500)
    .to({ alpha: 1 }, 800, createjs.Ease.sineOut);
  createjs.Tween.get(surala.student)
    .wait(500)
    .to({ alpha: 1 }, 800, createjs.Ease.sineOut);
  setTimeout(function () {
    surala.character.stopAllAnimation();
  }, 100);
  surala.disablecallOut();
  surala.currentSlide = 1;
  $("#lessonNo").css("display", "none");
  $(".titlescreen").css("display", "none");
  $("#skipBtn, #replayBtn").css("display", "none");
  if (timeOut != null) {
    clearTimeout(timeOut);
  }
  $(".slidecontainer, .footerBtns, .slideNumber").fadeIn(100);
  surala.slideNavigation.updateSlideNo();
  surala.slideTutorial.ready = true;
  setTimeout(function () {
    if (!surala.skipIntro) {
      surala.audio.stopSound("opening");
      surala.skipIntro = true;
    }
    document.getElementById("slidecontainer").src = "assets/slides/slide1.html";
  }, 2000);
  // student and teacher position change for slide content
  surala.teacher.alpha = 1;
  surala.teacher.x = 758;
  surala.teacher.y = 50;
  surala.teacher.gotoAndPlay("normal");
  surala.student.gotoAndPlay("normal");
  $(".slideNumber").css("display", "block");

  surala.audio.fadeOutVolume("opening", 0.05, 500); // reduce volume to 50%
}

function tick(event) {
  "use strict";

  try {
    surala.stage.update(event);
  } catch (e) {}
}
