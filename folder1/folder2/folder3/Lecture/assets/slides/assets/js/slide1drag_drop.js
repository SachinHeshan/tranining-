/* JS: drag and drop methods
 * initiates drag methods and controls using knovajs
 */

var layer, stage = null;
var width;
var height;
var currX;
var currY;
var imgArrBg = [];
var rectAreas = [];
var preimageWidth = 0;
var RowImgCount = 0;
var dragArr = [];
var correctAnswers = [];
var imgArr = [];
var imgArrBg = [];

// variables  used for multi element drag and drop functionality

var droppedEleStatus;
var dropbox_index = 0;
var dropped_elem_index = -1;
var dragDropObj = [];
var rect = null;
var dragEndCount = 0;
var droped;
var dropedElements = [];

// function createImage(path) {
// var imageObj = new Image();
// imageObj.src = "assets/images/slide1/" + path + '.png';
// return imageObj;
// }

// create drag and drop elements to canvas
function dragAndDrop(slide) {
    'use strict';
    // clear canvas
    currentQuestion = slideData.content['question' + currentQnNo];
    dragDropObj = [];
    if (stage !== null) {
        stage.clearCache(layer);
        stage.destroy(layer);
        stage.removeChildren();
    }

    width = parseInt(slideData.content.canvasdata.width);
    height = parseInt(slideData.content.canvasdata.height);

    droppedEleStatus = new Array(Object.keys(currentQuestion.dropareadata).length);

    //add drag elements to array 
    showImages(currentQuestion.dragElemts.split(","), buildStage);

    function showImages(sources, callback) {
        var images = {};
        var loadedImages = 0;
        var numImages = sources.length;

        RowImgCount = numImages / 2;
        for (var src in sources) {
            images[src] = new Image();
            images[src].onload = function() {
                if (++loadedImages >= numImages) {
                    callback(images);
                }
            };
            images[src].src = "assets/images/" + slide + "/" + sources[src] + '.png';
        }
        for (var x = 0; x < Object.keys(currentQuestion.dropareadata).length; x++) {
            var obj = { dropboxID: "", dropImgID: "", set: "0" };
            dropedElements[x] = obj;
        }
        for (var i = 0; i < Object.keys(currentQuestion.dropareadata).length; i++) {
            dragDropObj[i] = {};
            dragDropObj[i]["correctAnswerList"] = currentQuestion["correctAnswerList" + i].split(',');
            //dragDropObj[i]["correctAnswerList1"] = currentQuestion["correctAnswerList" + (i + 5)].split(',');
            dragDropObj[i]["dropCount"] = dragDropObj[i]["correctAnswerList"].length;
            dragDropObj[i]["droppedEleStatus"] = [];
        }
    }

    // add drag and drop elements events 
    function buildStage(images) {
        'use strict';
        layer.removeChildren();
        for (var i = 0; i < Object.keys(currentQuestion.dropareadata).length; i++) {
            layer.add(rect[i]);
        }
        for (var x = 0; x < Object.keys(currentQuestion.dropareadata).length; x++) {
            var droppable_ele_perBox = null;
            droppable_ele_perBox = currentQuestion["correctAnswerList" + x].split(',');
            for (var i = 0; i < droppable_ele_perBox.length; i++) {
                layer.add(rectAreas[x][i]);
            }
        }
        stage.add(layer);
        for (var i = 0; i < Object.keys(currentQuestion.dragElemtspos).length; i++) {
            // drag Items background images
            imgArrBg[i] = new Konva.Image({
                x: parseInt(currentQuestion.dragElemtspos["element" + (i + 1)].x),
                y: parseInt(currentQuestion.dragElemtspos["element" + (i + 1)].y),
                image: images[i],
                draggable: false,
                id: "imgBg" + (i + 1),
                opacity: 0.2
            });

            // draggable images
            imgArr[i] = new Konva.Image({
                x: parseInt(currentQuestion.dragElemtspos["element" + (i + 1)].x),
                y: parseInt(currentQuestion.dragElemtspos["element" + (i + 1)].y),
                image: images[i],
                draggable: false,
                id: "q" + currentQnNo + "dragItem" + (i + 1),
                opacity: 1,
                dragBoundFunc: function(pos) {
                    var newY = pos.y < 0 ? 0 : (pos.y > height - this.getAttr('height') ? height - this.getAttr('height') : pos.y);
                    var newX = pos.x < 0 ? 0 : (pos.x > width - this.getAttr('width') ? width - this.getAttr('width') : pos.x);
                    currX = newX;
                    currY = newY;

                    return {
                        x: newX,
                        y: newY
                    }

                }
            });
            // if (i >= 5 && i < Object.keys(currentQuestion.dragElemtspos).length) {
            // imgArr[i].setAttr('visible', false);
            // imgArrBg[i].setAttr('visible', false);
            // }

            layer.draw();

            var originalProperties;
            originalProperties = [{ x: imgArr[0].getAttr('x'), y: imgArr[0].getAttr('y'), id: imgArr[0].getAttr('id') }];
            correctAnswers.push(imgArr[i]);
            preimageWidth = preimageWidth + imgArr[i].getAttr('width');
            imgArr[i].on('dragmove', function() {
                this.moveToTop();
                layer.draw();
            });

            imgArr[i].on('mouseout', function() {
                $("#container canvas").css('cursor', 'default');
            });

            // on drop event
            imgArr[i].on('dragend', function() {
                dragEndCount++;
                dropped_elem_index = -1;
                this.x = currX;
                this.y = currY;
                var idstring = this.getAttr("id");
                var id = idstring.slice(-2).replace(/^\D+/g, '');
                var getBox = null;

                try {
                    for (var y = 0; y < Object.keys(currentQuestion.dropareadata).length; y++) {

                        for (var x = 0; x < rectAreas[y].length; x++) {
                            dropped_elem_index += 1;
                            if (currX > rectAreas[y][x].getAttr('x') - rectAreas[y][x].getAttr('width') &&
                                currX < (rectAreas[y][x].getAttr('x') + rectAreas[y][x].getAttr('width')) &&
                                currY > rectAreas[y][x].getAttr('y') - rectAreas[y][x].getAttr('height') &&
                                currY < (rectAreas[y][x].getAttr('y') + rectAreas[y][x].getAttr('height'))) {
                                dropbox_index = y;
                                getBox = x;
                                break;
                            }
                        }
                        if (getBox != null) {
                            break;
                        }
                    }

                    if (getBox !== null && ansArray[dropbox_index][getBox] !== "complete") {
                        var xmin = rectAreas[dropbox_index][getBox].getAttr('x') - rectAreas[dropbox_index][getBox].getAttr('width');
                        var xmax = rectAreas[dropbox_index][getBox].getAttr('x') + rectAreas[dropbox_index][getBox].getAttr('width');
                        var ymin = rectAreas[dropbox_index][getBox].getAttr('y') - rectAreas[dropbox_index][getBox].getAttr('height');
                        var ymax = rectAreas[dropbox_index][getBox].getAttr('y') + rectAreas[dropbox_index][getBox].getAttr('height');

                        if (currX > xmin && currX < xmax && currY > ymin && currY < ymax) {
                            // var vid = parseInt(id) - 1;
                            // var imgObj = createImage("dragA" + (vid + 1) + 'a');
                            // imgArr[vid].setAttr('image', imgObj);
                            // imgArr[vid].cache();
                            // imgArr[vid].drawHitFromCache();
                            this.setAttr('x', rectAreas[dropbox_index][getBox].getAttr('x') + (rectAreas[dropbox_index][getBox].getAttr('width') / 2) - (this.getAttr('width') / 2)).setAttr('y', rectAreas[dropbox_index][getBox].getAttr('y') + (rectAreas[dropbox_index][getBox].getAttr('height') / 2) - (this.getAttr('height') / 2));
                            var index = dragArr.indexOf(this.getAttr('id'));
                            pushID(index, this, imgArrBg[id - 1], getBox, dropbox_index);
                        } else {
                            revertDrag(this, id, dropbox_index);
                        }
                    } else {
                        revertDrag(this, id, dropbox_index);
                    }
                    layer.draw();

                }
                //}
                catch (e) {
                    console.log('Error caught' + e);
                }
            });

            imgArrBg[i].cache();
            imgArrBg[i].drawHitFromCache();
            layer.add(imgArrBg[i]);
            imgArr[i].cache();
            imgArr[i].drawHitFromCache();
            layer.add(imgArr[i]);
            layer.add(text);
            stage.add(layer);
        }

        // revert on dropoutside of drop box		
        function revertDrag(obj, id, dropBoxNo) {
            var index = dragArr.indexOf(obj.getAttr('id'));
            checkDrop(index, obj, imgArrBg[id - 1]);
            var checkIndex = dragDropObj[dropBoxNo]["droppedEleStatus"].indexOf(obj.getAttr('id')); //droppedEleStatus.indexOf(obj.getAttr('id'));
            for (var y = 0; y < Object.keys(currentQuestion.dropareadata).length; y++) {
                for (var x = 0; x < rectAreas[y].length; x++) {
                    if (dragDropObj[y]["droppedEleStatus"][x] == obj.getAttr('id')) {
                        dragDropObj[y]["droppedEleStatus"][x] = "0";
                    }
                }
            }
        }

        function pushID(index, obj, bgObj, getBox, dropBoxNo) {
            for (var i = 0; i < Object.keys(currentQuestion.dragElemtspos).length; i++) { //dragDropObj[dropBoxNo]["dropCount"]
                switch (getBox) {
                    case i:
                        // if element exist in the drop area 
                        if (dragDropObj[dropBoxNo]["droppedEleStatus"][getBox] !== "0" && dropedElements[dropped_elem_index].dropboxID === "dropBox" + dropped_elem_index && dropedElements[dropped_elem_index].set === "1" && dropedElements[dropped_elem_index].dropImgID !== obj.getAttr('id')) {
                            replaceAfterDrop(getBox, obj, dropBoxNo);
                        }
                        resetDropBox(obj, dropBoxNo);

                        layer.draw();
                        for (var y = 0; y < Object.keys(currentQuestion.dropareadata).length; y++) {
                            for (var x = 0; x < rectAreas[y].length; x++) {
                                if (dragDropObj[y]["droppedEleStatus"][x] == obj.getAttr('id')) {
                                    dragDropObj[y]["droppedEleStatus"][x] = "0";
                                }
                            }
                        }
                        dragDropObj[dropBoxNo]["droppedEleStatus"][getBox] = obj.getAttr('id');
                        break;
                }
            }

            dropedElements[dropped_elem_index].dropboxID = "dropBox" + dropped_elem_index;
            dropedElements[dropped_elem_index].dropImgID = obj.getAttr('id');
            dropedElements[dropped_elem_index].dropImgBgID = bgObj.getAttr('id');
            dropedElements[dropped_elem_index].set = "1";
            layer.draw();
        }

        function replaceAfterDrop(getBox, obj, dropBoxNo) {
            var imgShape = stage.find('#' + dropedElements[dropped_elem_index].dropImgBgID)[0];
            stage.find("#" + dropedElements[dropped_elem_index].dropImgID).setAttr('x', imgShape.getAttr('x')).setAttr('y', imgShape.getAttr('y'));
            var checkIndex = dragDropObj[dropBoxNo]["droppedEleStatus"].indexOf(obj.getAttr('id'));
            if (checkIndex > -1) {
                dragDropObj[dropBoxNo]["droppedEleStatus"][checkIndex] = "0";
            }
        }

        function checkDrop(index, obj, bgObj) {
            if (index > -1) {
                dragArr.splice(index, 1);
            }

            obj.setAttr('x', bgObj.getAttr('x')).setAttr('y', bgObj.getAttr('y'));
            layer.draw();
        }

    }

    /*create stage, group  and layer*/
    stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });

    var blueGroup = new Konva.Group({
        width: width,
        height: height
    });

    layer = new Konva.Layer();

    /*print some text*/
    var text = new Konva.Text({
        x: 10,
        y: 200,
        fontFamily: 'DFGKyouKaShoRW5',
        fontSize: 24,
        text: '',
        fill: 'black'
    });

    /*droppable container area*/

    rect = [];

    for (var i = 0; i < Object.keys(currentQuestion.dropareadata).length; i++) {
        rect[i] = new Konva.Rect({

            x: parseInt(currentQuestion.dropareadata['dropareadata' + (i + 1)].dropboxX),
            y: parseInt(currentQuestion.dropareadata['dropareadata' + (i + 1)].dropboxY),
            width: parseInt(currentQuestion.dropareadata['dropareadata' + (i + 1)].dropboxWidth),
            height: parseInt(currentQuestion.dropareadata['dropareadata' + (i + 1)].dropboxHeight),
            // stroke: '#7F7F7F',
            // strokeWidth: 4,
            dash: [15, 10],
            id: "outerBox" + (i + 1),
            cornerRadius: 10
        });
        blueGroup.add(rect[i]);
        layer.add(rect[i]);
    }

    // droppable elements

    var index = 1;
    for (var x = 0; x < Object.keys(currentQuestion.dropareadata).length; x++) {
        rectAreas[x] = [];
        var droppable_ele_perBox = null;
        droppable_ele_perBox = currentQuestion["correctAnswerList" + x].split(',');
        for (var i = 0; i < droppable_ele_perBox.length / 2; i++) {
            rectAreas[x][i] = new Konva.Rect({
                x: parseInt(currentQuestion.dropElemtspos["element" + index].x),
                y: parseInt(currentQuestion.dropElemtspos["element" + index].y),
                width: parseInt(currentQuestion["dropElemtsArea"].width), //150,dropElemtsArea
                height: parseInt(currentQuestion["dropElemtsArea"].height), //125,
                id: "dropBox" + i,
                // fill: 'blue',
                // stroke: 2,
                cursor: 'pointer'
            });
            blueGroup.add(rectAreas[x][i]);
            layer.add(rectAreas[x][i]);
            index += 1;
        }
    }
    stage.add(layer);

}

// reset dropped elements
function resetDropBox(obj, dropBoxNo) {
    for (var i = 0; i < dragDropObj[dropBoxNo]["droppedEleStatus"].length; i++) {
        if (obj.getAttr('id') === dropedElements[i].dropImgID) {
            var checkIndex1 = dragDropObj[dropBoxNo]["droppedEleStatus"].indexOf(dropedElements[i].dropImgID);
            if (checkIndex1 > -1) {
                dragDropObj[dropBoxNo]["droppedEleStatus"][checkIndex1] = "0";
            }
        }
    }
}

/* drag and drop functionalities end */