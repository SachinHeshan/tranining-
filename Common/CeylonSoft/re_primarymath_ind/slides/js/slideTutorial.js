 /* JS: slide tutorial */ 
 /* global tutorial for slide content */
 /* global audio queue */
 
 var slideTutorial= {
	 tutorialQueue: [],
     ready: true,
	 trigger: function(name, idArr, callBack){
		 "use strict";	
		
            if (slideTutorial.ready) {
                slideTutorial.ready = false;
				try{
                if(callBack === undefined){
					parent.surala.audio.playSound(name, false, slideTutorial.playNext);
				}
				else{					
					parent.surala.audio.playSound(name, false, callBack);
				}
				}
				catch(e){
					
				}
				
				if(idArr !== undefined && idArr !== null){
					for(var j=0; j<idArr.length; j++){
						$('.' + idArr[j]).css('visibility', 'visible');
					}				
				}
				
                //console.log("playing tutorial: " + name);
                
            } else {
                var i;
                for (i = 0; i < slideTutorial.tutorialQueue.length; i = i + 1) {
                    if (slideTutorial.tutorialQueue[i].name === name) {
                        return;
                    }
                }
				var obj = {name: name, idArr: idArr, callBack: callBack};
                slideTutorial.tutorialQueue.push(obj);
            }
        
	 },
	 playNext: function () {
		 "use strict";		 
		 
		 slideTutorial.ready = true;
		 
		 if (slideTutorial.tutorialQueue.length > 0) {
            slideTutorial.trigger(slideTutorial.tutorialQueue[0].name, slideTutorial.tutorialQueue[0].idArr, slideTutorial.tutorialQueue[0].callBack);
            slideTutorial.tutorialQueue.splice(0, 1);
		}
	}
 };