// preload items declaration + json
var preloaditems = {
  images: [],
  sounds: null,
  jsonURL: "./assets/data/slide1.json",
  content: null
};

// start point
window.onload = init;

// LMS | elements to track no of attempts

// slide data elements
var slideTutorial, slideManager;
var slideData = null;

var currentQuestion = null;
var currentQnNo = 1;

var totalDuration = 0;
var totalAudios = 0;

var answerBtnClicked1 = false;
var totalTegakiBox = 1;
var seqNo = 0;
var totalSequence = 0;
var totalQues = 0;
var score = 0;
var canvasStage = null;
var rightFB = [];
var wrongFB5 = [];
var correctAnswerNum = [];
var ansState = true;
var all_ans_correct = true;
var activityFlag = false;
var correctAns = 0;
var correctAnsArr = [];
var ansArray = [];

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
  'use strict';
  parent.preloadStatus = true;
  canvasStage = new createjs.Stage("canvasStage");
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick", tick);
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
  }
}

function showLMSFeedback() {
  loadActivity();
  currentQuestion = slideData.content['question' + currentQnNo];
  $('.display-all').css('visibility', 'visible');
  $(".display1").css("visibility", "visible");
  $('.feedback').css('display', 'block');
  $('#judgement_btn').css('pointer-events', 'none').css('cursor', 'default');
  $('#judgement_btn').removeClass('btn_active');
  $('#judgement_btn').unbind('click');
  setTimeout(showLMS_DnD, speedcal(1000));
  $('#canvasStage').css('display', 'block');
}


function showLMS_DnD() {
  droppedEleStatus = flash_answer.split(':');
  var x = 0;
  var ansIndex = [];
  if (droppedEleStatus[0] != "") {
      /*Re-Creating the dragDropObj by adding Dropped element status recieved from the LMS*/
      for (var j = 0; j < dragDropObj.length; j++) {
          if (droppedEleStatus[j] != "" && droppedEleStatus[j] != undefined)
              var elems = droppedEleStatus[j].split(',');
          for (var k = 0; k < elems.length; k++) {
              if (elems[k] != null || elems[k] != "")
                  ansIndex.push(parseInt(elems[k].slice(-2).replace(/^\D+/g, '')) - 1);
              dragDropObj[j]["droppedEleStatus"][k] = elems[k];
          }
          layer.draw();
      }
      /*Write the images on Canvas based on user selected input*/
      var index = null;
      for (i = 0; i < dragDropObj.length; i++) {
          for (var j = 0; j < dragDropObj[i]["droppedEleStatus"].length; j++) {
              // condition updated code for MAC fix
              if (dragDropObj[j]["droppedEleStatus"][j] != "" && dragDropObj[j]["droppedEleStatus"][j] != "0") {
                  index = parseInt(dragDropObj[j]["droppedEleStatus"][j].slice(-2).replace(/^\D+/g, '')) - 1;

                  imgArr[index].setAttr('x', (rectAreas[j][0].getAttr('x') + (rectAreas[j][0].getAttr('width') / 2)) - (imgArr[index].getAttr('width') / 2));
                  imgArr[index].setAttr('y', (rectAreas[j][0].getAttr('y') + (rectAreas[j][0].getAttr('height') / 2)) - (imgArr[index].getAttr('height') / 2));
              }
          }
      }
      layer.draw();
      /*Validation message - Start*/
      for (var x = 0; x < dragDropObj.length; x++) {
          ansArray[x] = [];
          correctAns = 0;
          correctAnsArr[x] = 0;
          // verify correct element has been dragged and update correct ans count 
          if (currentQuestion.type === "anyOrder") {
              var dropCount = 0;
              var dropArrayItems = dragDropObj[x].droppedEleStatus.sort();
              for (var m = 0; m < dragDropObj.length; m++) {
                  for (var n = 0; n < dropArrayItems.length; n++) {
                      if (dropArrayItems.indexOf(dragDropObj[m].correctAnswerList[n]) > -1) {
                          correctAnsArr[x]++;
                          dropCount++;
                      }
                  }
                  if (dropCount > 0) {
                      break;
                  }
              }
          } else {
              for (var i = 0; i < dragDropObj[x]["correctAnswerList"].length; i++) {
                  if (dragDropObj[x]["correctAnswerList"][i] === dragDropObj[x]["droppedEleStatus"][x]) {
                      ansArray[x][i] = "complete";
                      correctAnsArr[x] += 1;
                  } else {
                      //$(".display2").css("visibility", "visible");
                      $('#fb' + (x + 1)).addClass('wrongFB5');
                  }
              }
          }

      }
      for (x = 0; x < dragDropObj.length; x++) {
          if (correctAnsArr[x] !== dragDropObj[x]["correctAnswerList"].length) {
              all_ans_correct = false;
          }
      }
      for (x = 0; x < dragDropObj.length; x++) {

          if (!all_ans_correct) {
              if (correctAnsArr[x] === dragDropObj[x]["correctAnswerList"].length) {
                  animVal = x;
                  $('#fb' + (animVal + 1)).addClass('correctFB6');
              } else {
                  all_ans_correct = false;
                  //$(".display2").css("visibility", "visible");
                  $('#fb' + (x + 1)).addClass('wrongFB5');
              }
          }
      }

      if (all_ans_correct) {

          for (x = 0; x < dragDropObj.length; x++) {
              $('#fb' + (x + 1)).addClass('correctFB6');
              //$(".display2").css("visibility", "hidden");
          }
      }
  } else {
      for (x = 0; x < dragDropObj.length; x++) {
          //$(".display2").css("visibility", "visible");
          $('#fb' + (x + 1)).addClass('wrongFB5');
      }
  }
}

