// hiding the div that will contain the images
const imagesDiv = document.querySelector("#images");

const fileInput = document.querySelector("#upload");

const filteredImage = document.querySelector("#filteredImage");
let imageToFilter = filteredImage;

var dummyPdf = "http://localhost:8090"

const url = dummyPdf    
const options = {
    method: "GET"
}


async function load_pic() {
    
  const url = dummyPdf;

  const options = {
      method: "GET"
  }

  let response = await fetch(url, options)

  if (response.status === 200) {
      const imageBlob = await response.blob()
      const imageObjectURL = URL.createObjectURL(imageBlob);
      filteredImage.src = imageObjectURL
      imageToFilter.addEventListener("load", () => {
        filteredImage.src = filterImage(imageToFilter, filter, 10, 10, 10, 10);
      });
  }
  else {
      console.log("HTTP-Error: " + response.status)
  }
}


load_pic();

// initializing the filter value
const filterElement = document.getElementsByName("filterRadio");
let filter;
filterElement.forEach((f) => {
  if (f.checked) filter = f.value;
});




// applying the selected filter
filterElement.forEach((f) => {
  f.onclick = () => {
    filter = f.value;
    filteredImage.src = filterImage(imageToFilter, filter,10,10,10,10);
  };
});

filteredImage.setAttribute('draggable', false);


var x0 = null;
var y0 = null;
var x1 = null;
var y1 = null;
var active = false;


filteredImage.addEventListener("mousedown", (e) => {
  filter = "blur";
  active = true;
  var top = Math.round(filteredImage.getBoundingClientRect().top);
  var left = Math.round(filteredImage.getBoundingClientRect().left);
  x0 = e.pageX - left - window.pageXOffset;
  y0 = e.pageY - top - window.pageYOffset;
  // console.log(left, top);
  // console.log(y0)
  // filteredImage.src = filterImage(filteredImage, filter);
})


filteredImage.addEventListener("mousemove", (e)=>{
  filter = "blur";

  if(active) {
    var top = Math.round(filteredImage.getBoundingClientRect().top);
    var left = Math.round(filteredImage.getBoundingClientRect().left);
    x1 = e.pageX - left - window.pageXOffset;
    y1 =  e.pageY - top - window.pageYOffset;
    filteredImage.src = filterImage(filteredImage, filter, x0, y0, x1,y1);
  }
})

filteredImage.addEventListener("mouseup", (e)=>{
  active = false;
})


// fileInput.addEventListener("change", async (e) => {
//   const [file] = fileInput.files;
  
//   // displaying the uploaded image
//   imageToFilter = document.querySelector("#imageToFilter");
//   imageToFilter.src = await fileToDataUri(file);
//   // imageToFilter.src = 'src/images/smile.jpeg'; 
//   // console.log(imageToFilter.src)

//   // making the div containing the image visible
//   imagesDiv.style.visibility = "visible";

//   // applying the defaul filter
//   imageToFilter.addEventListener("load", () => {
//     filteredImage.src = filterImage(imageToFilter, filter, 10, 10, 10, 10);
//   });

//   return false;
// });

function fileToDataUri(field) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      resolve(reader.result);
    });

    reader.readAsDataURL(field);
  });
}

function filterImage(imageToFilter, filter, x0, y0, x1,y1) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const canvasWidth = imageToFilter.width;
  const canvasHeight = imageToFilter.height;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  context.drawImage(imageToFilter, 0, 0, canvasWidth, canvasHeight);

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

  const outputImageData = applyStretch(sourceImageData, blankOutputImageData, x0, y0, x1,y1);
  // const outputImageData = sourceImageData;
    
  context.putImageData(outputImageData, 0, 0);

  return canvas.toDataURL();
}


function applyWarp(sourceImageData, outputImageData, x0,y0, x1,y1){

  return applyConvolution(sourceImageData, outputImageData, [
    0,
    -1,
    0,
    -1,
    5,
    -1,
    0,
    -1,
    0
  ]);

}


function applyFilter(sourceImageData, outputImageData, filter) {
  if (filter === "noFilter") {
    return sourceImageData;
  } else if (filter === "threshold") {
    return applyThreshold(sourceImageData);
  } else if (filter === "sharpen") {
    return applyConvolution(sourceImageData, outputImageData, [
      0,
      -1,
      0,
      -1,
      5,
      -1,
      0,
      -1,
      0
    ]);
  } else if (filter === "blur") {
    return applyConvolution(sourceImageData, outputImageData, [
      1 / 16,
      2 / 16,
      1 / 16,
      2 / 16,
      4 / 16,
      2 / 16,
      1 / 16,
      2 / 16,
      1 / 16
    ]);
  } else {
    return sourceImageData;
  }
}

