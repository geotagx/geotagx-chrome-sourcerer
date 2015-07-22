var TARGET_HOST = "http://geotagx.org";
var TARGET_URI  = "/geotagx/sourcerer-proxy"

var GEOTAGX_SOURCERER_TYPE="geotagx-chrome-sourcerer";
var IMAGE_SOURCE = "IMAGE_SOURCE";

var DELIMITER = "%%%%"

var IMAGE_URL = "";
var SOURCE_URL = "";

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


chrome.extension.onMessage.addListener(function (msg, _, sendResponse) {
    console.log(JSON.stringify(msg));
    IMAGE_URL = msg.imageURL;
    SOURCE_URL = msg.sourceUrl;

    $("#category_options").html('');

    for(var _i =0 ; _i < GEOTAGX_CATEGORIES.length; _i++){
        var CATEGORY = GEOTAGX_CATEGORIES[_i];
        var img = $('<img class="img-circle" style="width:200px">');
        img.attr('src', TARGET_HOST+CATEGORY['img']);
        var CHECKBOX = $('<div class="checkbox col-md-4">');
        var LABEL = $('<label>')
        var INPUT = $('<input class="category_checkbox" type="checkbox">');
        INPUT.attr('name', CATEGORY.short_name);
        LABEL.append(INPUT);
        LABEL.append(img);
        // LABEL.append("<center><a href='"+TARGET_HOST+"/project/category/"+CATEGORY.short_name+"' target='_blank'><h5>"+CATEGORY.name+"</h5></a></center>");
        LABEL.append("<center><h5>"+CATEGORY.name+"</h5></center>");
        CHECKBOX.append(LABEL);


        // $('#image_preview').append(img);
        $("#category_options").append(CHECKBOX);
    }

    //Enable Submit Button here
});



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

function handleImageURL(url) {
    var sourcerer_object = {}
    sourcerer_object.source = GEOTAGX_SOURCERER_TYPE;
    sourcerer_object.image_url = url

    //Base64 encode the data before sending the GET request
    ARGUMENTS = Base64.encode(JSON.stringify(sourcerer_object))
    sourcerer_proxy_url = TARGET_HOST+TARGET_URI+"?sourcerer-data="+ARGUMENTS;
    httpGet(sourcerer_proxy_url)
}

function closeWindow(){
    chrome.windows.getCurrent(function(_window){
        chrome.windows.remove(_window.id);
    })    
}

$("#close_window").click(function(){
    closeWindow();
})

$("#submit").click(function(){
        var selected = [];
        $('#category_options input:checked').each(function() {
            selected.push($(this).attr('name'));
        });
        if(selected.length == 0){
            alert("You have not selected any relevant project yet...");
        }else{
                var sourcerer_object = {}

                sourcerer_object.source = GEOTAGX_SOURCERER_TYPE;
                sourcerer_object.type = IMAGE_SOURCE;
                sourcerer_object.image_url = IMAGE_URL;
                sourcerer_object.source_uri = SOURCE_URL;
                sourcerer_object.categories = selected;

                //Base64 encode the data before sending the GET request
                ARGUMENTS = Base64.encode(JSON.stringify(sourcerer_object))
                sourcerer_proxy_url = TARGET_HOST+TARGET_URI+"?sourcerer-data="+ARGUMENTS;
                httpGet(sourcerer_proxy_url);
                closeWindow();
        }
    });

