/* JS: slide manager
 * initiates slide content and controls
 * slide | seek bar 
 */
var preloaditems = {
  images: [],
  sounds: null,
  jsonURL: "./assets/data/slide8.json"
};
// slide data elements
var slideTutorial, slideManager;
var slideData = null;
var totalTegakiBox = 1;
var currentQuestion = null;


var totalDuration = 0;
var totalAudios = 0;

var seqNo = 0;
var totalSequence = 0;

// Handwritten class variable
var char_recog_v2 = null;
var selectedVal = [];
var fbAudio = null;
var fbAudioIE = null;

var state = null;
var currentQnNo = 1;
var answerBtnClicked1 = false;


var currentQnNo = 2;
var answerBtnClicked2 = false;
var char_recog_v2 = null;


$(document).ready(function() {
  char_recog_v2 = new CharRecogV2();
  // Handwritten popup initial setting
  char_recog_v2.init(); // In case of horizontal writing mode
  //char_recog_v2.init("vertical");  // In the case of the vertical writing mode

  // Add handwriting function to text box Parameter see specifications
  char_recog_v2.addText("text_1", tegaki_flg, 18, 3);
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
      setpixVal(totalDuration);
      setTimeout(function() {
          seekBarEnable();
          slideSequence(1);
          parent.surala.slideNavigation.playPauseState = true;
      }, 100);
      answerBtnClicked = false;


  }
}

