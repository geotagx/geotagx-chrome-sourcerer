var background_page = chrome.extension.getBackgroundPage();

var TARGET_HOST = "http://geotagx.org";
var TARGET_URI  = "/geotagx/sourcerer-proxy"

var GEOTAGX_SOURCERER_TYPE="geotagx-chrome-sourcerer"
var DELIMITER = "%%%%"

chrome.contextMenus.create({
    title: "Upload Image URL to GeoTag-X",
    contexts:["image"],
    onclick: function(info) {
        handleImageURL(info.srcUrl);
    }
});

/**
 * Sends a HTTP GET Request to the sourcerer-proxy
 * TODO : Handle errors here
 */
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function handleImageURL(url) {
    ARGUMENTS = GEOTAGX_SOURCERER_TYPE + DELIMITER + url
    sourcerer_proxy_url = TARGET_HOST+TARGET_URI+"?sourcerer-data="+ARGUMENTS
    httpGet(sourcerer_proxy_url)
}

