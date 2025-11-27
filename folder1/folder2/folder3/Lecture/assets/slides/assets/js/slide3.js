/* JS: slide manager
 * initiates slide content and controls
 * slide | seek bar 
 */
var preloaditems = {
  images: [],
  sounds: null,
  jsonURL: "./assets/data/slide3.json"
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
  char_recog_v2.addEnText("text_1", tegaki_flg, 4, 1);

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
      answerBtnClicked1 = false;
      answerBtnClicked2 = false;


  }
}

function showLMSFeedback() {

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
              $('#option_4').css('color', '#999999');
              $('#option_5').css('color', '#999999');
          }
      }
      for (var i = 0; i < correctAnswer.length; i++) {
          $('#' + correctAnswer[i]).addClass('selectEnable').removeClass('wrongTxtcolor');
          $('#option_2').css('color', '#999999');
          $('#option_4').css('color', '#999999');
          $('#option_5').css('color', '#999999');
      }

  }
  if (currentQnNo == 2) {
      loadActivity();
      $('.display1,.display2,.display3,.display4,.display9').css('visibility', 'visible');
      $('.feedback, .correctAnswer').css('display', 'block');
      flash_answer = flash_answer.split('#comma');
      currentQuestion = slideData.content['question2'];
      correctAnsArray = currentQuestion.correctAnswer.split(',');
      // var correctAnsArray = currentQuestion.correctAnswer.split(',');
      for (var i = 0; i < correctAnsArray.length; i++) {
          $("#text_" + (i + 1)).val(flash_answer[i]);
      }
      // validating all input elements
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
  // parent.surala.disablecallOut_teacher();
  switch (seqNo) {
      case 1:
          loadSelectable();
          answerBtnClicked1 = false;
          loadActivity();
          resetall();
          answerBtnClicked2 = false;
   
  
          parent.surala.audio.playSound('IPM_S10L04u09_031', null, function() {
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
          $(".display2").css("visibility", "visible");
          // Hide blueline in case 2
          
          $(".shape").css("visibility", "visible");
          // Initialize the selectable functionality for display 2
          initDisplay2Selectable();
          parent.surala.audio.playSound('IPM_S10L04u010_031', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  pauseSeekbar = true;
                  enableDisplay2Selectable();
                  parent.surala.character.stopAllAnimation();
                  parent.surala.character.animate('teacher', 'normal');
              }
          });
          break;
      case 3:
          // Only continue to next sequence after answer checking
          // Reset the answer submitted flag when moving to the next sequence
          isAnswerSubmitted = false;
          $(".display2").css("visibility", "visible");
          if (seqNo >= 3 && seqNo <= 4 && seekBarStatus !== "ended") {
              currentQnNo = 1;
              if (!answerBtnClicked1)
                  enableDisplay2Selectable();
          }
          // Show blueline in case 3
          $(".blueline").css("visibility", "visible");
          parent.surala.audio.playSound('IPM_S10L04u09_033', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 4;
                  slideSequence(seqNo);
              }
          });
          break;
      case 4:
          // Reset the answer submitted flag when moving to the next sequence
          isAnswerSubmitted = false;
           
          // Continue showing blueline in case 4 (part of case 3 sequence)
           $(".answer").css("visibility" , "visible")
          parent.surala.audio.playSound('IPM_S10L04u010_032', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 5;
                  slideSequence(seqNo);
              }
          });
          break;
      case 5:
          // Reset the answer submitted flag when moving to the next sequence
          isAnswerSubmitted = false;
         
          $(".one").css("visibility" , "visible")
          $(".two").css("visibility" , "visible")
          parent.surala.audio.playSound('IPM_S10L04u010_033', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 6;
                  slideSequence(seqNo);
              }
          });
          break;
      case 6:
          // Reset the answer submitted flag when moving to the next sequence
          isAnswerSubmitted = false;
          disableSelectable();
          currentQnNo = 2;
          loadActivity();
          answerBtnClicked2 = false;
          $(".display4").css("visibility", "visible");
          // Hide the example text by default in case 6
          $(".example").css("visibility", "hidden");
          parent.surala.audio.playSound('IPM_S10L04u010_034', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  pauseSeekbar = true;
                  enableTegaki();
              }
          });
          break;
      case 7:
          // Reset the answer submitted flag when moving to the next sequence
          isAnswerSubmitted = false;
          $(".display5").css("visibility", "visible");
          parent.surala.audio.playSound('IPM_S10L04u010_035', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 8;
                  slideSequence(seqNo);
              }
          });
          break;
    

  }
}

