// preload items declaration + json
var preloaditems = {
  images: [],
  sounds: null,
  jsonURL: "./assets/data/slide2.json",
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
var answerSubmittedInCase2 = false;
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
            $('.display01').css("visibility", "visible");
            if (parent.surala && parent.surala.audio) {
                parent.surala.audio.playSound('IPM_S10L03u03_034', null, function() {
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
          // Show display2 during second audio and enable answer selection
          
          $('.display01, .display2').css("visibility", "visible");
          
          // Reset shapes and answer state for seekbar navigation
          if (pauseSeekbar || sliderChanged) {
              answerSubmittedInCase2 = false;
              // Remove selected class from all shapes
              const shapeMap = {
                  "A": "shape1-img",
                  "B": "shape2-img", 
                  "C": "shape3-img",
                  "D": "shape4-img",
                  "E": "shape5-img"
              };
              // Reset all shapes regardless of selectedShapes array
              Object.values(shapeMap).forEach(imgClass => {
                  let imgElements = document.getElementsByClassName(imgClass);
                  if (imgElements.length > 0) {
                      imgElements[0].classList.remove("selected");
                      let letterBox = imgElements[0].parentElement.querySelector('.letter-box');
                      if (letterBox) {
                          letterBox.classList.remove("selected");
                      }
                  }
              });
              selectedShapes = [];
              // Clear feedback images
              ['A', 'B', 'C', 'D', 'E'].forEach(shape => {
                  let feedback = document.getElementById("feedback" + shape);
                  if (feedback) {
                      feedback.style.display = "none";
                  }
              });
          }
          
          // Enable shape selection and judgement button during case 2 audio
          setTimeout(function() {
              if (!pauseSeekbar) {
                  $("#judgement_btn").css('pointer-events', 'auto').css('cursor', 'pointer');
                  $('#judgement_btn').addClass('btn_active');
                  // Attach click handler for case 2 answer evaluation
                  $('#judgement_btn').off('click').on('click', function(e) {
                      e.preventDefault();
                      evaluateCase2Answer();
                  });
              }
          }, 500);
          
          parent.surala.audio.playSound('IPM_S10L03u03_035', null, function() {
            if (sliderChanged) {
                sliderChanged = false;
            } else if (!answerSubmittedInCase2) {
                // If no answer submitted, PAUSE seekbar and wait for answer
                pauseSeekbar = true;
                parent.surala.slideNavigation.blinkNextBtn(false);
            }
            // If answer was submitted, the evaluateCase2Answer function will handle progression to case 3 and 4
          });
          break;
      case 3:
          // Hide display2 and continue with third audio
      
          $('.display01, .display2').css("visibility", "visible");
          
          // Reset answer state when navigating via seekbar
          if (pauseSeekbar || sliderChanged) {
              answerSubmittedInCase2 = false;
              // Remove selected class from all shapes
              const shapeMap = {
                  "A": "shape1-img",
                  "B": "shape2-img", 
                  "C": "shape3-img",
                  "D": "shape4-img",
                  "E": "shape5-img"
              };
              // Reset all shapes regardless of selectedShapes array
              Object.values(shapeMap).forEach(imgClass => {
                  let imgElements = document.getElementsByClassName(imgClass);
                  if (imgElements.length > 0) {
                      imgElements[0].classList.remove("selected");
                      let letterBox = imgElements[0].parentElement.querySelector('.letter-box');
                      if (letterBox) {
                          letterBox.classList.remove("selected");
                      }
                  }
              });
              selectedShapes = [];
          }
          
          // Add blinking outline to yellow-box during case 3 audio
          var blinkInterval = setInterval(function() {
              $('.yellow-box').toggleClass('blink-outline');
          }, 500);
          
          parent.surala.audio.playSound('IPM_S10L03u03_036', null, function() {
            // Stop blinking when audio ends
            clearInterval(blinkInterval);
            $('.yellow-box').removeClass('blink-outline');
            
            if (sliderChanged) {
                sliderChanged = false;
            } else {
                seqNo = 4;
                slideSequence(seqNo);
            }
          });
          break;
      case 4:
           
              $('.display01, .display2').css("visibility", "visible");
          parent.surala.audio.playSound('IPM_S10L03u03_037', null, function() {
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
  switch (num) {
      case 1:
          $('.display01').css("visibility", "visible");
          break;
      case 2:
          $('.display01, .display2').css("visibility", "visible");
          if (seekBarStatus !== "ended") {
              answerSubmittedInCase2 = false;
              // Remove selected class from all shapes
              const shapeMap = {
                  "A": "shape1-img",
                  "B": "shape2-img", 
                  "C": "shape3-img",
                  "D": "shape4-img",
                  "E": "shape5-img"
              };
              // Reset all shapes regardless of selectedShapes array
              Object.values(shapeMap).forEach(imgClass => {
                  let imgElements = document.getElementsByClassName(imgClass);
                  if (imgElements.length > 0) {
                      imgElements[0].classList.remove("selected");
                      let letterBox = imgElements[0].parentElement.querySelector('.letter-box');
                      if (letterBox) {
                          letterBox.classList.remove("selected");
                      }
                  }
              });
              selectedShapes = [];
              // Reset button state and remove old click handlers
              $('#judgement_btn').off('click');
              $('#judgement_btn').css('pointer-events', 'none').css('cursor', 'default');
              $('#judgement_btn').removeClass('btn_active');
          }
          break;
      case 3:
          $('.display01, .display2').css("visibility", "visible");
          break;
      case 4:
          $('.display01, .display2').css("visibility", "visible");
          break;
  }
}


function hidecontent(num) {
  switch (num) {
      case 1:
          $('.display01').css("visibility", "hidden");
          break;
      case 2:
          $('.display01, .display2').css("visibility", "hidden");
          // Clear feedback images when hiding display2
          const feedbackIds = ['A', 'B', 'C', 'D', 'E'];
          feedbackIds.forEach(id => {
              let feedback = document.getElementById("feedback" + id);
              if (feedback) {
                  feedback.style.display = "none";
              }
          });
          // Reset selected shapes and outlines
          const shapeMap = {
              "A": "shape1-img",
              "B": "shape2-img", 
              "C": "shape3-img",
              "D": "shape4-img",
              "E": "shape5-img"
          };
          Object.values(shapeMap).forEach(imgClass => {
              let imgElements = document.getElementsByClassName(imgClass);
              if (imgElements.length > 0) {
                  imgElements[0].classList.remove("selected");
                  let letterBox = imgElements[0].parentElement.querySelector('.letter-box');
                  if (letterBox) {
                      letterBox.classList.remove("selected");
                  }
              }
          });
          selectedShapes = [];
          answerSubmittedInCase2 = false;
          break;
      case 3:
          $('.display01, .display2').css("visibility", "hidden");
          break;
      case 4:
          $('.display01, .display2').css("visibility", "hidden");
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
          
          // Position the feedback image
          const shapeMap = {
              "A": "shape1-img",
              "B": "shape2-img", 
              "C": "shape3-img",
              "D": "shape4-img",
              "E": "shape5-img"
          };
          let imgClass = shapeMap[shape];
          let imgElements = document.getElementsByClassName(imgClass);
          
          if (imgElements.length > 0) {
              let img = imgElements[0];
              let rect = img.getBoundingClientRect();
              feedback.style.left = (rect.left + window.scrollX + rect.width - 50) + "px";
              feedback.style.top = (rect.top + window.scrollY - 25) + "px";
              feedback.style.display = "block";
              feedback.style.width = "50px";
              feedback.style.height = "50px";
          }
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

// Shape selection and feedback functionality
var selectedShapes = [];

document.addEventListener("DOMContentLoaded", function () {
    // shape IDs mapped to image classes
    const shapeMap = {
        "A": "shape1-img",
        "B": "shape2-img", 
        "C": "shape3-img",
        "D": "shape4-img",
        "E": "shape5-img"
    };

    // correct answers (C and D correspond to shape3-img and shape4-img)
    const correctAnswers = ["C", "D"];

    // user selected shapes - now using global variable
    // let selectedShapes = [];

    // Add feedback image containers to the DOM
    Object.keys(shapeMap).forEach(shape => {
        let feedbackImg = document.createElement("img");
        feedbackImg.id = "feedback" + shape;
        feedbackImg.style.position = "absolute";
        feedbackImg.style.display = "none";
        feedbackImg.style.zIndex = "1000";
        document.body.appendChild(feedbackImg);
    });

    // Add click event listeners to shape images
    Object.keys(shapeMap).forEach(shape => {
        let imgClass = shapeMap[shape];
        let imgElements = document.getElementsByClassName(imgClass);
        
        if (imgElements.length > 0) {
            let img = imgElements[0];
            
            img.addEventListener("click", function () {
                // Get the corresponding letter box
                let letterBox = img.parentElement.querySelector('.letter-box');
                
                // If already selected → unselect
                if (img.classList.contains("selected")) {
                    img.classList.remove("selected");
                    if (letterBox) {
                        letterBox.classList.remove("selected");
                    }
                    selectedShapes = selectedShapes.filter(s => s !== shape);
                    return;
                }

                // limit selection to 2
                if (selectedShapes.length >= 2) {
                    return; // stop extra selection
                }

                // Add yellow outline to indicate selection
                img.classList.add("selected");
                if (letterBox) {
                    letterBox.classList.add("selected");
                }
                selectedShapes.push(shape);
            });
        }
    });

    // RESULT BUTTON - delegate to evaluateCase2Answer function
    let judgementBtn = document.getElementById("judgement_btn");
    if (judgementBtn) {
        judgementBtn.removeEventListener("click", arguments.callee);
        // Note: The actual click handler is attached in slideSequence case 2
        // This DOMContentLoaded listener is kept for compatibility
    }
});

window.onunload = function() {
  parent.surala.disablecallOut();
  parent.surala.audio.stopAllNonLoopSounds();
  parent.surala.character.stopAllAnimation();
};