document.getElementById('download-button').addEventListener('click', async function() {
    const button = this;
    button.disabled = true;
    button.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Preparing Download...
    `;
    
    // Get the HTML content of the report wrapper
    let content = document.getElementById('report-content-wrapper').innerHTML;
    
    // Create a temporary DOM element to manipulate the content for download
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // --- Image Embedding & Layout Conversion Logic ---
    const imageElements = tempDiv.querySelectorAll('img');
    const imagePromises = Array.from(imageElements).map(async (img) => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('data:')) {
            try {
                const response = await fetch(`https://cors-anywhere.herokuapp.com/${src}`);
                if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
                const blob = await response.blob();
                const dataUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
                img.src = dataUrl;
            } catch (error) {
                console.error('Error fetching or converting image for DOCX:', error);
            }
        }
    });

    await Promise.all(imagePromises);

    // Convert the flexbox header to a table for better DOCX compatibility
    tempDiv.querySelectorAll('.flex.items-center.space-x-6').forEach(flexContainer => {
        const img = flexContainer.querySelector('img');
        const textDiv = flexContainer.querySelector('div');
        if(img && textDiv) {
            const table = document.createElement('table');
            table.setAttribute('style', 'width: 100%; border-collapse: collapse;');
            const tbody = document.createElement('tbody');
            const tr = document.createElement('tr');
            
            const td1 = document.createElement('td');
            td1.setAttribute('style', 'width: 1.25in; vertical-align: top;');
            const imgClone = img.cloneNode(true);
            imgClone.setAttribute('style', 'width: 0.9in; height: auto;');
            td1.appendChild(imgClone);

            const td2 = document.createElement('td');
            td2.setAttribute('style', 'vertical-align: top; padding-left: 20px;');
            td2.innerHTML = textDiv.innerHTML;
            
            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
            table.appendChild(tbody);
            flexContainer.parentNode.replaceChild(table, flexContainer);
        }
    });

    tempDiv.querySelectorAll('[contenteditable="true"]').forEach(el => el.removeAttribute('contenteditable'));
    
    const headerText = tempDiv.querySelector('.page-header')?.textContent || 'UNCLASSIFIED//FOR OFFICIAL USE ONLY';
    const footerText = tempDiv.querySelector('.page-footer')?.textContent || 'UNCLASSIFIED//FOR OFFICIAL USE ONLY';

    tempDiv.querySelectorAll('.page-header, .page-footer').forEach(el => el.remove());

    const finalContent = tempDiv.innerHTML;

    const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; }
                h2 { font-size: 14pt; font-weight: bold; }
                h3 { font-size: 12pt; font-weight: bold; margin-top: 16px; font-style: italic; }
                ul { list-style-type: disc; padding-left: 40px; }
                li { margin-bottom: 6px; }
                p { margin-bottom: 10px; }
                strong { font-weight: bold; }
                .report-meta strong { display: inline-block; width: 200px; }
                .main-title { text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 20px; }
                
                .section-header { 
                    background-color: #014791; 
                    color: white; 
                    padding: 12px 12px;
                    margin-top: 24px;
                    margin-bottom: 12px;
                }
                
                .page { page-break-after: always; }
                .page:last-child { page-break-after: avoid; }
            </style>
        </head>
        <body>
            <div id="header" style="text-align: center; font-family: 'Times New Roman', Times, serif; font-weight: bold;">
                ${headerText}
            </div>
            <div id="footer" style="text-align: center; font-family: 'Times New Roman', Times, serif; font-weight: bold;">
                ${footerText}
            </div>

            ${finalContent}
        </body>
        </html>
    `;
    
    // Convert the HTML string to a DOCX blob
    const converted = htmlDocx.asBlob(fullHtml, {
        orientation: 'portrait',
        margins: {
            top: 720,
            right: 720,
            bottom: 720,
            left: 720,
            header: 360,
            footer: 360,
        },
        header: true,
        footer: true,
    });
    
    saveAs(converted, 'FBI-IIR-Report.docx');

    button.disabled = false;
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Download as DOCX';
});
