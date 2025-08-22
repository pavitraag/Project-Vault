// Background script for Chrome extension
// Handles content script injection and pets management

let petsEnabled = true;

// Initialize on extension startup
chrome.runtime.onStartup.addListener(async () => {
    console.log("Extension started");
    await loadSettings();
});

chrome.runtime.onInstalled.addListener(async () => {
    console.log("Extension installed/updated");
    await loadSettings();
    await injectPetsIntoAllTabs();
});

// Load settings from storage
async function loadSettings() {
    try {
        const result = await chrome.storage.local.get(['petsEnabled']);
        petsEnabled = result.petsEnabled !== false; // Default to true
        console.log("Pets enabled:", petsEnabled);
    } catch (error) {
        console.error("Error loading settings:", error);
    }
}

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch (message.action) {
        case 'togglePets':
            petsEnabled = message.enabled;
            console.log("Pets toggled:", petsEnabled);
            
            if (petsEnabled) {
                await injectPetsIntoAllTabs();
            } else {
                await removePetsFromAllTabs();
            }
            break;
            
        case 'getPetsStatus':
            sendResponse({ enabled: petsEnabled });
            break;
            
        default:
            console.log("Unknown message action:", message.action);
    }
});

// Inject pets into all existing tabs
async function injectPetsIntoAllTabs() {
    if (!petsEnabled) return;
    
    try {
        const tabs = await chrome.tabs.query({});
        
        for (const tab of tabs) {
            // Skip chrome:// and extension pages
            if (tab.url.startsWith('chrome://') || 
                tab.url.startsWith('chrome-extension://') ||
                tab.url.startsWith('moz-extension://') ||
                tab.url.startsWith('edge://')) {
                continue;
            }
            
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: injectPetsScript
                });
                console.log("Pets injected into tab:", tab.url);
            } catch (error) {
                console.log("Could not inject into tab:", tab.url, error.message);
            }
        }
    } catch (error) {
        console.error("Error injecting pets into all tabs:", error);
    }
}