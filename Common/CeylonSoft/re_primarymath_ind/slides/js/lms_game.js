/* LMS function */

var page = 1;

var game_probrem_num = "";
var game_answer = "";
var game_success = "";
var type = "game_page";

//メイン画面ドキュメント
var $parent = $(parent.document);
//メイン画面更新メソッドを取得する
var setMain = parent.setMain;
//ログを送るためのＵＲＬ
var logUrl = parent.log_url;
//学習ログを送るためのURL
var studyLogUrl = parent.study_log_url;

var againScoUrl = parent.again_sco_url;
//ゲームまたはドリルへ進む場合のURL
var nextScoUrl = parent.next_sco_url;
//確認ダイアログ
var msgDialog = parent.msgDialog;


//初期起動送信
var iniParam = {};
var sendMassage;

$(document).ready(function(){
	
	//tegaki switch between device and desktop
	try{
		switch(parent.tegaki_flg){
			case 'true': tegaki_flg = true;
			break;
			case 'false': tegaki_flg = false;
			break;
			case '1': tegaki_flg = true;
			break;
			case '': tegaki_flg = false;
			break;
			default: tegaki_flg = false;
			break;
		}
		if(tegaki_flg === false){
			disablePopup();
		}
		$('input[type=text], textarea').removeAttr('onkeypress');
	}
	catch(e){}
	
	//送信する
	sendMassage = function(url, param){
		$.ajax({
			type: "POST",
			url: url,
			data : param,
			success: function(msg) {
				msgDialog(msg);
			},
			error: function(XMLHttpRequest, message, object){
				//alert('error:' + message);
			}
		});
	}
	
	iniParam['page'] = page;
	iniParam['type'] = type;
	
	if(!(typeof parent.game_problem_num  === "undefined")){
		// check result;
	} else {	
		sendMassage(logUrl, iniParam);
	}
});

// disable tegaki popup if desktop
function disablePopup(){	
	$('input[type=text], textarea').unbind();
	$('input[type=text], textarea').on('click', function(){
		if(tegaki_flg === true) {	
			$("#tegaki_popup").css("display","block");
		}else{
			$("#tegaki_popup").css("display","none");
			$("#tegaki_popup").css("visibility","hidden");
			$(this).focus();			
		}
	});
}