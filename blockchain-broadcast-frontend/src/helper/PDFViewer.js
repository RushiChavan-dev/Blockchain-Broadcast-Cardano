import React, { useRef, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';
import * as pdfjsWorker from 'pdfjs-dist';

// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



function PDFViewer({ startPage, endPage , title}) {
  console.log("test")
    const containerRef = useRef(null);


    function getPdfPath(title) {
      let pdfPath;
      console.log(title)
  
      switch(title) {
          case 'The Great Gatsby':
              pdfPath = require('../books/gatsby.pdf');
              break;
          case 'Pride and Prejudice':
              pdfPath = require('../books/jane.pdf');
              break;
          case 'Sapiens: A Brief History of Humankind':
              pdfPath = require('../books/yuval.pdf');
              break;
          case "Let's Explore Diabetes with Owls":
              pdfPath = require('../books/sedaris.pdf');
              break;
          case "Becoming":
              pdfPath = require('../books/michelle.pdf');
              break;
          case "The Hobbit":
              pdfPath = require('../books/hobbit.pdf');
              break;
          case "Leaves of Grass":
              pdfPath = require('../books/walt.pdf');
              break;
          // Add more cases as needed
          default:
              console.warn('No matching PDF for this title.');
              break;
      }
  
      return pdfPath;
  }
  
  
  useEffect(() => {
    console.log("Working")
    async function fetchAndRenderPdf() {
        console.log(title);
        const pdfPath = getPdfPath(title);

        try {
            const pdf = await pdfjs.getDocument(pdfPath).promise;

            for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
                // Create a canvas for each page and append to the container
                const canvas = document.createElement('canvas');
                containerRef.current.appendChild(canvas);

                const page = await pdf.getPage(pageNumber);
                const viewport = page.getViewport({ scale: 1.2 });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: canvas.getContext('2d'),
                    viewport: viewport
                };
                page.render(renderContext);
            }
        } catch (error) {
            console.error("Error rendering PDF: ", error);
        }
    }

    fetchAndRenderPdf();
}, [startPage, endPage, title]);

    return(
      <>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <h1>{title}</h1>
          </div>
          <div ref={containerRef}></div>
      </>
  )
  
  }
  

export default PDFViewer;

// function PDFViewer({ url }) {
//     const canvasRef = useRef(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');

//         // Load the PDF
//         const loadingTask = pdfjs.getDocument(url);
//         loadingTask.promise.then(pdf => {
//             console.log('PDF loaded');

//             // Fetch the first page
//             const pageNumber = 1;
//             pdf.getPage(pageNumber).then(page => {
//                 console.log('Page loaded');

//                 const viewport = page.getViewport({ scale: 1.0 });

//                 // Prepare canvas using PDF page dimensions
//                 canvas.height = viewport.height;
//                 canvas.width = viewport.width;

//                 // Render PDF page into canvas context
//                 const renderContext = {
//                     canvasContext: context,
//                     viewport: viewport
//                 };
//                 const renderTask = page.render(renderContext);
//                 renderTask.promise.then(() => {
//                     console.log('Page rendered');
//                 });
//             });
//         });
//     }, [url]);

//     return <canvas ref={canvasRef} />;
// }

// export default PDFViewer;
