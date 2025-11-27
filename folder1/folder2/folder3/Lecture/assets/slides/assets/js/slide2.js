// preload items declaration + json
var preloaditems = {
  images: [],
  sounds: null,
  jsonURL: "./assets/data/slide2.json",
  content: null
};

// LMS variables
var studyLogUrl = parent.study_log_url;

// Speed control utility function
function speedcal(speed_number) {
  var rate = parent.speed_rate;
  if (rate != "") {
    if (rate == 0.5 || rate == 0.75) {
      speed_number = speed_number + speed_number * rate;
    } else {
      speed_number = speed_number / rate;
    }
  }
  return speed_number;
}

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
var answerSubmittedInCase2 = false;
var answerSubmittedInCase18 = false; // Track if answer has been submitted in case 18
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

// Add sliderChanged variable for seekbar functionality
var sliderChanged = false;
var previousSeqNo = 0;
var parent = window.parent;
var playbuttonClick = false; // Add this variable for seekbar functionality

// Add missing variables for seekbar functionality
var seekbarWidth = 720; // 15px start position
var seekbarLength = 717;
var currentSliderPos = 0;
var seekBarStatus = "inprogress";
var timeOut,
  interVal = null;
var disableSeekBar = false;
var pauseSeekbar = false;
var onSliderDrag = false;
var seekBarTimer = null;

