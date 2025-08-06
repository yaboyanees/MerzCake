/**
 * This function fetches the toolbar HTML from a separate file 
 * and injects it into the placeholder div on the main page.
 */
async function loadToolbar() {
    try {
        const response = await fetch('toolbar.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const toolbarHTML = await response.text();
        document.getElementById('toolbar-placeholder').innerHTML = toolbarHTML;
    } catch (error) {
        console.error('Could not load the toolbar:', error);
        document.getElementById('toolbar-placeholder').innerHTML = '<p class="text-red-500">Error: Toolbar could not be loaded.</p>';
    }
}

/**
 * Main application logic.
 * This event listener waits for the initial HTML document to be loaded.
 * It then loads the toolbar and, once complete, initializes the presentation.
 */
document.addEventListener('DOMContentLoaded', async function () {
    // First, load the toolbar component and wait for it to be ready.
    await loadToolbar();
    
    // Now that the toolbar is loaded, we can safely find our elements 
    // and run the rest of the presentation logic.
    const presentationContainer = document.getElementById('presentation-container');
    const slideNavList = document.getElementById('slide-nav-list');
    const toolbar = document.getElementById('toolbar'); 

    // A safety check to ensure the toolbar was loaded before we proceed.
    if (!toolbar) {
        console.error("Toolbar element not found after loading. Aborting script initialization.");
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
                // The 'slidesData' variable is accessed here, but defined in index.html
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
    
    // The drawBarChart function was removed from this file and moved to index.html.
    // The chartResizeObserver below can still call it because it's available globally.

    function applyStyle(command, value = null) {
        if (lastActiveEditable) {
            lastActiveEditable.focus();
            document.execCommand(command, false, value);
        }
    }
    
    let chartResizeTimer;
    const chartResizeObserver = new ResizeObserver(entries => {
        if (!entries || !entries.length) return;
        clearTimeout(chartResizeTimer);
        chartResizeTimer = setTimeout(() => {
            // This call still works because drawBarChart is a global function now.
            drawBarChart('#chart-container');
        }, 50);
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

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                visibleSlides.add(entry.target.id);
            } else {
                visibleSlides.delete(entry.target.id);
            }
            
            const chartContainer = entry.target.querySelector('#chart-container');
            if (entry.isIntersecting && chartContainer) {
                chartResizeObserver.observe(chartContainer);
            } else if (chartContainer) {
                chartResizeObserver.unobserve(chartContainer);
            }
        });
        updateActiveNavOnScroll();
    }, { 
        rootMargin: `-${toolbar.offsetHeight + 16}px 0px 0px 0px`, 
        threshold: 0.01
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
