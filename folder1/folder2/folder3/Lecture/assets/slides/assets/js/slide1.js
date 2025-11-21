/* ==============================================================
   slide1.js –  Jumlah sudut segitiga (180°)
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
var answerSubmitted = false; // Track if if the question in seq 2 has been answered
var userPreviousAnswer = ""; // Store the user's last submitted answer
var isCorrect = false; // Store the correctness of the last submitted answer

// ---------- INIT ----------
function init() {
    'use strict';
    // Ensure parent objects exist before calling methods
    if (parent && parent.surala && parent.surala.audio) {
        parent.surala.audio.stopAllNonLoopSounds();
    }
    
    // Initialize drag and drop functionality
    initDragAndDrop();
    
    // Assume slideManager and slideTutorial are defined globally or imported
    slideManager = slideManager(); 
    slideTutorial = slideTutorial;

    if (parent && parent.surala) {
        parent.surala.slideDuration = [];
        parent.surala.durationIndex = 0;
    }
    if (slideTutorial) {
        slideTutorial.enableSeekbar = true;
    }
    
    $('#correctAnswerDisplay').css('display', 'none');
    $('.feedback').css('visibility', 'hidden'); // Ensure feedback is hidden initially

    $.ajax({
        dataType: "json",
        url: preloaditems.jsonURL,
        success: function (data) {
            slideData = data.surala;
            preloaditems.sounds = slideData.sounds;
            preloaditems.images = slideData.images;
            preloaditems.content = slideData.content;

            if (slideManager) {
                slideManager.preLoadFromList(
                    preloaditems.images,
                    preloaditems.sounds,
                    addContent,
                    slideManager.progressBar
                );
            } else {
                addContent(); 
            }
        }
    });
}

// Initialize drag and drop functionality
function initDragAndDrop() {
    // Make choices draggable
    $('.choice').attr('draggable', true);
    
    // Add event listeners for drag and drop
    $('.choice').on('dragstart', function(e) {
        e.originalEvent.dataTransfer.setData('text/plain', $(this).text().trim());
        $(this).addClass('dragging');
    });
    
    $('.choice').on('dragend', function(e) {
        $(this).removeClass('dragging');
    });
    
    // Add event listeners for drop zones
    $('[class^="dropzone-"]').each(function() {
        // Add dragover event
        $(this).on('dragover', function(e) {
            e.preventDefault();
            $(this).css('border', '2px dashed #000');
        });
        
        // Add dragleave event
        $(this).on('dragleave', function(e) {
            e.preventDefault();
            $(this).css('border', '2px dashed #888');
        });
        
        // Add drop event
        $(this).on('drop', function(e) {
            e.preventDefault();
            $(this).css('border', '2px dashed #888');
            
            var data = e.originalEvent.dataTransfer.getData('text/plain');
            var dropZone = $(this);
            
            // Clear the drop zone
            dropZone.empty();
            
            // Add the dragged element to the drop zone
            dropZone.text(data);
            
            // Store the answer in data attribute for validation
            dropZone.attr('data-dropped', data);
        });
    });
}

// Function to validate answers
function validateAnswers() {
    var correctAnswers = {
        'dropzone-1': 'Segitiga',
        'dropzone-2': 'Lingkaran',
        'dropzone-3': 'Persegi Panjang',
        'dropzone-4': 'Juring',
        'dropzone-5': 'Persegi'
    };
    
    var allCorrect = true;
    var results = {};
    
    for (var dropzone in correctAnswers) {
        var droppedValue = $('#' + dropzone).attr('data-dropped') || '';
        var isCorrect = droppedValue === correctAnswers[dropzone];
        
        results[dropzone] = {
            dropped: droppedValue,
            correct: correctAnswers[dropzone],
            isCorrect: isCorrect
        };
        
        if (!isCorrect) {
            allCorrect = false;
        }
    }
    
    return {
        allCorrect: allCorrect,
        results: results
    };
}

// Function to reset drag and drop
function resetDragAndDrop() {
    $('[class^="dropzone-"]').each(function() {
        $(this).empty();
        $(this).removeAttr('data-dropped');
    });
}

// Expose functions for external use
window.validateAnswers = validateAnswers;
window.resetDragAndDrop = resetDragAndDrop;

// ---------- AFTER PRELOAD ----------
function addContent() {
    'use strict';
    if (parent) parent.preloadStatus = true;

    // ----- LMS RE-ENTRY -----
    if (parent && parent.flash_problem_num !== undefined) {
        var flash_answer = parent.flash_answer;
        var flash_success = parent.flash_success;
        currentQnNo = parseInt(parent.flash_problem_num.split('-')[1]);
        userPreviousAnswer = flash_answer;
        answerSubmitted = true;
        isCorrect = (flash_success == "1");

        $('.seekBar,.seekBarSlider').hide();
        showLMSFeedback();
        return;
    }

    // ----- NORMAL START -----
    if (slideData && slideData.slideDuration) {
        totalSequence = totalAudios = slideData.slideDuration.length;
        totalDuration = 0;
        for (var i = 0; i < totalAudios; i++) {
            totalDuration += parseFloat(parseFloat(slideData.slideDuration[i].dur).toFixed(2));
        }
        totalDuration = parseFloat(totalDuration.toFixed(2));
    }
    
    if (typeof setpixVal === 'function') setpixVal(totalDuration);
    
    setTimeout(() => {
        if (typeof seekBarEnable === 'function') seekBarEnable();
        slideSequence(1);
        if (parent && parent.surala && parent.surala.slideNavigation) {
            parent.surala.slideNavigation.playPauseState = true;
        }
    }, 100);
}

/* ==============================================================
   LMS RE-ENTRY (show previous answer + feedback)
   ============================================================== */