// Track currently playing audio
var currentAudioId = null;

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
  // Stop any currently playing audio first
  if (currentAudioId) {
      parent.surala.audio.stopSound(currentAudioId);
      currentAudioId = null;
  }
  
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
  
  // Update content based on sequence number
  updateContentForSequence(seqNo);
  
  switch (seqNo) {
      case 1: 
            $('.display1').css("visibility", "visible");
            
            // Disable shape selection in case 1
            shapeSelectionEnabled = false;
            
            if (parent.surala && parent.surala.audio) {
                currentAudioId = 'IPM_S10L04u010_010';
                parent.surala.audio.playSound(currentAudioId, null, function() {
                    if (sliderChanged) {
                        sliderChanged = false;
                    } else {
                        seqNo = 2;
                        slideSequence(seqNo);
                    }
                });
            }
            break;
      case 2:
          shapeSelectionEnabled = true;
          
          // Make the shape image blink 2 times at the start of case 2
          var blinkCount = 0;
          var blinkInterval = setInterval(function() {
              $('.shape').fadeOut(300).fadeIn(300);
              blinkCount++;
              if (blinkCount >= 2) {
                  clearInterval(blinkInterval);
              }
          }, 400);
          
          currentAudioId = 'IPM_S10L04u010_011';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 3;
                slideSequence(seqNo);
            }
          });
          break;
      case 3:
          parent.surala.character.animate('student', 'talk', function() {
              parent.surala.character.animate('student', 'talk_stop');
          });
          currentAudioId = 'IPM_S10L04u010_S002';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            parent.surala.character.stopAllAnimation();
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 4;
                slideSequence(seqNo);
            }
          });
          break;
      case 4:
          $('.display2').css("visibility", "visible");
          currentAudioId = 'IPM_S10L04u010_012';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 5;
                slideSequence(seqNo);
            }
          });
          break;

      case 5:
          currentAudioId = 'IPM_S10L04u010_013';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 6;
                slideSequence(seqNo);
            }
          });
          break;
      case 6:
          currentAudioId = 'IPM_S10L04u010_S003';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 7;
                slideSequence(seqNo);
            }
          });
          break;
      case 7:
          currentAudioId = 'IPM_S10L04u010_S004';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 8;
                slideSequence(seqNo);
            }
          });
          break;
      case 8:
          currentAudioId = 'IPM_S10L04u010_014';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 9;
                slideSequence(seqNo);
            }
          });
          break;
      case 9:
          currentAudioId = 'IPM_S10L04u010_015';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 10;
                slideSequence(seqNo);
            }
          });
          break;
      case 10:
          currentAudioId = 'IPM_S10L04u010_016';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 11;
                slideSequence(seqNo);
            }
          });
          break;
      case 11:
          currentAudioId = 'IPM_S10L04u010_017';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 12;
                slideSequence(seqNo);
            }
          });
          break;
      case 12:
          currentAudioId = 'IPM_S10L04u010_S005';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 13;
                slideSequence(seqNo);
            }
          });
          break;
      case 13:
          currentAudioId = 'IPM_S10L04u010_018';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 14;
                slideSequence(seqNo);
            }
          });
          break;
      case 14:
          $('.blueline').css("visibility", "visible");
          currentAudioId = 'IPM_S10L04u010_019';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 15;
                slideSequence(seqNo);
            }
          });
          break;
      case 15:
          currentAudioId = 'IPM_S10L04u010_020';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 16;
                slideSequence(seqNo);
            }
          });
          break;
      case 16:
          $('.one').css("visibility", "visible");
          currentAudioId = 'IPM_S10L04u010_021';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 17;
                slideSequence(seqNo);
            }
          });
          break;
      case 17:
          $('.two').css("visibility", "visible");
          currentAudioId = 'IPM_S10L04u010_022';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 18;
                slideSequence(seqNo);
            }
          });
          break;
      case 18:
          $('.display4').css("visibility", "visible");
          
          // Enable input field and button for case 18
          $('#text_1').prop('disabled', false).css('pointer-events', 'auto');
          $('#judgement_btn1').css('pointer-events', 'auto').addClass('btn_active');
          
          // Add event listener for the judgement button
          $('#judgement_btn1').off('click').on('click', function() {
              validateCase18Answer();
          });
          
          currentAudioId = 'IPM_S10L04u010_023';
          parent.surala.audio.playSound(currentAudioId, null, function() {
              // Audio stops here, allowing kids to give answer
              // Answer giving and checking continues to other cases
              if (sliderChanged) {
                  sliderChanged = false;
              } else {
                  // Don't automatically advance to next case - wait for user input
                  // Pause seekbar until user answers
                  pauseSeekbar = true;
              }
          });
          break;
      case 19:
          $('.display5').css("visibility", "visible");
          currentAudioId = 'IPM_S10L04u010_024';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 20;
                slideSequence(seqNo);
            }
          });
          break;
      case 20:
          $('.display6').css("visibility", "visible");
          currentAudioId = 'IPM_S10L04u010_025';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 21;
                slideSequence(seqNo);
            }
          });
          break;
      case 21:
          $('.display7').css("visibility", "visible");
          currentAudioId = 'IPM_S10L04u010_026';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 22;
                slideSequence(seqNo);
            }
          });
          break;
      case 22:
          // Blink 2 times when starting case 22 - blink the element containing 4.800 km²
          var blinkCount = 0;
          var blinkInterval = setInterval(function() {
              // Blink display7 and any element with the value
              $('.display7, .value, .answer, [data-value="4.800"]').fadeOut(300).fadeIn(300);
              blinkCount++;
              if (blinkCount >= 2) {
                  clearInterval(blinkInterval);
              }
          }, 400);
          
          currentAudioId = 'IPM_S10L04u010_027';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 23;
                slideSequence(seqNo);
            }
          });
          break;
      case 23:
          $('.display8').css("visibility", "visible");
          currentAudioId = 'IPM_S10L04u010_028';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 24;
                slideSequence(seqNo);
            }
          });
          break;
      case 24:
          currentAudioId = 'IPM_S10L04u010_029';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 25;
                slideSequence(seqNo);
            }
          });
          break;
      case 25:
          currentAudioId = 'IPM_S10L04u010_030';
          parent.surala.audio.playSound(currentAudioId, null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 26;
                slideSequence(seqNo);
            }
          });
          break;
      case 26:
          // End of slide
          endSeekbar();
          break;
  }
}

// Function to update content based on sequence number
function updateContentForSequence(seqNo) {
  // Reset all content first
  resetAllContent();
  
  // Show content based on current sequence
  for (var i = 1; i <= seqNo; i++) {
      showcontent(i);
  }
}