function showLMSFeedback() {
  loadSelectable();
  if (currentQnNo == 1) {
      loadSelectable();
      var correctAnsCount = 0;
      var correctAnswer = [];
      $('.display1,.display9').css('visibility', 'visible');
      $('.feedback, .correctAnswer').css('display', 'block');
      flash_answer = flash_answer.split(',');
      var correctAnswer = currentQuestion.correctAnswer.split(',');

      if (flash_answer != "") {
          for (var i = 0; i < flash_answer.length; i++) {
              if (jQuery.inArray(flash_answer[i], correctAnswer) > -1) {
                  //correctAnsCount++;
                  $('#fb_' + flash_answer[i]).addClass('correctFB6');
                  $('#' + correctAnswer[i]).addClass('selectEnable').removeClass('wrongTxtcolor');
              } else {
                  $('#fb_' + flash_answer[i]).addClass('wrongFB6');
                  $('#' + flash_answer[i]).addClass('wrongTxtcolor');
                  $('#' + correctAnswer[i]).addClass('selectEnable').removeClass('wrongTxtcolor');
                  if (correctAnswer.length > flash_answer.length) {
                      for (var j = 0; j < correctAnswer.length; j++) {
                          $('#' + correctAnswer[j]).addClass('selectEnable').removeClass('wrongTxtcolor');
                      }
                  } else {
                      $('#' + correctAnswer[i]).addClass('selectEnable').removeClass('wrongTxtcolor');
                  }
              }
          }
          if (correctAnswer.length == correctAnsCount) {
              $('.options').removeClass('wrongTxtcolor');
          }
      } else {
          for (var i = 0; i < correctAnswer.length; i++) {
              $('#' + correctAnswer[i]).addClass('selectEnable').removeClass('wrongTxtcolor');
              $('#option_2').css('color', '#999999');
              $('#option_3').css('color', '#999999');
              $('#option_5').css('color', '#999999');
          }
      }
      for (var i = 0; i < correctAnswer.length; i++) {
          $('#' + correctAnswer[i]).addClass('selectEnable').removeClass('wrongTxtcolor');
          $('#option_2').css('color', '#999999');
          $('#option_3').css('color', '#999999');
          $('#option_5').css('color', '#999999');
      }

  }
  if (currentQnNo == 2) {
      loadActivity();
      $('.display1,.display2,.display3,.display4,.display5,.display9').css('visibility', 'visible');
      $('.feedback, .correctAnswer').css('display', 'block');
      var correctAnsCount = 0;
      var correctAnsArray = [];
      flash_answer = flash_answer.split('#comma');
      currentQuestion = slideData.content['question2'];
      correctAnsArray = currentQuestion.correctAnswer.split('.');
      // var correctAnsArray = currentQuestion.correctAnswer.split(',');
      for (var i = 0; i < correctAnsArray.length; i++) {
          $("#text_" + (i + 1)).val(flash_answer[i]);
      }
      // validating all input elements
      for (var i = 0; i < correctAnsArray.length; i++) {
          if (correctAnsArray[i].split('/')[0] === $('#text_' + (i + 1)).val() || correctAnsArray[i].split('/')[1] === $('#text_' + (i + 1)).val()) {
              $('#fb' + (i + 1)).addClass('correctFB6');
          } else {
              $('#fb' + (i + 1)).addClass('wrongFB5');
              $('#crt' + (i + 1)).html(correctAnsArray[i].split('/')[0]);
          }
      }
  }

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
          loadSelectable();
          answerBtnClicked1 = false;
          loadActivity();
          resetall();
          answerBtnClicked2 = false;
          parent.surala.audio.playSound('IPM_S10L04u09_100', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 2;
                  slideSequence(seqNo);

              }
          });
          break;
      case 2:
          currentQnNo = 1;
          loadSelectable();
          answerBtnClicked1 = false;
          $(".display1").css("visibility", "visible");
          parent.surala.audio.playSound('IPM_S10L04u09_041+', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  pauseSeekbar = true;
                  enableSelectable();
                  parent.surala.character.stopAllAnimation();
                  parent.surala.character.animate('teacher', 'normal');
              }
          });
          break;
      case 3:
          $('.blink2').css('visibility', 'visible');
          interVal = setInterval(function() {
              if ($('.blink2').hasClass('blinkItem')) {
                  $('.blink2').removeClass('blinkItem');
                  $('.blink2').css('visibility', 'hidden');
              } else {
                  $('.blink2').addClass('blinkItem');
                  $('.blink2').css('visibility', 'visible');
              }
          }, speedcal(500));
          timeOut = setTimeout(function() {
              clearInterval(interVal);
              $('.blink2').removeClass('blinkItem');
              $('.blink2').css('visibility', 'hidden');
              $('.display2').css('visibility', 'visible');
          }, speedcal(3500));

          parent.surala.audio.playSound('IPM_S10L04u09_102', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 4;
                  slideSequence(seqNo);
              }
          });
          break;
      case 4:
          $('.blink2').css('visibility', 'hidden');
          $('.blink3').css('visibility', 'visible');
          interVal = setInterval(function() {
              if ($('.blink3').hasClass('blinkItem')) {
                  $('.blink3').removeClass('blinkItem');
                  $('.blink3').css('visibility', 'hidden');
              } else {
                  $('.blink3').addClass('blinkItem');
                  $('.blink3').css('visibility', 'visible');
              }
          }, speedcal(500));
          timeOut = setTimeout(function() {
              clearInterval(interVal);
              $('.blink3').removeClass('blinkItem');
              $('.blink3').css('visibility', 'hidden');
              $('.display3').css('visibility', 'visible');
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 5;
                  slideSequence(seqNo);
              }
          }, speedcal(3500));

          parent.surala.audio.playSound('IPM_S10L04u09_103', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  parent.surala.character.stopAllAnimation();
              }
          });
          break;
      case 5:
          $('.blink3').css('visibility', 'hidden');
          $('.blink4').css('visibility', 'visible');
          interVal = setInterval(function() {
              if ($('.blink4').hasClass('blinkItem')) {
                  $('.blink4').removeClass('blinkItem');
                  $('.blink4').css('visibility', 'hidden');
              } else {
                  $('.blink4').addClass('blinkItem');
                  $('.blink4').css('visibility', 'visible');
              }
          }, speedcal(500));
          timeOut = setTimeout(function() {
              clearInterval(interVal);
              $('.blink4').removeClass('blinkItem');
              $('.blink4').css('visibility', 'hidden');
              $('.display4').css('visibility', 'visible');
          }, speedcal(3500));
          parent.surala.audio.playSound('IPM_S10L04u09_104', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 6;
                  slideSequence(seqNo);
              }
          });
          break;
      case 6:
          $('.blink4').css('visibility', 'hidden');
          disableSelectable();
          currentQnNo = 2;
          loadActivity();
          answerBtnClicked2 = false;
          $(".display5").css("visibility", "visible");
          parent.surala.audio.playSound('IPM_S10L04u09_105', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  pauseSeekbar = true;
                  enableTegaki();
              }
          });
          break;
      case 7:
          $(".display6").css("visibility", "visible");
          parent.surala.audio.playSound('IPM_S10L04u09_106', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 8;
                  slideSequence(seqNo);
              }
          });
          break;
      case 8:
          $(".display7").css("visibility", "visible");
          parent.surala.audio.playSound('IPM_S10L04u09_107', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 9;
                  slideSequence(seqNo);
              }
          });
          break;
      case 9:
          $(".display8").css("visibility", "visible");
          parent.surala.audio.playSound('IPM_S10L04u09_108', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 10;
                  slideSequence(seqNo);
              }
          });
          break;
      case 10:
          $(".display9").css("visibility", "visible");
          timeOut = setTimeout(function() {
              $(".display9_1").css("visibility", "visible");
          }, 500);
          timeOut = setTimeout(function() {
              $(".display9_2").css("visibility", "visible");
          }, 1000);
          parent.surala.audio.playSound('IPM_S10L04u09_109', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 11;
                  slideSequence(seqNo);
              }
          });
          break;
      case 11:
          parent.surala.audio.playSound('IPM_S10L04u09_110', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 12;
                  slideSequence(seqNo);
              }
          });
          break;
      case 12:
          parent.surala.audio.playSound('IPM_S10L04u09_111', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 13;
                  slideSequence(seqNo);
              }
          });
          break;
      case 13:
          parent.surala.audio.playSound('IPM_S10L01u02_042', null, function() {
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
          break;
      case 2:
          $(".display1").css("visibility", "visible");
          currentQnNo = 1;
          if (seqNo >= 2 && seqNo <= 2 && seekBarStatus !== "ended") {
              answerBtnClicked1 = false;
          }
          break;
      case 3:
          if (seqNo >= 3 && seqNo <= 5 && seekBarStatus !== "ended") {
              currentQnNo = 1;
              if (!answerBtnClicked1)
                  enableSelectable();
          }
          break;
      case 4:
          $('.blink2').css('visibility', 'visible');
          $(".display2").css("visibility", "visible");
          break;
      case 5:
          $('.blink2').css('visibility', 'hidden');
          $('.blink3').css('visibility', 'visible');

          $(".display3").css("visibility", "visible");
          break;
      case 6:
          $('.blink3').css('visibility', 'hidden');
          $('.blink4').css('visibility', 'visible');
          $(".display4").css("visibility", "visible");
          $(".display5").css("visibility", "visible");
          currentQnNo = 2;
          disableSelectable();
          if (seqNo == 6 && seekBarStatus !== "ended") {
              answerBtnClicked2 = false;
          }
          break;
      case 7:
          disableSelectable();
          $('.blink4').css('visibility', 'hidden');
          $(".display6").css("visibility", "visible");
          if (seqNo >= 7 && seekBarStatus !== "ended") {
              currentQnNo = 2;
              if (!answerBtnClicked2) {
                  enableTegaki();
              }
          }
          break;
      case 8:
          $(".display7").css("visibility", "visible");
          break;
      case 9:
          $(".display8").css("visibility", "visible");
          break;
      case 10:
          $(".display9,.display9_1,.display9_2").css("visibility", "visible");
          break;
      case 11:
          if (seekBarStatus === "ended") {
              answerBtnClicked1 = false;
              disableSelectable();
              answerBtnClicked2 = false;
              disableActivity();
          }
          break;
      case 12:
          break;
      case 13:
          break;
  }
}

