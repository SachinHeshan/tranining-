/**/
/*jslint browser: true*/
/*global audio support */
/*global console*/

//get values from LMS

//コンテンツ内容の保持
var remainData = {};
//log_url、next_sco_url、study_log_urlに、サーバのURLご指定ください。
var log_url = "../../../../../../common/CeylonSoft/lms/log_url.php";
var next_sco_url = "../../../../common/CeylonSoft/lms/next_sco_url.php";
var study_log_url = "../../../../../../common/CeylonSoft/lms/study_log_url.php";
var url_path = "http://www.aaa.jp/bbb/";
var status = "true";
var indicator_flag = "true";
var tegaki_flg = "";
var speedControl = true; // added speedControl on Sep 2020 | to set speed control ON/OFF based on LMS value
var disp_page = "";
var disp_page_array = [];
var current_page = "";
var flash_problem_num;
var flash_answer;
var flash_success;
var flash_count;
var type;

if (parent) {
  if (typeof parent.log_url != "undefined") {
    this.log_url = parent.log_url;
  }
  if (typeof parent.next_sco_url != "undefined") {
    this.next_sco_url = parent.next_sco_url;
  }
  if (typeof parent.status != "undefined") {
    this.status = parent.status;
  }
  if (typeof parent.current_page != "undefined") {
    this.current_page = parent.current_page;
  }
  if (typeof parent.disp_page != "undefined") {
    this.disp_page = parent.disp_page;
  }
  if (typeof parent.url_path != "undefined") {
    this.url_path = parent.url_path;
  }
  if (typeof parent.indicator_flag != "undefined") {
    this.indicator_flag = parent.indicator_flag;
  }
  if (typeof parent.study_log_url != "undefined") {
    this.study_log_url = parent.study_log_url;
  }
  if (typeof parent.flash_problem_num != "undefined") {
    this.flash_problem_num = parent.flash_problem_num;
  }
  if (typeof parent.flash_answer != "undefined") {
    this.flash_answer = parent.flash_answer;
  }
  if (typeof parent.flash_success != "undefined") {
    this.flash_success = parent.flash_success;
  }
  if (typeof parent.flash_count != "undefined") {
    this.flash_count = parent.flash_count;
  }
  if (typeof parent.type != "undefined") {
    this.type = parent.type;
  }
  if (typeof parent.tegaki_flg != "undefined") {
    this.tegaki_flg = parent.tegaki_flg;
  }
  // added speedControl on Sep 2020 | to set speed control ON/OFF based on LMS value
  if (typeof parent.speedControl != "undefined") {
    this.speedControl = parent.speedControl;
  }
}

function detectPlatform() {
  "use strict";

  /* 10-Apr-2020: disable browser next and back */
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
  };
  //this line will disable the right click funtionality for main html
  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });

  var uagent = navigator.userAgent.toLowerCase(),
    version,
    qualityCookie,
    myAudio,
    webaudioapi,
    canvas,
    supports = {
      performanceMode: "normal",
      canvas: false, // determined below
      touch: !!window.hasOwnProperty("ontouchstart"),

      // specific browsers as determined above
      iPod: uagent.search("ipod") > -1,
      iPhone: uagent.search("iphone") > -1,
      iPad: uagent.search("ipad") > -1,
      safari: uagent.search("safari") > -1,
      ie: uagent.search("msie") > -1,
      firefox: uagent.search("firefox") > -1,
      android: uagent.search("android") > -1,
      chrome: uagent.search("chrome") > -1,
      silk: uagent.search("silk") > -1,
      iOS: false, //determined below
      mobile: false, //determined below
      desktop: false, //determined below
      multitouch: false, //determined below

      // audio support as determined below
      ogg: true,
      m4a: true,
      mp3: true,
      webAudio: false,
    };

  supports.iOS = supports.iPod || supports.iPhone || supports.iPad;
  supports.mobile = supports.iOS || supports.android || supports.silk;
  supports.desktop = !supports.mobile;

  // Determine audio support
  myAudio = document.createElement("audio");
  if (
    myAudio.canPlayType &&
    !(
      !!myAudio.canPlayType &&
      "" !== myAudio.canPlayType('audio/ogg; codecs="vorbis"')
    )
  ) {
    supports.ogg = false;
    if (
      supports.ie ||
      !(!!myAudio.canPlayType && "" !== myAudio.canPlayType("audio/mp4"))
    ) {
      supports.m4a = false; //make IE use mp3's since it doesn't like the version of m4a made for mobiles
    }
  }

  // Does the browser support canvas?
  canvas = document.createElement("canvas");
  try {
    supports.canvas = !!canvas.getContext("2d"); // S60
  } catch (e) {
    supports.canvas = !!canvas.getContext; // IE
  }

  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    surala.startBtn = false;
    $("#touchBtn").show().removeAttr("onclick");
    supports.webAudio = true;
    $("#touchBtn").on("click", function () {
      $("#touchBtn").hide(10);
      //var context = new AudioContext();
      surala.audio = initAudio();
      surala.audio.loadSound(
        "click",
        "../../../../../../common/CeylonSoft/re_primarymath_ind/sound/effects/click",
        "effect",
        1,
        function () {
          surala.startBtn = true;
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
      );
      surala.stage.addChild(surala.loadcontainer);
    });
  } catch (e) {
    supports.webAudio = false;
    surala.startBtn = false;
    $("#touchBtn").show().removeAttr("onclick");
    $("#touchBtn").on("click", function () {
      $("#touchBtn").hide(10);
      //var context = new AudioContext();
      surala.audio = initAudio();
      surala.audio.loadSound(
        "click",
        "../../../../../../common/CeylonSoft/re_primarymath_ind/sound/effects/click",
        "effect",
        1,
        function () {
          surala.startBtn = true;
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
      );
      surala.stage.addChild(surala.loadcontainer);
    });
  }
  /* speed control */
  if (speedControl && flash_problem_num == null) {
    lectureControls.init();
  }
  return supports;
}

