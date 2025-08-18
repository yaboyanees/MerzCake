/**
 * slide.js
 * * This script handles the dynamic rendering and interactivity of the NORAD presentation template.
 * It depends on the `slidesData` and `executiveOverviewData` variables being defined in the HTML file
 * before this script is loaded.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if slide data is available
    if (typeof slidesData === 'undefined' || typeof executiveOverviewData === 'undefined') {
        console.error("Error: slidesData or executiveOverviewData is not defined. Make sure it's included in the HTML before this script.");
        return;
    }

    const presentationContainer = document.getElementById('presentation-container');
    const slideNavList = document.getElementById('slide-nav-list');
    let currentSlideIndex = 0;

    /**
     * Renders all slides into the presentation container.
     */
    function renderAllSlides() {
        presentationContainer.innerHTML = '';
        slidesData.forEach((slideData, index) => {
            const slideWrapper = document.createElement('div');
            slideWrapper.id = `slide-${index}`;
            slideWrapper.className = 'slide-wrapper';

            const slideElement = document.createElement('div');
            slideElement.className = 'slide rounded-lg';
            
            slideElement.innerHTML = `
                ${getHeader(slideData)}
                <div class="slide-content-area">
                    ${getLayoutHtml(slideData, index)}
                </div>
                ${getFooter(index)}
            `;
            
            slideWrapper.appendChild(slideElement);
            presentationContainer.appendChild(slideWrapper);
        });
    }

    /**
     * Generates the HTML for the slide header.
     * @param {object} slideData - The data for the current slide.
     * @returns {string} The HTML string for the header.
     */
    function getHeader(slideData) {
        const isTitleSlide = slideData.layout === 'title_slide';
        let centerText = '';

        if (isTitleSlide) {
            centerText = `
                <div class="header-center">
                    <div>This Briefing is classified</div>
                    <div class="unclassified-text">UNCLASSIFIED</div>
                </div>`;
        } else {
            centerText = `
                <div class="header-center">
                    <div class="unclassified-text">UNCLASSIFIED</div>
                    <div contenteditable="true" class="font-bold text-3xl">${slideData.title}</div>
                </div>`;
        }

        return `<div class="slide-header">
                    <div class="header-left">
                        <div class="logos">
                            <img src="https://www.norad.mil/Portals/29/Images/NORADlogo80.png" alt="NORAD Logo" onerror="this.style.display='none'">
                            <img src="https://www.northcom.mil/Portals/28/Images/USNORTHCOMlogo80.png" alt="USNORTHCOM Logo" onerror="this.style.display='none'">
                        </div>
                    </div>
                    ${centerText}
                </div>`;
    }

    /**
     * Generates the HTML for the slide footer.
     * @param {number} index - The index of the current slide.
     * @returns {string} The HTML string for the footer.
     */
    function getFooter(index) {
        return `<div class="slide-footer">
                    <div class="unclassified-text text-center" style="margin-bottom: -5px;">UNCLASSIFIED</div>
                    <div class="footer-line-wrapper">
                        <div class="footer-line"></div>
                        <span class="footer-line-text" style="left: 4rem;">NORAD and USNORTHCOM</span>
                        <span class="footer-line-text" style="right: 7rem;">We Have The Watch</span>
                        <div class="footer-page-number">${index + 1}</div>
                    </div>
                </div>`;
    }
    
    /**
     * Generates the inner HTML for a slide's content area based on its layout.
     * @param {object} slideData - The data for the current slide.
     * @param {number} slideIndex - The index of the current slide.
     * @returns {string} The HTML string for the slide content.
     */
    function getLayoutHtml(slideData, slideIndex) {
        switch (slideData.layout) {
            case 'title_slide':
                const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase();
                return `<div class="slide-content w-full text-center flex flex-col justify-between h-full">
                            <div class="text-center">
                                <br><br><br>
                                <h1 contenteditable="true" class="text-4xl font-bold mb-4">${slideData.title}</h1>
                                <br>
                                <h2 contenteditable="true" class="text-3xl font-bold">${date}</h2>
                            </div>
                            <div contenteditable="true" class="text-sm text-left">
                                ${slideData.classifier}<br>
                                ${slideData.derivedFrom}<br>
                                ${slideData.declassifyOn}
                            </div>
                        </div>`;
            case 'standard_content':
                let footerInfoHtml = '';
                if (slideData.footer_info) {
                    // Corrected positioning for all standard_content slides with a footer
                    const style = 'bottom: -0.5rem; right: 1.5rem;';
                    footerInfoHtml = `<div contenteditable="true" class="text-xs absolute" style="${style}">${slideData.footer_info}</div>`;
                }
                return `<div class="slide-content w-full h-full flex flex-col text-left justify-start">
                            <div contenteditable="true" class="flex-grow">${slideData.content}</div>
                            ${footerInfoHtml}
                        </div>`;
            case 'four_quadrant':
                const grayedOut = slideData.theme === 'grayed_out';
                let quadrantFooterInfo = '';
                if(slideData.footer_info) {
                    quadrantFooterInfo = `<div contenteditable="true" class='text-xs absolute' style="bottom: -1.5rem; right: -0.5rem;">${slideData.footer_info}</div>`;
                }
                return `<div class="slide-content quadrant-grid">
                            <div class="vertical-divider"></div>
                            <div class="horizontal-divider"></div>
                            <div class="quadrant ${grayedOut ? 'grayed-out' : ''}">
                                <div class="quadrant-title text-center">${slideData.q1_title}</div>
                                <div contenteditable="true" class="text-sm mt-2">${slideData.q1_content}</div>
                            </div>
                            <div class="quadrant ${grayedOut ? 'grayed-out' : ''}">
                                <div class="quadrant-title text-center">${slideData.q2_title}</div>
                                <div contenteditable="true" class="text-sm mt-2">${slideData.q2_content}</div>
                            </div>
                            <div class="quadrant ${grayedOut ? 'grayed-out' : ''}">
                                <div class="quadrant-title text-center">${slideData.q3_title}</div>
                                <div contenteditable="true" class="text-sm mt-2">${slideData.q3_content}</div>
                            </div>
                            <div class="quadrant">
                                <div class="quadrant-title text-center">${slideData.q4_title}</div>
                                <div contenteditable="true" class="text-sm mt-2 relative h-full">${slideData.q4_content}</div>
                            </div>
                            ${quadrantFooterInfo}
                        </div>`;
            case 'timeline':
                return `<div class="slide-content w-full h-full">
                            <svg class="timeline-svg" viewbox="0 0 800 450">
                                ${generateTimelineEvents(slideData.events)}
                                ${generateTimelineLegend()}
                            </svg>
                        </div>`;
            case 'title_only':
                return `<div class="slide-content w-full text-center flex items-center justify-center h-full">
                            <h1 contenteditable="true" class="text-6xl">${slideData.title}</h1>
                        </div>`;
            default:
                return '';
        }
    }

    /**
     * Generates SVG elements for timeline events.
     * @param {Array<object>} events - An array of event objects.
     * @returns {string} The SVG elements as an HTML string.
     */
    function generateTimelineEvents(events) {
        // Define fixed start and end points for the timeline ray
        const startX = 50;
        const startY = 420;
        const endX = 700;
        const endY = 28;

        // Calculate the total span of the timeline ray
        const totalXSpan = endX - startX;
        const totalYSpan = startY - endY; // Y decreases as we move along the timeline

        // Define a buffer to leave space at the end of the timeline
        const buffer = 20;
        const totalLength = Math.sqrt(totalXSpan ** 2 + totalYSpan ** 2);
        const maxProportion = (totalLength - buffer) / totalLength;

        // Draw the fixed-length timeline ray with an arrowhead
        let eventElements = `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="black" stroke-width="4" marker-end="url(#arrowhead)"/>
                             <defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="black"/></marker></defs>`;
        
        events.forEach((event, i) => {
            // Calculate the proportion along the line for the current event
            // If there's only one event, place it at the start (proportion = 0)
            const proportion = events.length > 1 ? i / (events.length - 1) : 0;
            
            // Scale the proportion to account for the buffer at the end
            const scaledProportion = proportion * maxProportion;

            // Calculate the x and y coordinates for the event's shape
            const x = startX + scaledProportion * totalXSpan;
            const y = startY - scaledProportion * totalYSpan;
            
            let shape = '';
            switch(event.type) {
                case 'current':
                    shape = `<path d="M ${x} ${y-12} L ${x+4} ${y-4} L ${x+12} ${y-4} L ${x+6} ${y+2} L ${x+8} ${y+10} L ${x} ${y+6} L ${x-8} ${y+10} L ${x-6} ${y+2} L ${x-12} ${y-4} L ${x-4} ${y-4} Z" fill="#FFD700" stroke="black" stroke-width="3"/>`;
                    break;
                case 'future':
                    shape = `<rect x="${x-8}" y="${y-8}" width="16" height="16" fill="#0000FF" stroke="black" stroke-width="3"/>`;
                    break;
                case 'completed':
                default:
                    shape = `<circle cx="${x}" cy="${y}" r="10" fill="#008000" stroke="black" stroke-width="3"/>`;
            }
            
            eventElements += `
                ${shape}
                <foreignObject x="${x + 20}" y="${y - 5}" width="250" height="30">
                   <div xmlns="http://www.w3.org/1999/xhtml" contenteditable="true" style="font-size: 12px; line-height: 1.2;">
                        <span style="font-weight: bold;">${event.date}</span>
                        <span> ${event.label}</span>
                    </div>
                </foreignObject>
            `;
        });

        return eventElements;
    }

    /**
     * Generates the SVG legend for the timeline.
     * @returns {string} The SVG legend as an HTML string.
     */
    function generateTimelineLegend() {
        return `
            <g transform="translate(650, 350)">
                <circle cx="0" cy="0" r="8" fill="#008000" stroke="black" stroke-width="3"></circle>
                <text x="20" y="5" font-size="12">Completed Event</text>
                <path transform="translate(0, 35)" d="M 0 -8 L 2.66 -2.66 L 8 -2.66 L 4 1.33 L 5.33 6.66 L 0 4 L -5.33 6.66 L -4 1.33 L -8 -2.66 L -2.66 -2.66 Z" fill="#FFD700" stroke="black" stroke-width="3"></path>
                <text x="20" y="35" font-size="12">Current Event</text>
                <rect x="-8" y="57" width="16" height="16" fill="#0000FF" stroke="black" stroke-width="3"></rect>
                <text x="20" y="70" font-size="12">Future Event</text>
            </g>
        `;
    }

    /**
     * Updates the side navigation, highlighting the active slide.
     * @param {number} activeIndex - The index of the currently visible slide.
     */
    function updateSlideNav(activeIndex) {
        slideNavList.innerHTML = '';
        slidesData.forEach((slide, index) => {
            const li = document.createElement('li');
            li.className = `p-2 rounded-md cursor-pointer text-sm transition-colors ${index === activeIndex ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'}`;
            li.textContent = `${index + 1}: ${slide.title.replace('(U) ', '')}`;
            li.onclick = () => {
                document.getElementById(`slide-${index}`).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            };
            slideNavList.appendChild(li);
        });
    }

    /**
     * Sets up the toolbar functionality.
     */
    function setupToolbar() {
        const toolbar = document.getElementById('toolbar');
        const fontSelector = document.getElementById('font-selector');
        const colorPicker = document.getElementById('color-picker');

        toolbar.addEventListener('click', (e) => {
            const button = e.target.closest('.toolbar-button');
            if (button && button.dataset.command) {
                e.preventDefault();
                const command = button.dataset.command;
                if (command === 'print') {
                    window.print();
                } else {
                    document.execCommand(command, false, null);
                }
            }
        });

        fontSelector.addEventListener('change', (e) => {
            document.execCommand('fontName', false, e.target.value);
        });

        colorPicker.addEventListener('input', (e) => {
            document.execCommand('foreColor', false, e.target.value);
        });
    }
    
    /**
     * Sets up an Intersection Observer to track which slide is visible.
     */
    function setupScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const newIndex = parseInt(entry.target.id.replace('slide-', ''), 10);
                    if (currentSlideIndex !== newIndex) {
                        currentSlideIndex = newIndex;
                        updateSlideNav(newIndex);
                    }
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.6 });

        document.querySelectorAll('.slide-wrapper').forEach(slide => observer.observe(slide));
    }

    // --- Initial Setup ---
    renderAllSlides();
    updateSlideNav(0);
    setupToolbar();
    setupScrollObserver();
});