function showLMSFeedback() {
    $('.display1').css('visibility', 'visible');
    
    // Set answer box state based on stored data
    $('#answerBox').val(userPreviousAnswer);
    updateAnswerBoxUI(isCorrect, userPreviousAnswer);

    $('#judgement_btn').prop('disabled', true).css('cursor', 'default');
    
    setTimeout(() => {
        if (isCorrect) $('#correctFB').css('visibility', 'visible');
        else          $('#wrongFB').css('visibility', 'visible');
        
        disableActivity();
        if (!isCorrect) {
            $('#correctAnswerDisplay').css('display', 'block');
        }
    }, 300);
}

/* ==============================================================
   SEQUENCE (audio + show elements)
   ============================================================== */
var previousSeqNo = 0;
function slideSequence(seq) {
    // Prevent re-triggering if already in this sequence unless explicitly clicked (play button)
    if (previousSeqNo === seq && !parent.playbuttonClick) return; 
    
    previousSeqNo = seq;
    parent.playbuttonClick = false;
    seqNo = seq;

    // Stop all audio and animations before starting the new sequence
    if (parent.surala && parent.surala.audio) parent.surala.audio.clearAllSounds();
    if (parent.surala && parent.surala.character) {
        parent.surala.character.stopAllAnimation();
        parent.surala.character.teacherTalk(true);
    }
    if (parent.surala && parent.surala.slideNavigation) {
        parent.surala.slideNavigation.blinkNextBtn(false);
    }
    if (parent.surala) parent.surala.disablecallOut();

    // Update UI state based on the new sequence number (This is the seekbar fix entry point)
    updateContentForSequence(seq);

    // Skip audio playback if the slide change was caused by the seekbar being dragged
    if (sliderChanged) {
        sliderChanged = false;
        return; 
    }

    switch (seq) {
        case 1:
            if (parent.surala && parent.surala.audio) {
                parent.surala.audio.playSound('IPM_S10L04u09_007', null, () => {
                    slideSequence(seq + 1);
                });
            }
            break;

        case 2:
            if (parent.surala && parent.surala.audio) {
                parent.surala.audio.playSound('IPM_S10L04u010_005', null, () => {
                    slideSequence(seq + 1);
                });
            }
            break;

        case 3:
            // Only proceed if answered, or if seeking past it (handled by updateContentForSequence)
            if (!answerSubmitted && seqNo < 3) return; 

            if (parent.surala && parent.surala.audio) {
                parent.surala.audio.playSound('IPM_S10L04u010_006', null, () => {
                    slideSequence(seq + 1);
                });
            }
            break;

        case 4:
            if (parent.surala && parent.surala.audio) {
                parent.surala.audio.playSound('IPM_S10L04u010_S001', null, () => {
                    slideSequence(seq + 1);
                });
            }
            break;

        case 5:
            if (parent.surala && parent.surala.audio) {
                parent.surala.audio.playSound('IPM_S10L04u010_007', null, () => {
                    slideSequence(seq + 1);
                });
            }
            break;

        case 6:
            if (parent.surala && parent.surala.character) {
                 parent.surala.character.teacherTalk(false);
            }
            if (parent.surala && parent.surala.audio) {
                parent.surala.audio.playSound('IPM_S10L04u010_008', null, () => {
                    // Continue to next sequence instead of ending
                    slideSequence(seq + 1);
                });
            }
            break;
            
        case 7:
            // Show display1 before playing audio
            $('.display1').css('visibility', 'visible');
            if (parent.surala && parent.surala.audio) {
                parent.surala.audio.playSound('IPM_S10L04u09_012', null, () => {
                    // Stop and wait for user interaction
                    if (!answerSubmitted) enableActivity();
                });
            }
            break;

        case 8:
            // Show display1 before playing audio
            $('.display1').css('visibility', 'visible');
            if (parent.surala && parent.surala.audio) {
                parent.surala.audio.playSound('IPM_S10L04u09_013', null, () => {
                    slideSequence(seq + 1);
                });
            }
            break;

        case 9:
            // Show display1 before playing audio
            $('.display1').css('visibility', 'visible');
            if (parent.surala && parent.surala.audio) {
                parent.surala.audio.playSound('IPM_S10L04u010_009', null, () => {
                    // Correctly ends the seekbar timeline after the last audio
                    seekBarStatus = "ended";
                    disableActivity();
                });
            }
            break;


    }
}

