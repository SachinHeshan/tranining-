/* JS: slide manager
 * initiates slide content and controls
 * slide | seek bar 
 */
var preloaditems = {
    images: [],
    sounds: null,
    jsonURL: "./assets/data/slide6.json"
};


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
            preloaditems.content = slideData.content;
            parent.audioDur = [];
            slideManager.preLoadFromList(preloaditems.images, preloaditems.sounds, addContent, slideManager.progressBar);
        }
    });
}



function addContent() {
    'use strict';
    parent.preloadStatus = true;
    $('img').on('dragstart', function(event) { event.preventDefault(); });

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
            $(".display1").css('visibility', 'hidden');
            parent.surala.audio.playSound('IPM_S10L04u09_062', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 2;
                    slideSequence(seqNo);
                }
            });
            break;
        case 2:
            parent.surala.audio.playSound('IPM_S10L04u09_063', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 3;
                    slideSequence(seqNo);
                }
            });
            break;
        case 3:
            $(".display1").css("visibility", "visible");
            parent.surala.audio.playSound('IPM_S10L04u09_064', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 4;
                    slideSequence(seqNo);
                }
            });
            break;
        case 4:
            parent.surala.audio.playSound('IPM_S10L04u09_065', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 5;
                    slideSequence(seqNo);
                }
            });
            break;
        case 5:
            parent.surala.audio.playSound('IPM_S10L04u09_066', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 6;
                    slideSequence(seqNo);
                }
            });
            break;
        case 6:
            $('.blink').removeClass('blinkItem');
            interVal = setInterval(function() {
                if ($('.blink').hasClass('blinkItem')) {
                    $('.blink').removeClass('blinkItem').css('visibility', 'visible');
                    $('.gwd-p-1fdv').css('color', 'red');
                    $('.gwd-p-p3wx').css('color', 'red');
                    $('.gwd-line-1xb0').css('stroke', 'red');
                } else {
                    $('.blink').addClass('blinkItem').css('visibility', 'hidden');
                    $('.gwd-p-1fdv').css('color', 'black');
                    $('.gwd-p-p3wx').css('color', 'black');
                    $('.gwd-line-1xb0').css('stroke', 'black');
                }
            }, 500);
            timeOut = setTimeout(function() {
                clearInterval(interVal);
                $('.blink').removeClass('blinkItem').css('visibility', 'visible');
                $('.gwd-p-1fdv').css('color', 'black');
                $('.gwd-p-p3wx').css('color', 'black');
                $('.gwd-line-1xb0').css('stroke', 'black');
            }, speedcal(3500));
            parent.surala.audio.playSound('IPM_S10L04u09_067', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 7;
                    slideSequence(seqNo);
                }
            });
            break;
        case 7:
            $(".display2").css("visibility", "visible");
            $(".display17").css("visibility", "visible");
            parent.surala.audio.playSound('IPM_S10L04u09_015', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 8;
                    slideSequence(seqNo);
                }
            });
            break;
        case 8:
            $(".display17").css("visibility", "visible");
            $('.blink1').removeClass('blinkItem');
            interVal = setInterval(function() {
                if ($('.blink1').hasClass('blinkItem')) {
                    $('.blink1').removeClass('blinkItem').css('visibility', 'visible');
                    $(".display17").css("visibility", "visible");
                } else {
                    $('.blink1').addClass('blinkItem').css('visibility', 'hidden');
                    $(".display17").css("visibility", "hidden");
                }
            }, 500);
            timeOut = setTimeout(function() {
                clearInterval(interVal);
                $('.blink1').removeClass('blinkItem').css('visibility', 'visible');
                $(".display17").css("visibility", "visible");
            }, speedcal(3500));
            parent.surala.audio.playSound('IPM_S10L04u09_068', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 9;
                    slideSequence(seqNo);
                }
            });
            break;
        case 9:
            parent.surala.audio.playSound('IPM_S10L04u09_069', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 10;
                    slideSequence(seqNo);
                }
            });
            break;
        case 10:
            parent.surala.audio.playSound('IPM_S10L04u09_070', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 11;
                    slideSequence(seqNo);
                }
            });
            break;
        case 11:
            parent.surala.character.teacherTalk(false);
            parent.surala.character.animate('student', 'normal_speak');
            parent.surala.character.animate('teacher', 'left_hand_up_and_normal');
            parent.surala.enablecallOut('Oh, saya melihat juring!', 1);
            window.parent.$('.speech_bubble').css({ 'padding-left': '8px', 'padding-top': '33px' });
            parent.surala.audio.playSound('IPM_S10L04u09_S003', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {

                    parent.surala.disablecallOut();
                    seqNo = 12;
                    slideSequence(seqNo);

                }
            });
            break;
        case 12:
            parent.surala.audio.playSound('IPM_S10L04u09_071', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 13;
                    slideSequence(seqNo);
                }
            });
            break;
        case 13:
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
                $(".display10").css("visibility", "hidden");
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 14;
                    slideSequence(seqNo);
                }
            }, speedcal(3500));
            parent.surala.audio.playSound('IPM_S10L04u09_072', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    parent.surala.character.stopAllAnimation();
                }
            });
            break;
        case 14:
            $('.blink3').removeClass('blinkItem');
            interVal = setInterval(function() {
                if ($('.blink3').hasClass('blinkItem')) {
                    $('.blink3').removeClass('blinkItem').css('visibility', 'visible');
                    $(".display11").css("visibility", "visible");
                } else {
                    $('.blink3').addClass('blinkItem').css('visibility', 'hidden');
                    $(".display11").css("visibility", "hidden");
                }
            }, 500);
            timeOut = setTimeout(function() {
                clearInterval(interVal);
                $('.blink3').removeClass('blinkItem').css('visibility', 'visible');
                $(".display11").css("visibility", "hidden");
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 15;
                    slideSequence(seqNo);
                }
            }, speedcal(3500));
            parent.surala.audio.playSound('IPM_S10L04u09_073', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    parent.surala.character.stopAllAnimation();
                }
            });
            break;
        case 15:
            parent.surala.audio.playSound('IPM_S10L04u09_074', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 16;
                    slideSequence(seqNo);
                }
            });
            break;
        case 16:
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
                $(".display10").css("visibility", "hidden");
                $(".display12").css("visibility", "visible");
                $(".display12").animate({ left: '421px' });
            }, speedcal(3500));
            parent.surala.audio.playSound('IPM_S10L04u09_075', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 17;
                    slideSequence(seqNo);
                }
            });
            break;
        case 17:
            parent.surala.audio.playSound('IPM_S10L04u09_076', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 18;
                    slideSequence(seqNo);
                }
            });
            break;
        case 18:
            parent.surala.character.teacherTalk(false);
            parent.surala.character.animate('student', 'normal_speak');
            parent.surala.character.animate('teacher', 'left_hand_up_and_normal');
            parent.surala.enablecallOut('Benarkah?', 1);
            window.parent.$('.speech_bubble').css({ 'padding-left': '14px', 'padding-top': '33px' });
            parent.surala.audio.playSound('IPM_S10L03u03_S011', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    parent.surala.disablecallOut();
                    seqNo = 19;
                    slideSequence(seqNo);

                }
            });
            break;
        case 19:
            $(".display12").css("visibility", "hidden");
            $(".display4").css("visibility", "visible");
            $('.blink4').removeClass('blinkItem');
            interVal = setInterval(function() {
                if ($('.blink4').hasClass('blinkItem')) {
                    $('.blink4').removeClass('blinkItem').css('visibility', 'visible');
                    $(".display13").css("visibility", "visible");
                } else {
                    $('.blink4').addClass('blinkItem').css('visibility', 'hidden');
                    $(".display13").css("visibility", "hidden");
                }
            }, 500);
            timeOut = setTimeout(function() {
                clearInterval(interVal);
                $('.blink4').removeClass('blinkItem').css('visibility', 'hidden');
                $(".display13").css("visibility", "hidden");
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 20;
                    slideSequence(seqNo);
                }
            }, speedcal(3500));
            parent.surala.audio.playSound('IPM_S10L04u09_077', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {

                    parent.surala.character.stopAllAnimation();
                }
            });
            break;
        case 20:
            $(".display16").css("visibility", "visible");
            $('.blink8').removeClass('blinkItem');
            interVal = setInterval(function() {
                if ($('.blink8').hasClass('blinkItem')) {
                    $('.blink8').removeClass('blinkItem').css('visibility', 'visible');
                    $(".display16").css("visibility", "visible");
                } else {
                    $('.blink8').addClass('blinkItem').css('visibility', 'hidden');
                    $(".display16").css("visibility", "hidden");
                }
            }, 500);
            timeOut = setTimeout(function() {
                clearInterval(interVal);
                $('.blink8').removeClass('blinkItem').css('visibility', 'hidden');
                $(".display16").css("visibility", "hidden");
            }, speedcal(3500));
            parent.surala.audio.playSound('IPM_S10L04u09_078', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 21;
                    slideSequence(seqNo);
                }
            });
            break;
        case 21:
            $(".display13").css("visibility", "visible");
            $('.blink7').removeClass('blinkItem');
            interVal = setInterval(function() {
                if ($('.blink7').hasClass('blinkItem')) {
                    $('.blink7').removeClass('blinkItem').css('visibility', 'visible');
                    $(".display13").css("visibility", "visible");
                } else {
                    $('.blink7').addClass('blinkItem').css('visibility', 'hidden');
                    $(".display13").css("visibility", "hidden");
                }
            }, 500);
            timeOut = setTimeout(function() {
                clearInterval(interVal);
                $('.blink7').removeClass('blinkItem').css('visibility', 'hidden');
                $(".display13").css("visibility", "hidden");
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 22;
                    slideSequence(seqNo);
                }
            }, speedcal(3500));
            parent.surala.audio.playSound('IPM_S10L04u09_079', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    parent.surala.character.stopAllAnimation();
                }
            });
            break;
        case 22:

            $(".display15").css("visibility", "visible");
            $('.blink6').removeClass('blinkItem');
            interVal = setInterval(function() {
                if ($('.blink6').hasClass('blinkItem')) {
                    $('.blink6').removeClass('blinkItem').css('visibility', 'visible');
                    $(".display15").css("visibility", "visible");
                } else {
                    $('.blink6').addClass('blinkItem').css('visibility', 'hidden');
                    $(".display15").css("visibility", "hidden");
                }
            }, 500);
            timeOut = setTimeout(function() {
                clearInterval(interVal);
                $('.blink6').removeClass('blinkItem').css('visibility', 'hidden');
                $(".display15").css("visibility", "hidden");
            }, speedcal(3000));
            $(".display5").css("visibility", "visible");
            parent.surala.audio.playSound('IPM_S10L04u09_080', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 23;
                    slideSequence(seqNo);
                }
            });
            break;

        case 23:
            $(".display17").css("visibility", "visible");
            $('.blink1').removeClass('blinkItem');
            interVal = setInterval(function() {
                if ($('.blink1').hasClass('blinkItem')) {
                    $('.blink1').removeClass('blinkItem').css('visibility', 'visible');
                    $(".display17").css("visibility", "visible");
                } else {
                    $('.blink1').addClass('blinkItem').css('visibility', 'hidden');
                    $(".display17").css("visibility", "hidden");
                }
            }, 500);
            timeOut = setTimeout(function() {
                clearInterval(interVal);
                $('.blink1').removeClass('blinkItem').css('visibility', 'visible');
                $(".display17").css("visibility", "visible");
                seqNo = 24;
                slideSequence(seqNo);
            }, speedcal(3500));
            parent.surala.audio.playSound('IPM_S10L04u09_081', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    parent.surala.character.stopAllAnimation();
                }
            });
            break;

        case 24:
            $(".display6").css("visibility", "visible");
            parent.surala.audio.playSound('IPM_S10L04u09_082', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 25;
                    slideSequence(seqNo);
                }
            });
            break;
        case 25:
            $(".display7").css("visibility", "visible");
            parent.surala.audio.playSound('IPM_S10L04u09_083', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 26;
                    slideSequence(seqNo);
                }
            });
            break;
        case 26:
            $(".display8").css("visibility", "visible");
            $('.blink1').removeClass('blinkItem');
            interVal = setInterval(function() {
                if ($('.blink1').hasClass('blinkItem')) {
                    $('.blink1').removeClass('blinkItem').css('visibility', 'visible');
                    $(".display17").css("visibility", "visible");
                } else {
                    $('.blink1').addClass('blinkItem').css('visibility', 'hidden');
                    $(".display17").css("visibility", "hidden");
                }
            }, 500);
            timeOut = setTimeout(function() {
                clearInterval(interVal);
                $('.blink1').removeClass('blinkItem').css('visibility', 'visible');
                $(".display17").css("visibility", "visible");
            }, speedcal(3500));
            parent.surala.audio.playSound('IPM_S10L04u09_084', null, function() {
                if (sliderChanged) {
                    sliderChanged = false;
                } else {
                    seqNo = 27;
                    slideSequence(seqNo);
                }
            });
            break;
        case 27:
            $(".display9").css("visibility", "visible");
            parent.surala.audio.playSound('IPM_S10L04u09_085', null, function() {
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
            $(".display1").css('visibility', 'hidden');
            break;
        case 2:
            break;
        case 3:
            $(".display1").css("visibility", "visible");
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            $('.gwd-p-1fdv').css('color', 'black');
            $('.gwd-p-p3wx').css('color', 'black');
            $('.gwd-line-1xb0').css('stroke', 'black');
            break;
        case 7:
            $(".display2").css("visibility", "visible");
            $(".display17").css("visibility", "visible");
            break;
        case 8:
            $(".display17").css("visibility", "visible");
            break;
        case 9:
            break;
        case 10:
            break;
        case 11:
            break;
        case 12:
            break;
        case 13:
            $(".display10").css("visibility", "hidden");
            break;
        case 14:
            $(".display11").css("visibility", "hidden");
            break;
        case 15:
            break;
        case 16:
            $(".display10").css("visibility", "hidden");
            $(".display12").css("visibility", "hidden");
            break;
        case 17:
            $(".display12").css("visibility", "visible");
            $(".display12").css({ left: '421px' });
            break;
        case 18:

            break;
        case 19:
            $(".display12").css("visibility", "hidden");
            $(".display4").css("visibility", "visible");
            $(".display13").css("visibility", "hidden");
            break;
        case 20:
            $(".display16").css("visibility", "hidden");
            break;

        case 21:
            $(".display13").css("visibility", "hidden");
            break;
        case 22:
            $(".display15").css("visibility", "hidden");
            $(".display5").css("visibility", "visible");
            break;
        case 23:
            $(".display17").css("visibility", "visible");
            break;
        case 24:
            $(".display6").css("visibility", "visible");
            break;
        case 25:
            $(".display7").css("visibility", "visible");
            break;
        case 26:
            $(".display8").css("visibility", "visible");
            break;
        case 27:
            $(".display9").css("visibility", "visible");
            $(".display12").css("visibility", "hidden");
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
            $(".display1").css("visibility", "hidden");
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            $('.gwd-p-1fdv').css('color', 'black');
            $('.gwd-p-p3wx').css('color', 'black');
            $('.gwd-line-1xb0').css('stroke', 'black');
            break;
        case 7:
            $(".display2").css("visibility", "hidden");
            $(".display17").css("visibility", "hidden");
            break;
        case 8:
            $(".display17").css("visibility", "hidden");
            break;
        case 9:
            break;
        case 10:
            break;
        case 11:
            break;
        case 12:
            break;
        case 13:
            $(".display10").css("visibility", "hidden");
            break;
        case 14:
            $(".display11").css("visibility", "hidden");
            break;
        case 15:
            break;
        case 16:
            $(".display10").css("visibility", "hidden");
            $(".display12").css("visibility", "hidden");
            break;
        case 17:
            break;
        case 18:
            $(".display12").css("visibility", "hidden");

            break;
        case 19:
            $(".display4").css("visibility", "hidden");
            $(".display13").css("visibility", "hidden");
            break;
        case 20:
            $(".display16").css("visibility", "hidden");
            break;

        case 21:
            $(".display13").css("visibility", "hidden");
            break;
        case 22:
            $(".display15").css("visibility", "hidden");
            $(".display5").css("visibility", "hidden");
            break;
        case 23:
            $(".display17").css("visibility", "hidden");
            break;
        case 24:
            $(".display6").css("visibility", "hidden");
            break;
        case 25:
            $(".display7").css("visibility", "hidden");
            break;
        case 26:
            $(".display8").css("visibility", "hidden");
            break;
        case 27:
            $(".display9").css("visibility", "hidden");
            $(".display12").css("visibility", "hidden");
            break;

    }
}
window.onunload = function() {
    parent.surala.disablecallOut();
    parent.surala.audio.stopAllNonLoopSounds();
    parent.surala.character.stopAllAnimation();
};