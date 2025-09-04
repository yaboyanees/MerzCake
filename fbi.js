        document.getElementById('download-button').addEventListener('click', async function() {
            const button = this;
            button.disabled = true;
            button.textContent = 'Preparing Download...';
            
            // Get the HTML content of the report wrapper
            let content = document.getElementById('report-content-wrapper').innerHTML;
            
            // Create a temporary DOM element to manipulate the content for download
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;

            // --- Image Embedding Logic ---
            // Find all images and convert them to Base64 data URIs to embed them in the DOCX
            const imageElements = tempDiv.querySelectorAll('img');
            const imagePromises = Array.from(imageElements).map(async (img) => {
                // Use a try-catch block to prevent a single failed image from stopping the process
                try {
                    // Use a cors-anywhere proxy to prevent CORS errors when fetching from different domains
                    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
                    const response = await fetch(proxyUrl + img.src);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch image: ${response.statusText}`);
                    }
                    const blob = await response.blob();
                    const dataUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                    img.src = dataUrl;
                } catch (error) {
                    console.error('Error fetching or converting image for DOCX:', img.src, error);
                }
            });

            await Promise.all(imagePromises);

            // --- FIX: Layout Conversion for DOCX ---
            // Find the flex container with the seal and address and convert it to a table
            const sealContainer = tempDiv.querySelector('[data-export-layout="seal-header"]');
            if (sealContainer) {
                const image = sealContainer.querySelector('img');
                const textDiv = sealContainer.querySelector('div');

                if (image && textDiv) {
                    // Set explicit size on image for better DOCX rendering. 96px is equivalent to Tailwind's h-24/w-24.
                    image.setAttribute('width', '96');
                    image.setAttribute('height', '96');
                    image.style.width = '96px';
                    image.style.height = '96px';
                    image.removeAttribute('class');

                    // Create a table to replicate the flex layout, which is more DOCX-friendly
                    const table = document.createElement('table');
                    table.setAttribute('style', 'border: none; border-collapse: collapse; width: 100%;');
                    
                    const tbody = document.createElement('tbody');
                    const tr = document.createElement('tr');

                    const tdImage = document.createElement('td');
                    tdImage.setAttribute('style', 'width: 100px; vertical-align: top; border: none;');
                    tdImage.appendChild(image.cloneNode(true));

                    const tdText = document.createElement('td');
                    tdText.setAttribute('style', 'vertical-align: top; padding-left: 24px; border: none;');
                    tdText.appendChild(textDiv.cloneNode(true));
                    
                    tr.appendChild(tdImage);
                    tr.appendChild(tdText);
                    tbody.appendChild(tr);
                    table.appendChild(tbody);
                    
                    // Replace the original flex div with the new table
                    sealContainer.parentNode.replaceChild(table, sealContainer);
                }
            }

            // Remove contenteditable attributes
            tempDiv.querySelectorAll('[contenteditable="true"]').forEach(el => el.removeAttribute('contenteditable'));
            
            // For DOCX, we'll embed the header/footer directly inside the page content for better compatibility
            tempDiv.querySelectorAll('.page').forEach(page => {
                const header = page.querySelector('.page-header');
                const footer = page.querySelector('.page-footer');
                const reportContent = page.querySelector('.report-content');

                if(header && reportContent) {
                    const headerClone = header.cloneNode(true);
                    headerClone.style.textAlign = 'center';
                    headerClone.style.fontWeight = 'bold';
                    reportContent.insertBefore(headerClone, reportContent.firstChild);
                    header.remove();
                }

                if(footer && reportContent) {
                    const footerClone = footer.cloneNode(true);
                    footerClone.style.textAlign = 'center';
                    footerClone.style.fontWeight = 'bold';
                    reportContent.appendChild(footerClone);
                    footer.remove();
                }
            });


            const finalContent = tempDiv.innerHTML;

            const fullHtml = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <style>
                        /* Basic styles for Word doc */
                        body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; }
                        h2 { font-size: 14pt; font-weight: bold; }
                        h3 { font-size: 12pt; font-weight: bold; margin-top: 16px; font-style: italic; }
                        ul { list-style-type: disc; padding-left: 40px; }
                        li { margin-bottom: 6px; }
                        p { margin-bottom: 10px; }
                        strong { font-weight: bold; }
                        .report-meta strong { display: inline-block; width: 200px; }
                        .main-title { text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 20px; }
                        
                        /* Replicating section header style for Word */
                        .section-header { 
                            background-color: #014791; 
                            color: white; 
                            padding: 8px 12px;
                            margin-top: 24px;
                            margin-bottom: 12px;
                        }
                        
                        /* Page break logic for Word */
                        .page {
                           page-break-after: always;
                        }

                    </style>
                </head>
                <body>
                    ${finalContent}
                </body>
                </html>
            `;
            
            // Convert the HTML string to a DOCX blob
            const converted = htmlDocx.asBlob(fullHtml);
            
            // Use FileSaver.js to save the file
            saveAs(converted, 'FBI-IIR-Report.docx');

            // Restore button state
            button.disabled = false;
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Download as DOCX';
        });