function showcontent(num) {
  switch (num) {
      case 1:
          $(".shape").css("visibility", "hidden");
          // Hide blueline in case 1
          $(".blueline").css("visibility", "hidden");
          break;
      case 2:
          $(".display1").css("visibility", "visible");
          currentQnNo = 1;
          if (seqNo <= 2 && seekBarStatus !== "ended") {
              answerBtnClicked1 = false;
          }
          // Hide blueline in case 2
          $(".blueline").css("visibility", "hidden");
          break;
      case 3:
          $(".display2").css("visibility", "visible");
          
          
          // Show blueline in case 3
          $(".blueline").css("visibility", "visible");
          break;
      case 4:
          $(".display3").css("visibility", "visible");
          // Continue showing blueline in case 4
          $(".blueline").css("visibility", "visible");
          break;
      case 5:
          
          break;
      case 6:
        disableSelectable();
        $(".display4").css("visibility", "visible");
        currentQnNo = 2;
        if (seqNo == 6 && seekBarStatus !== "ended") {
            answerBtnClicked2 = false;
        }
          break;
      case 7:
        $(".display5").css("visibility", "visible");
          disableSelectable();
          if (seqNo >= 7 && seqNo <= 8 && seekBarStatus !== "ended") {
              currentQnNo = 2;
              if (!answerBtnClicked2) {
                  enableTegaki();
              }
          }
          break;
      case 8:
        $(".display6").css("visibility", "visible");
          break;
      case 9:
          $(".display7,.display7_1,.display7_2,.display8,.shape").css("visibility", "visible");
          if (seekBarStatus === "ended") {
              answerBtnClicked1 = false;
              disableSelectable();
              answerBtnClicked2 = false;
              disableActivity();
          }
          break;


  }
}

