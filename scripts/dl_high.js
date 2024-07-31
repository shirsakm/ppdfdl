let jsPdf = document.createElement("script");
jsPdf.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js';

jsPdf.onload = () => {
    let pdfDocumentName = "{}";
    let doc;

    function generatePDF() {
        let imgTags = document.getElementsByTagName("img");
        let checkURLString = "blob:https://drive.google.com/";
        let validImgTagCounter = 0;

        for (let i = 0; i < imgTags.length; i++) {
            if (imgTags[i].src.substring(0, checkURLString.length) === checkURLString) {
                validImgTagCounter++;
                let img = imgTags[i];
                let canvas = document.createElement('canvas');
                let context = canvas.getContext("2d");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
                let imgDataURL = canvas.toDataURL();
                let orientation = img.naturalWidth > img.naturalHeight ? 'l' : 'p';
                let scalefactor = 1.335;
                let pageWidth = img.naturalWidth * scalefactor;
                let pageHeight = img.naturalHeight * scalefactor;

                if (validImgTagCounter === 1) {
                    doc = new js_pdf({
                        orientation: orientation,
                        unit: "px",
                        format: [pageWidth, pageHeight],
                    });
                    doc.addImage(imgDataURL, "PNG", 0, 0, img.naturalWidth, img.naturalHeight);
                } else {
                    doc.addPage([pageWidth, pageHeight], orientation);
                    doc.addImage(imgDataURL, "PNG", 0, 0, img.naturalWidth, img.naturalHeight);
                }
            }
        }

        pdfDocumentName += ".pdf";
        doc.save(pdfDocumentName)
    }

    let allElements = document.querySelectorAll('*');
    let chosenElement;
    let heightOfScrollableElement = 0;

    for (let i = 0; i < allElements.length; i++) {
        if (allElements[i].scrollHeight >= allElements[i].clientHeight) {
            if (heightOfScrollableElement < allElements[i].scrollHeight) {
                heightOfScrollableElement = allElements[i].scrollHeight;
                chosenElement = allElements[i];
            }
        }
    }

    if (chosenElement.scrollHeight > chosenElement.clientHeight) {
        let scrollDistance = Math.round(chosenElement.clientHeight / 2);
        let loopCounter = 0;

        function myLoop(remainingHeightToScroll, scrollToLocation) {
            loopCounter++;
            setTimeout(() => {
                if (remainingHeightToScroll === 0) {
                    scrollToLocation = scrollDistance;
                    chosenElement.scrollTo(0, scrollToLocation);
                    remainingHeightToScroll = chosenElement.scrollHeight - scrollDistance;
                } else {
                    scrollToLocation += scrollDistance;
                    chosenElement.scrollTo(0, scrollToLocation);
                    remainingHeightToScroll -= scrollDistance;
                }
                if (remainingHeightToScroll >= chosenElement.clientHeight) {
                    myLoop(remainingHeightToScroll, scrollToLocation)
                } else {
                    setTimeout(function () {
                        generatePDF();
                    }, 1500)
                }
            }, 500)
        }

        myLoop(0, 0);
    } else {
        setTimeout(function () {
            generatePDF();
        }, 1500)
    }
}

document.body.appendChild(jsPdf);