/* ==============================================================
   ACTIVITY (type 180 → Jawab)
   ============================================================== */
function enableActivity() {
    answerBtnClicked = false;
    $('#judgement_btn').prop('disabled', false).addClass('btn_active')
        .off('click').on('click', evaluateActivity);
    
    pauseSeekbar = true;
    if (parent.surala && parent.surala.slideNavigation) {
        parent.surala.slideNavigation.playPauseState = false;
    }
}

function disableActivity() {
    $('#judgement_btn').prop('disabled', true).removeClass('btn_active');
    // Note: pauseSeekbar is managed in evaluateActivity/seekbar functions, not here.
}

function updateAnswerBoxUI(correct, userAns) {
    // This function sets the visual state of the answer box
    var ansBoxStyle = {
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-size': 'contain'
    };
    
    if (correct) {
        ansBoxStyle['background-image'] = 'url(../../../../../../common/CeylonSoft/re_primarymath_ind/images/correct1.png)';
        $('#correctAnswerDisplay').css('display', 'none');
    } else {
        ansBoxStyle['background-image'] = 'url(../../../../../../common/CeylonSoft/re_primarymath_ind/images/wrong1.png)';
        $('#correctAnswerDisplay').css('display', 'block');
    }
    
    // Apply visual feedback to drop zones
    $('[class^="dropzone-"]').each(function() {
        var dropzoneClass = $(this).attr('class').split(' ')[0]; // Get the dropzone class
        var correctAnswer = $(this).attr('data-answer');
        var droppedAnswer = $(this).attr('data-dropped');
        
        if (correct) {
            $(this).css('border', '2px solid green');
        } else if (droppedAnswer) {
            if (correctAnswer === droppedAnswer) {
                $(this).css('border', '2px solid green');
            } else {
                $(this).css('border', '2px solid red');
            }
        }
    });
    
    $('#answerBox').css(ansBoxStyle);
    $('#answerBox').val(userAns);
}

/* ---------- JUDGEMENT ---------- */
function evaluateActivity() {
    if (answerBtnClicked) return;
    answerBtnClicked = true;
    answerSubmitted = true; 

    // Validate drag and drop answers
    var validationResult = validateAnswers();
    var correct = validationResult.allCorrect;
    
    // Store results
    userPreviousAnswer = "Drag and Drop Activity"; // Placeholder since we're not storing individual answers
    isCorrect = correct;

    // ----- UI -----
    disableActivity(); 
    
    $('.feedback').css('visibility', 'hidden');
    if (correct) {
        $('#correctFB').css('visibility', 'visible');
    } else {
        $('#wrongFB').css('visibility', 'visible');
    }
    
    // Update UI based on correctness
    updateAnswerBoxUI(correct, userPreviousAnswer);

    // ----- AUDIO / ANIMATION -----
    if (parent.surala && parent.surala.character) {
        parent.surala.character.animate('student', correct ? 'correct' : 'wrong', () => {
            parent.surala.character.animate('student', correct ? 'correct_stop' : 'wrong_stop');
        });
        parent.surala.character.animate('teacher', correct ? 'correct' : 'wrong', () => {
            parent.surala.character.animate('teacher', correct ? 'correct_speak' : 'wrong_speak');
        });
    }
    
    var feedbackSound = correct ? 'MG_benar_02' : 'MG_salah_07';
    if (parent.surala && parent.surala.audio) {
        parent.surala.audio.playSound(feedbackSound, null, () => {
            if (sliderChanged) { sliderChanged = false; return; }
            
            // Resume the seekbar timer and navigation state
            pauseSeekbar = false;
            if (parent.surala.slideNavigation) {
                parent.surala.slideNavigation.playPauseState = true;
            }
            if (typeof playSeekbar === 'function') playSeekbar(); 
            
            // After resuming the seekbar, call the next sequence
            slideSequence(8); // Continue to case 8
        });
    }

    /* -- LMS code | sending result to LMS -- */
    var activityNo = "slide1" + '-' + currentQnNo;
    var param = {
        flash_problem_num: activityNo,
        flash_answer: correct ? "Correct" : "Incorrect",
        type: 'lecture_answer',
        flash_count: 1,
        flash_success: correct ? 1 : 0
    };

    if (typeof setMain === 'function') setMain(activityNo, param);
    if (typeof sendMassage === 'function') sendMassage(studyLogUrl, param, false);
}