function tick(event) {
  "use strict";
  canvasStage.update(event);
  if (layer != undefined) {
      layer.draw();
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
  switch (seqNo) {
      case 1:
          loadActivity();
          answerBtnClicked = false;
          parent.surala.audio.playSound('IPM_S10L04u09_007', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 2;
                  slideSequence(seqNo);
              }
          });
          break;
      case 2:
          parent.surala.audio.playSound('IPM_S10L04u09_008', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 3;
                  slideSequence(seqNo);
              }
          });
          break;
      case 3:

          parent.surala.audio.playSound('IPM_S10L04u09_009', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  // parent.surala.disablecallOut();
                  seqNo = 4;
                  slideSequence(seqNo);

              }
          });
          break;
      case 4:
          parent.surala.character.teacherTalk(false);
          parent.surala.character.animate('student', 'normal_speak');
          parent.surala.enablecallOut("Hmm, saya ingat.", 1);
          window.parent.$('.speech_bubble').css({ 'padding-left': '9px', 'padding-top': '33px' });
          parent.surala.audio.playSound('IPM_S10L04u09_S001', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 5;
                  slideSequence(seqNo);
              }
          });
          break;
      case 5:
          parent.surala.audio.playSound('IPM_S10L04u09_010', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 6;
                  slideSequence(seqNo);
              }
          });
          break;
      case 6:

          parent.surala.audio.playSound('IPM_S10L04u09_011', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 7;
                  slideSequence(seqNo);
              }
          });
          break;
      case 7:
          loadActivity();
          answerBtnClicked = false;
          $('.display1,.show1').css('visibility', 'visible');
          parent.surala.audio.playSound('IPM_S10L04u09_012', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  pauseSeekbar = true;
                  enableButton();
              }
          });
          break;
      case 8:
          parent.surala.audio.playSound('IPM_S10L04u09_013', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  seqNo = 9;
                  slideSequence(seqNo);
              }
          });
          break;
      case 9:
          parent.surala.audio.playSound('IPM_S10L04u09_014', null, function() {
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  disableActivity();
                  parent.surala.character.stopAllAnimation();
              }
          });
          break;


  }
}

function showcontent(num) {
  parent.surala.disablecallOut();
  switch (num) {
      case 1:
          // disableActivity();

          if (seqNo >= 1 && seqNo <= 7 && seekBarStatus !== "ended") {
              answerBtnClicked = false;
          }

          break;
      case 2:
          break;
      case 3:
          break;
      case 4:
          break;
      case 5:
          break;
      case 6:


      case 7:

          $(".display1").css("visibility", "visible");

          if (seqNo < 8 && seekBarStatus !== "ended") {
              answerBtnClicked = false;
              loadActivity();
          }
          break;

      case 8:

          if (seqNo >= 8 && seekBarStatus !== "ended") {

              if (!answerBtnClicked) {
                  enableButton();
              } else {
                  showAnswers();
              }
          }
          break;
      case 9:
          if (seekBarStatus == "ended") {
              if (answerBtnClicked) {
                  showAnswers();
              }
              disableActivity();
          }
          break;
  }
}


