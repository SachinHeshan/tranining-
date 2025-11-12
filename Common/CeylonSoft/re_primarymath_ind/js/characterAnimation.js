 /* JS: character animation */ 
 
 function characterAnimation(){
	var characterAnimation = {
		init: function(){
			
		},
		animate: function(character, frame, callback){
			if(character === 'teacher'){
				surala.teacher.gotoAndPlay(frame);
				if(callback !== null && callback !== undefined){
				  surala.teacher.addEventListener("animationend", callback);
				}
			}else{
				//characterAnimation.teacherTalk(false);
				surala.student.gotoAndPlay(frame);
				if(callback !== null && callback !== undefined){
					surala.student.addEventListener("animationend", callback);
				}
			}
		},
		stopAnimation: function(character, frame){
			//surala.teacher.removeAllEventListeners();
			//surala.student.removeAllEventListeners();
			if(character === 'teacher'){
				surala.teacher.gotoAndStop(frame);
			}else{
				surala.student.gotoAndStop(frame);
			}			
		},
		stopAllAnimation: function(){
			surala.teacher.removeAllEventListeners("animationend");
			surala.student.removeAllEventListeners("animationend");
			surala.teacher.gotoAndPlay('normal');
			surala.student.gotoAndPlay('normal');
		},
		teacherTalk: function(value){
			if(value){
				surala.teacher.gotoAndPlay('normal_speak');
			}else{
				surala.teacher.gotoAndPlay('normal');				
			}
		}
	};	
	characterAnimation.init();
	return characterAnimation;
 }