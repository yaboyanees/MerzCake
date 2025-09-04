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

    // --- PPTX Exporter Module ---
    pptxExporter: {
        imageToB64: async function(url) {
            try {
                const response = await fetch(url);
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
        htmlToPptxTextObjects: function(element) {
            if (!element) return [{ text: '', options: {} }];

            const results = [];

            const rgbToHex = (rgb) => {
                if (!rgb || !rgb.startsWith('rgb')) return '000000';
                const [r, g, b] = rgb.match(/\d+/g).map(Number);
                return [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
            };

            const traverse = (node) => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                    const parent = node.parentElement;
                    const style = window.getComputedStyle(parent);
                    const options = {
                        fontFace: style.fontFamily.split(',')[0].trim().replace(/"/g, ''),
                        fontSize: Math.round(parseFloat(style.fontSize) * 0.75), // px to points
                        color: rgbToHex(style.color),
                        bold: parseInt(style.fontWeight, 10) >= 700 || style.fontWeight === 'bold',
                        italic: style.fontStyle === 'italic',
                        underline: style.textDecorationLine.includes('underline'),
                    };
                    results.push({ text: node.textContent.replace(/\s+/g, ' '), options });
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    if (['P', 'DIV'].includes(node.tagName) && results.length > 0 && !results[results.length-1].text.endsWith('\n')) {
                        results.push({ text: '\n', options: {} });
                    }
                    Array.from(node.childNodes).forEach(traverse);
                }
            };
            
            traverse(element);
            return results.length > 0 ? results : [{ text: ' ', options: {} }];
        },
        export: async function() {
            if (typeof PptxGenJS === 'undefined' || typeof html2canvas === 'undefined') {
                alert('Error: A required library for exporting (PptxGenJS or html2canvas) is not loaded.');
                return;
            }

            let pptx = new PptxGenJS();
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

                slide.addText(this.htmlToPptxTextObjects(slideElem.querySelector('header .font-arial')), { x: 0.3, y: 0.2 });
                
                const headerTitleElem = slideElem.querySelector('header h1');
                if (headerTitleElem) {
                    slide.addText(this.htmlToPptxTextObjects(headerTitleElem), { x: 5.0, y: 0.4, w: 4.7, h: 0.5, align: 'right' });
                }
                
                const bannerSegmentsGrow = [369, 46, 42, 34, 34, 29, 25, 21, 17, 12, 8, 4];
                const totalGrow = bannerSegmentsGrow.reduce((sum, val) => sum + val, 0);
                const bannerTotalWidth = 9.4;
                const bannerStartX = 0.3;
                const bannerHeight = 0.2;
                const bannerY = slideData.layout === 'title' ? 1.0 - (bannerHeight / 2) : 1.2;
                const bannerGap = 0.02;
                const numGaps = bannerSegmentsGrow.length - 1;
                const availableWidthForRects = bannerTotalWidth - (numGaps * bannerGap);
                
                let currentX = bannerStartX;
                for (const grow of bannerSegmentsGrow) {
                    const segmentWidth = (grow / totalGrow) * availableWidthForRects;
                    if (segmentWidth > 0) {
                       slide.addShape(pptx.shapes.RECTANGLE, {
                           x: currentX,
                           y: bannerY,
                           w: segmentWidth,
                           h: bannerHeight,
                           fill: { type: 'gradient', color: ['6A0DAD', 'C3B1E1'], angle: 90 },
                           line: { width: 0 }
                       });
                       currentX += segmentWidth + bannerGap;
                    }
                }
                
                const footerTextElem = slideElem.querySelector('footer > div:first-child');
                if (footerTextElem) {
                    slide.addText(this.htmlToPptxTextObjects(footerTextElem), { x: 0.3, y: 7.0, w: 7, h: 0.3, fontSize: 8 });
                }
                slide.addText(this.htmlToPptxTextObjects(slideElem.querySelector('footer .font-arial')), { x: 9.0, y: 6.9, w: 0.7, h: 0.3, align: 'right' });

                switch (slideData.layout) {
                    case 'title': {
                        const logoB64 = await this.svgToB64('https://upload.wikimedia.org/wikipedia/commons/d/da/Joint_Chiefs_of_Staff_seal_%282%29.svg');
                        if(logoB64) slide.addImage({ data: logoB64, x: 0.4, y: 0.5, w: 1, h: 1 });
                        
                        const titleElem = slideElem.querySelector('main h1');
                        if (titleElem) slide.addText(this.htmlToPptxTextObjects(titleElem), { x: 0.5, y: 2.2, w: 9, h: 1.0, align: 'center' });

                        const subtitleElem = slideElem.querySelector('main h2');
                        if (subtitleElem) slide.addText(this.htmlToPptxTextObjects(subtitleElem), { x: 0.5, y: 3.5, w: 9, h: 0.7, align: 'center' });
                        
                        const cuiBoxElem = slideElem.querySelector('footer div[style*="bottom: 5rem"]');
                        if (cuiBoxElem) slide.addText(this.htmlToPptxTextObjects(cuiBoxElem), { x: 6.5, y: 3.0, w: 3.0, h: 1.5 });
                        break;
                    }
                    case 'bullet_list':
                    case 'two_column_image':
                    case 'two_column_text':
                    case 'map': {
                        const uls = slideElem.querySelectorAll('main ul');
                        const xPositions = uls.length > 1 ? [0.7, 5.3] : [1.0];
                        const widths = uls.length > 1 ? [4.3, 4.3] : [8.5];
                        
                        uls.forEach((ul, ulIndex) => {
                            const listItems = ul.querySelectorAll('li');
                            let allBulletPoints = [];
                            listItems.forEach((li, liIndex) => {
                                allBulletPoints = allBulletPoints.concat(this.htmlToPptxTextObjects(li));
                                if (liIndex < listItems.length - 1) {
                                    allBulletPoints.push({ text: '\n', options: {} });
                                }
                            });
                            const defaultFontSize = uls.length > 1 ? 18 : (slideData.fontSize === 'text-5xl' ? 32 : 24);
                            
                            slide.addText(allBulletPoints, {
                                x: xPositions[ulIndex], y: 1.4, w: widths[ulIndex], h: 4.5,
                                bullet: true,
                                lineSpacing: defaultFontSize * 1.5
                            });
                        });

                        if (slideData.layout === 'two_column_image') {
                            const imageContainer = slideElem.querySelector('.editable-image-column');
                            if (imageContainer) {
                                const imageDivs = imageContainer.querySelectorAll('div');
                                let yPos = 1.4;
                                for (const div of imageDivs) {
                                    const caption = div.querySelector('p');
                                    const img = div.querySelector('img');
                                    if (caption) slide.addText(this.htmlToPptxTextObjects(caption), { x: 6.2, y: yPos, w: 3.5, h: 0.3 });
                                    if (img) {
                                        const imgB64 = await this.imageToB64(img.src);
                                        if(imgB64) slide.addImage({ data: imgB64, x: 6.2, y: yPos + 0.25, w: 3.5, h: 1.5 });
                                    }
                                    yPos += 2.0;
                                }
                            }
                        } else if (slideData.layout === 'map') {
                             const mapTitleElem = slideElem.querySelector('main h2');
                             if (mapTitleElem) slide.addText(this.htmlToPptxTextObjects(mapTitleElem), { x: 0.5, y: 1.3, w: 9, h: 0.4, align: 'center' });
                             try {
                                 await new Promise(res => setTimeout(res, 500));
                                 const mapContainer = slideElem.querySelector('#map-container');
                                 const canvas = await html2canvas(mapContainer, { logging: false, useCORS: true, backgroundColor: null });
                                 const mapB64 = canvas.toDataURL('image/png');
                                 slide.addImage({ data: mapB64, x: 1.0, y: 1.7, w: 8.0, h: 4.5 });
                             } catch (error) {
                                 console.error('Failed to capture map canvas:', error);
                             }
                        }
                        break;
                    }
                    case 'questions':
                    case 'backups': {
                        const titleElem = slideElem.querySelector('main h1');
                        const textHeight = 1.5;
                        const slideContentHeight = 7.5;
                        const centeredY = (slideContentHeight - textHeight) / 2;
                        if (titleElem) slide.addText(this.htmlToPptxTextObjects(titleElem), { x: 0.5, y: centeredY - 0.5, w: 9, h: textHeight, align: 'center' });
                        break;
                    }
                }
            }

            pptx.writeFile({ fileName: `Presentation-${new Date().toISOString().split('T')[0]}.pptx` });
        }
    },

    // --- MODIFIED: The Main Initialization Function ---
    init() {
        this.config.presentationContainer = document.getElementById('presentation-container');
        if (!this.config.presentationContainer) {
            console.error("Presentation container not found!");
            return;
        }

        const discoveredSlides = [];
        const slideElements = this.config.presentationContainer.querySelectorAll('.slide');

        slideElements.forEach((slideEl, index) => {
            // Ensure parent wrapper has the correct ID for the observer
            const wrapper = slideEl.closest('.slide-wrapper');
            if (wrapper) {
                wrapper.id = `slide-wrapper-${index}`;
            }

            // Build the slide data object from data-* attributes
            const slideData = {
                id: slideEl.id || `slide-${index}`,
                title: slideEl.dataset.title || 'Untitled',
                layout: slideEl.dataset.layout || 'default',
                // You can add more data attributes for other properties if needed
                // e.g., highlightedCountries: slideEl.dataset.countries ? slideEl.dataset.countries.split(',') : []
            };
            discoveredSlides.push(slideData);
        });

        this.config.slidesData = discoveredSlides;
        
        // Render the D3 map if a map slide exists in the discovered data
        const mapSlideData = this.config.slidesData.find(slide => slide.layout === 'map');
        if (mapSlideData && document.getElementById('map-container')) {
            // NOTE: If map config is dynamic, you'll need to pass it via data-* attributes too
            // For now, it uses a default configuration.
            this.d3Map.render({ 
                highlightedCountries: ['Yemen', 'Somalia', 'Ethiopia', 'Saudi Arabia', 'Djibouti', 'Eritrea'],
                mapConfig: { center: [48, 12.5], scale: 1200 }
            });
        }
        
        // Initialize all the interactive components
        this.toolbar.init();
        this.sideNav.update();
        this.presentationManager.initObserver();
        this.presentationManager.scaleSlides();
        window.addEventListener('resize', this.presentationManager.scaleSlides);
    }
};