function hidecontent(num) {
  switch (num) {
      case 1:

          break;
      case 2:
          break;
      case 3:
          break;
      case 4:
          break;
      case 5:
          break;
      case 6:
          $(".display1").css("visibility", "hidden");
          break;
      case 7:
          break;
      case 8:
          break;
      case 9:
          break;


  }
}

function loadActivity() {
  // debugger;
  'use strict';
  currentQnNo = 1;

  //flag = false;
  currentQuestion = slideData.content["question" + currentQnNo];
  // canvasStage.removeAllChildren();

  //var correctAnsArray = currentQuestion.correctAnswer.split(',');
  dragAndDrop("slide1");

  correctAnswerNum = [];

  //loadFeedbackMarks(Object.keys(currentQuestion.dragElemtspos).length/2);
  all_ans_correct = true;
  for (var i = 0; i < dragDropObj.length; i++) {
      ansArray[i] = new Array(dragDropObj[i]["correctAnswerList"].length);
      $('#fb' + (i + 1)).removeClass('correctFB6');
      $('#fb' + (i + 1)).removeClass('wrongFB4');
      $('#crt1,#crt2,#crt3,#crt4,#crt5,#crt6,#crt7').css('display', 'block');
      dragDropObj[i]["droppedEleStatus"] = [];
  }

  $('#canvasStage').css('display', 'none');
  $('#judgement_btn').css('pointer-events', 'none').css('cursor', 'default');
  $('#judgement_btn').removeClass('btn_active');
  $('#judgement_btn').unbind('click');
  $('.feedback, .correctAnswer').css('display', 'none');
}


function disableActivity() {
  for (var i = 0; i < imgArr.length; i++) {
      imgArr[i].setAttr('draggable', false);
      imgArr[i].on('mouseover', function() {
          $("#container canvas").css('cursor', 'default');
      });
  }
  $("#judgement_btn").removeClass("btn_active");
  $("#judgement_btn").css('pointer-events', 'none').css('cursor', 'default').removeAttr("onclick");
}

function enableButton() {

  currentQuestion = slideData.content["question" + currentQnNo];

  activityFlag = true;
  parent.surala.character.stopAllAnimation();
  timeOut = setTimeout(function() {
      for (var i = 0; i < Object.keys(currentQuestion.dragElemtspos).length; i++) {

          imgArr[i].setAttr('draggable', true);
          imgArr[i].on('mouseover', function() {
              $("#container canvas").css('cursor', 'pointer');
          });
      }
  }, 200);
  $("#judgement_btn").css('pointer-events', 'auto').css('cursor', 'pointer');
  $('#judgement_btn').addClass('btn_active');
  $('#judgement_btn').attr('onclick', 'evaluateActivity()');
}

function tick(event) {
  "use strict";
  if (layer != undefined) {
      layer.draw();
  }
}

