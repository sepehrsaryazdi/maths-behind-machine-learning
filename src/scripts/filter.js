

var image = document.getElementById("face");


const canvas = document.getElementById("faceSpace");
const ctx = canvas.getContext("2d");

const img = new Image(); // Create new img element
// img.crossOrigin = "Anonymous";

// filterImage = (img) => {
//     img.data
// }

img.onload = () => {
    
        // console.log(img.data);

        canvasWidth = 250;
        canvasHeight = 150;

        // ctx.drawImage(img,0,0, canvasWidth, canvasHeight);
        const sourceImageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        ctx.putImageData(sourceImageData, 0, 0);
        const blankOutputImageData = ctx.createImageData(
            canvasWidth,
            canvasHeight
          );

          

        
        // ctx.beginPath();
        // ctx.moveTo(30, 96);
        // ctx.lineTo(70, 66);
        // ctx.lineTo(103, 76);
        // ctx.lineTo(170, 15);
        // ctx.stroke();
    }

// img.src = "src/images/smile.jpeg"; // Set source path
img.src = image.src;
// img.crossOrigin="";
