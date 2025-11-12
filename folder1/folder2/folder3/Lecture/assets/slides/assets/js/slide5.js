 /* JS: slide manager
  * initiates slide content and controls
  * slide | seek bar 
  */
 var preloaditems = {
  images: [],
  sounds: null,
  jsonURL: "./assets/data/slide5.json"
};

window.onload = init;

// LMS | elements to track no of attempts

// slide data elements
var slideTutorial, slideManager;
var slideData = null;

var currentQuestion = null;
var currentQnNo = 1;
var param = {};
var totalDuration = 0;
var totalAudios = 0;
var answerBtnClicked = false;
var seqNo = 0;
var totalSequence = 0;
var totalQuestion = 0;
var totalinputbox = 0;
var fbAudio = null;
var char_recog_v2 = null;


$(document).ready(function() {
  char_recog_v2 = new CharRecogV2();
  // Handwritten popup initial setting
  char_recog_v2.init(); // In case of horizontal writing mode
  //char_recog_v2.init("vertical");  // In the case of the vertical writing mode

  // Add handwriting function to text box Parameter see specifications
  char_recog_v2.addText("text_1", tegaki_flg, 4, 3);
  //  char_recog_v2.addText("text_2", tegaki_flg, 04, 3);

});


function init() {

  'use strict';
  parent.surala.audio.stopAllNonLoopSounds();
  slideManager = slideManager();
  slideTutorial = slideTutorial;

  parent.surala.slideDuration = [];
  parent.surala.durationIndex = 0;
  slideTutorial.enableSeekbar = true;

  $.ajax({
      dataType: "json",
      url: preloaditems.jsonURL,
      success: function(data) {
          slideData = data.surala;
          preloaditems.sounds = slideData.sounds;
          preloaditems.images = slideData.images;
          preloaditems.content = slideData.content;
          parent.audioDur = [];
          slideManager.preLoadFromList(preloaditems.images, preloaditems.sounds, addContent, slideManager.progressBar);
      }
  });

}

// start method once elements preloaded
function addContent() {

  parent.preloadStatus = true;

  $('img').on('dragstart', function(event) { event.preventDefault(); });
  /* -- LMS Code: Get values from LMS -- */
  if (!(parent.flash_problem_num === undefined)) {
      //問題1テキストボックスの初期表示
      flash_answer = parent.flash_answer;
      flash_success = parent.flash_success;
      currentQnNo = parseInt(parent.flash_problem_num.split('-')[1]);
      $('.seekBar,.seekBarSlider').css('display', 'none');
      showLMSFeedback();
  } else {
      totalSequence = totalAudios = slideData.slideDuration.length;
      for (var i = 0; i < totalAudios; i++) {
          totalDuration += parseFloat(parseFloat(slideData.slideDuration[i].dur).toFixed(2));
      }
      totalDuration = parseFloat(totalDuration.toFixed(2));
      if (navigator.userAgent.indexOf("Trident") != -1) {
          totalDuration = totalDuration + 1;
      }

      setpixVal(totalDuration);
      seekBarEnable();
      slideSequence(1);
      parent.surala.slideNavigation.playPauseState = true;

  }
}

function showLMSFeedback() {
  loadActivity();
  $(".popupContent").css('visibility', 'hidden');
  $('.feedback, .correctAnswer').css('display', 'block');
  $('.display1').css('visibility', 'visible');
  $('.gwd-img-gw0e').css('pointer-events', 'none')
  flash_answer = flash_answer.split('#comma');
  var correctAnsArray = currentQuestion.correctAnswer.split(',');

  if (currentQnNo == 1) {
      $('.display1').css('visibility', 'visible');
      for (var i = 0; i < correctAnsArray.length; i++) {
          $("#text_" + (i + 1)).val(flash_answer[i]);
      }
  }
  // validating all input elements
  if (currentQnNo == 1) {

      for (var i = 0; i < correctAnsArray.length; i++) {
          var firstAnswer1 = correctAnsArray[i].split('/')[0];
          var secondAnswer1 = correctAnsArray[i].split('/')[1];
          if (firstAnswer1 === $('#text_' + (i + 1)).val() || secondAnswer1 === $('#text_' + (i + 1)).val()) {
              $('#fb' + (i + 1)).addClass('correctFB6');
          } else {
              $('#fb' + (i + 1)).addClass('wrongFB5');
              $('#crt' + (i + 1)).html(firstAnswer1);
          }
      }
  }

}


