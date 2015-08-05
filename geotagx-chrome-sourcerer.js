var background_page = chrome.extension.getBackgroundPage();
var TARGET_HOST = "http://geotagx.org";
var refreshCategoriesTimeOut = 24 * 60 * 60 * 1000;


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

  if(parser.hostname.match(/\.google\./gi) ){
    return "GOOGLE";
  }else if(parser.hostname.match(/geotagx\./gi)){
    return "GEOTAGX";
  }
  else{
    return false;
  }
}

var GEOTAGX_CATEGORIES =  [
   {
      "img":"/static/geotagx-img/categories/ebola_response.png",
      "name":"Ebola Response",
      "short_name":"ebolaresponse"
   },
   {
      "img":"/static/geotagx-img/categories/winter_shelter.png",
      "name":"Winter Shelter",
      "short_name":"emergencyshelterassessmentinthemiddleeast"
   },
   {
      "img":"/static/geotagx-img/categories/yemeni_agricultural_water_assesment.png",
      "name":"Yemeni Agricultural Water Assesment",
      "short_name":"yemeniagriculturalwaterassessment"
   },
   {
      "img":"/static/geotagx-img/categories/yamuna_monsoon_flooding.png",
      "name":"Yamuna Monsoon Flooding 2013",
      "short_name":"yamunamonsoonflooding2013"
   },
   {
      "img":"/static/geotagx-img/categories/somali_drought.png",
      "name":"Somali Drought",
      "short_name":"somalidrought"
   }
]



/**
 * Sends a HTTP GET Request to the sourcerer-proxy
 * TODO : Handle errors here
 */
function httpGet(url)
{
    try{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
    }catch(err){
        //alert("Something went wrong :( Are you sure you are connected to the internet ? Please try again later !!");
        //Pass silently for now
        return false;
    }
}

/**
 * Updates GeoTagX Categories list
 * @return {[type]} [description]
 */
function updateGeoTagXCategories(){
    CATEGORIES_END_POINT = "/geotagx/sourcerer/categories.json"
    json_response = httpGet(TARGET_HOST+CATEGORIES_END_POINT);
    if(json_response){
        data = JSON.parse(json_response);
        GEOTAGX_CATEGORIES = []
        $.each(data, function(key, value) {
            console.log(key, value);
            value.short_name = key;
            GEOTAGX_CATEGORIES.push(value);
        });
    }
}

updateGeoTagXCategories();
setInterval(updateGeoTagXCategories(), refreshCategoriesTimeOut);


// Handles opening of dialog window for pushing images to GeoTag-X
chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === 'found_image') {

        //Check for blacklisted domains
        var blackListCheck = checkForBlacklistedHosts(request.sourceUrl, request.imageURL);
        if(blackListCheck == "GOOGLE"){
            alert("We cannot collect images from Google. We would encourage you to visit the page and then try resending the image as we are required to collect the actual source of the image");
            return;
        }else if(blackListCheck == "GEOTAGX"){
          alert("You cannot send images from GeoTagX.org. Please try sending another image from another domain.");
          return;
        }
        else{
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
                            sourceUrl : request.sourceUrl,
                            GEOTAGX_CATEGORIES : GEOTAGX_CATEGORIES
                        });
                    }
                });
            });
        }
    }
});


// Add TinyEye Reverse Search for images
// Code Inspired from : https://code.google.com/p/tineye-chrome/

// var geotagxTinyEye = geotagxTinyEye || {};
// geotagxTinyEye.SERVER = 'www.tineye.com';


// geotagxTinyEye.openUrl = function(url) {
//     // Open new tabs next to current one
//     chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

//         // Get new tab index
//         var new_tab_index = tabs[0].index + 1;

//         // Check where the user wants the url to be open
//         switch(localStorage.tab_visibility) {
//             case "background":
//                 chrome.tabs.create({url: url, active: false, index: new_tab_index});
//                 break;
//             case "foreground":
//                 chrome.tabs.create({url: url, active: true, index: new_tab_index});
//                 break;
//             case "current":
//                 chrome.tabs.update(tabs[0].id, {url: url});
//                 break;
//             default:
//                 chrome.tabs.create({url: url, active: false, index: new_tab_index});
//         }

//     });
// };

// geotagxTinyEye.imageSearch = function(info, tab) {
//     // Send the selected image to tinyeye
//     url = encodeURIComponent(info.srcUrl);
//     geotagxTinyEye.openUrl("http://" + geotagxTinyEye.SERVER + "/search/?url=" + url);
// };

// // Create two context menu items for image, and page clicks
// var contextMenuTinyEyeObject = {
//     "title": "Reverse Search Image on TinEye for similar images",
//     "contexts": ["image"],
//     "onclick": geotagxTinyEye.imageSearch}

// var contextMenuTinyEyeId = chrome.contextMenus.create(contextMenuTinyEyeObject);