// Function to reset all content visibility
function resetAllContent() {
  $('.display1, .display2, .display4, .display5, .display6, .display7, .display8').css('visibility', 'hidden');
  $('.blueline, .one, .two').css('visibility', 'hidden');
  $('.feedback, .correctAnswer').css('display', 'none');
  $('#fb1, #fb2, #fb3, #fb4, #fb5, #fb6, #fb7').removeClass('correctFB6 wrongFB5');
  
  // Reset interactive states
  shapeSelectionEnabled = false;
  answerBtnClicked1 = false;
  answerSubmittedInCase2 = false;
  answerSubmittedInCase18 = false;
  $('#text_1').prop('disabled', true).css('pointer-events', 'none').val('');
  $('#judgement_btn1').css('pointer-events', 'none').removeClass('btn_active');
  $('#judgement_btn').css('pointer-events', 'none').removeClass('btn_active');
}

function showcontent(num) {
  parent.surala.disablecallOut();
  switch (num) {
      case 1:
          $('.display1').css("visibility", "visible");
          shapeSelectionEnabled = false;
          break;
      case 2:
          
          shapeSelectionEnabled = true;
          break;
      case 4:
          $('.display2').css("visibility", "visible");
          break;
      case 14:
          $('.blueline').css("visibility", "visible");
          break;
      case 16:
          $('.one').css("visibility", "visible");
          break;
      case 17:
          $('.two').css("visibility", "visible");
          break;
      case 18:
          $('.display4').css("visibility", "visible");
          break;
      case 19:
          $('.display5').css("visibility", "visible");
          break;
      case 20:
          $('.display6').css("visibility", "visible");
          break;
      case 21:
          $('.display7').css("visibility", "visible");
          break;
      case 23:
          $('.display8').css("visibility", "visible");
          break;
  }
}

