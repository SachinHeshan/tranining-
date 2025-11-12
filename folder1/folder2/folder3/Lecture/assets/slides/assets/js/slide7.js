/* JS: slide manager
 * initiates slide content and controls
 * slide | seek bar 
 */
var preloaditems = {
    images: [],
    sounds: null,
    jsonURL: "./assets/data/slide7.json"
};

// slide data elements
var slideTutorial, slideManager;
var slideData = null;
var currentQuestion = null;
var totalDuration = 0;
var totalAudios = 0;
var seqNo = 0;
var totalSequence = 0;
var selectedVal = [];
var fbAudio = null;
var fbAudioIE = null;

var totalQns = 1;

var totalQues = 0;
var currentQnNo = 1;

// Handwritten class variable
var char_recog_v2 = null;

$(document).ready(function() {
    char_recog_v2 = new CharRecogV2();
    char_recog_v2.init(); // In case of horizontal writing mode

    char_recog_v2.addText("text_1", tegaki_flg, 4, 3);

});


function init() {
    'use strict';
    $('img').on('dragstart', function(event) { event.preventDefault(); });
    slideManager = slideManager();
    slideTutorial = slideTutorial;

    $.ajax({
        dataType: "json",
        url: preloaditems.jsonURL,
        success: function(data) {
            slideData = data.surala;
            preloaditems.sounds = slideData.sounds;
            preloaditems.images = slideData.images;
            parent.audioDur = [];
            slideManager.preLoadFromList(preloaditems.images, preloaditems.sounds, addContent, slideManager.progressBar);
        }
    });
    // if (parent.surala.support.android) {
    //     $('.inputBox_1').css('top', '76px');
    // }

    // if ((parent.surala.support.safari) && !(parent.surala.support.chrome)) {
    //     $('.inputBox_1').css('top', '76px');
    // }

    // if (parent.surala.support.touch && parent.surala.support.safari && !parent.surala.support.chrome) {
    //     $('.inputBox_1').css('top', '76px');
    // }

    // if (navigator.userAgent.indexOf("CrOS") != -1) {
    //     $('.inputBox_1').css('top', '76px');
    // }

    // if (navigator.userAgent.indexOf("Edge") != -1) {}
}

