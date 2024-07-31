let jsPdf = document.createElement("script");
jsPdf.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js';

jsPdf.onload = () => {
    let pdf = new jsPDF();
    let elements = document.getElementsByTagName("img");

    for (let i = 0; i < elements.length; i++) {
        let img = elements[i];

        if (!/^blob:/.test(img.src)) {
            continue;
        }

        let canvas = document.createElement('canvas');
        let context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        let imgData = canvas.toDataURL("image/jpeg", 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.addPage();
    }

    pdf.save("{}.pdf");
}

document.body.appendChild(jsPdf);