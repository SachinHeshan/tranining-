//コンテンツ内容の保持
var remainData = {};

//log_url、next_sco_url、study_log_urlに、サーバのURLご指定ください。
var log_url = "../../../../../../common/CeylonSoft/lms/log_url.php";
var next_sco_url = "../../../../common/CeylonSoft/lms/next_sco_url.php";
var study_log_url = "../../../../../../common/CeylonSoft/lms/study_log_url.php";
var url_path = "http://www.aaa.jp/bbb/";
var status = "true";
var indicator_flag = "true";

//disp_pageは、復習教材（spot）で使用。現在は指定したページしか表示されない。
//var disp_page = "1,3,5,8";
var disp_page = "";
var disp_page_array = [];

var flash_problem_num;
var flash_answer;
var flash_success;
var flash_count;
var type;

// Coreフレームから呼び出した場合、パラメータを上書きする
if (parent) {
  if (typeof parent.log_url != "undefined") {
    this.log_url = parent.log_url;
  }
  if (typeof parent.next_sco_url != "undefined") {
    this.next_sco_url = parent.next_sco_url;
  }
  if (typeof parent.status != "undefined") {
    this.status = parent.status;
  }
  if (typeof parent.current_page != "undefined") {
    this.current_page = parent.current_page;
  }
  if (typeof parent.disp_page != "undefined") {
    this.disp_page = parent.disp_page;
  }
  if (typeof parent.url_path != "undefined") {
    this.url_path = parent.url_path;
  }
  if (typeof parent.indicator_flag != "undefined") {
    this.indicator_flag = parent.indicator_flag;
  }
  if (typeof parent.study_log_url != "undefined") {
    this.study_log_url = parent.study_log_url;
  }
  if (typeof parent.flash_problem_num != "undefined") {
    this.flash_problem_num = parent.flash_problem_num;
  }
  if (typeof parent.flash_answer != "undefined") {
    this.flash_answer = parent.flash_answer;
  }
  if (typeof parent.flash_success != "undefined") {
    this.flash_success = parent.flash_success;
  }
  if (typeof parent.flash_count != "undefined") {
    this.flash_count = parent.flash_count;
  }
  if (typeof parent.type != "undefined") {
    this.type = parent.type;
  }
}

var setMain = function (no, param) {
  //コンテンツ判定値を更新する
  remainData[no] = param;
};

function reshow() {
  //メイン画面表示を更新する
  $("#logUrl").text(log_url);
  $("#nexScoUrl").text(next_sco_url);
  $("#status").text(status);
  $("#currentPage").text(current_page);
  $("#dispPage").text(disp_page);
  $("#urlPath").text(url_path);
  $("#indicatorFlag").text(indicator_flag);
  $("#studyLogUrl").text(study_log_url);
}

var $dialog = null;
var $diaBody = null;
//ダイアログ表示フラグ
var isDialogShow = false;

var eventArray = new Array();

function msgDialog(msg) {
  if (isDialogShow) {
    //ダイアログが表示している場合、閉じた後で再表示する
    eventArray.unshift(msg);
  } else {
    //ダイアログが表示していない場合
    isDialogShow = true;
    $diaBody.empty();
    $diaBody.append(msg);
    $dialog.modal({ backdrop: "static" });
  }
}

function okDown(e) {
  $dialog.trigger("closed");
  isDialogShow = false;
}

$(document).ready(function () {
  //this line will disable the right click funtionality for main html
  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });
  $("#touchBtn").html("");
  //this line will disable the image draggable funtionality for main html
  $("img").on("dragstart", function (event) {
    event.preventDefault();
  });
  if (disp_page != "") {
    disp_page_array = disp_page.split(",");
    disp_page_array.sort(function (a, b) {
      return parseInt(a) - parseInt(b);
    });
    if (current_page == null || current_page == "") {
      current_page = disp_page_array[0];
    }
  }

  $dialog = $("#myModal");
  $diaBody = $("#dialogBody");
  //ダイアログ表示
  $dialog.on("closed", function () {
    if (eventArray.length > 0) {
      setTimeout(function () {
        $diaBody.empty();
        $diaBody.append(eventArray.pop());
        $dialog.modal({ backdrop: "static" });
      }, 500);
    } else {
      isDialogShow = true;
    }
  });

  //メイン画面初期表示
  reshow();
});

var page = 0;
var mprint = "false";
var type = "lecture_page";

//送信する
var sendMassage = function (url, param) {
  $.ajax({
    type: "POST",
    url: url,
    data: param,
    success: function (msg) {
      msgDialog(msg);
    },
    error: function (XMLHttpRequest, message, object) {
      //alert('error:' + message);
    },
  });
};

//初期起動送信
var iniParam = {};
iniParam["flash_problem_num_list"] = flash_problem_num_list;
iniParam["page"] = page;
iniParam["mprint"] = mprint;
iniParam["type"] = type;
