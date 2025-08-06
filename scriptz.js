// This constant holds the HTML template for our toolbar.
const toolbarHTML = `
<div id="toolbar" class="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg shadow-md flex items-center space-x-2 flex-wrap gap-y-2 mb-4 sticky top-4 z-30">
    <select id="font-selector" class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
        <option value="Arial, sans-serif">Arial</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="'Times New Roman', serif">Times New Roman</option>
        <option value="Verdana, sans-serif">Verdana</option>
    </select>
    <input type="color" id="text-color-input" value="#ffffff" title="Text Color">
    <div class="border-l border-gray-400 dark:border-gray-500 h-6 mx-1"></div>
    <button data-command="bold" class="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600" title="Bold"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 dark:text-gray-200 pointer-events-none"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg></button>
    <button data-command="italic" class="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600" title="Italic"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 dark:text-gray-200 pointer-events-none"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg></button>
    <button data-command="underline" class="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600" title="Underline"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 dark:text-gray-200 pointer-events-none"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg></button>
    <div class="border-l border-gray-400 dark:border-gray-500 h-6 mx-1"></div>
    <button data-command="insertUnorderedList" class="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600" title="Bulleted List"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 dark:text-gray-200 pointer-events-none"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></button>
    <button data-command="insertOrderedList" class="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600" title="Numbered List"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 dark:text-gray-200 pointer-events-none"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg></button>
    <div class="border-l border-gray-400 dark:border-gray-500 h-6 mx-1"></div>
    <button data-command="justifyLeft" class="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600" title="Align Left"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 dark:text-gray-200 pointer-events-none"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg></button>
    <button data-command="justifyCenter" class="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600" title="Align Center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 dark:text-gray-200 pointer-events-none"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg></button>
    <button data-command="justifyRight" class="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600" title="Align Right"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 dark:text-gray-200 pointer-events-none"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg></button>
    <div class="border-l border-gray-400 dark:border-gray-500 h-6 mx-1"></div>
    <button id="insert-image-btn" class="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600" title="Insert Image"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 dark:text-gray-200 pointer-events-none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></button>
    <div class="ml-auto"></div>
    <button id="save-btn" class="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600" title="Save as PDF/Print">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 dark:text-gray-200 pointer-events-none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
    </button>
</div>
`;

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('toolbar-placeholder').innerHTML = toolbarHTML;
    
    const presentationContainer = document.getElementById('presentation-container');
    const slideNavList = document.getElementById('slide-nav-list');
    const toolbar = document.getElementById('toolbar'); 

    if (!toolbar) {
        console.error("Toolbar element could not be created from toolbarHTML. Aborting script initialization.");
        return;
    }
    
    let lastActiveEditable = null;
    let savedRange = null;
    let activeImage = null;

    const visibleSlides = new Set();
    let scrollDebounceTimer;

    function addEditableListeners(element, slideIndex, contentKey) {
        element.contentEditable = true;
        element.addEventListener('focus', () => { lastActiveEditable = element; });
        element.addEventListener('blur', () => {
            setTimeout(() => {
                if (slidesData && slidesData[slideIndex]) {
                    slidesData[slideIndex][contentKey] = element.innerHTML;
                    updateSlideNavTitle(slideIndex);
                }
            }, 100);
        });
    };

    function updateSlideNavTitle(slideIndex) {
        const navLink = document.querySelector(`#slide-nav-list a[href="#slide-${slideIndex}"]`);
        if (navLink && slidesData && slidesData[slideIndex]) {
            const fullText = (slidesData[slideIndex].title || "Untitled").replace(/<[^>]*>?/gm, '');
            const maxLength = 22;
            let displayText = fullText;
            if (fullText.length > maxLength) {
                displayText = fullText.substring(0, maxLength).trim() + '...';
            }
            navLink.textContent = displayText;
        }
    }
    
    function removeResizeWrapper() { 
        const wrapper = document.querySelector('.resize-wrapper');
        if (wrapper) { 
            wrapper.remove();
        }
        activeImage = null; 
    }

    function renderSlideContent(slideElement, slideIndex) {
        const slide = slidesData[slideIndex];
        slideElement.innerHTML = '';
        slideElement.className = 'slide';
        slideElement.id = `slide-${slideIndex}`;
        const needsBanner = slide.layout !== 'title_slide' && slide.layout !== 'title_only';
        if (needsBanner) {
            slideElement.classList.add('has-banner');
            const banner = document.createElement('div');
            banner.className = 'slide-title-banner';
            const titleElement = document.createElement('h2');
            titleElement.innerHTML = slide.title || "Untitled";
            addEditableListeners(titleElement, slideIndex, 'title');
            banner.appendChild(titleElement);
            slideElement.appendChild(banner);
        }
        switch (slide.layout) {
            case 'title_slide':
                const titleBox = document.createElement('div');
                titleBox.className = 'flex flex-col justify-center items-center h-full'; 
                const contentWrapper = document.createElement('div');
                contentWrapper.className = 'w-full max-w-5xl';
                const title = document.createElement('h2');
                title.className = 'text-6xl font-bold mb-4 text-center';
                title.innerHTML = slide.title;
                addEditableListeners(title, slideIndex, 'title');
                const subtitle = document.createElement('p');
                subtitle.className = 'text-3xl text-center';
                subtitle.innerHTML = slide.content;
                addEditableListeners(subtitle, slideIndex, 'content');
                contentWrapper.append(title, subtitle);
                titleBox.appendChild(contentWrapper);
                slideElement.appendChild(titleBox);
                break;
            case 'title_only':
                const titleOnlyElement = document.createElement('h2');
                titleOnlyElement.className = "text-6xl font-bold text-center";
                titleOnlyElement.innerHTML = slide.title || "Untitled";
                addEditableListeners(titleOnlyElement, slideIndex, 'title');
                slideElement.classList.add('justify-center', 'items-center');
                slideElement.appendChild(titleOnlyElement);
                break;
            case 'two_column_chart':
            case 'two_column':
                const container = document.createElement('div');
                container.className = "flex flex-1 min-h-0 w-full text-2xl items-start";
                const col1 = document.createElement('div');
                col1.className = 'p-2 overflow-y-auto';
                col1.style.width = slide.column1Width || `calc(50% - 4px)`;
                col1.innerHTML = slide.content || "";
                addEditableListeners(col1, slideIndex, 'content');
                const splitter = document.createElement('div');
                splitter.className = 'column-splitter';
                splitter.dataset.slideIndex = slideIndex;
                const col2 = document.createElement('div');
                col2.className = 'p-2';
                col2.style.width = slide.column2Width || `calc(50% - 4px)`;
                
                if (slide.layout === 'two_column_chart') {
                    col2.innerHTML = slide.content2 || "";
                    col2.classList.add('h-full');
                } else {
                    col2.innerHTML = slide.content2 || "";
                    addEditableListeners(col2, slideIndex, 'content2');
                     col2.classList.add('overflow-y-auto');
                }
                container.append(col1, splitter, col2);
                slideElement.appendChild(container);
                break;
            case 'standard_content':
            default:
                if (slide.layout === 'standard_content') {
                    const contentElement = document.createElement('div');
                    contentElement.className = "text-3xl space-y-4 w-full";
                    contentElement.innerHTML = slide.content || "";
                    addEditableListeners(contentElement, slideIndex, 'content');
                    slideElement.appendChild(contentElement);
                }
                break;
        }
    }

    function renderAllSlides() {
        presentationContainer.innerHTML = '';
        slideNavList.innerHTML = '';
        slidesData.forEach((slide, slideIndex) => {
            const slideElement = document.createElement('div');
            presentationContainer.appendChild(slideElement);
            renderSlideContent(slideElement, slideIndex);

            const navItem = document.createElement('li');
            const navLink = document.createElement('a');
            navLink.href = `#slide-${slideIndex}`;
            
            const fullText = (slide.title || `Slide ${slideIndex + 1}`).replace(/<[^>]*>?/gm, '');
            const maxLength = 22;
            let displayText = fullText;
            if (fullText.length > maxLength) {
                displayText = fullText.substring(0, maxLength).trim() + '...';
            }
            navLink.textContent = displayText;

            navLink.className = 'block p-2 rounded hover:bg-gray-700 cursor-pointer text-sm';
            navItem.appendChild(navLink);
            slideNavList.appendChild(navItem);
        });
        document.querySelectorAll('.slide').forEach(slide => observer.observe(slide));
    }
    
    function applyStyle(command, value = null) {
        if (lastActiveEditable) {
            lastActiveEditable.focus();
            document.execCommand(command, false, value);
        }
    }
    
    // --- UPDATED RESIZE OBSERVER ---
    // This observer watches all visible chart containers for size changes.
    const chartResizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            const container = entry.target;
            const containerId = container.id;

            // Based on the container's ID, call the correct global drawing function from index.html
            if (containerId === 'chart-container') {
                drawBarChart('#' + containerId);
            } else if (containerId === 'delay-chart-container') {
                drawDelayChart('#' + containerId);
            }
        }
    });

    function updateActiveNavOnScroll() {
        const viewportCenter = window.innerHeight / 2;
        let closestSlideId = null;
        let minDistance = Infinity;

        visibleSlides.forEach(slideId => {
            const slideElement = document.getElementById(slideId);
            if (!slideElement) return;

            const rect = slideElement.getBoundingClientRect();
            const slideCenter = rect.top + rect.height / 2;
            const distance = Math.abs(viewportCenter - slideCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestSlideId = slideId;
            }
        });

        if (closestSlideId) {
            document.querySelectorAll('#slide-nav-list a').forEach(link => {
                link.classList.toggle('nav-active', link.getAttribute('href') === `#${closestSlideId}`);
            });
        }
    }

    // --- UPDATED INTERSECTION OBSERVER ---
    // This observer detects when slides scroll into view.
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                visibleSlides.add(entry.target.id);
            } else {
                visibleSlides.delete(entry.target.id);
            }
            
            // Find ALL chart containers within the current slide
            const chartContainers = entry.target.querySelectorAll('.chart-container');

            chartContainers.forEach(container => {
                // If the slide is visible on screen...
                if (entry.isIntersecting) {
                    const containerId = container.id;
                    // Draw the correct chart for the container that is now visible
                    if (containerId === 'chart-container') {
                        drawBarChart('#' + containerId);
                    } else if (containerId === 'delay-chart-container') {
                        drawDelayChart('#' + containerId);
                    }
                    // Start observing this container for resizes
                    chartResizeObserver.observe(container);
                } else {
                    // Stop observing for resizes when it's off-screen to save resources
                    chartResizeObserver.unobserve(container);
                }
            });
        });
        updateActiveNavOnScroll();
    }, { 
        rootMargin: `-${toolbar.offsetHeight + 16}px 0px 0px 0px`, 
        threshold: 0.01
    });

    // --- Event Listeners ---
    toolbar.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-command]');
        if (button) {
            const command = button.dataset.command;
            const alignCommands = ['justifyLeft', 'justifyCenter', 'justifyRight'];

            if (activeImage && alignCommands.includes(command)) {
                activeImage.style.display = 'block';
                switch (command) {
                    case 'justifyLeft':
                        activeImage.style.marginLeft = '0';
                        activeImage.style.marginRight = 'auto';
                        break;
                    case 'justifyCenter':
                        activeImage.style.marginLeft = 'auto';
                        activeImage.style.marginRight = 'auto';
                        break;
                    case 'justifyRight':
                        activeImage.style.marginLeft = 'auto';
                        activeImage.style.marginRight = '0';
                        break;
                }
                const contentEditableParent = activeImage.closest('[contenteditable="true"]');
                if (contentEditableParent) {
                    contentEditableParent.dispatchEvent(new Event('blur'));
                }
                removeResizeWrapper();
            } else {
                applyStyle(command);
            }
        }
        
        if (e.target.closest('#insert-image-btn')) {
            if (!lastActiveEditable) { 
                alert("Please click on a text area to set the insertion point."); 
                return; 
            }
            
            const selection = window.getSelection();
            if (selection.getRangeAt && selection.rangeCount) {
                savedRange = selection.getRangeAt(0);
            } else {
                savedRange = null;
            }

            document.getElementById('modal-backdrop').classList.remove('hidden');
            document.getElementById('image-modal').classList.remove('hidden');
            document.getElementById('image-url-input').focus();
        }

        if (e.target.closest('#save-btn')) window.print();
    });

    document.getElementById('font-selector').addEventListener('change', (e) => applyStyle('fontName', e.target.value));
    document.getElementById('text-color-input').addEventListener('input', (e) => applyStyle('foreColor', e.target.value));

    document.getElementById('image-modal').addEventListener('click', e => {
        const action = e.target.dataset.action;
        if (action === 'cancel' || action === 'confirm') {
            document.getElementById('modal-backdrop').classList.add('hidden');
            document.getElementById('image-modal').classList.add('hidden');

            if (action === 'confirm') {
                const url = document.getElementById('image-url-input').value.trim();
                if (url && savedRange) {
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(savedRange);

                    const tempId = `temp-img-${Date.now()}`;
                    document.execCommand('insertHTML', false, `<img src="${url}" id="${tempId}" style="width: 50%;" alt="User Image">`);
                    
                    setTimeout(() => {
                        const newImg = document.getElementById(tempId);
                        if (newImg) {
                            const pixelWidth = newImg.offsetWidth;
                            newImg.style.width = `${pixelWidth}px`;
                            newImg.removeAttribute('id');
                        }
                    }, 0);
                }
                savedRange = null; 
            }
        }
    });

    const debouncedScrollHandler = () => {
        clearTimeout(scrollDebounceTimer);
        scrollDebounceTimer = setTimeout(updateActiveNavOnScroll, 100);
    };

    slideNavList.addEventListener('click', function(e) {
        e.preventDefault();
        const link = e.target.closest('a');
        if (!link) return;
        const targetSlide = document.querySelector(link.getAttribute('href'));
        if (targetSlide) {
            window.removeEventListener('scroll', debouncedScrollHandler);
            const scrollPosition = targetSlide.offsetTop - toolbar.offsetHeight - 16;
            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
            setTimeout(() => {
                 window.addEventListener('scroll', debouncedScrollHandler);
                 updateActiveNavOnScroll();
            }, 1000);
        }
    });

    window.addEventListener('scroll', debouncedScrollHandler);

    // --- Column Resizing Logic ---
    presentationContainer.addEventListener('mousedown', function(e) {
        if (!e.target.classList.contains('column-splitter')) return;
        e.preventDefault();
        const splitter = e.target;
        const leftCol = splitter.previousElementSibling;
        const rightCol = splitter.nextElementSibling;
        const container = splitter.parentElement;
        const slideIndex = splitter.dataset.slideIndex;
        if (!leftCol || !rightCol || !container || slideIndex === undefined) return;
        const startX = e.clientX;
        const startLeftWidth = leftCol.offsetWidth;
        document.body.classList.add('is-resizing-columns');
        const doResize = (e) => {
            const totalWidth = container.offsetWidth - splitter.offsetWidth;
            let newLeftWidth = startLeftWidth + (e.clientX - startX);
            if (newLeftWidth < 100) newLeftWidth = 100;
            if (newLeftWidth > totalWidth - 100) newLeftWidth = totalWidth - 100;
            const newRightWidth = totalWidth - newLeftWidth;
            leftCol.style.width = `${newLeftWidth}px`;
            rightCol.style.width = `${newRightWidth}px`;
        };
        const stopResize = () => {
            document.body.classList.remove('is-resizing-columns');
            window.removeEventListener('mousemove', doResize);
            window.removeEventListener('mouseup', stopResize);
            if (slidesData && slidesData[slideIndex]) {
                const totalWidth = container.offsetWidth - splitter.offsetWidth;
                slidesData[slideIndex].column1Width = `${(leftCol.offsetWidth / totalWidth) * 100}%`;
                slidesData[slideIndex].column2Width = `${(rightCol.offsetWidth / totalWidth) * 100}%`;
            }
        };
        window.addEventListener('mousemove', doResize);
        window.addEventListener('mouseup', stopResize);
    });

    // --- Image Resizing & Selection Logic ---
    (function setupImageInteraction() {
        let resizeWrapper = null; 
        document.addEventListener('click', function(e) {
            const target = e.target;
            const isImage = target.tagName === 'IMG' && target.closest('.slide');
            
            if (isImage) {
                if (target !== activeImage) {
                     createResizeWrapper(target);
                }
            } else if (!target.closest('.resize-wrapper') && !target.closest('#toolbar')) {
                removeResizeWrapper();
            }
        }, true);
        
        function createResizeWrapper(image) {
            removeResizeWrapper();
            activeImage = image; 
            const slide = image.closest('.slide');
            if (!slide) return;
            
            resizeWrapper = document.createElement('div');
            resizeWrapper.className = 'resize-wrapper';
            
            resizeWrapper.style.top = `${image.offsetTop}px`;
            resizeWrapper.style.left = `${image.offsetLeft}px`;
            resizeWrapper.style.width = `${image.offsetWidth}px`;
            resizeWrapper.style.height = `${image.offsetHeight}px`;

            const seHandle = document.createElement('div');
            seHandle.className = 'resize-handle se';
            
            resizeWrapper.appendChild(seHandle); 
            slide.appendChild(resizeWrapper);

            seHandle.addEventListener('mousedown', startResize);
        }

        function startResize(e) {
            e.preventDefault(); e.stopPropagation();
            const startX = e.clientX;
            const startWidth = activeImage.offsetWidth;
            const startHeight = activeImage.offsetHeight;
            
            const doResize = (e) => {
                let newWidth = startWidth + (e.clientX - startX);
                if (newWidth < 50) newWidth = 50;
                const newHeight = (startHeight / startWidth) * newWidth;
                activeImage.style.width = `${newWidth}px`;
                activeImage.style.height = `${newHeight}px`;
                
                resizeWrapper.style.width = `${newWidth}px`;
                resizeWrapper.style.height = `${newHeight}px`;
                resizeWrapper.style.top = `${activeImage.offsetTop}px`;
                resizeWrapper.style.left = `${activeImage.offsetLeft}px`;
            };

            const stopResize = () => {
                window.removeEventListener('mousemove', doResize);
                window.removeEventListener('mouseup', stopResize);
                const contentEditableParent = activeImage.closest('[contenteditable="true"]');
                if (contentEditableParent) {
                     contentEditableParent.dispatchEvent(new Event('blur'));
                }
            };
            window.addEventListener('mousemove', doResize);
            window.addEventListener('mouseup', stopResize);
        }
    })();

    // Initial Render
    renderAllSlides();
    setTimeout(updateActiveNavOnScroll, 100);
});