function hidecontent(num) {
  switch (num) {
      case 1:
          $('.display1').css("visibility", "hidden");
          shapeSelectionEnabled = false;
          break;
      case 2:
          $('.display2').css("visibility", "hidden");
          break;
      case 4:
          $('.display2').css("visibility", "hidden");
          break;
      case 14:
          $('.blueline').css("visibility", "hidden");
          break;
      case 16:
          $('.one').css("visibility", "hidden");
          break;
      case 17:
          $('.two').css("visibility", "hidden");
          break;
      case 18:
          $('.display4').css("visibility", "hidden");
          break;
      case 19:
          $('.display5').css("visibility", "hidden");
          break;
      case 20:
          $('.display6').css("visibility", "hidden");
          break;
      case 21:
          $('.display7').css("visibility", "hidden");
          break;
      case 23:
          $('.display8').css("visibility", "hidden");
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

// Evaluate answer submitted during case 2
function evaluateCase2Answer() {
  if (answerSubmittedInCase2) {
      return; // Already submitted
  }
  
  answerSubmittedInCase2 = true;
  
  // Disable button after submission
  $('#judgement_btn').css('pointer-events', 'none').css('cursor', 'default');
  $('#judgement_btn').removeClass('btn_active');
  
  // Correct answers are C and D
  const correctAnswers = ["C", "D"];
  
  // Check if no answer provided (empty submission)
  if (selectedShapes.length === 0) {
      // Show correct answers with correct feedback marks
      correctAnswers.forEach(shape => {
          let feedback = document.getElementById("feedback" + shape);
          if (feedback) {
              feedback.src = "../../../../../../Common/CeylonSoft/re_primarymath_ind/images/correct4.png";
              feedback.classList.add("show");
          }
      });
      
      // Play wrong animation and audio for empty submission
      parent.surala.character.animate('student', 'wrong', function() {
          parent.surala.character.animate('student', 'wrong_stop');
      });
      parent.surala.character.animate('teacher', 'wrong', function() {
          parent.surala.character.animate('teacher', 'wrong_speak');
      });
      
      // Play wrong sound
      setTimeout(function() {
          if (parent.surala && parent.surala.audio) {
              parent.surala.audio.playSound('MG_salah_07', null, function() {
                  if (sliderChanged) {
                      sliderChanged = false;
                  } else {
                      // Resume seekbar after feedback
                      pauseSeekbar = false;
                      seqNo = 3;
                      slideSequence(seqNo);
                      playSeekbar();
                  }
              });
          }
      }, 200);
      
      return; // Exit function after handling empty submission
  }
  
  // Check if answer is correct
  let allCorrect = selectedShapes.length === 2 && 
                   selectedShapes.every(shape => correctAnswers.includes(shape)) &&
                   correctAnswers.every(ans => selectedShapes.includes(ans));
  
  // Show feedback marks on shapes
  selectedShapes.forEach(shape => {
      let feedback = document.getElementById("feedback" + shape);
      if (feedback) {
          if (correctAnswers.includes(shape)) {
              feedback.src = "../../../../../../Common/CeylonSoft/re_primarymath_ind/images/correct4.png";
          } else {
              feedback.src = "../../../../../../Common/CeylonSoft/re_primarymath_ind/images/wrong2.png";
          }
          feedback.classList.add("show");
      }
  });
  
  if (allCorrect) {
      // Play correct animation and audio
      parent.surala.character.animate('student', 'correct', function() {
          parent.surala.character.animate('student', 'correct_stop');
      });
      parent.surala.character.animate('teacher', 'correct', function() {
          parent.surala.character.animate('teacher', 'correct_speak');
      });
      
      // Play correct sound
      setTimeout(function() {
          if (parent.surala && parent.surala.audio) {
              parent.surala.audio.playSound('MG_benar_02', null, function() {
                  if (sliderChanged) {
                      sliderChanged = false;
                  } else {
                      // Resume seekbar after correct feedback
                      pauseSeekbar = false;
                      seqNo = 3;
                      slideSequence(seqNo);
                      playSeekbar();
                  }
              });
          }
      }, 200);
  } else {
      // Play wrong animation and audio
      parent.surala.character.animate('student', 'wrong', function() {
          parent.surala.character.animate('student', 'wrong_stop');
      });
      parent.surala.character.animate('teacher', 'wrong', function() {
          parent.surala.character.animate('teacher', 'wrong_speak');
      });
      
      // Play wrong sound
      setTimeout(function() {
          if (parent.surala && parent.surala.audio) {
              parent.surala.audio.playSound('MG_salah_07', null, function() {
                  if (sliderChanged) {
                      sliderChanged = false;
                  } else {
                      // Resume seekbar after wrong feedback
                      pauseSeekbar = false;
                      seqNo = 3;
                      slideSequence(seqNo);
                      playSeekbar();
                  }
              });
          }
      }, 200);
  }
}

// Validate answer for case 18
function validateCase18Answer() {
    // Prevent multiple submissions
    if (answerSubmittedInCase18) {
        return;
    }
    
    answerSubmittedInCase18 = true;
    
    // Get the user input and remove any spaces
    var userAnswer = $('#text_1').val().trim().replace(/\s/g, '');
    
    // Check if answer is empty
    if (userAnswer === '') {
        // For empty submission, treat as wrong answer
        var isCorrect = false;
    } else {
        // Correct answers are 4.800 or 4800
        var isCorrect = (userAnswer === '4.800' || userAnswer === '4800');
    }
    
    // Disable input and button after submission
    $('#text_1').prop('disabled', true).css('pointer-events', 'none');
    $('#judgement_btn1').css('pointer-events', 'none').removeClass('btn_active');
    
    // Set up animation parameters for feedback
    parent.surala.character.stopAllAnimation();
    
    // LMS tracking
    var activityNo = "slide2-case18";
    var param = {
        flash_problem_num: activityNo,
        flash_answer: userAnswer,
        type: 'lecture_answer',
        flash_count: 1,
        flash_success: isCorrect ? 1 : 0
    };
    
    if (isCorrect) {
        // Hide the example text for correct answers
        $('.example').hide();
        
        // Play correct animation and audio using existing function
        parent.surala.character.animate('student', 'correct', function() {
            parent.surala.character.animate('student', 'correct_stop');
        });
        parent.surala.character.animate('teacher', 'correct', function() {
            parent.surala.character.animate('teacher', 'correct_speak');
        });
        
        // Play correct sound
        setTimeout(function() {
            if (parent.surala && parent.surala.audio) {
                parent.surala.audio.playSound('MG_benar_02', null, function() {
                    // Send LMS data
                    if (typeof setMain === 'function') setMain(activityNo, param);
                    if (typeof sendMassage === 'function') sendMassage(studyLogUrl, param, false);
                    
                    // Resume seekbar and continue to next case after correct feedback
                    pauseSeekbar = false;
                    seqNo = 19;
                    slideSequence(seqNo);
                });
            }
        }, 200);
    } else {
        // Show the example text for wrong answers
        $('.example').show();
        
        // Play wrong animation and audio using existing function
        parent.surala.character.animate('student', 'wrong', function() {
            parent.surala.character.animate('student', 'wrong_stop');
        });
        parent.surala.character.animate('teacher', 'wrong', function() {
            parent.surala.character.animate('teacher', 'wrong_speak');
        });
        
        // Play wrong sound
        setTimeout(function() {
            if (parent.surala && parent.surala.audio) {
                parent.surala.audio.playSound('MG_salah_07', null, function() {
                    // Send LMS data
                    if (typeof setMain === 'function') setMain(activityNo, param);
                    if (typeof sendMassage === 'function') sendMassage(studyLogUrl, param, false);
                    
                    // Resume seekbar and continue to next case after wrong feedback
                    pauseSeekbar = false;
                    seqNo = 19;
                    slideSequence(seqNo);
                });
            }
        }, 200);
    }
}


window.onunload = function() {
  parent.surala.disablecallOut();
  parent.surala.audio.stopAllNonLoopSounds();
  parent.surala.character.stopAllAnimation();
};

// Add this function to handle showing content when seekbar moves forward/backward
function updateSlideContent(seq) {
  // Reset all displays and states
  resetAllContent();
  
  // Show content up to the current sequence
  for (var i = 1; i <= seq; i++) {
      showcontent(i);
  }
}

function seekBarEnable() {
  slideTutorial.enableSeekbar = true;
  disableSeekBar = false;

  parent.surala.enableBookmark = true;

  // seekbar pointer on drag
  $(".seekBarSlider").draggable({
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
        
        // Stop all audio immediately when dragging starts
        parent.surala.audio.stopAllNonLoopSounds();
        currentAudioId = null;
        
        parent.surala.character.teacherTalk(false);
        parent.surala.slideNavigation.blinkNextBtn(false);
        pauseSeekbar = true;
      }
    },
    drag: function (e, ui) {
      if (slideTutorial.enableSeekbar && disableSeekBar === false) {
        currentSliderPos = ui.position.left;
        if (currentSliderPos > seekbarWidth) currentSliderPos = seekbarWidth;

        $("#sliderVal").css({ width: currentSliderPos + "px" });
        parent.surala.character.stopAllAnimation();

        // Update content based on slider position
        updateContentBasedOnSlider(currentSliderPos);
      }
    },
    stop: function (e, ui) {
      parent.playbuttonClick = true;
      parent.surala.disablecallOut();
      if (slideTutorial.enableSeekbar && currentSliderPos < seekbarLength) {
        onSliderDrag = false;
        currentSliderPos = ui.position.left;
        $("#seekBarSlider").css({ left: currentSliderPos + "px" });
        $("#sliderVal").css({ width: currentSliderPos + "px" });
        updateSlide();
        if (currentSliderPos >= 710 && currentSliderPos < seekbarLength) {
          endSeekbar();
        }
      } else if (currentSliderPos >= seekbarLength) {
        endSeekbar();
      }
    },
  });

  $(".seekBarSlider").draggable("enable");
  playSeekbar();
}

