/* ==============================================================
   slide1.js  –  Jumlah sudut segitiga (180°)
   ============================================================== */

// ---------- PRELOAD ----------
var preloaditems = {
    images: [],
    sounds: null,
    jsonURL: "./assets/data/slide1.json",
    content: null
};

window.onload = init;

// ---------- LMS TRACKING ----------
var slideTutorial, slideManager;
var slideData = null;
var currentQnNo = 1;
var answerBtnClicked = false;
var totalDuration = 0;
var seqNo = 0;
// seekBarStatus should be defined in the parent scope

// ---------- INIT ----------
function init() {
    'use strict';
    parent.surala.audio.stopAllNonLoopSounds();
    slideManager = slideManager();
    slideTutorial = slideTutorial;

    parent.surala.slideDuration = [];
    parent.surala.durationIndex = 0;
    slideTutorial.enableSeekbar = true;
    
    // Hide the correct answer display by default when the page loads
    $('#correctAnswerDisplay').css('display', 'none');

    $.ajax({
        dataType: "json",
        url: preloaditems.jsonURL,
        success: function (data) {
            slideData = data.surala;
            preloaditems.sounds = slideData.sounds;
            preloaditems.images = slideData.images;
            preloaditems.content = slideData.content;

            slideManager.preLoadFromList(
                preloaditems.images,
                preloaditems.sounds,
                addContent,
                slideManager.progressBar
            );
        }
    });
}

// ---------- AFTER PRELOAD ----------
function addContent() {
    'use strict';
    parent.preloadStatus = true;

    // ----- LMS RE-ENTRY -----
    if (parent.flash_problem_num !== undefined) {
        flash_answer  = parent.flash_answer;
        flash_success = parent.flash_success;
        currentQnNo   = parseInt(parent.flash_problem_num.split('-')[1]);
        $('.seekBar,.seekBarSlider').hide();
        showLMSFeedback();
        return;
    }

    // ----- NORMAL START -----
    totalDuration = slideData.slideDuration.reduce((s, o) => s + parseFloat(o.dur), 0);
    setpixVal(totalDuration);
    setTimeout(() => {
        seekBarEnable();
        slideSequence(1);
        parent.surala.slideNavigation.playPauseState = true;
    }, 100);
}

/* ==============================================================
   LMS RE-ENTRY (show previous answer + feedback)
   ============================================================== */
function showLMSFeedback() {
    $('.display1').css('visibility', 'visible');
    $('#answerBox').val(flash_answer).css({
        'background-image': 'none'
    });
    $('#jawabBtn').prop('disabled', true).css('cursor', 'default');

    setTimeout(() => {
        if (flash_success == "1") $('#correctFB').css('visibility', 'visible');
        else                     $('#wrongFB').css('visibility', 'visible');
    }, 300);
}

/* ==============================================================
   SEQUENCE (audio + show elements)
   ============================================================== */
var previousSeqNo = 0;
function slideSequence(seq) {
    if (previousSeqNo === seq && !parent.playbuttonClick) return;
    previousSeqNo = seq;
    parent.playbuttonClick = false;

    parent.surala.disablecallOut();
    parent.surala.character.stopAllAnimation();
    parent.surala.character.teacherTalk(true);
    parent.surala.slideNavigation.blinkNextBtn(false);

    switch (seq) {
        case 1:                     // show question
            $('.display1').css('visibility', 'visible');
            parent.surala.audio.playSound('IPM_S10L04u09_007', null, next);
            break;
        case 2:                     // enable input + button
            enableActivity();
            parent.surala.audio.playSound('IPM_S10L04u09_008', null, next);
            break;
        case 3:                     // (optional extra narration)
            parent.surala.audio.playSound('IPM_S10L04u09_009', null, next);
            break;
        case 4:                     // end
            parent.surala.character.teacherTalk(false);
            parent.surala.audio.playSound('IPM_S10L04u09_010', null, () => {});
            break;
    }
    function next() {
        if (sliderChanged) { sliderChanged = false; return; }
        slideSequence(seq + 1);
    }
}

/* ==============================================================
   ACTIVITY (type 180 → Jawab)
   ============================================================== */
function enableActivity() {
    answerBtnClicked = false;
    $('#answerBox').prop('disabled', false).focus().css({
        'background-image': 'none'
    });
    $('#judgement_btn').prop('disabled', false).addClass('btn_active')
        .off('click').on('click', evaluateActivity);
}
function disableActivity() {
    $('#answerBox').prop('disabled', true);
    $('#judgement_btn').prop('disabled', true).removeClass('btn_active');
}

