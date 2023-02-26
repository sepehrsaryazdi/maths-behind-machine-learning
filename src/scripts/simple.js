// simple.js



pdfjsLib.GlobalWorkerOptions.workerSrc =
    'src/scripts/pdfjs-3.3.122-dist/build/pdf.worker.js';

var vid = document.getElementById("droneVideo");
vid.playbackRate = 10;


var dummyPdf = "http://localhost:8080"

var loadingTask = pdfjsLib.getDocument(dummyPdf);

var pdfSections = document.getElementsByClassName("pdfSection");

loadingTask.promise.then(
	function (pdf) {
		// Load information from the first page.
		for(i = 0 ; i < pdfSections.length ; i++){
			// console.log(pdf.getPage(2))
			pdf.getPage(i).then(function (page) {
				var scale = 10;
				var viewport = page.getViewport({scale: scale});
				var canvas = pdfSections[page._pageIndex];
				// console.log(canvas)

				var context = canvas.getContext("2d");
				// console.log(viewport);

				canvas.height = viewport.height;
				canvas.width = viewport.width;

			//    canvas.height = 0.5*window.innerHeight;
			//    canvas.width = 0.5*window.innerWidth;
				
				// Render the page into the `<canvas>` element.
				var renderContext = {
					canvasContext: context,
					viewport: viewport,
				};
			
				page.render(renderContext);

			
        

			// page.render(renderContext);
            
            // .then(function () {
			// 	console.log('Page rendered!');
			// });
			
			});
		
		}
	},
	function (reason) {
		console.error(reason);
	},
);


// class ScrollController() {
// 	computeDivTopAbsolutePosition(div) {
//         return div.getBoundingClientRect().top + window.pageYOffset
//     }

//     computeDivBottomAbsolutePosition(div) {
//         return div.getBoundingClientRect().bottom + window.pageYOffset
//     }

//     computeDivAbsoluteDifference(div1,div2) {
//         return this.computeDivTopAbsolutePosition(div2) - this.computeDivBottomAbsolutePosition(div1)
//     }
// }


function computeDivTopAbsolutePosition(div) {
	return div.getBoundingClientRect().top + window.pageYOffset
}

pdfTopPositions = []
for(i=0 ; i < pdfSections.length ; i++){
	pdfTopPositions.push(computeDivTopAbsolutePosition(pdfSections[i]));
}

console.log(pdfTopPositions);

// window.addEventListener('scroll', function(event) {
// 	let scroll = this.scrollY;
// 	// console.log(computeDivTopAbsolutePosition(pdfSections[0]));
// 	console.log(scroll);
// 	for(i = 0 ; i < pdfSections.length-1 ; i++){
// 		if(scroll > pdfTopPositions[i]) {
// 			pdfSections[i+1].scrollIntoView();
// 		}
// 	}
// })

var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
var currentSection = 0;

console.log(currentScroll);

for(i = 0 ; i < pdfSections.length-1 ; i++){
	if(currentScroll >= pdfTopPositions[i] & currentScroll < pdfTopPositions[i+1]){
		currentSection = i;
	}
}



document.addEventListener('keydown', event => {
	event.preventDefault();
	if (event.code === 'Space' || event.code === "Enter" || event.code == "ArrowDown" || event.code == "ArrowRight") {
	  console.log('Space pressed')
	  currentSection += 1
	  if(currentSection >= pdfSections.length){
		currentSection = pdfSections.length - 1;
	  }
	  
	} else if (event.code == "ArrowUp" || event.code == "ArrowLeft") {
		currentSection -= 1
		if(currentSection < 0){
			currentSection = 0;
		}
	}

	console.log(currentSection)


	pdfSections[currentSection].scrollIntoView();
  })