function slideContent() {
  'use strict';
  parent.preloadStatus = true;
  $('img').on('dragstart', function(event) { event.preventDefault(); });
  parent.surala.character.teacherTalk(true);
  totalSequence = totalAudios = slideData.slideDuration.length;
  for (var i = 0; i < totalAudios; i++) {
      totalDuration += parseFloat(parseFloat(slideData.slideDuration[i].dur).toFixed(2));
  }
  totalDuration = parseFloat(totalDuration.toFixed(2));
  setpixVal(totalDuration);
  seekBarEnable();
  timeOut = setTimeout(slideSequence(1), 200);
  parent.surala.slideNavigation.playPauseState = true;
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
  parent.surala.disablecallOut_teacher();
  switch (seqNo) {
      case 1:
          timeOut = setTimeout(function() {
              loadActivity();
              answerBtnClicked = false;
              $(".display1").css("visibility", "visible");
          }, 200);

          currentQnNo = 1;


          parent.surala.audio.playSound('IPM_S10L04u09_049', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  pauseSeekbar = true;
                  enableTegaki();
              }
          });
          break;
      case 2:
          parent.surala.audio.playSound('IPM_S10L04u09_050', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 3;
                  slideSequence(seqNo);
              }
          });
          break;
      case 3:
          $(".display4").css("visibility", "visible");
          $('.blink1').removeClass('blinkItem');
          interVal = setInterval(function() {
              if ($('.blink1').hasClass('blinkItem')) {
                  $('.blink1').removeClass('blinkItem').css('visibility', 'visible');
                  $(".display4").css("visibility", "visible");
              } else {
                  $('.blink1').addClass('blinkItem').css('visibility', 'hidden');
                  $(".display4").css("visibility", "hidden");
              }
          }, 500);
          timeOut = setTimeout(function() {
              clearInterval(interVal);
              $('.blink1').removeClass('blinkItem').css('visibility', 'visible');
              $(".display4").css("visibility", "hidden");
          }, speedcal(2500));
          parent.surala.audio.playSound('IPM_S10L04u09_051', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 4;
                  slideSequence(seqNo);
              }
          });
          break;
      case 4:
          $(".display2").css("visibility", "visible");
          parent.surala.audio.playSound('IPM_S10L04u09_052', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 5;
                  slideSequence(seqNo);
              }
          });
          break;
      case 5:
          $(".display3").css("visibility", "visible");
          parent.surala.audio.playSound('IPM_S10L04u09_053', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 6;
                  slideSequence(seqNo);
              }
          });
          break;
      case 6:
          $(".display9").css("visibility", "visible");
          $('.blink2').removeClass('blinkItem');
          interVal = setInterval(function() {
              if ($('.blink2').hasClass('blinkItem')) {
                  $('.blink2').removeClass('blinkItem').css('visibility', 'visible');
                  $(".display10").css("visibility", "visible");
              } else {
                  $('.blink2').addClass('blinkItem').css('visibility', 'hidden');
                  $(".display10").css("visibility", "hidden");
              }
          }, 500);
          timeOut = setTimeout(function() {
              clearInterval(interVal);
              $('.blink2').removeClass('blinkItem').css('visibility', 'visible');
              $(".display10").css("visibility", "visible");
          }, speedcal(3500));
          parent.surala.audio.playSound('IPM_S10L04u09_054', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 7;
                  slideSequence(seqNo);
              }
          });
          break;
      case 7:
          $('.blink2').css("visibility", "visible");
          $(".display5").css("visibility", "visible");
          parent.surala.audio.playSound('IPM_S10L04u09_055', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 8;
                  slideSequence(seqNo);
              }
          });
          break;
      case 8:
          parent.surala.audio.playSound('IPM_S10L04u09_056', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 9;
                  slideSequence(seqNo);
              }
          });
          break;
      case 9:
          parent.surala.audio.playSound('IPM_S10L04u09_057', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  parent.surala.character.teacherTalk(false);
                  timeOut = setTimeout(function() {
                      seqNo = 10;
                      slideSequence(seqNo);
                  }, speedcal(2000));
              }
          });
          break;
      case 10:
          parent.surala.character.teacherTalk(true);
          $(".display6").css("visibility", "visible");
          parent.surala.audio.playSound('IPM_S10L04u09_058', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 11;
                  slideSequence(seqNo);
              }
          });
          break;
      case 11:
          $(".display7").css("visibility", "visible");
          timeOut = setTimeout(function() {
              $(".display7_1").css("visibility", "visible");
          }, 500);
          timeOut = setTimeout(function() {
              $(".display7_2").css("visibility", "visible");
          }, 1000);
          parent.surala.audio.playSound('IPM_S10L04u09_059', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 12;
                  slideSequence(seqNo);
              }
          });
          break;
      case 12:
          parent.surala.audio.playSound('IPM_S10L04u09_060', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 13;
                  slideSequence(seqNo);
              }
          });
          break;
      case 13:
          parent.surala.audio.playSound('IPM_S10L04u09_061', null, function() {
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
  switch (num) {

      case 1:
          $(".display1").css("visibility", "visible");
          $(".popupContent").css('visibility', 'hidden');
          catchCount = 1;
          currentQnNo = 1;
          if (seqNo == 1 && seekBarStatus !== "ended") {
              answerBtnClicked = false;
          }
          break;
      case 2:

          if (seqNo >= 2 && seqNo <= 13 && seekBarStatus !== "ended") {
              currentQnNo = 1;
              if (!answerBtnClicked) {
                  enableTegaki();
              }
          }
          break;
      case 3:
          $(".display4").css("visibility", "hidden");
          break;
      case 4:
          $(".display2").css("visibility", "visible");
          break;
      case 5:
          $(".display3").css("visibility", "visible");
          break;
      case 6:
          $(".display9").css("visibility", "visible");
          $(".display10").css("visibility", "hidden");
          break;
      case 7:
          $('.blink2').css("visibility", "visible");

          break;
      case 8:
          $(".display5").css("visibility", "visible");
          break;
      case 9:
          break;
      case 10:
          $(".display6").css("visibility", "visible");
          break;
      case 11:
          $(".display7").css("visibility", "visible");
          $(".display7_1").css("visibility", "visible");
          $(".display7_2").css("visibility", "visible");
          $(".display8").css("visibility", "hidden");
          break;
      case 12:
          $(".display8").css("visibility", "visible");
          break;
      case 13:
          if (seekBarStatus === "ended") {
              answerBtnClicked = false;
              disableActivity();

          }
          break;

  }
}

function hidecontent(num) {
  switch (num) {
      case 1:
          $(".display1").css("visibility", "hidden");

          catchCount = 1;
          break;
      case 2:
          break;
      case 3:
          $(".display4").css("visibility", "hidden");
          break;
      case 4:
          $(".display2").css("visibility", "hidden");
          break;
      case 5:
          $(".display3").css("visibility", "hidden");
          break;
      case 6:
          $(".display9").css("visibility", "hidden");
          $(".display10").css("visibility", "hidden");
          break;
      case 7:
          $('.blink2').css("visibility", "hidden");
          $(".display5").css("visibility", "hidden");
          break;
      case 8:
          break;
      case 9:
          break;
      case 10:
          $(".display6").css("visibility", "hidden");
          break;
      case 11:
          $(".display7,.display7_1,.display7_2,.display8").css("visibility", "hidden");
          break;
      case 12:
          break;
      case 13:
          break;


  }
}





// disable activity
function disableActivity() {
  currentQuestion = slideData.content["question" + currentQnNo];
  var correctAnsArray = currentQuestion.correctAnswer;
  for (var i = 1; i <= correctAnsArray.length; i++) {
      $("#text_" + i).attr("readonly", "true");
  }
  $('#judgement_btn').removeClass('btn_active');
  $('#judgement_btn').removeAttr('onclick');

}
// reset activity 
function loadActivity() {
  currentQuestion = slideData.content["question" + currentQnNo];
  var correctAnsArray = currentQuestion.correctAnswer;
  for (var i = 1; i <= correctAnsArray.length; i++) {
      $("#text_" + i).attr("readonly", "true");
      $("#text_" + i).css('pointer-events', 'none');
      $("#text_" + i).css('color', 'black');
      $("#text_" + i).val('');
      $('#crt' + i).html('');
      $('#fb' + i).removeClass('correctFB6');
      $('#fb' + i).removeClass('wrongFB5');
  }
  $('#judgement_btn').removeClass('btn_active');
  $('#judgement_btn').unbind('click');
  $('.feedback, .correctAnswer').css('display', 'none');

}

// activate the activity for user input
function enableTegaki() {
  parent.surala.character.stopAllAnimation();
  currentQuestion = slideData.content['question' + currentQnNo];
  var correctAnsArray = currentQuestion.correctAnswer.split(',');
  // enable judgement button and input boxes

  $('#judgement_btn').css('pointer-events', 'auto').addClass('btn_active').attr('onclick', 'validateTegaki()');
  for (var i = 1; i <= correctAnsArray.length; i++) {
      $("#text_" + i).removeAttr("readonly");
      $("#text_" + i).css('pointer-events', 'auto');
      // $("#text_" + i).css('cursor', 'pointer');
      $("#text_" + i).css('color', 'black');
  }
  if (tegaki_flg === true) {
      for (var i = 1; i <= correctAnsArray.length; i++) {
          $("#text_" + i).attr('onclick', '$("#tegaki_popup").css("display","block");');
      }
  }
}
// user input validation
function validateTegaki() {
  //debugger;
  parent.surala.disablecallOut();
  clearTimeout(timeOut);
  clearInterval(interVal);
  // $('#inputBoxContainer1,#inputBoxContainer2,#inputBoxContainer3,#inputBoxContainer4,#inputBoxContainer5').css("z-index", 0);
  // $(".popupContent").css("display", "none");
  if (currentQnNo == 1 && answerBtnClicked)
      return;

  var nextSeqNum = null;
  if (currentQnNo == 1) {
      nextSeqNum = 2;
  }


  if (previousSeqNo == nextSeqNum) {
      previousSeqNo = 0;
  }
  if (seqNo >= nextSeqNum) {
      pauseSeekbar = true;
      sliderChanged = true;
      setTimeout(function() { sliderChanged = false; }, 50);
      parent.surala.audio.clearAllSounds();
      seqNo = nextSeqNum;
      updateSlideContent(seqNo - 1);

      currentSliderPos = slideData.slideDuration[nextSeqNum - 2].pixVal;
      $('#seekBarSlider').css({ left: (currentSliderPos) + 'px' });
      $('#sliderVal').css({ width: (currentSliderPos) + 'px' });
  }
  $('.feedback,.correctAnswer').css('display', 'block');
  /* -- LMS code -- */
  activityNo = page + '-' + currentQnNo;
  // check if judgement button is active

  var correctAnsCount = 0;
  var correctAnsArray = [];
  correctAnsArray = currentQuestion.correctAnswer.split(','); // convert correct answer (JSON data) into array
  // var autocorrectAnsArray = currentQuestion.autocorrectAnswer.split(',');
  // disable the input box and track user answer
  param["flash_answer"] = '';
  for (var i = 0; i < correctAnsArray.length; i++) {
      $("#text_" + (i + 1)).attr("readonly", "true");
      $("#text_" + (i + 1)).css('pointer-events', 'none');
  }
  $("#text_1").val($("#text_1").val().replace(/\#comma/gi, ''));
  if (currentQnNo == 1) {
      answerBtnClicked = true;

      for (var i = 0; i < correctAnsArray.length; i++) {
          if (i === correctAnsArray.length) {
              param["flash_answer"] += $("#text_" + (i + 1)).val()
          } else {
              if (i == correctAnsArray.length - 1) {
                  param["flash_answer"] += $("#text_" + (i + 1)).val();
              } else {
                  param["flash_answer"] += $("#text_" + (i + 1)).val() + '#comma';
              }
          }
      }
  }

  // disable tegaki popup and judgement button
  // $('#tegaki_popup').css('display', 'none');
  $('#judgement_btn,#judgement_btn1').removeClass('btn_active');
  $('#judgement_btn,#judgement_btn1').unbind('click');

  // validating all input elements
  for (var i = 0; i < correctAnsArray.length; i++) {
      // debugger;
      if (currentQnNo == 1) {
          var firstAnswer = correctAnsArray[i].split('/')[0];
          var secondAnswer = correctAnsArray[i].split('/')[1];
          if ( firstAnswer === $('#text_' + (i + 1)).val() || secondAnswer === $('#text_' + (i + 1)).val()) {
              correctAnsCount++; // number of correct answer count
              $('#fb' + (i + 1)).addClass('correctFB6');

          } else {
              $('#fb' + (i + 1)).addClass('wrongFB5');
              $('#crt' + (i + 1)).html(firstAnswer);

          }
      }

  }
  fbAudio = null;
  fbAudio_IE = null;
  // play correct/wrong feedback audio based on validation
  if (correctAnsCount == correctAnsArray.length) {
      correctAnsFun();
  } else {
      wrongAns();
  }
  /* -- LMS code | sending result to LMS -- */
  param["flash_problem_num"] = activityNo;
  param["type"] = 'lecture_answer';
  param["flash_count"] = 1;
  //メイン画面を更新する
  setMain(activityNo, param);
  //送信する
  sendMassage(studyLogUrl, param, false);
  /* -- LMS code end -- */
}

// play correct feedback audio and proceed to next sequence
function correctAnsFun() {
  parent.surala.character.animate('student', 'correct', function() {
      parent.surala.character.animate('student', 'correct_stop');
  });
  parent.surala.character.animate('teacher', 'correct', function() {
      parent.surala.character.animate('teacher', 'correct_speak');
  });
  parent.surala.audio.playSound('correct', null, function() {
      if (sliderChanged) {
          sliderChanged = false;
      } else {
          playNextAnimation(currentQuestion.audio.correct, true);
      }
  });
  // -- LMS code | set to 1 if correct validation -- 
  param["flash_success"] = 1;
}

function wrongAns() {
  parent.surala.character.animate('student', 'wrong', function() {
      parent.surala.character.animate('student', 'wrong_stop');
  });
  parent.surala.character.animate('teacher', 'wrong', function() {
      parent.surala.character.animate('teacher', 'wrong_speak')
  });
  parent.surala.audio.playSound('wrong', null, function() {
      if (sliderChanged) {
          sliderChanged = false;
      } else {
          playNextAnimation(currentQuestion.audio.incorrect, false);
      }
  });
  // -- LMS code -- 
  param["flash_success"] = 0;
}


// play set of sequence after validation and SE sound
function playNextAnimation(audio, stateVal) {
  if (fbAudio === audio) {
      return;
  }
  fbAudio = audio;
  parent.surala.audio.playSound(audio, null, function() {
      if (sliderChanged) {
          sliderChanged = false;
      } else {
          seqNo = 2;
          slideSequence(seqNo);
          pauseSeekbar = false;
          playSeekbar();
      }
  });
}

var catchCount = 1;

function popup() {
  if (catchCount == 0) {
      catchCount = 1;
      $(".popupContent").css('visibility', 'hidden');
  } else {
      catchCount = 0;
      $(".popupContent").css('visibility', 'visible');
  }
}



$("#hintbtn").click(function() {
  $(".popupContent").toggle();
});

window.onunload = function() {
  parent.surala.audio.stopAllNonLoopSounds();
  parent.surala.character.stopAllAnimation();
};