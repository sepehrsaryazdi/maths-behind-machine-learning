// const filteredImage = document.querySelector("#filteredImage");



// const faceSpace = document.querySelector("#faceSpace");

var canvas = document.getElementById("faceSpace");


var bezierPoints = [];

var tValues = [];
var n = 10;
for(i = 0 ; i < n ; i++){
    tValues.push(i/n);
}

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var context = canvas.getContext("2d");

var currentTIndex = 0;

var active = false;




function randomPoint() {
    var x = Math.round(Math.random()*canvasWidth);
    var y = Math.round(Math.random()*canvasHeight);
    return [x,y];
}



filteredImage.addEventListener("mousedown", (e) => {
    active = true;
    // var top = Math.round(filteredImage.getBoundingClientRect().top);
    // var left = Math.round(filteredImage.getBoundingClientRect().left);
    // x0 = e.pageX - left - window.pageXOffset;
    // y0 = e.pageY - top - window.pageYOffset;

    bezierPoints.pop();
    bezierPoints.pop();
    bezierPoints.pop();
    bezierPoints.push(randomPoint());
    bezierPoints.push(randomPoint());
    bezierPoints.push(randomPoint());
    
  })
  
  
  filteredImage.addEventListener("mousemove", (e)=>{  
    if(active) {

        currentTIndex += 1;
        if(currentTIndex == tValues.length){
            currentTIndex = 0;
            bezierPoints.shift();
            bezierPoints.push(randomPoint());
        }

        var t = tValues[currentTIndex];
        
        var currentPointX = Math.round((1-t)**2*bezierPoints[0][0] + 2*t*(1-t)*bezierPoints[1][0] + t**2*bezierPoints[2][0]);
        var currentPointY = Math.round((1-t)**2*bezierPoints[0][1] + 2*t*(1-t)*bezierPoints[1][1] + t**2*bezierPoints[2][1]);

        console.log(currentPointX, currentPointY);

        var canvasData = context.getImageData(0, 0, canvasWidth, canvasHeight);

        for(i = 0 ; i<canvasData.length ; i ++ ){
            canvasData[i] = 255;
        }

        canvasData.data[currentPointY*canvasWidth + currentPointX] = 5;
        canvasData.data[currentPointY*canvasWidth + currentPointX + 1] = 10;
        canvasData.data[currentPointY*canvasWidth + currentPointX + 2] = 30;
        canvasData.data[currentPointY*canvasWidth + currentPointX + 3] = 255;

        context.putImageData(canvasData, 0, 0);  
    }
  })
  
  filteredImage.addEventListener("mouseup", (e)=>{
    active = false;
  })
  


  function addPoints(imageToFilter, x0,y0){

    // const canvas = document.createElement("canvas");
    // const context = canvas.getContext("2d");

    canvasWidth = imageToFilter.width;
    canvasHeight = imageToFilter.height;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // context.drawImage(faceSpace, 0, 0, canvasWidth, canvasHeight);

    const sourceImageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    const blankOutputImageData = context.createImageData(
        canvasWidth,
        canvasHeight
    );

    // const outputImageData = applyWarp(
    //   sourceImageData,
    //   blankOutputImageData,
    //   1,1,1,1
    // );

    const outputImageData = addBlackPoint(sourceImageData, blankOutputImageData, x0, y0);
    // const outputImageData = sourceImageData;
        
    context.putImageData(outputImageData, 0, 0);

    return canvas.toDataURL();
  }



  function addBlackPoint(sourceImageData, outputImageData, x0,y0) {
    const src = sourceImageData.data;
    const dst = outputImageData.data;
  
    const srcWidth = sourceImageData.width;
    const srcHeight = sourceImageData.height;
  
    const w = srcWidth;
    const h = srcHeight;
  
    for(x=0 ; x<w; x++){
      for(y=0 ; y<h; y++){
        // console.log(y*w+x);
        const offSet = (y*w + x)*4;
        dst[offSet] = src[offSet];
        dst[offSet+1] = src[offSet+1];
        dst[offSet+2] = src[offSet+2];
        dst[offSet+3] = src[offSet+3];
      }
    }

    const addedPointOffset = (y0*w + x0)*4;
    dst[addedPointOffset] = 0;
    dst[addedPointOffset+1] = 0;
    dst[addedPointOffset+2] = 0;
    dst[addedPointOffset+3] = 255;

    
  
    return outputImageData;
  
  
  }