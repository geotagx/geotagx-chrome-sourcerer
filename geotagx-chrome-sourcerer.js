var background_page = chrome.extension.getBackgroundPage();

chrome.contextMenus.create({
    title: "Upload Image URL to GeoTag-X",
    contexts:["image"],
    onclick: function(info) {
        chrome.runtime.sendMessage({type:'found_image', imageURL:info.srcUrl, sourceUrl: info.pageUrl});
    }
});

//Checks for blacklisted domains and returns true if the domain is blacklisted
function checkForBlacklistedHosts(SOURCE_URL, IMAGE_URL){
    console.log(SOURCE_URL);
  var parser = document.createElement('a');
  parser.href = SOURCE_URL;

  if(parser.hostname.match(/\.google\./gi)){
    return true;
  }else{
    return false;
  }
}

// Handles opening of dialog window for pushing images to GeoTag-X
chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === 'found_image') {

        //Check for blacklisted domains
        if(checkForBlacklistedHosts(request.sourceUrl, request.imageURL)){
            alert("We cannot collect images from Google. We would encourage you to visit the page and then try resending the image as we are required to collect the actual source of the image");
            return;
        }else{
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
    }
});


// Add TinyEye Reverse Search for images
// Code Inspired from : https://code.google.com/p/tineye-chrome/

var geotagxTinyEye = geotagxTinyEye || {};
geotagxTinyEye.SERVER = 'www.tineye.com';


geotagxTinyEye.openUrl = function(url) {
    // Open new tabs next to current one
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

        // Get new tab index
        var new_tab_index = tabs[0].index + 1;

        // Check where the user wants the url to be open
        switch(localStorage.tab_visibility) {
            case "background":
                chrome.tabs.create({url: url, active: false, index: new_tab_index});
                break;
            case "foreground":
                chrome.tabs.create({url: url, active: true, index: new_tab_index});
                break;
            case "current":
                chrome.tabs.update(tabs[0].id, {url: url});
                break;
            default:
                chrome.tabs.create({url: url, active: false, index: new_tab_index});
        }

    });
};

geotagxTinyEye.imageSearch = function(info, tab) {
    // Send the selected image to tinyeye
    url = encodeURIComponent(info.srcUrl);
    geotagxTinyEye.openUrl("http://" + geotagxTinyEye.SERVER + "/search/?url=" + url);
};

// Create two context menu items for image, and page clicks
chrome.contextMenus.create({
    "title": "Reverse Search Image on TinEye for similar images",
    "contexts": ["image"],
    "onclick": geotagxTinyEye.imageSearch});