function addContent() {
    'use strict';
    parent.preloadStatus = true;
    $('img').on('dragstart', function(event) { event.preventDefault(); });
    /* -- LMS Code: Get values from LMS -- */
    if (!(parent.flash_problem_num == null)) {
        //問題1テキストボックスの初期表示
        flash_answer = parent.flash_answer;
        flash_success = parent.flash_success;
        currentQnNo = parseInt(parent.flash_problem_num.split('-')[1]);
        $('.seekBar,.seekBarSlider').css('display', 'none');
        showLMSFeedback();
    } else {
        totalSequence = totalAudios = slideData.slideDuration.length;
        /*if (navigator.userAgent.indexOf("Trident") != -1) {
            totalDuration = totalDuration + 0.9;
        }*/

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
    $(".display1").css("visibility", "visible");
    $(".display2,.blink1").css("visibility", "visible");
    $('.feedback,.correctAnswer').css('display', 'block');
    flash_answer = flash_answer.split('#comma');
    var correctAnsArray = currentQuestion.correctAnswer.split(',');
    var autocorrectAnsArray = currentQuestion.autocorrectAnswer.split(',');
    for (var i = 0; i < correctAnsArray.length; i++) {
        $("#text_" + (i + 1)).val(flash_answer[i]);
        if (correctAnsArray[i].split('/')[0] === $('#text_' + (i + 1)).val() || correctAnsArray[i].split('/')[1] === $('#text_' + (i + 1)).val()) {
            $('#fb' + (i + 1)).addClass('correctFB6');
        } else {
            $('#fb' + (i + 1)).addClass('wrongFB4');
            $('#crt' + (i + 1)).html(autocorrectAnsArray[i]);
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
    switch (seqNo) {
        case 1:
            timeOut = setTimeout(function() {
                $(".display1").css("visibility", "visible");
            }, 300);

            parent.surala.audio.playSound('IPM_S10L04u09_086', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 2;
                    slideSequence(seqNo);
                }
            });
            break;
        case 2:
            $(".display7").css("visibility", "visible");
            timeOut = setTimeout(function() {
                $('#71').attr("src", "assets/images/slide7/39.png");
            }, 300);
            timeOut = setTimeout(function() {
                $('#71').animate({ width: "91px", height: "91px", left: "530px", top: "225px" }, 700, 'linear');
            }, 500);


            timeOut = setTimeout(function() {
                $(".display8").css("visibility", "visible");
                timeOut = setTimeout(function() {
                    $('#70').attr("src", "assets/images/slide7/42.png");
                }, 300);
                timeOut = setTimeout(function() {
                    $('#70').animate({ width: "91px", height: "91px", left: "415px", top: "225px" }, 700, 'linear');
                }, 500);
            }, speedcal(1500));
            parent.surala.audio.playSound('IPM_S10L04u09_087', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 3;
                    slideSequence(seqNo);
                }
            });
            break;
        case 3:
            $('#70').animate({ width: "129px", height: "129px", left: "180px", top: "232px" }, 900, 'linear');
            timeOut = setTimeout(function() {
                $('#70').attr("src", "assets/images/slide7/44.png");
            }, 300);

            timeOut = setTimeout(function() {
                $('#71').animate({ width: "129px", height: "129px", left: "181px", top: "234px" }, 900, 'linear');
                timeOut = setTimeout(function() {
                    $('#71').attr("src", "assets/images/slide7/46.png");
                }, 300);
            }, speedcal(1200));
            parent.surala.audio.playSound('IPM_S10L04u09_088', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 4;
                    slideSequence(seqNo);
                }
            });
            break;
        case 4:
            $(".display7").css("visibility", "hidden");
            $(".display8").css("visibility", "hidden");
            $(".display6").css("visibility", "visible");
            $('.blink').removeClass('blinkItem');
            interVal = setInterval(function() {
                if ($('.blink').hasClass('blinkItem'))
                    $('.blink').removeClass('blinkItem').css('visibility', 'visible');
                else
                    $('.blink').addClass('blinkItem').css('visibility', 'hidden');
            }, 500);
            timeOut = setTimeout(function() {
                clearInterval(interVal);
                $('.blink').removeClass('blinkItem').css('visibility', 'visible');
                $(".display6").css("visibility", "hidden");
            }, speedcal(3500));

            parent.surala.audio.playSound('IPM_S10L04u09_089', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 5;
                    slideSequence(seqNo);
                }
            });
            break;
        case 5:
            $(".display2").css("visibility", "visible");
            parent.surala.audio.playSound('IPM_S10L04u09_090', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 6;
                    slideSequence(seqNo);
                }
            });
            break;
        case 6:
            $(".display2_1").css("visibility", "visible");
            $('.blink1').removeClass('blinkItem');
            interVal = setInterval(function() {
                if ($('.blink1').hasClass('blinkItem'))
                    $('.blink1').removeClass('blinkItem').css('visibility', 'visible');
                else
                    $('.blink1').addClass('blinkItem').css('visibility', 'hidden');
            }, 500);
            timeOut = setTimeout(function() {
                clearInterval(interVal);
                $('.blink1').removeClass('blinkItem').css('visibility', 'visible');
                $(".display9").css("visibility", "hidden");
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 7;
                    slideSequence(seqNo);
                }
            }, speedcal(3500));
            parent.surala.audio.playSound('IPM_S10L04u09_091', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    parent.surala.character.stopAllAnimation();
                }
            });
            break;
        case 7:
            $(".display2_2").css("visibility", "visible");
            $(".display10").css("visibility", "visible");
            $('.blink3').removeClass('blinkItem');
            interVal = setInterval(function() {
                if ($('.blink3').hasClass('blinkItem'))
                    $('.blink3').removeClass('blinkItem').css('visibility', 'visible');
                else
                    $('.blink3').addClass('blinkItem').css('visibility', 'hidden');
            }, 500);
            timeOut = setTimeout(function() {
                clearInterval(interVal);
                //$('.blink3').removeClass('blinkItem').css('visibility', 'visible');
                $(".display10").css("visibility", "hidden");
                $('.blink3').addClass('blinkItem').css('visibility', 'hidden');
            }, speedcal(3500));
            parent.surala.audio.playSound('IPM_S10L04u09_092', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 8;
                    slideSequence(seqNo);
                }
            });
            break;
        case 8:
            $('.blink3').removeClass('blinkItem');
            interVal = setInterval(function() {
                if ($('.blink3').hasClass('blinkItem'))
                    $('.blink3').removeClass('blinkItem').css('visibility', 'visible');
                else
                    $('.blink3').addClass('blinkItem').css('visibility', 'hidden');
            }, 500);
            timeOut = setTimeout(function() {
                clearInterval(interVal);
                //$('.blink3').removeClass('blinkItem').css('visibility', 'visible');
                $(".display10").css("visibility", "hidden");
                $('.blink3').addClass('blinkItem').css('visibility', 'hidden');
            }, speedcal(3500));
            parent.surala.audio.playSound('IPM_S10L04u09_093', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 9;
                    slideSequence(seqNo);
                }
            });
            break;
        case 9:
            $(".display3").css("visibility", "visible");
            parent.surala.audio.playSound('IPM_S10L04u09_094', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 10;
                    slideSequence(seqNo);
                }
            });
            break;
        case 10:
            $(".display4").css("visibility", "visible");
            parent.surala.audio.playSound('IPM_S10L04u09_095', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 11;
                    slideSequence(seqNo);
                }
            });
            break;
        case 11:
            $(".display5").css("visibility", "visible");
            parent.surala.audio.playSound('IPM_S10L04u09_096', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 12;
                    slideSequence(seqNo);
                }
            });
            break;
        case 12:
            parent.surala.audio.playSound('IPM_S10L04u09_097', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 13;
                    slideSequence(seqNo);
                }
            });
            break;
        case 13:
            parent.surala.audio.playSound('IPM_S10L04u09_098', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 14;
                    slideSequence(seqNo);
                }
            });
            break;
        case 14:
            parent.surala.audio.playSound('IPM_S10L04u09_099', null, function() {
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
            $(".display1").css("visibility", "visible");
            $('#71').attr("src", "assets/images/slide7/37.png");
            $('#71').css({ width: "130px", height: "130px", left: "178px", top: "231px" });
            $('#70').attr("src", "assets/images/slide7/40.png");
            $('#70').css({ width: "130px", height: "130px", top: "233px", left: "180px" });
            break;
        case 2:
            $(".display7").css("visibility", "visible");
            $(".display8").css("visibility", "visible");
            break;
        case 3:
            $('#71').attr("src", "assets/images/slide7/39.png");
            $('#71').css({ width: "91px", height: "91px", left: "181px", top: "234px" });
            $('#70').attr("src", "assets/images/slide7/42.png");
            $('#70').css({ width: "91px", height: "91px", left: "180px", top: "232px" });
            break;
        case 4:
            $(".display6").css("visibility", "hidden");
            $(".display7").css("visibility", "hidden");
            $(".display8").css("visibility", "hidden");
            break;
        case 5:
            $(".display2").css("visibility", "visible");
            break;
        case 6:
            $(".display2_1").css("visibility", "visible");
            break;
        case 7:
            $(".display2_2").css("visibility", "visible");
            break;
        case 8:
            //$(".display10").css("visibility", "visible");
            break;
        case 9:
            $(".display3").css("visibility", "visible");
            break;
        case 10:
            $(".display4").css("visibility", "visible");
            break;
        case 11:
            $(".display5").css("visibility", "visible");
            break;
        case 12:
            break;
        case 13:
            break;
        case 14:
            break;
    }
}

