document.getElementById('addSite').addEventListener('click', function () {
    const website = document.getElementById('website').value;
    const userAgent = document.getElementById('userAgent').value;

    if (website && userAgent) {
        chrome.storage.sync.get('sites', (data) => {
            let sites = data.sites || [];
            sites.push({ website, userAgent });
            chrome.storage.sync.set({ sites }, () => {
                displaySites();  // Refresh the list
                document.getElementById('website').value = '';  // Clear the input
            });
        });
    }
});

function displaySites() {
    chrome.storage.sync.get('sites', (data) => {
        const siteList = document.getElementById('siteList');
        siteList.innerHTML = '';  // Clear the list before re-rendering

        (data.sites || []).forEach((site, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${site.website} - ${site.userAgent} <button class="remove-site" data-index="${index}">Remove</button>`;
            siteList.appendChild(li);
        });

        // Add event listeners to all remove buttons
        document.querySelectorAll('.remove-site').forEach((button) => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                removeSite(index);
            });
        });
    });
}

function removeSite(index) {
    chrome.storage.sync.get('sites', (data) => {
        let sites = data.sites || [];
        sites.splice(index, 1);  // Remove the site from the array by index
        chrome.storage.sync.set({ sites }, () => {
            displaySites();  // Refresh the list after deletion
        });
    });
}

// Initially display the sites on page load
document.addEventListener('DOMContentLoaded', displaySites);