function applyThreshold(sourceImageData, threshold = 127) {
  const src = sourceImageData.data;

  for (let i = 0; i < src.length; i += 4) {
    const r = src[i];
    const g = src[i + 1];
    const b = src[i + 2];
    // thresholding the current value
    const v = 0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold ? 255 : 0;
    src[i] = src[i + 1] = src[i + 2] = v;
  }

  return sourceImageData;
}

function applyStretch(sourceImageData, outputImageData, x0, y0, x1,y1) {
  const epsilon = 10;
  const src = sourceImageData.data;
  const dst = outputImageData.data;

  const srcWidth = sourceImageData.width;
  const srcHeight = sourceImageData.height;

  const w = srcWidth;
  const h = srcHeight;


  // console.log(src.length, w*h*4);




  // console.log(w,h);


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

  const numCentres = Math.abs(x1-x0) + Math.abs(y1-y0);
  
  var centres = []
  for(t = 0 ; t <= 1 ; t+=1/numCentres) {
    x_t = Math.round((1-t)*x0 + t*x1);
    y_t = Math.round((1-t)*y0 + t*y1);
    if(centres.length == 0){
      centres.push([x_t,y_t]);
    }

    var exists = false;
    for(i = 0 ; i < centres.length ; i++){
        var centre = centres[i];
        if (centre[0] == x_t & centre[1] == y_t) {
          exists = true;
        }
    }

    if(!exists){
      centres.push([x_t,y_t]);
    }

  }

  // var originalPixels = []
  // for(x=0;x<w; x++){
  //   for(y=0;y<h;y++){
  //     if((x-x0)**2 + (y-y0)**2 <= epsilon**2){
  //       originalPixels.push([x,y])
  //     }
  //   }
  // }

  // console.log(originalPixels);

  var uniqueDifferentials = [];

  for(r = 0 ; r<= epsilon; r++){
    for(theta = 0 ; theta< 2*Math.PI; theta+= 1/10){
      x = Math.round(r*Math.cos(theta));
      y = Math.round(r*Math.sin(theta));
      if(uniqueDifferentials.length == 0){
        uniqueDifferentials.push([x,y]);
      }
  
      var exists = false;
      for(i = 0 ; i < uniqueDifferentials.length ; i++){
          var uniqueDifferential = uniqueDifferentials[i];
          if (uniqueDifferential[0] == x & uniqueDifferential[1] == y) {
            exists = true;
          }
      }
  
      if(!exists){
        uniqueDifferentials.push([x,y]);
      }

    }
  }



  for(i=0 ; i<centres.length ; i++){
    var centre = centres[i];
    x_t = centre[0];
    y_t = centre[1];
    for(j = 0 ; j < uniqueDifferentials.length ; j ++ ){
      var uniqueDifferential = uniqueDifferentials[j];
      var dx = uniqueDifferential[0];
      var dy = uniqueDifferential[1];
      x_old = Math.max(Math.min(x0 + dx, w-1),0);
      x_new = Math.max(Math.min(x_t + dx, w-1),0);
      y_old = Math.max(Math.min(y0 + dy,h-1),0);
      y_new = Math.max(Math.min(y_t + dy,h-1),0);

      const offSetOld = (y_old*w + x_old)*4;
      const offSetNew = (y_new*w + x_new)*4;

      dst[offSetNew] = src[offSetOld];
      dst[offSetNew+1] = src[offSetOld+1];
      dst[offSetNew+2] = src[offSetOld+2];
      dst[offSetNew+3] = src[offSetOld+3];

    }
  
  
  }

  return outputImageData;


}


function applyConvolution(sourceImageData, outputImageData, kernel) {
  const src = sourceImageData.data;
  const dst = outputImageData.data;

  const srcWidth = sourceImageData.width;
  const srcHeight = sourceImageData.height;

  const side = Math.round(Math.sqrt(kernel.length));
  const halfSide = Math.floor(side / 2);

  // padding the output by the convolution kernel
  const w = srcWidth;
  const h = srcHeight;

  // iterating through the output image pixels
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0;

      // calculating the weighed sum of the source image pixels that
      // fall under the convolution kernel
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = y + cy - halfSide;
          const scx = x + cx - halfSide;

          if (scy >= 0 && scy < srcHeight && scx >= 0 && scx < srcWidth) {
            let srcOffset = (scy * srcWidth + scx) * 4;
            let wt = kernel[cy * side + cx];
            r += src[srcOffset] * wt;
            g += src[srcOffset + 1] * wt;
            b += src[srcOffset + 2] * wt;
            a += src[srcOffset + 3] * wt;
          }
        }
      }

      const dstOffset = (y * w + x) * 4;

      dst[dstOffset] = r;
      dst[dstOffset + 1] = g;
      dst[dstOffset + 2] = b;
      dst[dstOffset + 3] = a;
    }
  }
  return outputImageData;
}
