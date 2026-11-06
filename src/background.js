chrome.runtime.onInstalled.addListener(() => {
    // Initialize the extension with some default rules
    setUserAgentRules();
});

// Update rules whenever storage is changed
chrome.storage.onChanged.addListener(() => {
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
                        },
                        {
                            header: 'Sec-Ch-Ua',
                            operation: 'set',
                            value: '"Chromium";v="157", "Google Chrome";v="157", "Not?A_Brand";v="99"'
                        },
                        {
                            header: 'Sec-Ch-Ua-Mobile',
                            operation: 'set',
                            value: '?0'
                        },
                        {
                            header: 'Sec-Ch-Ua-Platform',
                            operation: 'set',
                            value: '"Windows"'
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
    "Windows-Chrome": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36",
    "Mac-Chrome": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Linux-Firefox": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0",
    "Windows-Firefox": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0"
};