function hidecontent(num) {
    switch (num) {
        case 1:
            $(".display1").css("visibility", "hidden");
            break;
        case 2:
            $(".display7").css("visibility", "hidden");
            $(".display8").css("visibility", "hidden");
            break;
        case 3:

            break;
        case 4:
            $(".display7").css("visibility", "hidden");
            $(".display8").css("visibility", "hidden");
            $(".display6").css("visibility", "hidden");
            break;
        case 5:
            $(".display2").css("visibility", "hidden");
            break;
        case 6:
            $(".display2_1").css("visibility", "hidden");
            break;
        case 7:
            $(".display2_2").css("visibility", "hidden");
            $(".display10").css("visibility", "hidden");
            $(".blink3").css("visibility", "hidden");
            break;
        case 8:

            break;
        case 9:
            $(".display3").css("visibility", "hidden");
            break;
        case 10:
            $(".display4").css("visibility", "hidden");
            break;
        case 11:
            $(".display5").css("visibility", "hidden");
            break;
        case 12:
            break;
        case 13:
            break;
        case 14:
            break;
    }
}

//disable the activity
function disableActivity() {
    for (var i = 0; i < totalQns; i++) {
        $("#text_" + (i + 1)).attr("readonly", "true");
        $("#text_" + (i + 1)).css('pointer-events', 'none');
    }
    $('#judgement_btn').removeClass('btn_active');
    $('#judgement_btn').unbind('click').css('pointer-events', 'none');
}
// reset activity 
function loadActivity() {
    activityNo = "";
    currentQuestion = slideData.content["question" + currentQnNo];
    var correctAnsArray = currentQuestion.correctAnswer.split(',');
    for (var i = 0; i < totalQns; i++) {
        $("#text_" + (i + 1)).attr("readonly", "true");
        $("#text_" + (i + 1)).css('pointer-events', 'none');
    }
    for (var i = 1; i <= correctAnsArray.length; i++) {
        $("#text_" + i).css('color', 'black');
        $("#text_" + i).val('');
        $("#crt" + i).html('');
        $("#fb" + i).removeClass('correctFB6').removeClass('wrongFB4');
    }
    $('#judgement_btn').removeClass('btn_active');
    $('#judgement_btn').unbind('click');
    //$('.feedback, .correctAnswer').css('display', 'none');
}
// activate the activity for user input
function enableTegaki() {
    parent.surala.character.stopAllAnimation();
    currentQuestion = slideData.content['question' + currentQnNo];
    var correctAnsArray = currentQuestion.correctAnswer.split(',');
    $('#judgement_btn').css('pointer-events', 'auto').addClass('btn_active').attr('onclick', 'validateTegaki()');
    for (var i = 1; i <= correctAnsArray.length; i++) {
        $("#text_" + i).removeAttr("readonly");
        $("#text_" + i).css('pointer-events', 'auto');
        $("#text_" + i).css('color', 'black');
        if (tegaki_flg === true) {
            $("#text_" + i).attr('onclick', '$("#tegaki_popup").css("display","block");');
        }

    }
}