function hidecontent(num) {
  switch (num) {
      case 1:

          break;
      case 2:
          $(".display1").css("visibility", "hidden");
          break;
      case 3:
          $('.blink2').css("visibility", "hidden");
          $(".display2").css("visibility", "hidden");
          break;
      case 4:
          $('.blink3').css("visibility", "hidden");
          $(".display3").css("visibility", "hidden");
          break;
      case 5:
          $('.blink4').css("visibility", "hidden");
          $(".display4").css("visibility", "hidden");
          break;
      case 6:
          $(".display5").css("visibility", "hidden");
          break;
      case 7:
          $(".display6 ").css("visibility", "hidden");
          break;
      case 8:
          $(".display7").css("visibility", "hidden");
          break;
      case 9:
          $(".display8").css("visibility", "hidden");
          break;
      case 10:
          $(".display9,.display9_1,.display9_2").css("visibility", "hidden");
          break;
      case 11:
          break;
      case 12:
          break;
      case 13:
          break;
  }
}

window.onunload = function() {
  parent.surala.disablecallOut();
  parent.surala.audio.stopAllNonLoopSounds();
  parent.surala.character.stopAllAnimation();
};

function disableActivity() {
  answerBtnClicked2 = false;
  currentQuestion = slideData.content["question2"];
  var correctAnsArray = currentQuestion.correctAnswer.split('.');
  for (var i = 1; i <= correctAnsArray.length; i++) {
      $("#text_" + i).attr("readonly", "true").css('pointer-events', 'none');
  }
  $('#judgement_btn1').removeClass('btn_active');
  $('#judgement_btn1').removeAttr('onclick');

}


