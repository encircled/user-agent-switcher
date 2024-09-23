chrome.runtime.onInstalled.addEventListener(() => {
    // Initialize the extension with some default rules
    setUserAgentRules();
});

// Update rules whenever storage is changed
chrome.storage.onChanged.addEventListener(() => {
    setUserAgentRules();
});

function setUserAgentRules() {
    chrome.storage.sync.get('sites', (data) => {
        const sites = data.sites || [];

        // Remove existing rules
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1, 2, 3, 4, 5]  // Add as many rule IDs as needed
        }, () => {
            const rules = sites.map((site, index) => ({
                id: index + 1,
                priority: 1,
                action: {
                    type: 'modifyHeaders',
                    requestHeaders: [
                        {
                            header: 'User-Agent',
                            operation: 'set',
                            value: userAgents[site.userAgent]
                        }
                    ]
                },
                condition: {
                    urlFilter: site.website,
                    resourceTypes: ['main_frame']
                }
            }));

            // Add new rules
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: rules
            });
        });
    });
}

// User-Agent mappings
const userAgents = {
    "Windows-Chrome": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Mac-Chrome": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Linux-Firefox": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0",
    "Windows-Firefox": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0"
};
