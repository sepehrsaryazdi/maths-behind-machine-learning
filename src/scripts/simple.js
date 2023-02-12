// simple.js



pdfjsLib.GlobalWorkerOptions.workerSrc =
    'src/scripts/pdfjs-3.3.122-dist/build/pdf.worker.js';



var dummyPdf = "http://localhost:8080"

var loadingTask = pdfjsLib.getDocument(dummyPdf);


loadingTask.promise.then(
	function (pdf) {
		// Load information from the first page.
		pdf.getPage(1).then(function (page) {
			var scale = 20;
			var viewport = page.getViewport({scale: scale});
            var canvas = document.getElementById("pdf");
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
	},
	function (reason) {
		console.error(reason);
	},
);