// simple.js



pdfjsLib.GlobalWorkerOptions.workerSrc =
    'src/scripts/pdfjs-3.3.122-dist/build/pdf.worker.js';



var dummyPdf = "http://localhost:8080"

var loadingTask = pdfjsLib.getDocument(dummyPdf);


loadingTask.promise.then(
	function (pdf) {
		// Load information from the first page.
		pdf.getPage(1).then(function (page) {
			var scale = 10;
			var viewport = page.getViewport({scale: scale});
            console.log(viewport);

			// Apply page dimensions to the `<canvas>` element.
			var canvas = document.getElementById('pdf');
			var context = canvas.getContext('2d');
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
            
            // .then(function () {
			// 	console.log('Page rendered!');
			// });
		});
	},
	function (reason) {
		console.error(reason);
	},
);