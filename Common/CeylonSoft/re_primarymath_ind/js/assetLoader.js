/* class: assetLoader
 * Audio and images preload
 */
function assetLoader() {
  this.PreLoadFromList = function (
    images,
    sounds,
    donecallback,
    progresscallback
  ) {
    "use strict";

    /*if(!(surala.support.iOS) && surala.support.webAudio){
			var context = new AudioContext();
			if(context.state == 'suspended'){
				surala.stage.removeChild(surala.loadcontainer);
				return;	
			}
		}*/

    if (!surala.startBtn) {
      surala.stage.removeChild(surala.loadcontainer);
      return;
    }

    var imagesDone = 0,
      soundsDone = 0,
      imgParent,
      audioParent,
      i,
      img_id,
      audio_id,
      img,
      onLoadFunction,
      onErrorFunction,
      j,
      progress = 0;

    if (images === undefined || images === null) {
      images = [];
    }
    if (sounds === undefined || sounds === null) {
      sounds = [];
    }

    if (images.length + sounds.length === 0) {
      donecallback();
      return;
    }

    if (flash_problem_num != null) {
      sounds = [];
    } else if (!(typeof flash_problem_num === "undefined")) {
      sounds = [];
    }

    function checkDone() {
      try {
        if (progresscallback !== undefined && progresscallback !== null) {
          progress = (
            (imagesDone + soundsDone) /
            (images.length + sounds.length)
          ).toFixed(1);
          progresscallback(progress);
        }

        if (imagesDone === images.length && soundsDone === sounds.length) {
          if (donecallback !== null) {
            donecallback();
          }
        }
      } catch (e) {
        //console.log('Asset Loader JS : checkDone');
      }
    }

    function imageLoadDone() {
      imagesDone = imagesDone + 1;
      //console.log('imagesDone: ' + imagesDone);
      checkDone();
    }

    function SoundLoadDone() {
      soundsDone = soundsDone + 1;
      //console.log('soundsDone: ' + soundsDone);
      checkDone();
    }

    function loadAudioAssets(sounds, j) {
      surala.audio.loadSound(
        sounds[j].name,
        sounds[j].src,
        sounds[j].type,
        1,
        SoundLoadDone
      );
    }

    imgParent = document.getElementById("slideImages");
    audioParent = document.getElementById("slideAudio");

    onLoadFunction = function () {
      imageLoadDone();
    };

    onErrorFunction = function (evt) {
      //console.error("Failed to load image: " + evt.originalTarget.src);
      imageLoadDone();
    };
    try {
      for (i = 0; i < images.length; i = i + 1) {
        img_id = "image_" + images[i].name;

        if (document.getElementById(img_id) !== null) {
          // Skip images that exist already...
          imageLoadDone();
        } else {
          img = new Image();
          img.onload = onLoadFunction;
          img.onerror = onErrorFunction;
          img.src = images[i].src;
          imgParent.appendChild(img);
          img.setAttribute("id", img_id);
          img.anim = images[i].anim;
        }
      }

      for (j = 0; j < sounds.length; j = j + 1) {
        surala.audio.loadSound(
          sounds[j].name,
          sounds[j].src,
          sounds[j].type,
          1,
          SoundLoadDone
        );
      }

      var soundPath = null;
      for (i = 0; i < sounds.length; i++) {
        soundPath =
          sounds[i].src.split("/")[sounds[i].src.split("/").length - 1];
        if (soundPath !== sounds[i].name) {
          console.error(
            "Difference in name and audio path\nSound name: " +
              sounds[i].name +
              " | Sound path: " +
              soundPath
          );
        }
      }
    } catch (e) {
      //console.log('load asset error: '+ e);
    }
  };
}