// Update content based on slider position
function updateContentBasedOnSlider(sliderPos) {
  var targetSeq = 1;
  for (var i = 0; i < slideData.slideDuration.length; i++) {
    if (sliderPos < parseFloat(slideData.slideDuration[i].pixVal)) {
      if (i > 0) {
        targetSeq = i;
      } else {
        targetSeq = 1;
      }
      break;
    } else if (i === slideData.slideDuration.length - 1) {
      targetSeq = slideData.slideDuration.length;
    }
  }
  
  // Update content visibility based on target sequence
  updateSlideContent(targetSeq);
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
        ((slideData.slideDuration[i].dur * 1000) / avgPixVal).toFixed(2)
      );
    }
  }
}

// update slide content on seekbar change
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
      
      // Stop all audio and clear current audio ID
      parent.surala.audio.stopAllNonLoopSounds();
      currentAudioId = null;

      // Update content based on new sequence
      updateSlideContent(seqNo - 1);

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

function endSeekbar() {
  parent.surala.character.stopAllAnimation();
  onSliderDrag = false;
  currentSliderPos = seekbarLength;
  clearTimeout(seekBarTimer);
  $("#seekBarSlider").css({ left: currentSliderPos + "px" });
  $("#sliderVal").css({ width: currentSliderPos + "px" });
  $("#seekBarSlider").css("cursor", "default");
  parent.surala.audio.stopAllNonLoopSounds();
  currentAudioId = null;

  setTimeout(function () {
    parent.surala.audio.stopAllNonLoopSounds();
    parent.surala.slideNavigation.blinkNextBtn(true);
    parent.surala.slideNavigation.playStatus = "pause";
    parent.surala.slideNavigation.playPause();
    seekBarStatus = "ended";
    /* speed control */
    parent.$(".lecture-controls-box").css("pointer-events", "none");
    updateSlideContent(totalSequence);
    currentSliderPos = 0;
    seqNo = 1;
  }, 50);
}

