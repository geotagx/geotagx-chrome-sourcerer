var background_page = chrome.extension.getBackgroundPage();

var TARGET_HOST = "http://localhost:5000";
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
function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function handleImageURL(url) {
    var sourcerer_object = {}
    sourcerer_object.source = GEOTAGX_SOURCERER_TYPE;
    sourcerer_object.image_url = url

    //Base64 encode the data before sending the GET request
    ARGUMENTS = Base64.encode(JSON.stringify(sourcerer_object))
    sourcerer_proxy_url = TARGET_HOST+TARGET_URI+"?sourcerer-data="+ARGUMENTS
    httpGet(sourcerer_proxy_url)
}