// user input validation
function validateTegaki() {
    parent.surala.character.stopAllAnimation();
    if (currentQnNo == 1 && answerBtnClicked1)
        return;
    // check if judgement button is active
    if (!$('#judgement_btn').hasClass('btn_active')) {
        return;
    }
    clearInterval(interVal);
    clearTimeout(timeOut);
    var nextSeqNum = 2;
    if (previousSeqNo == nextSeqNum) {
        previousSeqNo = 0;
    }
    var correctAnsCount = 0;
    var correctAnsArray = [];
    correctAnsArray = currentQuestion.correctAnswer.split(',');
    var autocorrectAnsArray = currentQuestion.autocorrectAnswer.split(',');
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
    /* -- LMS code -- */
    activityNo = page + '-' + currentQnNo;

    $('.feedback, .correctAnswer').css('display', 'block');
    param["flash_answer"] = '';
    for (var i = 1; i <= correctAnsArray.length; i++) {
        $("#text_" + i).attr("readonly", "true");
        $("#text_" + i).css('pointer-events', 'none');
    }
    $("#text_1").val($("#text_1").val().replace(/\#comma/gi, ''));

    for (var i = 1; i <= correctAnsArray.length; i++) {
        if (i != correctAnsArray.length)
            param["flash_answer"] += $("#text_" + i).val() + '#comma';
        else {
            param["flash_answer"] += $("#text_" + i).val();
            answerBtnClicked1 = true;
        }

    }
    // disable tegaki popup and judgement button
    $('#tegaki_popup').css('display', 'none');
    $('#judgement_btn').removeClass('btn_active');
    $('#judgement_btn').unbind('click');

    // validating all input elements	
    for (var i = 0; i < correctAnsArray.length; i++) {

        if (correctAnsArray[i].split('/')[0] === $('#text_' + (i + 1)).val() || correctAnsArray[i].split('/')[1] === $('#text_' + (i + 1)).val()) {
            correctAnsCount++;
            $('#fb' + (i + 1)).addClass('correctFB6');
        } else {
            $('#fb' + (i + 1)).addClass('wrongFB4');
            $('#crt' + (i + 1)).html(autocorrectAnsArray[i]);
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


var fbAudio_IE = null;
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
            if (fbAudio_IE === audio) {
                return;
            }
            fbAudio_IE = audio;
            if (currentQnNo == 1) {
                seqNo = 2;
            }
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