var background_page = chrome.extension.getBackgroundPage();

chrome.contextMenus.create({
    title: "Upload Image URL to GeoTag-X",
    contexts:["image"],
    onclick: function(info) {
        chrome.runtime.sendMessage({type:'found_image', imageURL:info.srcUrl, sourceUrl: info.pageUrl});
    }
});


// Handles opening of dialog window for pushing images to GeoTag-X
chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === 'found_image') {
        chrome.tabs.create({
            url: chrome.extension.getURL('choose_category.html'),
            active: false
        }, function(tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true
                // incognito, top, left, ...
            });

            chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
                if(tabId == tab.id && changeInfo.status == "complete"){
                    chrome.tabs.sendMessage(tabId, {
                        imageURL : request.imageURL,
                        sourceUrl : request.sourceUrl
                    });
                }
            });
        });
    }
});
