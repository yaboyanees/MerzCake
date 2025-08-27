const SlidePresenter = {

    // --- Core Application State & Variables ---
    config: {
        slidesData: [],
        currentSlideIndex: 0,
        presentationContainer: null,
        slideNavList: null,
    },

    // --- Toolbar Module ---
    toolbar: {
        init() {
            document.getElementById('toolbar').addEventListener('click', (e) => {
                const button = e.target.closest('.toolbar-button');
                if (button && button.dataset.command) {
                    e.preventDefault();
                    const command = button.dataset.command;
                    if (command === 'print') window.print();
                    else document.execCommand(command, false, null);
                }
            });
            document.getElementById('font-selector').addEventListener('change', (e) => document.execCommand('fontName', false, e.target.value));
            document.getElementById('color-picker').addEventListener('input', (e) => document.execCommand('foreColor', false, e.target.value));

            const exportBtn = document.getElementById('export-pptx-btn');
            if (exportBtn) {
                exportBtn.addEventListener('click', () => {
                    exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    exportBtn.disabled = true;
                    SlidePresenter.pptxExporter.export().finally(() => {
                        exportBtn.innerHTML = '<i class="fas fa-file-powerpoint"></i>';
                        exportBtn.disabled = false;
                    });
                });
            }
        }
    },

    // --- Side Navigation Module ---
    sideNav: {
        update() {
            const { slidesData, currentSlideIndex } = SlidePresenter.config;
            const slideNavList = document.getElementById('slide-nav-list');
            slideNavList.innerHTML = '';
            slidesData.forEach((slide, index) => {
                const li = document.createElement('li');
                li.className = `p-2 rounded-md cursor-pointer text-sm transition-colors ${index === currentSlideIndex ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'}`;
                li.textContent = `${index + 1}: ${slide.title}`;
                li.onclick = () => document.getElementById(`slide-wrapper-${index}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
                slideNavList.appendChild(li);
            });
        }
    },

    // --- Presentation Manager Module ---
    presentationManager: {
        initObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const newIndex = parseInt(entry.target.id.replace('slide-wrapper-', ''), 10);
                        if (SlidePresenter.config.currentSlideIndex !== newIndex) {
                            SlidePresenter.config.currentSlideIndex = newIndex;
                            SlidePresenter.sideNav.update();
                        }
                    }
                });
            }, { root: null, rootMargin: '0px', threshold: 0.6 });
            document.querySelectorAll('.slide-wrapper').forEach(slide => observer.observe(slide));
        },
        scaleSlides() {
            const wrapper = document.querySelector('.slide-wrapper');
            if (wrapper) {
                const scale = wrapper.offsetWidth / 1200;
                document.documentElement.style.setProperty('--slide-scale', scale);
            }
        }
    },

    // --- D3 Map Module ---
    d3Map: {
        render(mapData) {
            const highlightedCountries = mapData.highlightedCountries || [];
            const mapConfig = mapData.mapConfig || {};
            const center = mapConfig.center || [0, 0];
            const scale = mapConfig.scale || 150;
            
            function toTitleCase(str) {
                return str.replace(/\w\S*/g, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            }

            const width = 800, height = 450;
            let selectedLabel = null;
            const svg = d3.select("#map-container").append("svg").attr("width", width).attr("height", height);
            const g = svg.append("g");

            const minZoom = 0.25, maxZoom = 12;

            const fontSizeScale = d3.scaleLinear().domain([minZoom, 1, maxZoom]).range([24, 16, 6]).clamp(true);
            const radiusScale = d3.scaleLinear().domain([minZoom, 1, maxZoom]).range([12, 8, 3]).clamp(true);
            const starScale = d3.scaleLinear().domain([minZoom, 1, maxZoom]).range([1.2, 0.8, 0.3]).clamp(true);

            const zoom = d3.zoom()
                .scaleExtent([minZoom, maxZoom])
                .on("zoom", () => {
                    const transform = d3.event.transform;
                    const k = transform.k;
                    g.attr("transform", transform);
                    g.selectAll('.label').style('font-size', fontSizeScale(k) + 'px').style('stroke-width', (0.5 / k) + 'px');
                    g.selectAll('.major-city-icon').attr('r', radiusScale(k));
                    g.selectAll('.capital-icon').each(function() {
                        const icon = d3.select(this);
                        const currentTransform = icon.attr('transform');
                        const translatePart = currentTransform.split(')')[0] + ')';
                        icon.attr('transform', `${translatePart} scale(${starScale(k)})`);
                    });
                });

            svg.call(zoom).on("dblclick.zoom", null);

            const selectionBox = g.append("rect").attr("class", "selection-box").style("display", "none");
            const projection = d3.geoMercator().center(center).scale(scale).translate([width / 2, height / 2]);
            const pathGenerator = d3.geoPath().projection(projection);
            const citiesUrl = 'https://cdn.jsdelivr.net/gh/yaboyanees/MerzCake@main/world_cities.geojson';
            const bordersUrl = 'https://cdn.jsdelivr.net/gh/yaboyanees/MerzCake@main/country_borders.geojson';
            
            svg.on("click", () => { if (selectedLabel) { selectedLabel = null; selectionBox.style("display", "none"); } });
            d3.select("body").on("keydown", () => { if (selectedLabel && (d3.event.key === "Delete" || d3.event.key === "Backspace")) { selectedLabel.remove(); selectedLabel = null; selectionBox.style("display", "none"); } });
            
            Promise.all([d3.json(bordersUrl), d3.json(citiesUrl)]).then(([borderData, cityData]) => {
                g.selectAll(".country").data(borderData.features).enter().append("path").attr("class", "country").attr("d", pathGenerator).attr("fill", d => highlightedCountries.includes(d.properties.name) ? 'rgb(255, 204, 102)' : 'rgb(255, 219, 183)');
                const cityGroup = g.append("g").attr("class", "cities");
                const starPath = "M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z";
                cityGroup.selectAll(".capital-icon").data(cityData.features.filter(d => d.properties.isCapital && highlightedCountries.includes(d.properties.country))).enter().append("path").attr("class", "capital-icon").attr("d", starPath).attr("transform", d => `translate(${projection(d.geometry.coordinates)[0] - 12}, ${projection(d.geometry.coordinates)[1] - 12}) scale(0.8)`);
                cityGroup.selectAll(".major-city-icon").data(cityData.features.filter(d => !d.properties.isCapital && highlightedCountries.includes(d.properties.country))).enter().append("circle").attr("class", "major-city-icon").attr("cx", d => projection(d.geometry.coordinates)[0]).attr("cy", d => projection(d.geometry.coordinates)[1]).attr("r", 8);
                const labelGroup = g.append("g").attr("class", "labels");
                labelGroup.selectAll(".country-label").data(borderData.features.filter(d => highlightedCountries.includes(d.properties.name))).enter().append("text").attr("class", "label country-label").text(d => d.properties.name.toUpperCase()).attr("transform", d => `translate(${pathGenerator.centroid(d)[0]}, ${pathGenerator.centroid(d)[1]})`).call(createDragHandler()).on("click", selectHandler).on("dblclick", createEditHandler);
                labelGroup.selectAll(".city-label").data(cityData.features.filter(d => highlightedCountries.includes(d.properties.country))).enter().append("text").attr("class", "label city-label").text(d => d.properties.city).attr("transform", d => `translate(${projection(d.geometry.coordinates)[0]}, ${projection(d.geometry.coordinates)[1] + (d.properties.isCapital ? -18 : -12)})`).call(createDragHandler()).on("click", selectHandler).on("dblclick", createEditHandler);
            });

            function selectHandler(d) { d3.event.stopPropagation(); selectedLabel = d3.select(this); const bbox = this.getBBox(); const transform = selectedLabel.attr("transform"); selectionBox.attr("x", bbox.x - 4).attr("y", bbox.y - 4).attr("width", bbox.width + 8).attr("height", bbox.height + 8).attr("transform", transform).style("display", "block").raise(); }
            function createDragHandler() { let offsetX, offsetY; return d3.drag().on("start", function() { const transform = d3.select(this).attr("transform"); const parts = /translate\(([^,]+),([^)]+)\)/.exec(transform); if (parts) { const currentX = parseFloat(parts[1]); const currentY = parseFloat(parts[2]); offsetX = d3.event.x - currentX; offsetY = d3.event.y - currentY; } d3.select(this).raise().classed("active", true); }).on("drag", function() { const newX = d3.event.x - offsetX; const newY = d3.event.y - offsetY; const newTransform = `translate(${newX}, ${newY})`; d3.select(this).attr("transform", newTransform); if (selectedLabel && selectedLabel.node() === this) { selectionBox.attr("transform", newTransform); } }).on("end", function() { d3.select(this).classed("active", false); }); }
            
            function createEditHandler(d) {
                d3.event.stopPropagation();
                const textElement = d3.select(this);
                const isCity = !!d.properties.city;
                const bbox = textElement.node().getBBox();
                
                textElement.style("display", "none");
                if (selectedLabel && selectedLabel.node() === this) selectionBox.style("display", "none");

                const currentTransform = d3.zoomTransform(g.node());
                const k = currentTransform.k;
                
                const transformAttr = textElement.attr('transform');
                const parts = /translate\(([^,]+),([^)]+)\)/.exec(transformAttr);
                const textX = parts ? parseFloat(parts[1]) : 0;
                const textY = parts ? parseFloat(parts[2]) : 0;
                
                const foWidth = bbox.width + 10;
                const foHeight = bbox.height + 5;

                const foreignObject = g.append("foreignObject")
                    .attr("x", bbox.x - 5)
                    .attr("y", bbox.y - 2)
                    .attr("width", foWidth)
                    .attr("height", foHeight)
                    .attr("transform", `translate(${textX}, ${textY}) scale(${1/k})`);

                const currentText = (d.properties && d.properties.displayName) || (d.properties && d.properties.city) || (d.properties && d.properties.name);
                
                const input = foreignObject.append("xhtml:input")
                    .attr("type", "text")
                    .attr("class", "label-editor-input")
                    .style("width", `${foWidth}px`)
                    .style("height", `${foHeight}px`)
                    .style("font-size", `${fontSizeScale(k)}px`)
                    .property("value", currentText)
                    .on("blur", finishEditing)
                    .on("keydown", function() { if (d3.event.key === "Enter") finishEditing.call(this); });
                
                input.node().focus();
                input.node().select();

                function finishEditing() {
                    const newText = input.node().value;
                    if (d.properties) d.properties.displayName = newText;
                    textElement.text(isCity ? toTitleCase(newText) : newText.toUpperCase()).style("display", "block");
                    foreignObject.remove();
                    selectHandler.call(textElement.node(), d);
                }
            }
        }
    },

    pptxExporter: {
        imageToB64: async function(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Network response was not ok for url: ${url}`);
                }
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                console.error('Error converting image to Base64:', url, error);
                return null;
            }
        },

        svgToB64: async function(url) {
            try {
                const response = await fetch(url);
                const svgText = await response.text();
                return `data:image/svg+xml;base64,${btoa(svgText)}`;
            } catch (error) {
                console.error('Error converting SVG to Base64:', url, error);
                return null;
            }
        },

        // NEW FUNCTION: To draw the header banner segments as rectangles
        addHeaderBanner: function(slide) {
            // These colors approximate the current banner segments
            const colors = [
                '5F2A63', // Dark Purple
                '7F3E83',
                '9A4B9F',
                'AF5BB3',
                'C46BC8',
                'D97BE0',
                'EC8AF0',
                'FA99FC',
                'FFACFF',
                'FFBEFF',
                'FFD0FF',
                'FFE3FF'  // Lightest Pink
            ];
            
            // PPTX slide width is 10 inches for LAYOUT_4x3
            const totalBannerWidth = 9.4; // Corresponds to w: 9.4 in the HTML line
            const segmentFlexGrows = [369, 46, 42, 34, 34, 29, 25, 21, 17, 12, 8, 4];
            const totalFlexGrow = segmentFlexGrows.reduce((sum, val) => sum + val, 0);

            let currentX = 0.3; // Starting X position for the banner
            const bannerHeight = 0.1; // Height of each banner segment
            const bannerY = 1.1; // Y position for the banner, just below the header line

            segmentFlexGrows.forEach((flexGrow, index) => {
                const segmentWidth = (flexGrow / totalFlexGrow) * totalBannerWidth;
                slide.addShape(pptx.shapes.RECTANGLE, {
                    x: currentX,
                    y: bannerY,
                    w: segmentWidth,
                    h: bannerHeight,
                    fill: { color: colors[index] || 'CCCCCC' }, // Use color, default to gray
                    line: { color: colors[index] || 'CCCCCC', width: 0 } // No border line
                });
                currentX += segmentWidth;
            });
        },

        export: async function() {
            if (typeof PptxGenJS === 'undefined' || typeof html2canvas === 'undefined') {
                alert('Error: A required library for exporting (PptxGenJS or html2canvas) is not loaded.');
                return;
            }

            let pptx = new PptxGenJS();
            // FIXED: Changed layout to LAYOUT_4x3 for standard aspect ratio
            pptx.layout = 'LAYOUT_4x3';
            pptx.author = 'SlidePresenter';
            pptx.company = 'Gemini AI';
            pptx.title = 'Web-Based Presentation';

            const slideWrappers = document.querySelectorAll('.slide-wrapper');

            for (let i = 0; i < SlidePresenter.config.slidesData.length; i++) {
                const slideData = SlidePresenter.config.slidesData[i];
                const slideElem = slideWrappers[i]?.querySelector('.slide');
                if (!slideElem) continue;

                const slide = pptx.addSlide();

                if (slideData.layout === 'black') {
                    slide.background = { color: '000000' };
                    continue;
                }
                
                slide.background = { color: 'FFFFFF' };

                // --- Common Elements: Header & Footer ---
                // Header CUI
                slide.addText("CUI", { x: 0.3, y: 0.2, fontSize: 12, bold: true, fontFace: 'Arial' });
                // Header Title
                const headerTitleElem = slideElem.querySelector('header h1');
                if (headerTitleElem) {
                    // Adjusted Y position for header title
                    slide.addText(headerTitleElem.innerText, { x: 5.0, y: 0.3, w: 4.7, h: 0.4, fontSize: 22, bold: true, align: 'right' });
                }
                // NEW: Add the header banner segments
                this.addHeaderBanner(slide);
                // Footer Text
                const footerTextElem = slideElem.querySelector('footer > div:first-child');
                if (footerTextElem) {
                    // Adjusted Y position for footer text
                    slide.addText(footerTextElem.innerText, { x: 0.3, y: 7.0, w: 7, h: 0.3, fontSize: 8, color: '6B7280' });
                }
                // Footer CUI
                // Adjusted Y position for footer CUI
                slide.addText("CUI", { x: 9.0, y: 6.9, w: 0.7, h: 0.3, fontSize: 12, bold: true, fontFace: 'Arial', align: 'right' });

                switch (slideData.layout) {
                    case 'title': {
                        const logoB64 = await this.svgToB64('https://upload.wikimedia.org/wikipedia/commons/d/da/Joint_Chiefs_of_Staff_seal_%282%29.svg');
                        // Adjusted Y position for logo
                        if(logoB64) slide.addImage({ data: logoB64, x: 0.4, y: 0.4, w: 1, h: 1 });
                        
                        const titleElem = slideElem.querySelector('main h1');
                        if (titleElem) slide.addText(titleElem.innerText, { x: 0.5, y: 2.0, w: 9, h: 1.0, fontSize: 44, bold: true, align: 'center', fontFace: 'Arial' });

                        const subtitleElem = slideElem.querySelector('main h2');
                        if (subtitleElem) slide.addText(subtitleElem.innerText, { x: 0.5, y: 3.3, w: 9, h: 0.7, fontSize: 32, bold: true, align: 'center', fontFace: 'Arial' });
                        
                        const cuiBoxElem = slideElem.querySelector('footer div[contenteditable="true"][style*="bottom: 5rem"]');
                        if (cuiBoxElem) slide.addText(cuiBoxElem.innerText, { x: 6.5, y: 2.8, w: 3.0, h: 1.5, fontSize: 9, fontFace: 'Arial' });
                        break;
                    }
                    case 'bullet_list': {
                        const ulElem = slideElem.querySelector('main ul');
                        if (ulElem) {
                            const bullets = Array.from(ulElem.querySelectorAll('li'))
                                .map(li => li.textContent.trim())
                                .filter(text => text)
                                .join('\n');
                            const fontSize = slideData.fontSize === 'text-5xl' ? 32 : 24;
                            // Adjusted Y position for bullets
                            slide.addText(bullets, { x: 1.0, y: 1.5, w: 8.5, h: 4.5, fontSize: fontSize, bullet: true, bold: true, lineSpacing: fontSize * 1.5 });
                        }
                        break;
                    }
                    case 'two_column_image': {
                        const ulElem = slideElem.querySelector('main ul');
                        if (ulElem) {
                            const bullets = Array.from(ulElem.querySelectorAll('li')).map(li => li.textContent.trim()).filter(text => text).join('\n');
                            slide.addText(bullets, { x: 0.7, y: 1.5, w: 5.0, h: 4.5, fontSize: 24, bullet: true, bold: true, lineSpacing: 36 });
                        }
                        const imageContainer = slideElem.querySelector('.editable-image-column');
                        if (imageContainer) {
                            const images = imageContainer.querySelectorAll('img');
                            let yPos = 1.5;
                            for (const img of images) {
                                const caption = img.previousElementSibling?.innerText || '';
                                slide.addText(caption, { x: 6.2, y: yPos, w: 3.5, h: 0.3, fontSize: 10, bold: true });
                                const imgB64 = await this.imageToB64(img.src);
                                if(imgB64) slide.addImage({ data: imgB64, x: 6.2, y: yPos + 0.25, w: 3.5, h: 1.25 });
                                yPos += 1.8;
                            }
                        }
                        break;
                    }
                     case 'two_column_text': {
                        const uls = slideElem.querySelectorAll('main ul');
                        if (uls.length === 2) {
                            const bulletsLeft = Array.from(uls[0].querySelectorAll('li')).map(li => li.textContent.trim()).filter(text => text).join('\n');
                            slide.addText(bulletsLeft, { x: 0.7, y: 1.5, w: 4.3, h: 4.5, fontSize: 18, bullet: true, bold: true, lineSpacing: 30 });

                            const bulletsRight = Array.from(uls[1].querySelectorAll('li')).map(li => li.textContent.trim()).filter(text => text).join('\n');
                            slide.addText(bulletsRight, { x: 5.3, y: 1.5, w: 4.3, h: 4.5, fontSize: 18, bullet: true, bold: true, lineSpacing: 30 });
                        }
                        break;
                    }
                    case 'map': {
                        const mapTitleElem = slideElem.querySelector('main h2');
                        if (mapTitleElem) slide.addText(mapTitleElem.innerText, { x: 0.5, y: 1.3, w: 9, h: 0.4, fontSize: 16, bold: true, align: 'center' });
                        
                        try {
                            await new Promise(res => setTimeout(res, 500));
                            const mapContainer = slideElem.querySelector('#map-container');
                            const canvas = await html2canvas(mapContainer, { logging: false, useCORS: true, backgroundColor: null });
                            const mapB64 = canvas.toDataURL('image/png');
                            // Adjusted Y position for map image
                            slide.addImage({ data: mapB64, x: 1.0, y: 1.7, w: 8.0, h: 4.5 }); // Increased map height to better fit 4x3
                        } catch (error) {
                            console.error('Failed to capture map canvas:', error);
                            slide.addText('Error capturing map image.', { x: 1.5, y: 2.5, w: 5.33, h: 1, color: 'FF0000', align: 'center' });
                        }

                        const ulElem = slideElem.querySelector('main ul');
                         if (ulElem) {
                            const bullets = Array.from(ulElem.querySelectorAll('li')).map(li => li.textContent.trim()).filter(text => text).join('\n');
                            slide.addText(bullets, { x: 1.0, y: 5.8, w: 8, h: 1.5, fontSize: 18, bullet: true, bold: true, lineSpacing: 30 });
                        }
                        break;
                    }
                    case 'questions':
                    case 'backups': {
                        const titleElem = slideElem.querySelector('main h1');
                        const textHeight = 1.5;
                        // PPTX slide height for 4x3 is 7.5 inches. Header is ~1.5, footer is ~0.5
                        const availableHeight = 7.5 - 1.5 - 0.5; // Total - Header - Footer
                        const centeredY = 1.5 + (availableHeight - textHeight) / 2; // Start after header
                        if (titleElem) slide.addText(titleElem.innerText, { x: 0.5, y: centeredY, w: 9, h: textHeight, fontSize: 48, bold: true, align: 'center' });
                        break;
                    }
                }
            }

            pptx.writeFile({ fileName: `Presentation-${new Date().toISOString().split('T')[0]}.pptx` });
        }
    },

    init(slidesData) {
        this.config.slidesData = slidesData;
        this.config.presentationContainer = document.getElementById('presentation-container');
        
        // Removed header-banner-html for dynamic generation
        const bannerSegmentsHtml = `<div class="banner-segment" style="flex-grow: 369;"></div><div class="banner-segment" style="flex-grow: 46;"></div><div class="banner-segment" style="flex-grow: 42;"></div><div class="banner-segment" style="flex-grow: 34;"></div><div class="banner-segment" style="flex-grow: 34;"></div><div class="banner-segment" style="flex-grow: 29;"></div><div class="banner-segment" style="flex-grow: 25;"></div><div class="banner-segment" style="flex-grow: 21;"></div><div class="banner-segment" style="flex-grow: 17;"></div><div class="banner-segment" style="flex-grow: 12;"></div><div class="banner-segment" style="flex-grow: 8;"></div><div class="banner-segment" style="flex-grow: 4;"></div>`;

        function getStandardHeader(slideData) {
            const titleHtml = slideData.layout !== 'questions' && slideData.layout !== 'backups' 
                ? `<h1 contenteditable="true" class="text-4xl font-bold absolute top-10 right-6 text-black ${slideData.layout === 'bullet_list' && slideData.title === 'Overview' ? 'italic' : ''}">(U) ${slideData.title}</h1>` 
                : '';
            return `<header class="relative w-full p-6 h-36 flex-shrink-0"><div class="absolute top-6 left-6 font-arial font-bold text-lg text-black">CUI</div>${titleHtml}<div class="absolute bottom-11 left-6 w-[calc(100%-3rem)]"><div class="header-banner w-full">${bannerSegmentsHtml}</div></div></header>`;
        }

        function getStandardFooter(pageNumber) {
            const today = new Date();
            const dateString = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
            return `<footer class="w-full p-6 text-sm text-gray-500 flex justify-between items-end flex-shrink-0"><div><span>${pageNumber} ${dateString} Washington, District of Columbia, United States TITLE OF BRIEF.pptx</span></div><div class="font-arial font-bold text-lg text-black">CUI</div></footer>`;
        }

        function getLayoutHtml(slideData, slideIndex) {
            const pageNumber = slideIndex + 1;
            switch (slideData.layout) {
                case 'title':
                    return `<div class="slide" id="${slideData.id}"><header class="relative w-full p-6 h-36 flex-shrink-0"><div class="absolute top-6 left-6 font-arial font-bold text-lg text-black">CUI</div><div class="absolute bottom-1 left-6 w-[calc(100%-3rem)] h-24 flex items-center"><div class="w-24 h-24 absolute top-1/2 -translate-y-1/2 left-0 z-10 flex-shrink-0"><img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Joint_Chiefs_of_Staff_seal_%282%29.svg" alt="Joint Chiefs of Staff seal" class="w-full h-full object-contain"></div><div class="header-banner w-full">${bannerSegmentsHtml}</div></div></header><main class="flex-grow flex flex-col items-center justify-center text-center"><h1 contenteditable="true" class="text-7xl font-black tracking-wider text-gray-800">(U) TITLE OF BRIEF</h1><h2 contenteditable="true" class="text-5xl font-arial font-bold text-black mt-16">Subtitle</h2></main><footer class="relative w-full p-6 text-sm text-gray-500 flex justify-between items-end flex-shrink-0"><div contenteditable="true"><span>${pageNumber} ${new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} Washington, District of Columbia, United States TITLE OF BRIEF.pptx</span></div><div contenteditable="true" class="absolute text-left text-xs leading-tight font-arial font-bold text-black" style="bottom: 5rem; right: 6rem; width: 240px;"><p><span>Controlled By:</span></p><p><span>CUI Category:</span></p><p><span>LDC:</span></p><p><span>POC:</span></p><br><p><span>Classified by:</span></p><p><span>Derived From:</span></p><p><span>Decl on:</span></p></div><div class="font-arial font-bold text-lg text-black">CUI</div></footer></div>`;
                case 'bullet_list':
                    const fontSizeClass = slideData.fontSize || 'text-4xl';
                    const listItems = slideData.content.map(item => `<li>${item}</li>`).join('');
                    return `<div class="slide" id="${slideData.id}">${getStandardHeader(slideData)}<main class="flex p-12"><ul contenteditable="true" class="list-disc pl-16 space-y-6 font-bold ${fontSizeClass}">${listItems}</ul></main>${getStandardFooter(pageNumber)}</div>`;
                case 'two_column_image':
                    return `<div class="slide" id="${slideData.id}">${getStandardHeader(slideData)}<main class="flex p-12 gap-8 items-start"><div class="w-3/5"><ul contenteditable="true" class="list-disc pl-8 space-y-8 text-4xl font-bold"><li>(U) Bullet example text</li><li>(U) Sets the stage for highlighting issues</li><li>(U) Other bullet point here</li></ul></div><div class="w-2/5 flex flex-col justify-start gap-4 editable-image-column" contenteditable="true"><div><p class="font-bold text-lg mb-2">(U) Destroyer in Pacific</p><img src="https://www.naval-technology.com/wp-content/uploads/sites/15/2023/01/Featured-Image-Arleigh-Burke-Class-destroyer.jpg" class="border-2 border-black"></div><div><p class="font-bold text-lg mb-2">(U) Submarine off coast of San Diego</p><img src="https://upload.wikimedia.org/wikipedia/commons/b/bb/US_Navy_040730-N-1234E-002_PCU_Virginia_%28SSN_774%29_returns_to_the_General_Dynamics_Electric_Boat_shipyard.jpg" class="border-2 border-black"></div></div></main>${getStandardFooter(pageNumber)}</div>`;
                case 'two_column_text':
                    return `<div class="slide" id="${slideData.id}">${getStandardHeader(slideData)}<main class="flex p-12 gap-16 items-start"><div class="w-1/2"><ul contenteditable="true" class="list-disc pl-8 space-y-6 text-3xl font-bold"><li>(U) First point for the left column.</li><li>(U) Another point to illustrate the layout.</li></li><li>(U) This column can contain key takeaways.</li><li>(U) Additional bullet point.</li></ul></div><div class="w-1/2"><ul contenteditable="true" class="list-disc pl-8 space-y-6 text-3xl font-bold"><li>(U) First point for the right column.</li><li>(U) Supporting details or contrasting points.</li><li>(U) This column provides more information.</li><li>(U) Final bullet point for this side.</li></ul></div></main>${getStandardFooter(pageNumber)}</div>`;
                case 'map':
                    return `<div class="slide" id="${slideData.id}">${getStandardHeader(slideData)}<main class="relative flex flex-col items-center pt-2"><h2 contenteditable="true" class="text-2xl font-bold mb-2">(U) Region Map of Gulf of Aden & Red Sea</h2><div id="map-container"></div><ul contenteditable="true" class="list-disc pl-12 mt-8 text-3xl font-bold self-start ml-32 space-y-6"><li>(U) Callout bullet #1 goes here</li><li>(U) Callout bullet #2 goes here</li></ul></main>${getStandardFooter(pageNumber)}</div>`;
                case 'questions': case 'backups':
                     return `<div class="slide" id="${slideData.id}">${getStandardHeader(slideData)}<main class="flex items-center justify-center"><h1 contenteditable="true" class="text-7xl font-bold">${slideData.title}</h1></main>${getStandardFooter(pageNumber)}</div>`;
                case 'black':
                    return `<div class="slide bg-black" id="${slideData.id}"></div>`;
                default: return '';
            }
        }

        this.config.presentationContainer.innerHTML = '';
        this.config.slidesData.forEach((slideData, index) => {
            const slideWrapper = document.createElement('div');
            slideWrapper.className = 'slide-wrapper';
            slideWrapper.id = `slide-wrapper-${index}`;
            slideWrapper.innerHTML = getLayoutHtml(slideData, index);
            this.config.presentationContainer.appendChild(slideWrapper);
        });

        const mapSlideData = this.config.slidesData.find(slide => slide.layout === 'map');
        if (mapSlideData && document.getElementById('map-container')) {
            this.d3Map.render(mapSlideData);
        }
        this.toolbar.init();
        this.sideNav.update();
        this.presentationManager.initObserver();
        this.presentationManager.scaleSlides();
        window.addEventListener('resize', this.presentationManager.scaleSlides);
    }
};