function resetall() {
  currentQuestion = slideData.content["question2"];
  for (var i = 1; i <= totalTegakiBox; i++) {
      $("#text_" + (i)).attr("readonly", "true");
      $("#text_" + (i)).css('pointer-events', 'none');
      $("#text_" + (i)).css('color', 'black');
      $("#text_" + (i)).val('');
      $('#crt' + (i)).html('');
      $('#fb' + (i)).removeClass('correctFB6');
      $('#fb' + (i)).removeClass('wrongFB6');
      $('#judgement_btn' + i).removeClass('btn_active');
      $('#judgement_btn' + i).unbind('click');
  }
  $('#judgement_btn1').removeClass('btn_active');
  $('#judgement_btn1').unbind('click');
}

function loadActivity() {

  if (currentQnNo == 2) {
      currentQuestion = slideData.content["question1"];
      for (var i = 1; i <= 1; i++) {
          $("#text_" + i).attr("readonly", "true");
          $("#text_" + i).css('pointer-events', 'none');
          $("#text_" + i).css('color', 'black');
          $("#text_" + i).val('');
          $('#crt' + i).html('');
          $('#fb' + i).removeClass('correctFB6');
          $('#fb' + i).removeClass('wrongFB5');
      }
      $('#judgement_btn1').removeClass('btn_active');
      $('#judgement_btn1').unbind('click');
      $('#fb1,#crt1').css('display', 'none');
  }

}

function enableTegaki() {
  //debugger;
  if (currentQnNo == 2) {
      parent.surala.character.stopAllAnimation();
      currentQuestion = slideData.content['question2'];
      var correctAnsArray = currentQuestion.correctAnswer.split('/');
      // enable judgement button and input boxes
      $('#judgement_btn1').css('pointer-events', 'auto').addClass('btn_active').attr('onclick', 'validateTegaki()');
      for (var i = 1; i <= correctAnsArray.length; i++) {
          $("#text_" + i).removeAttr("readonly");
          $("#text_" + i).css('pointer-events', 'auto');
          $("#text_" + i).css('color', 'black');
      }
      if (tegaki_flg === true) {
          for (var i = 1; i <= correctAnsArray.length; i++) {
              $("#text_" + i).attr('onclick', '$("#tegaki_popup").css("display","block");');
          }
      }
  }
}

