const SlidePresenter = {
    // ... config, sideNav, presentationManager objects remain the same ...

    // --- Toolbar Module ---
    toolbar: {
        init() {
            document.getElementById('toolbar').addEventListener('click', (e) => {
                const button = e.target.closest('.toolbar-button');
                if (button && button.dataset.command) {
                    e.preventDefault();
                    const command = button.dataset.command;
                    
                    // MODIFIED: Handle the new save command
                    if (command === 'save-pptx') {
                        SlidePresenter.exportToPptx(button); // Pass the button for UI feedback
                    } else {
                        document.execCommand(command, false, null);
                    }
                }
            });
            document.getElementById('font-selector').addEventListener('change', (e) => document.execCommand('fontName', false, e.target.value));
            document.getElementById('color-picker').addEventListener('input', (e) => document.execCommand('foreColor', false, e.target.value));
        }
    },

    // --- D3 Map Module ---
    d3Map: {
        // ... d3Map object remains the same ...
    },

    // --- NEW: PPTX Export Module ---
    exportToPptx: async function(button) {
        if (typeof PptxGenJS === 'undefined' || typeof html2canvas === 'undefined') {
            alert('Error: A required library for PPTX export is not loaded!');
            return;
        }

        // --- UI Feedback ---
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_16x9';
        pptx.author = 'Slide Presenter';
        pptx.title = 'Web-Based Presentation';

        const slideElements = document.querySelectorAll('.slide-wrapper .slide');
        const delay = ms => new Promise(res => setTimeout(res, ms));

        // Helper function to fetch and convert images to base64
        const imageToBase64 = async (url) => {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        };

        for (const slideEl of slideElements) {
            const layout = slideEl.getAttribute('data-layout');
            const slide = pptx.addSlide();
            slide.background = { color: 'FFFFFF' }; // White background for all slides

            // Add Header Content (Title)
            const headerTitle = slideEl.querySelector('header h1');
            if (headerTitle) {
                slide.addText(headerTitle.innerText, { x: 4.5, y: 0.25, w: 5.25, h: 0.75, fontSize: 24, bold: true, align: 'right' });
            }
            
            // --- Parse content based on layout ---
            if (layout === 'title') {
                const h1 = slideEl.querySelector('main h1');
                const h2 = slideEl.querySelector('main h2');
                if (h1) slide.addText(h1.innerText, { x: 0.5, y: 2.0, w: 9, h: 1.5, fontSize: 44, bold: true, align: 'center' });
                if (h2) slide.addText(h2.innerText, { x: 0.5, y: 3.5, w: 9, h: 1, fontSize: 32, align: 'center' });
            } 
            else if (layout === 'bullet_list') {
                const bullets = Array.from(slideEl.querySelectorAll('li')).map(li => ({ text: li.innerText }));
                slide.addText(bullets, { x: 1, y: 1.5, w: 8, h: 3.5, fontSize: 28, bullet: true, lineSpacing: 42 });
            }
            else if (layout === 'two_column_text' || layout === 'one_column_text') {
                 const bullets = Array.from(slideEl.querySelectorAll('li')).map(li => ({ text: li.innerText }));
                 slide.addText(bullets, { x: 1, y: 1.5, w: 8, h: 3.5, fontSize: 22, bullet: true, lineSpacing: 36 });
            }
            else if (layout === 'two_column_image') {
                const bullets = Array.from(slideEl.querySelectorAll('li')).map(li => ({ text: li.innerText }));
                slide.addText(bullets, { x: 0.5, y: 1.5, w: 5, h: 3.5, fontSize: 24, bullet: true, lineSpacing: 40 });
                const images = slideEl.querySelectorAll('img');
                let yPos = 1.5;
                for (const img of images) {
                     try {
                        const base64 = await imageToBase64(img.src);
                        slide.addImage({ data: base64, x: 6, y: yPos, w: 3.5, h: 1.5 });
                        yPos += 1.7; // Stack images vertically
                     } catch(err) { console.error(err); }
                }
            }
            else if (layout === 'map') {
                try {
                    await delay(500); // Wait for map to render
                    const mapContainer = slideEl.querySelector('#map-container');
                    const canvas = await html2canvas(mapContainer, { logging: false, useCORS: true, backgroundColor: null });
                    const mapImageData = canvas.toDataURL('image/png');
                    slide.addImage({ data: mapImageData, x: 1, y: 1.5, w: 8, h: 4.5 });
                } catch (err) {
                    console.error("Error generating map slide:", err);
                    slide.addText("Error: Could not generate map image.", { x: 1, y: 2.5, w: 8, color: 'FF0000', align: 'center' });
                }
            }
            else if (layout === 'questions' || layout === 'backups') {
                const h1 = slideEl.querySelector('main h1');
                if(h1) slide.addText(h1.innerText, { x: 0, y: 0, w: '100%', h: '100%', align: 'center', valign: 'middle', fontSize: 48, bold: true });
            }
            else if (layout === 'black') {
                slide.background = { color: '000000' };
            }
        }

        pptx.writeFile({ fileName: 'Presentation.pptx' });

        // --- Restore Button ---
        button.innerHTML = originalIcon;
        button.disabled = false;
    },

    // --- Main Initializer ---
    init(slidesData) {
        // ... init function from before, but with one addition ...

        // Render all slides to the DOM
        this.config.presentationContainer.innerHTML = '';
        this.config.slidesData.forEach((slideData, index) => {
            const slideWrapper = document.createElement('div');
            slideWrapper.className = 'slide-wrapper';
            slideWrapper.id = `slide-wrapper-${index}`;
            const slideHtml = getLayoutHtml(slideData, index);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = slideHtml;
            const slideDiv = tempDiv.firstChild;

            // NEW: Add a data-layout attribute for easier parsing during export
            slideDiv.setAttribute('data-layout', slideData.layout);

            slideWrapper.appendChild(slideDiv);
            this.config.presentationContainer.appendChild(slideWrapper);
        });
        
        // ... rest of the init function ...
    }
};