/* ==============================================================
   CONTENT SHOW/HIDE (Seekbar Synchronization)
   ============================================================== */

// Helper to update the visual state based on the sequence number.
function updateContentForSequence(targetSeq) {
    // 1. Reset all sequence-specific content visibility
    $(".display1, .display2, .display3").css("visibility", "hidden");
    $('.feedback').css('visibility', 'hidden');
    $('#correctAnswerDisplay').css('display', 'none');
    disableActivity();

    // Reset answer box to allow new input unless already answered
    if (!answerSubmitted) {
        $('#answerBox').val('').css('background-image', 'none');
    }

    // 2. Sequentially show content up to the target sequence
    for (let i = 1; i <= targetSeq; i++) {
        showcontent(i);
    }
    
    // 3. Apply state for answered question (Seq 2) if seeking past it (Seq 3, 4, 5, 6)
    if (targetSeq >= 3 && answerSubmitted) {
        // Show the answer/feedback state and ensure activity is disabled
        $('#answerBox').val(userPreviousAnswer);
        updateAnswerBoxUI(isCorrect, userPreviousAnswer);
        if (isCorrect) $('#correctFB').css('visibility', 'visible');
        else          $('#wrongFB').css('visibility', 'visible');
        disableActivity();
    }
}


// Show content for a sequence number. Called when seeking *forward* to this point.
function showcontent(num) {
    if (parent.surala) parent.surala.disablecallOut();
    switch (num) {
        case 1:

            break;
        case 2:
          
            
            break;
        case 3:
            // Show content from D1 (implicit from earlier showcontent) and D2
            
            break;
        case 4:
            // D1 and D2 should already be visible

            break;
        case 5:
            // Show content from D3
          
            break;
        case 6:
            // Ensure all content is visible
           
            break;
        case 7:
            // Show display1
            $('.display1').css('visibility', 'visible');
            break;
        case 8:
            // Show display1
            $('.display1').css('visibility', 'visible');
            break;
        case 9:
            // Show display1
            $('.display1').css('visibility', 'visible');
            break;
    }
}

// Hide content for a sequence number. Called when seeking *backward* from this point.
function hidecontent(num) {
    // Note: This is primarily used to reset complex states when moving backward.
    switch (num) {
        case 1:
            break;
        case 2:
            // When seeking backward past the question (Seq 2): Reset the answer state
            $('.feedback').css('visibility', 'hidden');
            $('#correctAnswerDisplay').css('display', 'none');
            // Reset drag and drop activity
            resetDragAndDrop();
            $('#answerBox').val('').css('background-image', 'none');
            answerSubmitted = false;
            isCorrect = false;
            userPreviousAnswer = "";
            disableActivity();
            break;
        case 3:
            $(".display2").css("visibility", "hidden");
            break;
        case 5:
            $(".display3").css("visibility", "hidden");
            break;
        case 7:
            // No specific hide action needed for sequence 7
            break;
        case 8:
            // No specific hide action needed for sequence 8
            break;
        case 9:
            // No specific hide action needed for sequence 9
            break;
        default:
            break;
    }
}

















/* ==============================================================
   CLEAN-UP
   ============================================================== */
window.onunload = function () {
    if (parent.surala) {
        parent.surala.disablecallOut();
        parent.surala.audio.stopAllNonLoopSounds();
        parent.surala.character.stopAllAnimation();
    }
};

window.evaluateActivity = evaluateActivity;
window.showcontent = showcontent;
window.hidecontent = hidecontent;
window.updateContentForSequence = updateContentForSequence; // Expose this for external seekbar handler

$(document).ready(function() {
    if (parent.flash_problem_num === undefined) {
        $('#judgement_btn').off('click').on('click', evaluateActivity);
    }
});