// UI play/pause method
function playSlide(playStatus) {
  if (playStatus === "play") {
    if (!slideTutorial.enableSeekbar || pauseSeekbar) {
      slideTutorial.enableSeekbar = true;
      pauseSeekbar = false;
      clearTimeout(seekBarTimer);
      $(".seekBarSlider").draggable("enable");
      playSeekbar();
    }
    setTimeout(function () {
      sliderChanged = false;
      slideSequence(seqNo);
    }, 50);
    seekBarStatus = "inprogress";
    disableSeekBar = false;
    parent.surala.audio.stopAllNonLoopSounds();
    currentAudioId = null;
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

function seekBarDisable() {
  $(".seekBarSlider").draggable("disable");
  disableSeekBar = true;
}

function playSeekbar() {
  try {
    clearTimeout(seekBarTimer);

    /* Speed Control - Start */
    var audioRate = parent.lectureControls.playbackRate;
    var timeOutDur = parseFloat(
      ((totalDuration * 1000) / seekbarLength).toFixed(2)
    );
    if (audioRate != "") {
      if (audioRate == 0.5 || audioRate == 0.75) {
        timeOutDur = timeOutDur + timeOutDur * audioRate;
      } else {
        timeOutDur = timeOutDur / audioRate;
      }
    }
    /* Speed Control - End */

    var pixMoveDur = 5;
    if (!parent.surala.support.webAudio) {
      pixMoveDur = 5.16;
    }
    $("#seekBarSlider").css("cursor", "pointer");
    seekBarTimer = setTimeout(function () {
      // speed control disable on seekbar pause 08 April 2021
      if (pauseSeekbar) {
        $(".lecture-controls-box", window.parent.document).css({
          "pointer-events": "none",
          opacity: "0.5",
        });
      } else {
        $(".lecture-controls-box", window.parent.document).css({
          "pointer-events": "auto",
          opacity: "1",
        });
      }

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
        /* speed control */
        parent.$(".lecture-controls-box").css("pointer-events", "none");
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