/* speed control */
lectureControls = {
  playbackRate: 1, // default
  initOk: false,
  init: function () {
    "use strict";
    if (lectureControls.initOk) return;

    var controlsBox = document.createElement("div");
    controlsBox.classList = "lecture-controls-box";
    controlsBox.innerHTML = lectureControls._makeControls();

    lectureControls.es();

    // ページにコントロールボックスを追加する
    //parent.document.getElementsByTagName('body')[0].appendChild(controlsBox);
    document.getElementById("contentCenter").append(controlsBox);

    lectureControls.initOk = true;
  },

  /**
   * ESさんのレクチャーの設定メソッド
   */
  es: function () {
    try {
      // replace playSound function to force playbackRate
      var original_ = surala.audio.playSound;
      surala.audio.playSound = function (name, loop, callback) {
        original_(name, loop, callback);
        surala.audio.currentPlayingAudio.source.playbackRate.value =
          lectureControls.playbackRate;
      };
    } catch (e_) {
      // console.log( 'retry...' );
      setTimeout(lectureControls.es, 200);
    }
    window.setLecturePlaybackRate = function (step) {
      rate_ = $("#speedCentre").html();
      rate_ = parseFloat(rate_);

      if (step.id == "speedBack") {
        if (rate_ == 1) {
          return;
        } else {
          rate_ = rate_ - 0.25;
        }
      } else {
        if (rate_ == 1.5) {
          return;
        } else {
          rate_ = rate_ + 0.25;
        }
      }

      surala.slideNavigation.playPause();
      surala.slideNavigation.playPause();
      // button class
      lectureControls._setPlaybackRateButtonClass(rate_);
      speed_rate = rate_;
      global_Rate = rate_;
      lectureControls.playbackRate = rate_;
      surala.audio.currentPlayingAudio.source.playbackRate.value = rate_;
    };
  },

  /**
   * 音声ファイルを読み込んでから、playbackRateを設定する
   * そうしないと、スライドを進むために、スピードがリセットされています。
   *
   * @param {object} event_
   */
  _onLoadSetPlaybackRate: function (event_) {
    event_.target.playbackRate = lectureControls.playbackRate;
  },

  /**
   * 選択した察正スピードのボタンのCSSクラスを設定
   * @param {string} rate_ 選択した値
   */
  _setPlaybackRateButtonClass: function (rate_) {
    $("#speedCentre").html(rate_);
    switch (rate_) {
      case 1:
        $("#speedBack").css("opacity", "0.5").css("cursor", "default");
        $("#speedNext").css("opacity", "1").css("cursor", "pointer");
        break;
      case 1.25:
        $("#speedBack").css("opacity", "1").css("cursor", "pointer");
        $("#speedNext").css("opacity", "1").css("cursor", "pointer");
        break;
      case 1.5:
        $("#speedBack").css("opacity", "1").css("cursor", "pointer");
        $("#speedNext").css("opacity", "0.5").css("cursor", "default");
        break;
    }
    /*parent.document.querySelectorAll(".lecture-controls-box button").forEach(function(btn_) {
        	btn_.className = '';
        	if (btn_.getAttribute('rate') == rate_) btn_.className = 'active';
        });*/
  },

  /**
   * コントロールボックスを作成
   *
   * @return {string}
   */
  _makeControls: function () {
    /*var html = "";
        html += "<button onclick='setLecturePlaybackRate(1)' rate='1' class='active'>1x</button> ";
        html += "<button onclick='setLecturePlaybackRate(1.25)' rate='1.25'>1.25x</button> ";
        html += "<button onclick='setLecturePlaybackRate(1.5)' rate='1.5'>1.5x</button> ";*/
    var html = "";
    html +=
      "<div onclick='setLecturePlaybackRate(speedBack)' id='speedBack'></div> ";
    html += "<div id='speedCentre'>1</div> ";
    html +=
      "<div onclick='setLecturePlaybackRate(speedNext)' id='speedNext'></div> ";
    return html;
  },
};

//remove alert if called anywhere
function alert(msg) {
  console.log(msg);
}
