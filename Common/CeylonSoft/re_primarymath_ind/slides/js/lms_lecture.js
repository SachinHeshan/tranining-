/* LMS function */

var page;
var mprint;
var type = "lecture_page";

var currentpageType;
var flash_problem_num = "";
var flash_answer = "";
var flash_success = "";
var activityNo = "";
var tegaki_flg = parent.tegaki_flg;
var char_recog = null;
var param = {};

// common slide data elements
var slideTutorial, slideManager;
var slideData = null;
var currentQuestion = null;
var currentQnNo = 1;
var totalDuration = 0;
var totalAudios = 0;
var seqNo = 0;
var totalSequence = 0;
var answerBtnClicked = false;

// slide start point
window.onload = init;

//メイン画面ドキュメント
var $parent = $(parent.document);

//メイン画面更新メソッドを取得する
var setMain = parent.setMain;

//ログを送るためのURL
var logUrl = parent.log_url;
//学習ログを送るためのURL
var studyLogUrl = parent.study_log_url;
//ゲームまたはドリルへ進む場合のURL
var nextScoUrl = parent.next_sco_url;

//確認ダイアログ
var msgDialog = parent.msgDialog;

//初期起動送信
var iniParam = {};
var sendMassage;

$(document).ready(function() {
    /*speed*/
    parent.$('.lecture-controls-box').css("pointer-events", "none");
    parent.$('.lecture-controls-box').css('display', 'block');
    page = parent.surala.currentSlide;

    // Auto Complete for all the input and textarea
    $('input[type=text], textarea').attr("autocomplete", "off");


    //tegaki switch between device and desktop
    try {
        switch (parent.tegaki_flg) {
            case 'true':
                tegaki_flg = true;
                break;
            case 'false':
                tegaki_flg = false;
                break;
            case '1':
                tegaki_flg = true;
                break;
            case '':
                tegaki_flg = false;
                break;
            default:
                tegaki_flg = false;
                break;
        }
        if (tegaki_flg === false) {
            disablePopup();
        }
        $('input[type=text], textarea').removeAttr('onkeypress');
    } catch (e) {}

    if (currentpageType == 'summary') {
        mprint = "true";
    } else {
        mprint = "false";
    }

    //送信する
    sendMassage = function(url, param) {
        $.ajax({
            type: "POST",
            url: url,
            data: param,
            success: function(msg) {
                msgDialog(msg);
            },
            error: function(XMLHttpRequest, message, object) {
                //console.log('error:' + message);
            }
        });
    }

    iniParam['page'] = page;
    iniParam['mprint'] = mprint;
    iniParam['type'] = type;

    if ((parent.flash_problem_num === undefined)) {
        sendMassage(logUrl, iniParam);
    } else {
        if ((parent.flash_problem_num === null)) {
            sendMassage(logUrl, iniParam);
        }
    }

    if ($("div[id^=container]").length > 0) {
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", containerTick);
    }
});

// for chrome browser dnd visibility fix
function containerTick() {
    var containerList = $("div[id^=container]");
    for (var i = 0; i < containerList.length; i++) {
        if ($('#' + (containerList)[i].getAttribute('id')).css('visibility') == 'visible' && $('.konvajs-content').length > 0) {
            $('.konvajs-content').css('visibility', 'visible');
            $('.konvajs-content').css('visibility', '');
        }
    }
}

// disable tegaki popup if desktop
function disablePopup() {
    $('input[type=text], textarea').unbind();
    $('input[type=text], textarea').on('click', function() {
        if (tegaki_flg === true) {
            $("#tegaki_popup").css("display", "block");
        } else {
            $("#tegaki_popup").css("display", "none");
            $("#tegaki_popup").css("visibility", "hidden");
            $(this).focus();
        }
    });
}

// controlling "#" in text box
function disableHash() {
    $('input[type=text], textarea').unbind();
    $('input[type=text], textarea').on('change keydown paste input', function(e) {
        var textVal = $(this).val();
        $(this).val(textVal.replace('#', ''));
    });
}