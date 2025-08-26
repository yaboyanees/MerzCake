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

    // --- Main Initializer ---
    init(slidesData) {
        this.config.slidesData = slidesData;
        this.config.presentationContainer = document.getElementById('presentation-container');
        
        const bannerSegmentsHtml = `<div class="banner-segment" style="flex-grow: 369;"></div><div class="banner-segment" style="flex-grow: 46;"></div><div class="banner-segment" style="flex-grow: 42;"></div><div class="banner-segment" style="flex-grow: 34;"></div><div class="banner-segment" style="flex-grow: 34;"></div><div class="banner-segment" style="flex-grow: 29;"></div><div class="banner-segment" style="flex-grow: 25;"></div><div class="banner-segment" style="flex-grow: 21;"></div><div class="banner-segment" style="flex-grow: 17;"></div><div class="banner-segment" style="flex-grow: 12;"></div><div class="banner-segment" style="flex-grow: 8;"></div><div class="banner-segment" style="flex-grow: 4;"></div>`;

        function getStandardHeader(slideData) {
            const titleHtml = slideData.layout !== 'questions' && slideData.layout !== 'backups' 
                ? `<h1 contenteditable="true" class="text-4xl font-bold absolute top-10 right-6 text-black ${slideData.layout === 'bullet_list' && slideData.title === 'Overview' ? 'italic' : ''}">(U) ${slideData.title}</h1>` 
                : '';
            return `<header class="relative w-full p-6 h-36 flex-shrink-0"><div class="absolute top-6 left-6 font-arial font-bold text-lg text-black">CUI</div>${titleHtml}<div class="absolute bottom-11 left-6 w-[calc(100%-3rem)]"><div class="header-banner w-full">${bannerSegmentsHtml}</div></div></header>`;
        }

        function getStandardFooter(pageNumber) {
            return `<footer class="w-full p-6 text-sm text-gray-500 flex justify-between items-end flex-shrink-0"><div><span>${pageNumber} ${new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} TITLE OF BRIEF.pptx</span></div><div class="font-arial font-bold text-lg text-black">CUI</div></footer>`;
        }

        function getLayoutHtml(slideData, slideIndex) {
            const pageNumber = slideIndex + 1;
            switch (slideData.layout) {
                case 'title':
                    return `<div class="slide" id="${slideData.id}"><header class="relative w-full p-6 h-36 flex-shrink-0"><div class="absolute top-6 left-6 font-arial font-bold text-lg text-black">CUI</div><div class="absolute bottom-1 left-6 w-[calc(100%-3rem)] h-24 flex items-center"><div class="w-24 h-24 absolute top-1/2 -translate-y-1/2 left-0 z-10 flex-shrink-0"><img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Joint_Chiefs_of_Staff_seal_%282%29.svg" alt="Joint Chiefs of Staff seal" class="w-full h-full object-contain"></div><div class="header-banner w-full">${bannerSegmentsHtml}</div></div></header><main class="flex-grow flex flex-col items-center justify-center text-center"><h1 contenteditable="true" class="text-7xl font-black tracking-wider text-gray-800">(U) TITLE OF BRIEF</h1><h2 contenteditable="true" class="text-5xl font-arial font-bold text-black mt-16">Subtitle</h2></main><footer class="relative w-full p-6 text-sm text-gray-500 flex justify-between items-end flex-shrink-0"><div contenteditable="true"><span>${pageNumber} ${new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} TITLE OF BRIEF.pptx</span></div><div contenteditable="true" class="absolute text-left text-xs leading-tight font-arial font-bold text-black" style="bottom: 5rem; right: 6rem; width: 240px;"><p><span>Controlled By:</span></p><p><span>CUI Category:</span></p><p><span>LDC:</span></p><p><span>POC:</span></p><br><p><span>Classified by:</span></p><p><span>Derived From:</span></p><p><span>Decl on:</span></p></div><div class="font-arial font-bold text-lg text-black">CUI</div></footer></div>`;
                case 'bullet_list':
                    const fontSizeClass = slideData.fontSize || 'text-4xl';
                    const listItems = slideData.content.map(item => `<li>${item}</li>`).join('');
                    return `<div class="slide" id="${slideData.id}">${getStandardHeader(slideData)}<main class="flex p-12"><ul contenteditable="true" class="list-disc pl-16 space-y-6 font-bold ${fontSizeClass}">${listItems}</ul></main>${getStandardFooter(pageNumber)}</div>`;
                case 'two_column_image':
                    return `<div class="slide" id="${slideData.id}">${getStandardHeader(slideData)}<main class="flex p-12 gap-8 items-start"><div class="w-3/5"><ul contenteditable="true" class="list-disc pl-8 space-y-8 text-4xl font-bold"><li>(U) Bullet example text</li><li>(U) Sets the stage for highlighting issues</li><li>(U) Other bullet point here</li></ul></div><div class="w-2/5 flex flex-col justify-start gap-4 editable-image-column" contenteditable="true"><div><p class="font-bold text-lg mb-2">(U) Destroyer in Pacific</p><img src="https://www.naval-technology.com/wp-content/uploads/sites/15/2023/01/Featured-Image-Arleigh-Burke-Class-destroyer.jpg" class="border-2 border-black"></div><div><p class="font-bold text-lg mb-2">(U) Submarine off coast of San Diego</p><img src="https://upload.wikimedia.org/wikipedia/commons/b/bb/US_Navy_040730-N-1234E-002_PCU_Virginia_%28SSN_774%29_returns_to_the_General_Dynamics_Electric_Boat_shipyard.jpg" class="border-2 border-black"></div></div></main>${getStandardFooter(pageNumber)}</div>`;
                case 'two_column_text':
                    return `<div class="slide" id="${slideData.id}">${getStandardHeader(slideData)}<main class="flex p-12 gap-16 items-start"><div class="w-1/2"><ul contenteditable="true" class="list-disc pl-8 space-y-6 text-3xl font-bold"><li>(U) First point for the left column.</li><li>(U) Another point to illustrate the layout.</li><li>(U) This column can contain key takeaways.</li><li>(U) Additional bullet point.</li></ul></div><div class="w-1/2"><ul contenteditable="true" class="list-disc pl-8 space-y-6 text-3xl font-bold"><li>(U) First point for the right column.</li><li>(U) Supporting details or contrasting points.</li><li>(U) This column provides more information.</li><li>(U) Final bullet point for this side.</li></ul></div></main>${getStandardFooter(pageNumber)}</div>`;
                case 'map':
                    return `<div class="slide" id="${slideData.id}">${getStandardHeader(slideData)}<main class="relative flex flex-col items-center pt-2"><h2 contenteditable="true" class="text-2xl font-bold mb-2">(U) Region Map of Gulf of Aden & Red Sea</h2><div id="map-container"></div><ul contenteditable="true" class="list-disc pl-12 mt-8 text-3xl font-bold self-start ml-32 space-y-6"><li>(U) Callout bullet #1 goes here</li><li>(U) Callout bullet #2 goes here</li></ul></main>${getStandardFooter(pageNumber)}</div>`;
                case 'questions': case 'backups':
                     return `<div class="slide" id="${slideData.id}">${getStandardHeader(slideData)}<main class="flex items-center justify-center"><h1 contenteditable="true" class="text-7xl font-bold">${slideData.title}</h1></main>${getStandardFooter(pageNumber)}</div>`;
                case 'black':
                    return `<div class="slide bg-black" id="${slideData.id}"></div>`;
                default: return '';
            }
        }

        // Render all slides to the DOM
        this.config.presentationContainer.innerHTML = '';
        this.config.slidesData.forEach((slideData, index) => {
            const slideWrapper = document.createElement('div');
            slideWrapper.className = 'slide-wrapper';
            slideWrapper.id = `slide-wrapper-${index}`;
            slideWrapper.innerHTML = getLayoutHtml(slideData, index);
            this.config.presentationContainer.appendChild(slideWrapper);
        });

        // Initialize all modules
        if (document.getElementById('map-container')) {
            this.d3Map.render();
        }
        this.toolbar.init();
        this.sideNav.update();
        this.presentationManager.initObserver();
        this.presentationManager.scaleSlides();
        window.addEventListener('resize', this.presentationManager.scaleSlides);
    }
};