function validateTegaki() {
  //debugger;

  if (answerBtnClicked2 && currentQnNo == 2) {
      return;
  }


  clearInterval(interVal);
  clearTimeout(timeOut);

  var nextSeqNum;

  if (currentQnNo == 2) {
      nextSeqNum = 7;
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

      //currentSliderPos = slideData.slideDuration[1].pixVal;
      currentSliderPos = slideData.slideDuration[nextSeqNum - 2].pixVal;
      $('#seekBarSlider').css({ left: (currentSliderPos) + 'px' });
      $('#sliderVal').css({ width: (currentSliderPos) + 'px' });
  }
  // activity submission status
  if (currentQnNo == 2) {
      answerBtnClicked2 = true;
      $('#judgement_btn1').css('pointer-events', 'none');
      $("#text_1").attr("readonly", "true");
      $("#text_1").css('pointer-events', 'none');
      $('#fb1').css('display', 'block');
  }


  /* -- LMS code -- complesary */
  activityNo = page + '-' + currentQnNo;
  // check if judgement button is active
  var correctAnsCount = 0;
  var correctAnsArray = [];
  currentQuestion = slideData.content['question2'];
  correctAnsArray = currentQuestion.correctAnswer.split('.'); // convert correct answer (JSON data) into array
  // disable the input box and track user answer
  param["flash_answer"] = '';

  $("#text_1").val($("#text_1").val().replace(/\#comma/gi, ''));


  if (currentQnNo == 2) {
      for (var i = 1; i <= correctAnsArray.length; i++) {
          $("#text_" + i).attr("readonly", "true");
          $("#text_" + i).css('pointer-events', 'none');
          // track user input and update to LMS value
          if (i === correctAnsArray.length) {
              param["flash_answer"] += $("#text_" + i).val()
          } else {
              param["flash_answer"] += $("#text_" + i).val();
          }
      }
  }



  // disable tegaki popup and judgement button
  $('#tegaki_popup').css('display', 'none');
  $('#judgement_btn1').removeClass('btn_active');
  $('#judgement_btn1').unbind('click');
  // validating all input elements
  if (currentQnNo == 2) {
      // debugger;
      for (var i = 0; i < correctAnsArray.length; i++) {
          if (correctAnsArray[i].split('/')[0] === $('#text_' + (i + 1)).val() || correctAnsArray[i].split('/')[1] === $('#text_' + (i + 1)).val()) {
              correctAnsCount++; // number of correct answer count
              $('#fb' + (i + 1)).addClass('correctFB6');
              count = 1;
          } else {
              $('#fb' + (i + 1)).addClass('wrongFB5');
              // $("#text_" + (i + 1)).css('color', '#999999');
              $('#crt' + (i + 1)).html(correctAnsArray[i].split('/')[0]);
              $('#crt1').css('display', 'block');
          }
      }
  }
  //correctCount = count;
  fbAudio = null;
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


var converted_input_val;

function convertor(inputval) {
  var twobyteslist = ['－', 'ー', '−', '．', '０', '１', '２', '３', '４', '５', '６', '７', '８', '９', '．'];
  var onebyteslist = ['-', '-', '-', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

  var input = inputval.split("");

  var index;
  var convertval = [];

  for (var j = 0; j < input.length; j++) {
      index = twobyteslist.indexOf(input[j]);
      if (index > -1) {
          convertval.push(onebyteslist[index]);
      } else {
          convertval.push(input[j]);
      }
  }
  converted_input_val = convertval.join("");
  // console.log(converted_input_val);
}




function disableSelectable() {
  $(".options").attr("readonly", "true");
  $(".options").css('pointer-events', 'none');
  $('.options').unbind('click');
  $('#judgement_btn').removeClass('btn_active');
  $('#judgement_btn').removeAttr('onclick');

}
// reset activity 
function loadSelectable() {
  selectedAns = [];
  currentQuestion = slideData.content["question1"];
  selectedVal = [];
  $('#judgement_btn').removeClass('btn_active');
  $('#judgement_btn').unbind('click');
  $('.options').removeClass('wrongTxtcolor');
  $('.options').unbind('click');
  $('.options').css('pointer-events', 'none');
  $('.options').removeClass('selectEnable');
  $('.feedback').removeClass('correctFB6');
  $('.feedback').removeClass('wrongFB6');
  $('#option_1,#option_2,#option_3,#option_4,#option_5').css('color', 'black');
}


function showAnswer() {
  $('.options').removeClass('selectEnable');
  $('#' + currentQuestion.correctAnswer).addClass('selectEnable');
}

function enableSelectable() {
  selectedCount = 0;
  parent.surala.character.stopAllAnimation();
  var currentQuestion = slideData.content["question1"];
  qType = currentQuestion.qType;
  // enable judgement button and input boxes
  $('.options').unbind('click');
  $('#judgement_btn').css('pointer-events', 'auto').addClass('btn_active').attr('onclick', 'validateSelectable()');
  //selection enable
  $('.options').css('cursor', 'pointer');
  $('.options').css('pointer-events', 'auto');
  $('.options').on('click', function() {
      selectedVal = $(this).attr('id');
      var index = selectedAns.indexOf(selectedVal);
      if (qType == "singleType") {
          if ($(this).hasClass('selectEnable')) {
              return;
          }
          selectedCount = 1;
          selectedAns = [];
          selectedAns.push(selectedVal);
          $('.options').removeClass('selectEnable');
          $(this).addClass('selectEnable');
      } else {
          if ($(this).hasClass('disable_selection')) {
              return;
          }
          if ($(this).hasClass('selectEnable')) {
              selectedCount--;
              selectedAns.splice(index, 1);
              $(this).removeClass('selectEnable');
          } else {
              selectedCount++;
              selectedAns.push(selectedVal);
              $(this).addClass('selectEnable');
          }
      }
  });

}
//debugger;

function validateSelectable() {
  var currentQuestion = slideData.content["question1"];
  if (answerBtnClicked1) {
      return;
  }
  // check if judgement button is active
  if (!$('#judgement_btn').hasClass('btn_active')) {
      return;
  }
  clearInterval(interVal);
  clearTimeout(timeOut);

  var nextSeqNum = 3;
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
  // activity submission status
  answerBtnClicked1 = true;
  fbAudio = null;

  /* -- LMS code -- */
  activityNo = page + '-' + currentQnNo;

  var correctAnsCount = 0;
  var correctAnswer = [];
  var currentQuestion = slideData.content["question1"];
  correctAnswer = currentQuestion.correctAnswer.split(','); // correct answer (JSON data)
  qType = currentQuestion.qType;
  $('.feedback, .correctAnswer').css('display', 'block');

  // disable selection and judgement button
  $('.options').unbind('click').css('cursor', 'default');
  $('#judgement_btn').removeClass('btn_active');
  $('#judgement_btn').unbind('click');
  // validate the selected value and call the feedback audio
  selectedAns.sort(); //debugger;   
  if (qType = "singleType") {
      $('.options').addClass('wrongTxtcolor');
  } else {
      $('.options').removeClass('wrongTxtcolor');
  }
  if (correctAnswer.length == selectedCount) {
      var correctOptionsCount = 0;
      for (var i = 0; i < correctAnswer.length; i++) {
          if (jQuery.inArray(selectedAns[i], correctAnswer) > -1) {
              correctOptionsCount++;
              $('#' + correctAnswer[i]).addClass('selectEnable').removeClass('wrongTxtcolor');
          }
      }
      if (correctOptionsCount == correctAnswer.length) {
          correctAnsFun();
          for (var i = 0; i < correctAnswer.length; i++) {
              $('#fb_' + correctAnswer[i]).addClass('correctFB6');
              $('#' + correctAnswer[i]).addClass('selectEnable').removeClass('wrongTxtcolor');
              $('.options').removeClass('wrongTxtcolor');
          }
      } else {
          //$('#option_5').css('color', '#999999');
          wrongAns();

          for (var i = 0; i < selectedCount; i++) {
              if (jQuery.inArray(selectedAns[i], correctAnswer) > -1) {
                  $('#fb_' + selectedAns[i]).addClass('correctFB6');
                  $('#' + correctAnswer[i]).addClass('selectEnable').removeClass('wrongTxtcolor');
              } else {
                  $('#fb_' + selectedAns[i]).addClass('wrongFB6');
                  $('#' + selectedAns[i]).addClass('wrongTxtcolor');
                  $('#option_2').css('color', '#999999');
                  $('#option_3').css('color', '#999999');
                  $('#option_5').css('color', '#999999');
                  $('#' + selectedAns[i]).removeClass('selectEnable');
                  if (correctAnswer.length > selectedAns.length) {
                      for (var j = 0; j < correctAnswer.length; j++) {
                          $('#' + correctAnswer[j]).addClass('selectEnable').removeClass('wrongTxtcolor');
                      }
                  } else {
                      $('#' + correctAnswer[i]).addClass('selectEnable').removeClass('wrongTxtcolor');
                  }
              }
          }
      }
  } else {
      for (var i = 0; i <= selectedCount; i++) {
          if (jQuery.inArray(selectedAns[i], correctAnswer) > -1) {
              $('#fb_' + selectedAns[i]).addClass('correctFB6');
              $('#' + correctAnswer[i]).addClass('selectEnable');
              $('#' + correctAnswer[i]).removeClass('wrongTxtcolor');
          } else {
              $('#fb_' + selectedAns[i]).addClass('wrongFB6');
              $('#' + selectedAns[i]).addClass('wrongTxtcolor');
              $('#option_2').css('color', '#999999');
              $('#option_3').css('color', '#999999');
              $('#option_5').css('color', '#999999');
              $('#' + selectedAns[i]).removeClass('selectEnable');
              if (correctAnswer.length > selectedAns.length) {
                  for (var j = 0; j < correctAnswer.length; j++) {
                      $('#' + correctAnswer[j]).addClass('selectEnable');
                      $('#' + correctAnswer[i]).removeClass('wrongTxtcolor');
                  }
              } else {
                  $('#' + correctAnswer[i]).addClass('selectEnable');
                  $('#' + correctAnswer[i]).removeClass('wrongTxtcolor');
              }
          }
      }
      // $('#option_5').css('color', '#999999');
      wrongAns();
  }
  if (selectedVal == "") {
      $('#' + correctAnswer[i]).addClass('selectEnable');
      $('#option_2').css('color', '#999999');
      $('#option_3').css('color', '#999999');
      $('#option_5').css('color', '#999999');
      $('#' + correctAnswer[i]).removeClass('wrongTxtcolor');
  }
  /* -- LMS code | sending result to LMS -- */
  param["flash_problem_num"] = activityNo;
  param["type"] = 'lecture_answer';
  param["flash_count"] = 1;
  var selectedAnsLMS = selectedAns.toString();
  param["flash_answer"] = selectedAnsLMS; // pass selected value to LMS
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
          parent.surala.character.animate('student', 'normal_speak');
          parent.surala.character.animate('teacher', 'normal_speak');
          if (currentQnNo == 1) {
              seqNo = 3;
              slideSequence(seqNo);
              pauseSeekbar = false;
              playSeekbar();
          }
          if (currentQnNo == 2) {
              parent.surala.audio.clearAllSounds();
              seqNo = 7;
              slideSequence(seqNo);
              pauseSeekbar = false;
              playSeekbar();
          }
      }
  });
}


// unload current playing audios on slide change
window.onunload = function() {
  parent.surala.audio.stopAllNonLoopSounds();
  parent.surala.character.stopAllAnimation();
};