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
var totalSequence = 0;
var totalAudios = 0;
var sliderChanged = false;
var pauseSeekbar = false;
var seekBarStatus = "inprogress"; // Default value, will be updated by parent
var answerSubmitted = false; // Track if answer has been submitted
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
    totalSequence = totalAudios = slideData.slideDuration.length;
    totalDuration = 0; // Reset totalDuration
    for (var i = 0; i < totalAudios; i++) {
        totalDuration += parseFloat(parseFloat(slideData.slideDuration[i].dur).toFixed(2));
    }
    totalDuration = parseFloat(totalDuration.toFixed(2));
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
    // Block sequence progression until answer is submitted for cases after the question is shown
    if ((seq === 3 || seq === 4 || seq === 5 ) && !answerSubmitted) {
        return;
    }
    
    if (previousSeqNo === seq && !parent.playbuttonClick) return;
    previousSeqNo = seq;
    parent.playbuttonClick = false;
    seqNo = seq;

    parent.surala.disablecallOut();
    parent.surala.character.stopAllAnimation();
    parent.surala.character.teacherTalk(true);
    parent.surala.slideNavigation.blinkNextBtn(false);

    switch (seq) {
        case 1:
            parent.surala.audio.playSound('IPM_S10L01u05_005', null, () => {
                slideSequence(seq + 1);
            });
            break;

        case 2:
            $('.display1').css('visibility', 'visible');
            enableActivity();
            parent.surala.audio.playSound('IPM_S10L01u05_006', null, () => {
                // Do not automatically advance - wait for user answer
            });
            break;

        case 3:
            $('.display2').css('visibility', 'visible');
            parent.surala.audio.playSound('IPM_S10L01u05_007', null, () => {
                slideSequence(seq + 1);
            });
            break;

        case 4:
            parent.surala.audio.playSound('IPM_S10L01u05_008', null, () => {
                slideSequence(seq + 1);
            });
            break;

        case 5:
            $('.display3').css('visibility', 'visible');
            parent.surala.audio.playSound('IPM_S10L01u05_009', null, () => {
                slideSequence(seq + 1);
            });
            break;

        case 6:
            parent.surala.character.teacherTalk(false);
            parent.surala.audio.playSound('IPM_S10L01u05_010', null, () => {
                // Last slide – no next call
            });
            break;
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
    
    // Pause the seekbar when activity is enabled
    pauseSeekbar = true;
    parent.surala.slideNavigation.playPauseState = false;
}

function disableActivity() {
    $('#answerBox').prop('disabled', true);
    $('#judgement_btn').prop('disabled', true).removeClass('btn_active');
}

/* ---------- JUDGEMENT ---------- */
function evaluateActivity() {
    if (answerBtnClicked) return;
    answerBtnClicked = true;
    answerSubmitted = true; // Mark that answer has been submitted

    var userAns = $.trim($('#answerBox').val());
    var correct = (userAns === "180");

    // ----- UI -----
    // Keep the answer box visible and disable it, but don't clear the user's answer
    $('#answerBox').prop('disabled', true);
    $('#judgement_btn').prop('disabled', true).removeClass('btn_active');
    
    $('.feedback').css('visibility', 'hidden');
    if (correct) $('#correctFB').css('visibility', 'visible');
    else         $('#wrongFB').css('visibility', 'visible');

    if (correct) {
        // For correct answer, show the correct PNG as background but keep the typed answer
        $('#answerBox').css({
            'background-image': 'url(../../../../../../common/CeylonSoft/re_primarymath_ind/images/correct1.png)',
            'background-repeat': 'no-repeat',
            'background-position': 'center',
            'background-size': 'contain'
        });
        
        // Don't show the correct answer text under the box for correct answers
        $('#correctAnswerDisplay').css('display', 'none');
    } else {
        // For wrong answer, show the wrong PNG as background and keep it, keep the typed answer
        $('#answerBox').css({
            'background-image': 'url(../../../../../../common/CeylonSoft/re_primarymath_ind/images/wrong1.png)',
            'background-repeat': 'no-repeat',
            'background-position': 'center',
            'background-size': 'contain'
        });
        
        // Show the correct answer text under the box (but never show correct PNG in box for wrong answers)
        $('#correctAnswerDisplay').css('display', 'block');
    }

    // ----- AUDIO / ANIMATION -----
    parent.surala.character.animate('student', correct ? 'correct' : 'wrong', () => {
        parent.surala.character.animate('student', correct ? 'correct_stop' : 'wrong_stop');
    });
    parent.surala.character.animate('teacher', correct ? 'correct' : 'wrong', () => {
        parent.surala.character.animate('teacher', correct ? 'correct_speak' : 'wrong_speak');
    });
    
    // Play the feedback sound only once
    var feedbackSound = correct ? 'MG_benar_02' : 'MG_salah_07';
    parent.surala.audio.playSound(feedbackSound, null, () => {
        // After the feedback sound finishes
        if (sliderChanged) { sliderChanged = false; return; }
        
        // If wrong answer, show the correct answer
        if (!correct) {
            showCorrectAnswer();
        }
        
        // Resume the seekbar after answer is processed
        pauseSeekbar = false;
        parent.surala.slideNavigation.playPauseState = true;
        playSeekbar();
        
        // Continue with the sequence from case 3
        slideSequence(3);
    });




   /* -- LMS code | sending result to LMS -- */
    var activityNo = "slide1" + '-' + currentQnNo;
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
function showCorrectAnswer() {
   
    //  only show the correct answer text, 
    $('#correctAnswerDisplay').css('display', 'block');
}

function showcontent(num) {
  parent.surala.disablecallOut();
  switch (num) {
      case 1:
          // Show display1 only (question)
          $('.display1').css('visibility', 'visible');
          break;
      case 2:
          // Show display1 and enable activity
          $('.display1').css('visibility', 'visible');
          if (seekBarStatus !== "ended") {
              answerBtnClicked = false;
              enableActivity();
          }
          break;
      case 3:
          // Show display1 and display2
          $('.display1').css('visibility', 'visible');
          $('.display2').css('visibility', 'visible');
          break;
      case 4:
          // Just play audio, no UI changes
          break;
      case 5:
          // Show display1, display2, and display3
          $('.display1').css('visibility', 'visible');
          $('.display2').css('visibility', 'visible');
          $('.display3').css('visibility', 'visible');
          break;
      case 6:
          // End of sequence
          $('.display1').css('visibility', 'visible');
          break;
  }
}

function hidecontent(num) {
  switch (num) {
      case 1:
          $(".display1").css("visibility", "hidden");
          break;
      case 2:
          $(".display2").css("visibility", "hidden");
          break;
      case 3:
          $(".display3").css("visibility", "hidden");
          break;
      case 4:
          break;
      case 5:
          break;
      case 6:
          $(".display1").css("visibility", "hidden");
          break;
      default:
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