var animVal = 0;
var param = {};
// judgement button validation 
function evaluateActivity() {
  if (answerBtnClicked) {
      return;
  }

  var nextSeq = 8;

  if (previousSeqNo === seqNo) {
      previousSeqNo = 0;
  }


  if (seqNo >= nextSeq) { // check for the seqNo that is, case next to judgement point
      pauseSeekbar = true;
      sliderChanged = true;
      setTimeout(function() { sliderChanged = false; }, 50);
      parent.surala.audio.clearAllSounds();

      seqNo = nextSeq; // set the seqNo to the case next to judgement point
      updateSlideContent(seqNo - 1);

      currentSliderPos = slideData.slideDuration[nextSeq - 2].pixVal;
      $('#seekBarSlider').css({ left: (currentSliderPos) + 'px' });
      $('#sliderVal').css({ width: (currentSliderPos) + 'px' });
  }


  // activity submission status
  answerBtnClicked = true;
  clearInterval(interVal);
  clearInterval(timeOut);
  $('.feedback').css('display', 'block');
  $("#judgement_btn").css('pointer-events', 'none').css('cursor', 'default').removeAttr("onclick");
  $("#judgement_btn").removeClass("btn_active");


  /* -- LMS code -- */
  activityNo = page + '-' + currentQnNo;
  //var param = {};

  var clonedDroppedElements;
  clonedDroppedElements = [];
  for (var i = 0; i < Object.keys(currentQuestion.dragElemtspos).length; i++) { //debugger;
      imgArr[i].setAttr('draggable', false);
      imgArr[i].on('mouseover', function() {
          $("#container canvas").css('cursor', 'default');
      });
  }

  disableActivity();
  // debugger;
  /* -- LMS code end -- */
  for (var x = 0; x < dragDropObj.length; x++) {
      ansArray[x] = [];
      correctAns = 0;
      correctAnsArr[x] = 0;
      clonedDroppedElements[x] = dragDropObj[x]["droppedEleStatus"];
      // verify correct element has been dragged and update correct ans count 
      dragDropObj[x]["droppedEleStatus"].sort();

      if (currentQuestion.type === "anyOrder") {
          //var dropCount = 0;
          var dropArrayItems = dragDropObj[x].droppedEleStatus.sort();
          //for (var m = 0; m < dragDropObj.length; m++) {
          for (var n = 0; n < dragDropObj[x]["correctAnswerList"].length; n++) {
              if (dropArrayItems.length > 0) {
                  correctAnsArr[x]++;
                  //dropCount++;
              }
          }
      } else {
          for (var i = 0; i < dragDropObj[x]["correctAnswerList"].length; i++) {
              if (dragDropObj[x]["correctAnswerList"][i] === dragDropObj[x]["droppedEleStatus"][i]) {
                  var indexNo = parseInt(dragDropObj[x]["droppedEleStatus"][i].replace(/^\D+/g, '')) - 1;
                  ansArray[x][i] = "complete";
                  imgArr[indexNo].setAttr('draggable', false);
                  correctAnsArr[x] += 1;
              } else {
                  $('#fb' + (x + 1)).addClass('wrongFB5');
              }
          }
      }
  }
  for (x = 0; x < dragDropObj.length; x++) {
      if (correctAnsArr[x] === dragDropObj[x]["correctAnswerList"].length && dragDropObj[x]["droppedEleStatus"][0] !== "0") {
          animVal = x;
          $('#fb' + (x + 1)).addClass('correctFB6');
      } else {
          all_ans_correct = false;
          $('#fb' + (x + 1)).addClass('wrongFB5');
      }
  }

  fbAudio = null;
  if (all_ans_correct) {
      correctAnsFun();
  } else {
      wrongAns();
  }


  /* -- LMS code | sending result to LMS -- */
  param["flash_problem_num"] = activityNo;
  param["flash_answer"] = clonedDroppedElements.toString();
  param["type"] = 'lecture_answer';
  param["flash_count"] = 1;
  //メイン画面を更新する
  setMain(activityNo, param);
  //送信する
  sendMassage(studyLogUrl, param, false);
  /* -- LMS code end -- */

  stage.add(layer);
  correctAns = 0;
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

function showAnswers() {
  // updated code for MAC fix
  for (var x = 0; x < dragDropObj.length; x++) {
      imgArr[x].setAttr('visible', false);
  }
  for (var x = 0; x < dragDropObj.length; x++) {
      for (var i = 0; i < dragDropObj[x]["correctAnswerList"].length; i++) {
          if (dragDropObj[x]["correctAnswerList"][i] !== dragDropObj[x]["droppedEleStatus"][i]) {
              if (dragDropObj[x]["droppedEleStatus"][0] != undefined && dragDropObj[x]["droppedEleStatus"][0] !== "0") {
                  var index = parseInt(dragDropObj[x]["droppedEleStatus"][i].slice(-2).replace(/^\D+/g, '')) - 1;
                  imgArr[index].setAttr('visible', false);
              }
              $('#crt' + (x + 1)).css('visibility', 'visible');
              $('#crt' + (x + 1)).css('display', 'block');
          } else {
              var index = parseInt(dragDropObj[x]["droppedEleStatus"][i].slice(-2).replace(/^\D+/g, '')) - 1;
              imgArr[index].setAttr('visible', true);
              $('#crt' + (x + 1)).css('visibility', 'hidden');
          }
      }
      layer.draw();
  }

  for (var i = 0; i < Object.keys(currentQuestion.dragElemtspos).length; i++) {
      if ($('#fb' + (i + 1)).hasClass('wrongFB5')) {
          $('#fb' + (i + 1)).removeClass('wrongFB5');
      }
  }
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
          if (stateVal === false && currentQnNo == 1) {
              showAnswers();

          }
          seqNo = 8;
          slideSequence(seqNo);
          pauseSeekbar = false;
          playSeekbar();
      }
  });
}



window.onunload = function() {
  parent.surala.disablecallOut();
  parent.surala.audio.stopAllNonLoopSounds();
  parent.surala.character.stopAllAnimation();
};