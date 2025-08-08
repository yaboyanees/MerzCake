// --- Global variable to hold citation data ---
let citationData = {};

// --- Fetch citation data on page load ---
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://cdn.jsdelivr.net/gh/yaboyanees/MerzCake@main/citations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            citationData = data;
            console.log('Citation data loaded successfully.');
        })
        .catch(error => {
            console.error('Failed to load citation data:', error);
        });
});

// --- Drawer DOM Elements ---
const drawer = document.getElementById('sideDrawer');
const overlay = document.getElementById('drawerOverlay');
const drawerContent = document.getElementById('drawerContent');

/**
 * Opens the side drawer and populates it with content from the fetched citation data.
 * @param {string} citationId The ID of the citation to display.
 */
function openDrawer(citationId) {
    const data = citationData[citationId];
    if (!drawer || !overlay || !drawerContent) {
        console.error('Drawer elements not found in the DOM.');
        return;
    }
    
    if (!data) {
        console.error('Citation data not found for:', citationId);
        drawerContent.innerHTML = `<p class="text-red-400">Error: Could not load citation details.</p>`;
    } else {
        // Dynamically create the content for the drawer
        // Using textContent to prevent XSS vulnerabilities from the title, and escaping HTML for the code.
        const title = document.createElement('h4');
        title.className = 'font-bold text-lg';
        title.textContent = data.title;

        const button = document.createElement('button');
        button.onclick = () => copyCodeToClipboard(button);
        button.className = 'bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
        button.textContent = 'Copy Code';

        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-2';
        header.appendChild(title);
        header.appendChild(button);

        const pre = document.createElement('pre');
        pre.className = 'bg-gray-900 p-3 rounded-md max-h-full overflow-auto text-sm';
        
        const code = document.createElement('code');
        code.className = 'language-python';
        code.textContent = data.code; // Use textContent to let the browser handle rendering

        pre.appendChild(code);
        
        drawerContent.innerHTML = ''; // Clear previous content
        drawerContent.appendChild(header);
        drawerContent.appendChild(pre);
    }
    
    drawer.classList.add('open');
    overlay.classList.add('open');
}

/**
 * Closes the side drawer.
 */
function closeDrawer() {
    if (drawer && overlay) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
    }
}

/**
 * Copies the code from the <pre> block within the drawer to the clipboard.
 * @param {HTMLElement} buttonElement The "Copy Code" button that was clicked.
 */
function copyCodeToClipboard(buttonElement) {
    const preElement = buttonElement.closest('.flex').nextElementSibling;
    if (!preElement || !preElement.querySelector('code')) {
        console.error("Could not find the code block to copy.");
        return;
    }
    const codeText = preElement.querySelector('code').innerText;

    // Use the modern Clipboard API if available, with a fallback to execCommand.
    if (navigator.clipboard) {
        navigator.clipboard.writeText(codeText).then(() => {
            provideFeedback(buttonElement);
        }).catch(err => {
            console.error('Async: Could not copy text: ', err);
            fallbackCopyText(codeText, buttonElement); // Fallback if promise rejects
        });
    } else {
        fallbackCopyText(codeText, buttonElement);
    }
}

/**
 * Provides user feedback on the copy button.
 * @param {HTMLElement} buttonElement The button to give feedback on.
 */
function provideFeedback(buttonElement) {
    const originalText = buttonElement.innerText;
    buttonElement.innerText = 'Copied!';
    buttonElement.disabled = true;
    setTimeout(() => {
        buttonElement.innerText = originalText;
        buttonElement.disabled = false;
    }, 2000); // Revert back after 2 seconds
}

/**
 * Fallback method for copying text using execCommand.
 * @param {string} text The text to copy.
 * @param {HTMLElement} buttonElement The button to give feedback on.
 */
function fallbackCopyText(text, buttonElement) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "absolute";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        provideFeedback(buttonElement);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        buttonElement.innerText = 'Error!';
         setTimeout(() => {
            buttonElement.innerText = 'Copy Code';
        }, 2000);
    } finally {
        document.body.removeChild(textArea);
    }
}
