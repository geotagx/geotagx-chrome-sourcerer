var TARGET_HOST = "http://geotagx.org";
var TARGET_URI  = "/geotagx/sourcerer-proxy"

var GEOTAGX_SOURCERER_TYPE="geotagx-chrome-sourcerer"
var PAGE_WITH_UNDETECTABLE_IMAGES = "PAGE_WITH_UNDETECTABLE_IMAGES"
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
        alert("Something went wrong :( Are you sure you are connected to the internet ? Please try again later !!");
    }
}

$("#undetectable_images").click(function(){
    var sourcerer_object = {}
    sourcerer_object.source = GEOTAGX_SOURCERER_TYPE;
    sourcerer_object.type = PAGE_WITH_UNDETECTABLE_IMAGES;

    var query = { active: true, currentWindow: true };
	chrome.tabs.query(query, function(tabs){
	    sourcerer_object.page_url = tabs[0].url;

	    //Base64 encode the data before sending the GET request
	    ARGUMENTS = Base64.encode(JSON.stringify(sourcerer_object))
	    sourcerer_proxy_url = TARGET_HOST+TARGET_URI+"?sourcerer-data="+ARGUMENTS;
	    httpGet(sourcerer_proxy_url);
	    chrome.tabs.update({ active: true }); 
	})

})