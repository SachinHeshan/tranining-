 /* JS: bookmark 
  * dynamically generates bookmarks for the unit 
  * assign slides for each bookmarking.
  */ 
 
 function generateBookmark() {
	'use strict';
	
	surala.enableBookmark = false;
	
	// generate bookmark list
	var bookmarklist = document.getElementById('bookmarklist');
	for(var i=0; i< bookmarkRange.length; i++){
		var new_bookmark = document.createElement('div');
		
		// open chest for 1st bookmark
		if(i === 0) { 
			new_bookmark.className = "chest_open bookmarkItem"; 
		} else{
			new_bookmark.className = "chest_closed bookmarkItem";
		}
		
		new_bookmark.style.display = "inline-block";
		new_bookmark.id = "bookmark_" + (i+1);
		bookmarklist.appendChild(new_bookmark);
		document.getElementById("bookmark_" + (i+1)).setAttribute("onclick", 'loadNextSlide(' + bookmarkRange[i] + ")");
	}
 }
 
 function loadNextSlide(slideNo){
	 'use strict';	  	 	
	 if($('#bookmark_'+(bookmarkRange.indexOf(slideNo)+1)).hasClass("chest_open") || !surala.enableBookmark){
		 return;
	 } else{
		 if(preloadStatus){		 
			 if((bookmarkRange.indexOf(slideNo)) > -1){
				 preloadStatus = false;
				 
				 surala.currentSlide = slideNo;	
				 surala.disablecallOut();
				 surala.slideTutorial.tutorialQueue = [];
				 surala.audio.stopAllNonLoopSounds(); 
				 surala.slideNavigation.blinkNextBtn(false);
				 surala.character.stopAllAnimation();
				 surala.slidecontainer.src = 'assets/slides/slide' + surala.currentSlide + '.html';
				 $('.bookmarkItem').addClass("chest_closed").removeClass("chest_open");
				 $('#bookmark_' + (bookmarkRange.indexOf(slideNo) + 1)).removeClass("chest_closed").addClass("chest_open");
				 $('#playPause').attr('class', 'pause_w');
				 surala.slideNavigation.updateSlideNo();
			 }
		 }
	 }
	 //console.log('preloadStatus: ' + preloadStatus);
 }
 
 function loadPrevSlide(slideNo){
	 'use strict';
	  
	 surala.currentSlide = slideNo;	
	 surala.disablecallOut();
	 surala.slideTutorial.tutorialQueue = [];
	 surala.audio.stopAllNonLoopSounds(); 
	 surala.slideNavigation.blinkNextBtn(false);
	 surala.character.stopAllAnimation();
	 
	 surala.slidecontainer.src = 'assets/slides/slide' + surala.currentSlide + '.html';	
	 if((bookmarkRange.indexOf(slideNo)) > -1){
		 $('.bookmarkItem').addClass("chest_closed").removeClass("chest_open");
		 $('#bookmark_'+(bookmarkRange.indexOf(slideNo)+1)).removeClass("chest_closed").addClass("chest_open");
	 }else if((bookmarkRange.indexOf(slideNo+1)) > -1){
		 $('.bookmarkItem').addClass("chest_closed").removeClass("chest_open");
		 $('#bookmark_'+bookmarkRange.indexOf(slideNo+1)).removeClass("chest_closed").addClass("chest_open");
	 }
 }
 
 /* spot functionality to disable bookmarks and highlight respective bookmarks */
 function disableBookmark(){
 	if(disp_page_array.length > 0){
	 	$('.bookmarkItem').removeAttr('onclick');
		$('.bookmarkItem').css('cursor','default');
	 }
 }
 
 function checkBookmarkPos(slideNo){
	 surala.currentSlide = slideNo;	
	 if(slideNo >= bookmarkRange[bookmarkRange.length-1]){
		$('.bookmarkItem').addClass("chest_closed").removeClass("chest_open");
		$('#bookmark_'+bookmarkRange.length).removeClass("chest_closed").addClass("chest_open");
	 } else {
		 for(slideNo; slideNo<=surala.totalSlides; slideNo++){
			if((bookmarkRange.indexOf(slideNo)) > -1){
				x = bookmarkRange.indexOf(slideNo)
				//console.log('slideNo: '+slideNo+' index: '+x)
				$('.bookmarkItem').addClass("chest_closed").removeClass("chest_open");
				$('#bookmark_'+x).removeClass("chest_closed").addClass("chest_open");
				return slideNo;
			}
		 }
	 }
 }
 /* spot function end */