/* ---------- JUDGEMENT ---------- */
function evaluateActivity() {
    if (answerBtnClicked) return;
    answerBtnClicked = true;

    var userAns = $.trim($('#answerBox').val());
    var correct = (userAns === "180");

    // ----- UI -----
    disableActivity();
    $('.feedback').css('visibility', 'hidden');
    if (correct) $('#correctFB').css('visibility', 'visible');
    else         $('#wrongFB').css('visibility', 'visible');

    if (correct) {
        // For correct answer, show the correct PNG in the input box
        $('#answerBox').val('').css({
            'background-image': 'url(../../../../../../common/CeylonSoft/re_primarymath_ind/images/correct1.png)',
            'background-repeat': 'no-repeat',
            'background-position': 'center',
            'background-size': 'contain'
        });
        
        // Don't show the correct answer text under the box for correct answers
        $('#correctAnswerDisplay').css('display', 'none');
    } else {
        // Show wrong image first for wrong answer
        $('#answerBox').val('').css({
            'background-image': 'url(../../../../../../common/CeylonSoft/re_primarymath_ind/images/wrong1.png)',
            'background-repeat': 'no-repeat',
            'background-position': 'center',
            'background-size': 'contain'
        });
        
        // After a short delay, remove the wrong image and show the correct answer text under the box
        setTimeout(function() {
            // Remove the background image from the input box
            $('#answerBox').css({
                'background-image': 'none'
            });
            
            // Show the correct answer text under the box
            $('#correctAnswerDisplay').css('display', 'block');
        }, 1500); // 1.5 seconds delay
    }

    // ----- AUDIO / ANIMATION -----
    parent.surala.character.animate('student', correct ? 'correct' : 'wrong', () => {
        parent.surala.character.animate('student', correct ? 'correct_stop' : 'wrong_stop');
    });
    parent.surala.character.animate('teacher', correct ? 'correct' : 'wrong', () => {
        parent.surala.character.animate('teacher', correct ? 'correct_speak' : 'wrong_speak');
    });
    parent.surala.audio.playSound(correct ? 'correct' : 'wrong', null, () => {
        if (sliderChanged) { sliderChanged = false; return; }
        playNextAnimation(correct ? slideData.content.question1.audio.correct
                                  : slideData.content.question1.audio.incorrect,
                          !correct);
    });

    // ----- LMS -----
    var activityNo = page + '-' + currentQnNo;
    var param = {
        flash_problem_num: activityNo,
        flash_answer: userAns,
        type: 'lecture_answer',
        flash_count: 1,
        flash_success: correct ? 1 : 0
    };
    setMain(activityNo, param);
    sendMassage(studyLogUrl, param, false);
}

/* ---------- PLAY NEXT AUDIO AFTER FEEDBACK ---------- */
var fbAudio = null;
function playNextAnimation(audio, needShowAnswer) {
    if (fbAudio === audio) return;
    fbAudio = audio;
    parent.surala.audio.playSound(audio, null, () => {
        if (sliderChanged) { sliderChanged = false; return; }
        if (needShowAnswer) showCorrectAnswer();
        slideSequence(4);               // final sequence
        pauseSeekbar = false;
        playSeekbar();
    });
}

function showCorrectAnswer() {
    // Show the correct answer with the correct image
    $('#answerBox').val('').css({
        'background-image': 'url(../../../../../../common/CeylonSoft/re_primarymath_ind/images/correct1.png)',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-size': 'contain'
    });
    
    // Also show the correct answer text under the box
    // NOTE: This function should only be called when we want to explicitly show the correct answer
    // For example, at the end of the lesson or when the user has given a wrong answer
    $('#correctAnswerDisplay').css('display', 'block');
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
              // enableActivity instead of automatically showing answer
              enableActivity();
          }
          break;

      case 8:

          if (seqNo >= 8 && seekBarStatus !== "ended") {

              if (!answerBtnClicked) {
                  // enableButton equivalent - enable activity
                  enableActivity();
              } else {
                  // Only show correct answer if the user gave a wrong answer
                  // We need to check if the answer was wrong before showing the correct answer
                  // For now, we'll hide it by default and let evaluateActivity control it
                  $('#correctAnswerDisplay').css('display', 'none');
              }
          }
          break;
      case 9:
          if (seekBarStatus == "ended") {
              if (answerBtnClicked) {
                  // Only show correct answer if the user gave a wrong answer
                  // We need to check if the answer was wrong before showing the correct answer
                  // For now, we'll hide it by default and let evaluateActivity control it
                  $('#correctAnswerDisplay').css('display', 'none');
              }
              // disableActivity as before
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

/* ==============================================================
   CLEAN-UP
   ============================================================== */
window.onunload = function () {
    parent.surala.disablecallOut();
    parent.surala.audio.stopAllNonLoopSounds();
    parent.surala.character.stopAllAnimation();
};

// Make sure the evaluateActivity function is globally accessible
window.evaluateActivity = evaluateActivity;

// Attach click handler when document is ready
$(document).ready(function() {
    console.log("Document ready, attaching button click handler...");
    
    // Multiple methods to ensure the button works
    
    // Method 1: jQuery click handler
    $('#judgement_btn').off('click').on('click', function(event) {
        console.log("Button clicked via jQuery handler!");
        event.preventDefault();
        evaluateActivity();
    });
    
    // Method 2: Direct JavaScript assignment
    var btn = document.getElementById('judgement_btn');
    if (btn) {
        btn.onclick = function(event) {
            console.log("Button clicked via direct JavaScript!");
            if (event) event.preventDefault();
            evaluateActivity();
        };
    }
    
    // Method 3: Event listener
    if (btn) {
        btn.addEventListener('click', function(event) {
            console.log("Button clicked via event listener!");
            event.preventDefault();
            evaluateActivity();
        });
    }
});

// Also attach the handler after a small delay to ensure DOM is fully loaded
setTimeout(function() {
    console.log("Attaching button handler after delay...");
    var btn = document.getElementById('judgement_btn');
    if (btn) {
        btn.onclick = function(event) {
            console.log("Button clicked via delayed assignment!");
            if (event) event.preventDefault();
            evaluateActivity();
        };
    }
}, 1000);