function hidecontent(num) {
  switch (num) {
      case 1:
          $(".display9").css("visibility", "hidden");
          break;
      case 2:
          $(".display1").css("visibility", "hidden");
          break;
      case 3:
          $(".display2").css("visibility", "hidden");
          // Hide blueline when hiding display2
          $(".blueline").css("visibility", "hidden");
          break;
      case 4:
          $(".display3").css("visibility", "hidden");
          // Hide blueline when hiding display3
          $(".blueline").css("visibility", "hidden");
          break;
      case 5:
          break;
      case 6:
          $(".display4").css("visibility", "hidden");
          break;
      case 7:
          $(".display5").css("visibility", "hidden");
          break;
      case 8:
          $(".display6").css("visibility", "hidden");
          break;
      case 9:
          $(".display7,.display7_1,.display7_2,.display8").css("visibility", "hidden");
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
  var correctAnsArray = currentQuestion.correctAnswer.split(',');
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
  // Hide the example text by default
  $(".example").css("visibility", "hidden");
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
      // Hide the example text by default
      $(".example").css("visibility", "hidden");
  }

}
//debugger;
// activate the activity for user input
function enableTegaki() {
  //debugger;
  if (currentQnNo == 2) {
      parent.surala.character.stopAllAnimation();
      currentQuestion = slideData.content['question2'];
      var correctAnsArray = currentQuestion.correctAnswer.split(',');
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
  correctAnsArray = currentQuestion.correctAnswer.split(','); // convert correct answer (JSON data) into array
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
              param["flash_answer"] += $("#text_" + i).val() + '#comma';
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
          // Get user input and normalize it by removing dots
          var userInput = $('#text_' + (i + 1)).val().replace(/\./g, '');
          
          // Check if user input matches either format in the correct answer
          var correctFormats = correctAnsArray[i].split('/'); // Split by '/' to get both formats
          var isCorrect = false;
          
          for (var j = 0; j < correctFormats.length; j++) {
              var normalizedCorrect = correctFormats[j].replace(/\./g, '');
              if (userInput === normalizedCorrect) {
                  isCorrect = true;
                  break;
              }
          }
          
          if (isCorrect) {
              correctAnsCount++; // number of correct answer count
              $('#fb' + (i + 1)).addClass('correctFB6');
              count = 1;
              // Show the example text when answer is correct
              $('.example').show();
          } else {
              $('#fb' + (i + 1)).addClass('wrongFB5');
              // Show the correct format with dots for better readability
              $('#crt' + (i + 1)).html("Jawaban yang benar: 1.500"); // Show the formatted version as the correct answer
              $('#crt1').css('display', 'block');
              // Show the example text when answer is wrong
              $(".example").css("visibility", "visible");
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
                  $('#option_4').css('color', '#999999');
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
              $('#option_1').css('color', '#999999');
              $('#option_3').css('color', '#999999');
              $('#option_4').css('color', '#999999');
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
      $('#option_1').css('color', '#999999');
      $('#option_3').css('color', '#999999');
      $('#option_4').css('color', '#999999');
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

// Add these variables after the existing variable declarations
var selectedChoices = [];
var isAnswerSubmitted = false;

// Add this new function for display 2 selectable functionality
function initDisplay2Selectable() {
  // Reset variables
  selectedChoices = [];
  isAnswerSubmitted = false;
  
  // Remove any existing event handlers and styles
  $('.choices-box div').off('click').removeClass('selected');
  
  // Add event handler for the existing judgement button
  $('#judgement_btn').off('click').on('click', function() {
    if (!isAnswerSubmitted && selectedChoices.length > 0) {
      checkDisplay2Answer();
    }
  });
}

function enableDisplay2Selectable() {
  // Reset selection state
  selectedChoices = [];
  isAnswerSubmitted = false;
  
  // Enable clicking on choices
  $('.choices-box div').on('click', function() {
    if (isAnswerSubmitted) return;
    
    var $this = $(this);
    var choiceText = $this.text().trim();
    
    // Toggle selection
    if ($this.hasClass('selected')) {
      $this.removeClass('selected');
      selectedChoices = selectedChoices.filter(function(item) {
        return item !== choiceText;
      });
    } else {
      $this.addClass('selected');
      selectedChoices.push(choiceText);
    }
    
    // Enable judgement button if at least one choice is selected
    if (selectedChoices.length > 0) {
      $('#judgement_btn').css('opacity', '1').css('pointer-events', 'auto');
    } else {
      $('#judgement_btn').css('opacity', '0.5').css('pointer-events', 'none');
    }
  });
  
  // Initially disable judgement button
  $('#judgement_btn').css('opacity', '0.5').css('pointer-events', 'none');
  
  // Make sure the display2 judgement button is visible
  $('.display2 .judgement_btn').show();
}

function checkDisplay2Answer() {
  isAnswerSubmitted = true;
  
  // Disable further selections
  $('.choices-box div').off('click');
  $('#judgement_btn').css('opacity', '0.5').css('pointer-events', 'none');
  
  // Check if the selected answer is correct
  var isCorrect = selectedChoices.length === 1 && selectedChoices[0] === "Persegi Panjang";
  
  if (isCorrect) {
    // Keep the selected choice highlighted
    // Play correct sound and animations simultaneously
    // Play correct animations
    parent.surala.character.animate('student', 'correct', function() {
      parent.surala.character.animate('student', 'correct_stop');
    });
    parent.surala.character.animate('teacher', 'correct', function() {
      parent.surala.character.animate('teacher', 'correct_speak');
    });
    
    // Play correct sound at the same time
    parent.surala.audio.playSound('MG_benar_02', null, function() {
      // Continue to next sequence after a delay
      setTimeout(function() {
        // Set seekbar to continue
        pauseSeekbar = false;
        playSeekbar();
        // Manually trigger the continuation to case 3 (not case 4)
        slideSequence(3);
      }, 2000);
    });
  } else {
    // Remove incorrect selection highlighting
    $('.choices-box div').removeClass('selected');
    
    // Highlight the correct answer
    $('.choices-box div').each(function() {
      if ($(this).text().trim() === "Persegi Panjang") {
        $(this).addClass('selected');
      }
    });
    
    // Play wrong animations
    parent.surala.character.animate('student', 'wrong', function() {
      parent.surala.character.animate('student', 'wrong_stop');
    });
    parent.surala.character.animate('teacher', 'wrong', function() {
      parent.surala.character.animate('teacher', 'wrong_speak');
    });
    
    // Play wrong sound at the same time
    parent.surala.audio.playSound('MG_salah_09', null, function() {
      // Continue to next sequence after a delay
      setTimeout(function() {
        // Set seekbar to continue
        pauseSeekbar = false;
        playSeekbar();
        // Manually trigger the continuation to case 3 (not case 4)
        slideSequence(3);
      }, 2000);
    });
  }
}
