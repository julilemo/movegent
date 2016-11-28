// Variables
var btn_map = document.getElementById('btn_map');
var btn_list = document.getElementById('btn_list');
var btn_geolocation = document.getElementById('btn_geolocation');
var btn_favorite = document.getElementsByClassName('btn_favorite');
var btn_detail = document.getElementsByClassName('btn_detail');
var sportcentra = document.getElementById('sportcentra');
var speelterreinen = document.getElementById('speelterreinen');
var parken = document.getElementById('parken');
var hondenvoorzieningen = document.getElementById('hondenvoorzieningen');
var wandelroutes = document.getElementById('wandelroutes');
var toeristischeWandelroutes = document.getElementById('toeristischeWandelroutes');
var clear = document.getElementById('clear');
var map;
var data_id;
var coord_lat = [];
var coord_lgt = [];
var coord = [];
var category_marker = [];
var category_shapes = [];

// Functions
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(51.0535,3.7304),
        mapTypeId: 'terrain'
    });

}

function categoryMarker(array) {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(51.0535,3.7304)
    });

    for (var i=0; i<array.length; i++) {

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(array[i][1], array[i][0]),
            map: map
        });

        // To add the marker to the map, call setMap();
        marker.setMap(map);
    }
}

function categoryShape(array) {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(51.0535,3.7304)
    });

    for (var i=0; i<array.length; i++) {

        var drawPolygon = new google.maps.Polygon({
            path: array[i],
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.5
        });

        drawPolygon.setMap(map);
    }
}

function detail_marker(lat, lgt) {
    document.getElementById('map').style.display = 'block';
    document.getElementById('movegent-results').style.display = 'none';

    var myLatLng = {lat: lat, lng: lgt};
    console.log(lat + " / " + lgt);
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: myLatLng
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);
}

function detail_shape(array) {
    document.getElementById('map').style.display = 'block';
    document.getElementById('movegent-results').style.display = 'none';

    var lattitude = array[0].lat;
    var longitude = array[0].lng;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: {lat: lattitude, lng: longitude},
        mapTypeId: 'terrain'
    });

    var drawPolygon = new google.maps.Polygon({
        path: array,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.5
    });

    drawPolygon.setMap(map);
    console.log("lat: " + lattitude + " / long: " + longitude);
}

function showSportCentra() {
    if (sportcentra.checked) {
        // Show sportcentra options buttons
        document.getElementById('sportcentra_options').style.display = "block";

        // Hide options buttons
        document.getElementById('speelterreinen_options').style.display = "none";
        document.getElementById('hondenvoorzieningen_options').style.display = "none";
        document.getElementById('wandelroutes_options').style.display = "none";
        document.getElementById('parken').checked = false;
        document.getElementById('speelterreinen').checked = false;
        document.getElementById('hondenvoorzieningen').checked = false;
        document.getElementById('wandelroutes').checked = false;

        // Hide map data
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });

        initMap();

        // Load map data
        map.data.loadGeoJson('https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/GEOJSON/sportcentra.json');

        // Load result list
        function MoveGentSportcentraApp() {

            // URL of the Search API
            this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/sportcentra.json?callback=json_callback';
            // The results within the JSON-object
            this._moveGentData;
            // UI generated
            this._uiGenerated = false;

            // Initialize App
            this.init = function() {
                console.log('1. Initialize the app');

                this.loadData();
            }

            // Load the data from the API
            this.loadData = function() {
                console.log('2. Load the Data');

                var that = this;// Hack --> Closure

                var xhr = new XMLHttpRequest();
                xhr.open('get', this.API_URL, true);
                xhr.responseType = 'json';
                xhr.onload = function() {
                    if(xhr.status == 200) {
                        var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                        /*data = data.sort(function (a, b) {
                         if (a.name > b.name) {
                         return 1;
                         }
                         if (a.name < b.name) {
                         return -1;
                         }
                         // a must be equal to b
                         return 0;
                         });*/
                        that._moveGentData = data;
                        that.updateUI();
                    } else {
                        reject(status);
                    }
                }
                xhr.onerror = function() {
                    reject(Error('Network Error!'));
                }
                xhr.send();

            };

            // Update the User Interface (UI)
            this.updateUI = function() {
                console.log('3. Update UI');

                if(!this._uiGenerated) {
                    this.generateCardsUI(); // Call the function generateCardsUI
                    this._uiGenerated = true;
                }

            };

            // Generate the albums as a table with rows
            this.generateCardsUI = function() {
                console.log('4. Generate UI with cards');
                var tempStr = '<div id="results_sportcentra">';
                console.log("Length: " + this._moveGentData.length);
                coord_lat = [];
                coord_lgt = [];
                for(var i = 0;i<this._moveGentData.length;i++) {
                    var event = this._moveGentData[i];
                    data_id = event.properties.name;
                    coord_lgt.push(event.geometry.coordinates[0]);
                    coord_lat.push(event.geometry.coordinates[1]);
                    console.log("id: " + data_id);
                    console.log("lattitude: " + coord_lat[i]);
                    console.log("longitude: " + coord_lgt[i]);
                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.Naam + '</h1>';
                    tempStr += '<h3>' + event.properties.type + '</h3>';
                    tempStr += '<p>' + event.properties.straat + " " + event.properties.nr + ", " + event.properties.pstcd + " " + event.properties.Gem + '</h3>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_marker(coord_lat['+ i +'], coord_lgt['+ i +']);" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                };
                tempStr += '</div>';
                document.querySelector('.movegent-results').innerHTML = tempStr;
            };
        };

        var app = new MoveGentSportcentraApp(); // Make an instance of the MoveGentSportcentraApp
        app.init(); // Initialize the app

        // show result list
        function showList(className){
            var elements = document.getElementsByClassName(className);
            for(var i = 0, length = elements.length; i < length; i++) {
                elements[i].style.display = 'block';
            }
        }

        showList('movegent-results');
    }
    else {
        // Hide sportcentra options buttons
        document.getElementById('sportcentra_options').style.display = "none";

        // Hide map data
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });

        // reset lattitude, longitude and zoom of map
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: new google.maps.LatLng(51.0535,3.7304),
            mapTypeId: 'terrain'
        });

        // Hide list elements
        var results = document.getElementById('results_sportcentra');
        document.querySelector('.movegent-results').removeChild(results);
    }
}

function showSpeelTerreinen() {
    if (speelterreinen.checked) {
        // Show sportcentra options buttons
        document.getElementById('speelterreinen_options').style.display = "block";

        // Hide options buttons
        document.getElementById('sportcentra_options').style.display = "none";
        document.getElementById('hondenvoorzieningen_options').style.display = "none";
        document.getElementById('wandelroutes_options').style.display = "none";
        document.getElementById('parken').checked = false;
        document.getElementById('sportcentra').checked = false;
        document.getElementById('hondenvoorzieningen').checked = false;
        document.getElementById('wandelroutes').checked = false;

        // Hide map data
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });

        initMap()

        // Load map data
        map.data.loadGeoJson('https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/GEOJSON/speelterreinen.json');

        function MoveGentSpeelpleinenApp() {

            // URL of the Search API
            this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/speelterreinen.json?callback=json_callback';
            // The results within the JSON-object
            this._moveGentData;
            // UI generated
            this._uiGenerated = false;

            // Initialize App
            this.init = function() {
                console.log('1. Initialize the app');

                this.loadData();
            }

            // Load the data from the API
            this.loadData = function() {
                console.log('2. Load the Data');

                var that = this;// Hack --> Closure

                var xhr = new XMLHttpRequest();
                xhr.open('get', this.API_URL, true);
                xhr.responseType = 'json';
                xhr.onload = function() {
                    if(xhr.status == 200) {
                        var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                        /*data = data.sort(function (a, b) {
                         if (a.name > b.name) {
                         return 1;
                         }
                         if (a.name < b.name) {
                         return -1;
                         }
                         // a must be equal to b
                         return 0;
                         });*/
                        that._moveGentData = data;
                        that.updateUI();
                    } else {
                        reject(status);
                    }
                }
                xhr.onerror = function() {
                    reject(Error('Network Error!'));
                }
                xhr.send();

            };

            // Update the User Interface (UI)
            this.updateUI = function() {
                console.log('3. Update UI');

                if(!this._uiGenerated) {
                    this.generateCardsUI(); // Call the function generateCardsUI
                    this._uiGenerated = true;
                }

            };

            // Generate the albums as a table with rows
            this.generateCardsUI = function() {
                console.log('4. Generate UI with cards');
                var tempStr = '<div id="results_speelterreinen">';
                console.log(this._moveGentData.length);
                coord = [];
                for(var i=0;i<this._moveGentData.length;i++) {
                    var event = this._moveGentData[i];
                    data_id = event.properties.name;
                    for (var c = 0; c<(event.geometry.coordinates.length); c++) {
                        var array = [];
                        coord.push(array);
                        for (var d=0; d<(event.geometry.coordinates[c].length); d++) {
                            var longitude = event.geometry.coordinates[c][d][0];
                            var lattitude = event.geometry.coordinates[c][d][1];
                            var obj = {lat: lattitude ,lng: longitude};
                            array.push(obj);
                            // console.log("coordinate" + (d+1) + " : " + obj.lat + ", " + obj.lng);
                        }
                        console.log(coord[i]);
                    }
                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.naam + '</h1>';
                    tempStr += '<p>' + event.properties.functies + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_shape(coord[' + i + '])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                };
                tempStr += '</div>';
                console.log(coord);
                document.querySelector('.movegent-results').innerHTML = tempStr;
            };
        };

        var app = new MoveGentSpeelpleinenApp(); // Make an instance of the MoveGentSpeelpleinenApp
        app.init(); // Initialize the app

        // show result list
        function showList(className){
            var elements = document.getElementsByClassName(className);
            for(var i = 0, length = elements.length; i < length; i++) {
                elements[i].style.display = 'block';
            }
        }

        showList('movegent-results');
    }
    else {
        // Hide sportcentra options buttons
        document.getElementById('speelterreinen_options').style.display = "none";

        // Hide map data
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });

        // reset lattitude, longitude and zoom of map
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: new google.maps.LatLng(51.0535,3.7304),
            mapTypeId: 'terrain'
        });

        // Hide list elements
        var results = document.getElementById('results_speelterreinen');
        document.querySelector('.movegent-results').removeChild(results);

        hideList('movegent-results');
    }
}

function showHonden() {
    if (hondenvoorzieningen.checked) {
        // Show options buttons
        document.getElementById('hondenvoorzieningen_options').style.display = "block";

        // Hide options buttons
        document.getElementById('sportcentra_options').style.display = "none";
        document.getElementById('speelterreinen_options').style.display = "none";
        document.getElementById('wandelroutes_options').style.display = "none";
        document.getElementById('parken').checked = false;
        document.getElementById('sportcentra').checked = false;
        document.getElementById('speelterreinen').checked = false;
        document.getElementById('wandelroutes').checked = false;

        // Hide map data
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });

        initMap();

        // Load map data
        map.data.loadGeoJson('https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/GEOJSON/hondenvoorzieningen.json');

        function MoveGentDogsApp() {

            // URL of the Search API
            this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/hondenvoorzieningen.json?callback=json_callback';
            // The results within the JSON-object
            this._moveGentData;
            // UI generated
            this._uiGenerated = false;

            // Initialize App
            this.init = function() {
                console.log('1. Initialize the app');

                this.loadData();
            }

            // Load the data from the API
            this.loadData = function() {
                console.log('2. Load the Data');

                var that = this;// Hack --> Closure

                var xhr = new XMLHttpRequest();
                xhr.open('get', this.API_URL, true);
                xhr.responseType = 'json';
                xhr.onload = function() {
                    if(xhr.status == 200) {
                        var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                        /*data = data.sort(function (a, b) {
                         if (a.name > b.name) {
                         return 1;
                         }
                         if (a.name < b.name) {
                         return -1;
                         }
                         // a must be equal to b
                         return 0;
                         });*/
                        that._moveGentData = data;
                        that.updateUI();
                    } else {
                        reject(status);
                    }
                }
                xhr.onerror = function() {
                    reject(Error('Network Error!'));
                }
                xhr.send();

            };

            // Update the User Interface (UI)
            this.updateUI = function() {
                console.log('3. Update UI');

                if(!this._uiGenerated) {
                    this.generateCardsUI(); // Call the function generateCardsUI
                    this._uiGenerated = true;
                }

            };

            // Generate the albums as a table with rows
            this.generateCardsUI = function() {
                console.log('4. Generate UI with cards');
                var tempStr = '<div id="results_hondenvoorzieningen">';
                console.log(this._moveGentData.length);
                coord_lat = [];
                coord_lgt = [];
                for(var i=0;i<this._moveGentData.length;i++) {
                    var event = this._moveGentData[i];
                    data_id = event.properties.name;
                    coord_lgt.push(event.geometry.coordinates[0]);
                    coord_lat.push(event.geometry.coordinates[1]);
                    console.log("id: " + data_id);
                    console.log("lattitude: " + coord_lat[i]);
                    console.log("longitude: " + coord_lgt[i]);

                    var obj = {lat: coord_lat, lng: coord_lgt};

                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.Soort + '</h1>';
                    tempStr += '<h3>' + event.properties.Straat + ' ' + event.properties.Huisnummer + ', ' + event.properties.Postcode + ' ' + event.properties.Gemeente + '</h3>';
                    tempStr += '<p>' + event.properties.Plaatsomschrijving + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_marker(coord_lat['+ i +'], coord_lgt['+ i +']);" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                };
                tempStr += '</div>';
                document.querySelector('.movegent-results').innerHTML = tempStr;
            };
        };

        var app = new MoveGentDogsApp(); // Make an instance of the MoveGentDogsApp
        app.init(); // Initialize the app

        // show result list
        function showList(className){
            var elements = document.getElementsByClassName(className);
            for(var i = 0, length = elements.length; i < length; i++) {
                elements[i].style.display = 'block';
            }
        }

        showList('movegent-results');
    }
    else {
        // Hide sportcentra options buttons
        document.getElementById('hondenvoorzieningen_options').style.display = "none";

        // Hide map data
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });

        // reset lattitude, longitude and zoom of map
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: new google.maps.LatLng(51.0535,3.7304),
            mapTypeId: 'terrain'
        });

        // Hide list elements
        var results = document.getElementById('results_hondenvoorzieningen');
        document.querySelector('.movegent-results').removeChild(results);
    }
}

function showParken() {
    if (parken.checked) {
        // hide other options buttons
        document.getElementById('sportcentra_options').style.display = "none";
        document.getElementById('wandelroutes_options').style.display = "none";
        document.getElementById('speelterreinen_options').style.display = "none";
        document.getElementById('hondenvoorzieningen_options').style.display = "none";
        document.getElementById('wandelroutes').checked = false;
        document.getElementById('sportcentra').checked = false;
        document.getElementById('speelterreinen').checked = false;
        document.getElementById('hondenvoorzieningen').checked = false;

        // Hide map data
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });

        initMap();

        // Load map data
        map.data.loadGeoJson('https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/GEOJSON/parken.json');

        // load data list
        function MoveGentParkenApp() {

            // URL of the Search API
            this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/parken.json?callback=json_callback';
            // The results within the JSON-object
            this._moveGentData;
            // UI generated
            this._uiGenerated = false;

            // Initialize App
            this.init = function() {
                console.log('1. Initialize the app');

                this.loadData();
            }

            // Load the data from the API
            this.loadData = function() {
                console.log('2. Load the Data');

                var that = this;// Hack --> Closure

                var xhr = new XMLHttpRequest();
                xhr.open('get', this.API_URL, true);
                xhr.responseType = 'json';
                xhr.onload = function() {
                    if(xhr.status == 200) {
                        var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                        /*data = data.sort(function (a, b) {
                         if (a.name > b.name) {
                         return 1;
                         }
                         if (a.name < b.name) {
                         return -1;
                         }
                         // a must be equal to b
                         return 0;
                         });*/
                        that._moveGentData = data;
                        that.updateUI();
                    } else {
                        reject(status);
                    }
                }
                xhr.onerror = function() {
                    reject(Error('Network Error!'));
                }
                xhr.send();

            };

            // Update the User Interface (UI)
            this.updateUI = function() {
                console.log('3. Update UI');

                if(!this._uiGenerated) {
                    this.generateCardsUI(); // Call the function generateCardsUI
                    this._uiGenerated = true;
                }

            };

            // Generate the albums as a table with rows
            this.generateCardsUI = function() {
                console.log('4. Generate UI with cards');
                var tempStr = '<div id="results_parken">';
                console.log(this._moveGentData.length);
                coord = [];
                for(var i=0;i<this._moveGentData.length;i++) {
                    var event = this._moveGentData[i];
                    data_id = event.properties.name;
                    if (event.geometry.coordinates != null) {
                        for (var c = 0; c<(event.geometry.coordinates.length); c++) {
                            var array = [];
                            coord.push(array);
                            for (var d=0; d<(event.geometry.coordinates[c].length); d++) {
                                var longitude = event.geometry.coordinates[c][d][0];
                                var lattitude = event.geometry.coordinates[c][d][1];
                                var obj = {lat: lattitude ,lng: longitude};
                                array.push(obj);
                                // console.log("coordinate" + (d+1) + " : " + obj.lat + ", " + obj.lng);
                            }
                            console.log(coord[i]);
                        }
                    }
                    else {
                        var array = [];
                        coord.push(array);
                    }

                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.OBJECTNAAM + '</h1>';
                    tempStr += '<h3>' + event.properties.KLASSEMENT + '</h3>';
                    tempStr += '<p>' + event.properties.SECTOR + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_shape(coord[' + i + '])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                };
                tempStr += '</div>';
                document.querySelector('.movegent-results').innerHTML = tempStr;
            };
        };

        var app = new MoveGentParkenApp(); // Make an instance of the MoveGentParkenApp
        app.init(); // Initialize the app

        // show result list
        function showList(className){
            var elements = document.getElementsByClassName(className);
            for(var i = 0, length = elements.length; i < length; i++) {
                elements[i].style.display = 'block';
            }
        }

        showList('movegent-results');
    }
    else {
        // Hide map data
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });

        // reset lattitude, longitude and zoom of map
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: new google.maps.LatLng(51.0535,3.7304),
            mapTypeId: 'terrain'
        });

        // Hide list elements
        var results = document.getElementById('results_parken');
        document.querySelector('.movegent-results').removeChild(results);
    }
}

function showWandelRoutes() {
    if (wandelroutes.checked) {
        // Show sportcentra options buttons
        document.getElementById('wandelroutes_options').style.display = "block";

        // hide other options buttons
        document.getElementById('sportcentra_options').style.display = "none";
        document.getElementById('speelterreinen_options').style.display = "none";
        document.getElementById('hondenvoorzieningen_options').style.display = "none";
        document.getElementById('parken').checked = false;
        document.getElementById('sportcentra').checked = false;
        document.getElementById('speelterreinen').checked = false;
        document.getElementById('hondenvoorzieningen').checked = false;

        // Hide map data
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });

        initMap();

        // show map data
        map.data.loadGeoJson('https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/GEOJSON/wandelroutes.json');

        function MoveGentWalkingApp() {

            // URL of the Search API
            this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/wandelroutes.json?callback=json_callback';
            // The results within the JSON-object
            this._moveGentData;
            // UI generated
            this._uiGenerated = false;

            // Initialize App
            this.init = function() {
                console.log('1. Initialize the app');

                this.loadData();
            }

            // Load the data from the API
            this.loadData = function() {
                console.log('2. Load the Data');

                var that = this;// Hack --> Closure

                var xhr = new XMLHttpRequest();
                xhr.open('get', this.API_URL, true);
                xhr.responseType = 'json';
                xhr.onload = function() {
                    if(xhr.status == 200) {
                        var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                        /*data = data.sort(function (a, b) {
                         if (a.name > b.name) {
                         return 1;
                         }
                         if (a.name < b.name) {
                         return -1;
                         }
                         // a must be equal to b
                         return 0;
                         });*/
                        that._moveGentData = data;
                        that.updateUI();
                    } else {
                        reject(status);
                    }
                }
                xhr.onerror = function() {
                    reject(Error('Network Error!'));
                }
                xhr.send();

            };

            // Update the User Interface (UI)
            this.updateUI = function() {
                console.log('3. Update UI');

                if(!this._uiGenerated) {
                    this.generateCardsUI(); // Call the function generateCardsUI
                    this._uiGenerated = true;
                }

            };

            // Generate the albums as a table with rows
            this.generateCardsUI = function() {
                console.log('4. Generate UI with cards');
                var tempStr = '<div id="results_wandelroutes">';
                console.log(this._moveGentData.length);
                for(var i=0;i<this._moveGentData.length;i++) {
                    var event = this._moveGentData[i];
                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + "Wandelroute " + (i + 1) + '</h1>';
                    tempStr += '<h3>' + "Afstand: " + event.properties.Afstand + " meter" + '</h3>';
                    tempStr += '<p>' + "Staptijd: " + event.properties.TijdTXT2 + " minuten" + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a href="" class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a href="" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                };
                tempStr += '</div>';
                document.querySelector('.movegent-results').innerHTML = tempStr;
            };
        };

        var app = new MoveGentWalkingApp(); // Make an instance of the MoveGentWalkingApp
        app.init(); // Initialize the app

        // show result list
        function showList(className){
            var elements = document.getElementsByClassName(className);
            for(var i = 0, length = elements.length; i < length; i++) {
                elements[i].style.display = 'block';
            }
        }

        showList('movegent-results');
    }
    else {
        // Hide sportcentra options buttons
        document.getElementById('wandelroutes_options').style.display = "none";

        // Hide map data
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });

        // reset lattitude, longitude and zoom of map
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: new google.maps.LatLng(51.0535,3.7304),
            mapTypeId: 'terrain'
        });

        // Hide list elements
        var results = document.getElementById('results_wandelroutes');
        document.querySelector('.movegent-results').removeChild(results);
    }
}

// Eventhandlers
sportcentra_zwembad.onclick = function () {
    function MoveGentSportcentraApp() {

        // URL of the Search API
        this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/sportcentra.json?callback=json_callback';
        // The results within the JSON-object
        this._moveGentData;
        // UI generated
        this._uiGenerated = false;

        // Initialize App
        this.init = function() {
            console.log('1. Initialize the app');

            this.loadData();
        }

        // Load the data from the API
        this.loadData = function() {
            console.log('2. Load the Data');

            var that = this;// Hack --> Closure

            var xhr = new XMLHttpRequest();
            xhr.open('get', this.API_URL, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if(xhr.status == 200) {
                    var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                    /*data = data.sort(function (a, b) {
                     if (a.name > b.name) {
                     return 1;
                     }
                     if (a.name < b.name) {
                     return -1;
                     }
                     // a must be equal to b
                     return 0;
                     });*/
                    that._moveGentData = data;
                    that.updateUI();
                } else {
                    reject(status);
                }
            }
            xhr.onerror = function() {
                reject(Error('Network Error!'));
            }
            xhr.send();

        };

        // Update the User Interface (UI)
        this.updateUI = function() {
            console.log('3. Update UI');

            if(!this._uiGenerated) {
                this.generateCardsUI(); // Call the function generateCardsUI
                this._uiGenerated = true;
            }

        };

        // Generate the albums as a table with rows
        this.generateCardsUI = function() {
            console.log('4. Generate UI with cards');
            var tempStr = '<div id="results_sportcentra">';
            category_marker = [];
            console.log(this._moveGentData.length);
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                if (event.properties.type == "Zwembaden") {
                    var location = [event.geometry.coordinates[0], event.geometry.coordinates[1]];
                    console.log(location);
                    category_marker.push(location);
                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.Naam + '</h1>';
                    tempStr += '<h3>' + event.properties.type + '</h3>';
                    tempStr += '<p>' + event.properties.straat + " " + event.properties.nr + ", " + event.properties.pstcd + " " + event.properties.Gem + '</h3>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_marker(coord_lat['+ i +'], coord_lgt['+ i +']);" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                }
            };
            tempStr += "</div>";
            categoryMarker(category_marker);
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new MoveGentSportcentraApp(); // Make an instance of the MoveGentSportcentraApp
    app.init(); // Initialize the app
}

sportcentra_sporthal.onclick = function () {
    function MoveGentSportcentraApp() {

        // URL of the Search API
        this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/sportcentra.json?callback=json_callback';
        // The results within the JSON-object
        this._moveGentData;
        // UI generated
        this._uiGenerated = false;

        // Initialize App
        this.init = function() {
            console.log('1. Initialize the app');

            this.loadData();
        }

        // Load the data from the API
        this.loadData = function() {
            console.log('2. Load the Data');

            var that = this;// Hack --> Closure

            var xhr = new XMLHttpRequest();
            xhr.open('get', this.API_URL, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if(xhr.status == 200) {
                    var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                    /*data = data.sort(function (a, b) {
                     if (a.name > b.name) {
                     return 1;
                     }
                     if (a.name < b.name) {
                     return -1;
                     }
                     // a must be equal to b
                     return 0;
                     });*/
                    that._moveGentData = data;
                    that.updateUI();
                } else {
                    reject(status);
                }
            }
            xhr.onerror = function() {
                reject(Error('Network Error!'));
            }
            xhr.send();

        };

        // Update the User Interface (UI)
        this.updateUI = function() {
            console.log('3. Update UI');

            if(!this._uiGenerated) {
                this.generateCardsUI(); // Call the function generateCardsUI
                this._uiGenerated = true;
            }

        };

        // Generate the albums as a table with rows
        this.generateCardsUI = function() {
            console.log('4. Generate UI with cards');
            var tempStr = '<div id="results_sportcentra">';
            category_marker = [];
            console.log(this._moveGentData.length);
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                if (event.properties.type == "Sporthal") {
                    var location = [event.geometry.coordinates[0], event.geometry.coordinates[1]];
                    console.log(location);
                    category_marker.push(location);
                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.Naam + '</h1>';
                    tempStr += '<h3>' + event.properties.type + '</h3>';
                    tempStr += '<p>' + event.properties.straat + " " + event.properties.nr + ", " + event.properties.pstcd + " " + event.properties.Gem + '</h3>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_marker(coord_lat['+ i +'], coord_lgt['+ i +']);" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                }
            };
            tempStr += "</div>";
            categoryMarker(category_marker);
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new MoveGentSportcentraApp(); // Make an instance of the MoveGentSportcentraApp
    app.init(); // Initialize the app
}

sportcentra_buitensport.onclick = function () {
    function MoveGentSportcentraApp() {

        // URL of the Search API
        this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/sportcentra.json?callback=json_callback';
        // The results within the JSON-object
        this._moveGentData;
        // UI generated
        this._uiGenerated = false;

        // Initialize App
        this.init = function() {
            console.log('1. Initialize the app');

            this.loadData();
        }

        // Load the data from the API
        this.loadData = function() {
            console.log('2. Load the Data');

            var that = this;// Hack --> Closure

            var xhr = new XMLHttpRequest();
            xhr.open('get', this.API_URL, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if(xhr.status == 200) {
                    var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                    /*data = data.sort(function (a, b) {
                     if (a.name > b.name) {
                     return 1;
                     }
                     if (a.name < b.name) {
                     return -1;
                     }
                     // a must be equal to b
                     return 0;
                     });*/
                    that._moveGentData = data;
                    that.updateUI();
                } else {
                    reject(status);
                }
            }
            xhr.onerror = function() {
                reject(Error('Network Error!'));
            }
            xhr.send();

        };

        // Update the User Interface (UI)
        this.updateUI = function() {
            console.log('3. Update UI');

            if(!this._uiGenerated) {
                this.generateCardsUI(); // Call the function generateCardsUI
                this._uiGenerated = true;
            }

        };

        // Generate the albums as a table with rows
        this.generateCardsUI = function() {
            console.log('4. Generate UI with cards');
            var tempStr = '<div id="results_sportcentra">';
            category_marker = [];
            console.log(this._moveGentData.length);
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                if (event.properties.type == "Buitensporten") {
                    var location = [event.geometry.coordinates[0], event.geometry.coordinates[1]];
                    console.log(location);
                    category_marker.push(location);
                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.Naam + '</h1>';
                    tempStr += '<h3>' + event.properties.type + '</h3>';
                    tempStr += '<p>' + event.properties.straat + " " + event.properties.nr + ", " + event.properties.pstcd + " " + event.properties.Gem + '</h3>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_marker(coord_lat['+ i +'], coord_lgt['+ i +']);" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                }
            };
            tempStr += '</div>';
            categoryMarker(category_marker);
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new MoveGentSportcentraApp(); // Make an instance of the MoveGentSportcentraApp
    app.init(); // Initialize the app
}

speelterreinen_voetbal.onclick = function () {
    function MoveGentSpeelpleinenApp() {

        // URL of the Search API
        this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/speelterreinen.json?callback=json_callback';
        // The results within the JSON-object
        this._moveGentData;
        // UI generated
        this._uiGenerated = false;

        // Initialize App
        this.init = function() {
            console.log('1. Initialize the app');

            this.loadData();
        }

        // Load the data from the API
        this.loadData = function() {
            console.log('2. Load the Data');

            var that = this;// Hack --> Closure

            var xhr = new XMLHttpRequest();
            xhr.open('get', this.API_URL, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if(xhr.status == 200) {
                    var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                    /*data = data.sort(function (a, b) {
                     if (a.name > b.name) {
                     return 1;
                     }
                     if (a.name < b.name) {
                     return -1;
                     }
                     // a must be equal to b
                     return 0;
                     });*/
                    that._moveGentData = data;
                    that.updateUI();
                } else {
                    reject(status);
                }
            }
            xhr.onerror = function() {
                reject(Error('Network Error!'));
            }
            xhr.send();

        };

        // Update the User Interface (UI)
        this.updateUI = function() {
            console.log('3. Update UI');

            if(!this._uiGenerated) {
                this.generateCardsUI(); // Call the function generateCardsUI
                this._uiGenerated = true;
            }

        };

        // Generate the albums as a table with rows
        this.generateCardsUI = function() {
            console.log('4. Generate UI with cards');
            var tempStr = '<div id="results_speelterreinen">';
            category_shapes = [];
            console.log(this._moveGentData.length);
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                var string = "voetbal";
                if (event.properties.functies.indexOf(string) !== -1) {

                    for (var c = 0; c<(event.geometry.coordinates.length); c++) {
                        var array = [];
                        category_shapes.push(array);
                        for (var d=0; d<(event.geometry.coordinates[c].length); d++) {
                            var longitude = event.geometry.coordinates[c][d][0];
                            var lattitude = event.geometry.coordinates[c][d][1];
                            var obj = {lat: lattitude ,lng: longitude};
                            array.push(obj);
                            // console.log("coordinate" + (d+1) + " : " + obj.lat + ", " + obj.lng);
                        }
                        console.log(coord[i]);
                    }

                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.naam + '</h1>';
                    tempStr += '<p>' + event.properties.functies + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_shape(coord[' + i + '])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                }
            };
            categoryShape(category_shapes);
            tempStr += "</div>";
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new MoveGentSpeelpleinenApp(); // Make an instance of the MoveGentSpeelpleinenApp
    app.init(); // Initialize the app
}

speelterreinen_basketbal.onclick = function () {
    function MoveGentSpeelpleinenApp() {

        // URL of the Search API
        this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/speelterreinen.json?callback=json_callback';
        // The results within the JSON-object
        this._moveGentData;
        // UI generated
        this._uiGenerated = false;

        // Initialize App
        this.init = function() {
            console.log('1. Initialize the app');

            this.loadData();
        }

        // Load the data from the API
        this.loadData = function() {
            console.log('2. Load the Data');

            var that = this;// Hack --> Closure

            var xhr = new XMLHttpRequest();
            xhr.open('get', this.API_URL, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if(xhr.status == 200) {
                    var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                    /*data = data.sort(function (a, b) {
                     if (a.name > b.name) {
                     return 1;
                     }
                     if (a.name < b.name) {
                     return -1;
                     }
                     // a must be equal to b
                     return 0;
                     });*/
                    that._moveGentData = data;
                    that.updateUI();
                } else {
                    reject(status);
                }
            }
            xhr.onerror = function() {
                reject(Error('Network Error!'));
            }
            xhr.send();

        };

        // Update the User Interface (UI)
        this.updateUI = function() {
            console.log('3. Update UI');

            if(!this._uiGenerated) {
                this.generateCardsUI(); // Call the function generateCardsUI
                this._uiGenerated = true;
            }

        };

        // Generate the albums as a table with rows
        this.generateCardsUI = function() {
            console.log('4. Generate UI with cards');
            var tempStr = '<div id="results_speelterreinen">';
            category_shapes = [];
            console.log(this._moveGentData.length);
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                var string = "basketbal";
                if (event.properties.functies.indexOf(string) !== -1) {

                    for (var c = 0; c<(event.geometry.coordinates.length); c++) {
                        var array = [];
                        category_shapes.push(array);
                        for (var d=0; d<(event.geometry.coordinates[c].length); d++) {
                            var longitude = event.geometry.coordinates[c][d][0];
                            var lattitude = event.geometry.coordinates[c][d][1];
                            var obj = {lat: lattitude ,lng: longitude};
                            array.push(obj);
                            // console.log("coordinate" + (d+1) + " : " + obj.lat + ", " + obj.lng);
                        }
                        console.log(coord[i]);
                    }

                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.naam + '</h1>';
                    tempStr += '<p>' + event.properties.functies + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_shape(coord[' + i + '])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                }
            };
            categoryShape(category_shapes);
            tempStr += "</div>";
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new MoveGentSpeelpleinenApp(); // Make an instance of the MoveGentSpeelpleinenApp
    app.init(); // Initialize the app
}

speelterreinen_skate.onclick = function () {
    function MoveGentSpeelpleinenApp() {

        // URL of the Search API
        this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/speelterreinen.json?callback=json_callback';
        // The results within the JSON-object
        this._moveGentData;
        // UI generated
        this._uiGenerated = false;

        // Initialize App
        this.init = function() {
            console.log('1. Initialize the app');

            this.loadData();
        }

        // Load the data from the API
        this.loadData = function() {
            console.log('2. Load the Data');

            var that = this;// Hack --> Closure

            var xhr = new XMLHttpRequest();
            xhr.open('get', this.API_URL, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if(xhr.status == 200) {
                    var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                    /*data = data.sort(function (a, b) {
                     if (a.name > b.name) {
                     return 1;
                     }
                     if (a.name < b.name) {
                     return -1;
                     }
                     // a must be equal to b
                     return 0;
                     });*/
                    that._moveGentData = data;
                    that.updateUI();
                } else {
                    reject(status);
                }
            }
            xhr.onerror = function() {
                reject(Error('Network Error!'));
            }
            xhr.send();

        };

        // Update the User Interface (UI)
        this.updateUI = function() {
            console.log('3. Update UI');

            if(!this._uiGenerated) {
                this.generateCardsUI(); // Call the function generateCardsUI
                this._uiGenerated = true;
            }

        };

        // Generate the albums as a table with rows
        this.generateCardsUI = function() {
            console.log('4. Generate UI with cards');
            var tempStr = '<div id="results_speelterreinen">';
            category_shapes = [];
            console.log(this._moveGentData.length);
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                var string = "skate";
                if (event.properties.functies.indexOf(string) !== -1) {

                    for (var c = 0; c<(event.geometry.coordinates.length); c++) {
                        var array = [];
                        category_shapes.push(array);
                        for (var d=0; d<(event.geometry.coordinates[c].length); d++) {
                            var longitude = event.geometry.coordinates[c][d][0];
                            var lattitude = event.geometry.coordinates[c][d][1];
                            var obj = {lat: lattitude ,lng: longitude};
                            array.push(obj);
                            // console.log("coordinate" + (d+1) + " : " + obj.lat + ", " + obj.lng);
                        }
                        console.log(coord[i]);
                    }

                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.naam + '</h1>';
                    tempStr += '<p>' + event.properties.functies + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_shape(coord[' + i + '])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                }
            };
            categoryShape(category_shapes);
            tempStr += "</div>";
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new MoveGentSpeelpleinenApp(); // Make an instance of the MoveGentSpeelpleinenApp
    app.init(); // Initialize the app
}

speelterreinen_petanque.onclick = function () {
    function MoveGentSpeelpleinenApp() {

        // URL of the Search API
        this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/speelterreinen.json?callback=json_callback';
        // The results within the JSON-object
        this._moveGentData;
        // UI generated
        this._uiGenerated = false;

        // Initialize App
        this.init = function() {
            console.log('1. Initialize the app');

            this.loadData();
        }

        // Load the data from the API
        this.loadData = function() {
            console.log('2. Load the Data');

            var that = this;// Hack --> Closure

            var xhr = new XMLHttpRequest();
            xhr.open('get', this.API_URL, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if(xhr.status == 200) {
                    var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                    /*data = data.sort(function (a, b) {
                     if (a.name > b.name) {
                     return 1;
                     }
                     if (a.name < b.name) {
                     return -1;
                     }
                     // a must be equal to b
                     return 0;
                     });*/
                    that._moveGentData = data;
                    that.updateUI();
                } else {
                    reject(status);
                }
            }
            xhr.onerror = function() {
                reject(Error('Network Error!'));
            }
            xhr.send();

        };

        // Update the User Interface (UI)
        this.updateUI = function() {
            console.log('3. Update UI');

            if(!this._uiGenerated) {
                this.generateCardsUI(); // Call the function generateCardsUI
                this._uiGenerated = true;
            }

        };

        // Generate the albums as a table with rows
        this.generateCardsUI = function() {
            console.log('4. Generate UI with cards');
            var tempStr = '<div id="results_speelterreinen">';
            category_shapes = [];
            console.log(this._moveGentData.length);
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                var string = "petanque";
                if (event.properties.functies.indexOf(string) !== -1) {

                    for (var c = 0; c<(event.geometry.coordinates.length); c++) {
                        var array = [];
                        category_shapes.push(array);
                        for (var d=0; d<(event.geometry.coordinates[c].length); d++) {
                            var longitude = event.geometry.coordinates[c][d][0];
                            var lattitude = event.geometry.coordinates[c][d][1];
                            var obj = {lat: lattitude ,lng: longitude};
                            array.push(obj);
                            // console.log("coordinate" + (d+1) + " : " + obj.lat + ", " + obj.lng);
                        }
                        console.log(coord[i]);
                    }

                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.naam + '</h1>';
                    tempStr += '<p>' + event.properties.functies + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_shape(coord[' + i + '])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                }
            };
            categoryShape(category_shapes);
            tempStr += "</div>";
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new MoveGentSpeelpleinenApp(); // Make an instance of the MoveGentSpeelpleinenApp
    app.init(); // Initialize the app
}

speelterreinen_zandbak.onclick = function () {
    function MoveGentSpeelpleinenApp() {

        // URL of the Search API
        this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/speelterreinen.json?callback=json_callback';
        // The results within the JSON-object
        this._moveGentData;
        // UI generated
        this._uiGenerated = false;

        // Initialize App
        this.init = function() {
            console.log('1. Initialize the app');

            this.loadData();
        }

        // Load the data from the API
        this.loadData = function() {
            console.log('2. Load the Data');

            var that = this;// Hack --> Closure

            var xhr = new XMLHttpRequest();
            xhr.open('get', this.API_URL, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if(xhr.status == 200) {
                    var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                    /*data = data.sort(function (a, b) {
                     if (a.name > b.name) {
                     return 1;
                     }
                     if (a.name < b.name) {
                     return -1;
                     }
                     // a must be equal to b
                     return 0;
                     });*/
                    that._moveGentData = data;
                    that.updateUI();
                } else {
                    reject(status);
                }
            }
            xhr.onerror = function() {
                reject(Error('Network Error!'));
            }
            xhr.send();

        };

        // Update the User Interface (UI)
        this.updateUI = function() {
            console.log('3. Update UI');

            if(!this._uiGenerated) {
                this.generateCardsUI(); // Call the function generateCardsUI
                this._uiGenerated = true;
            }

        };

        // Generate the albums as a table with rows
        this.generateCardsUI = function() {
            console.log('4. Generate UI with cards');
            var tempStr = '<div id="results_speelterreinen">';
            category_shapes = [];
            console.log(this._moveGentData.length);
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                var string = "zandbak";
                if (event.properties.functies.indexOf(string) !== -1) {

                    for (var c = 0; c<(event.geometry.coordinates.length); c++) {
                        var array = [];
                        category_shapes.push(array);
                        for (var d=0; d<(event.geometry.coordinates[c].length); d++) {
                            var longitude = event.geometry.coordinates[c][d][0];
                            var lattitude = event.geometry.coordinates[c][d][1];
                            var obj = {lat: lattitude ,lng: longitude};
                            array.push(obj);
                            // console.log("coordinate" + (d+1) + " : " + obj.lat + ", " + obj.lng);
                        }
                        console.log(coord[i]);
                    }

                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.naam + '</h1>';
                    tempStr += '<p>' + event.properties.functies + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_shape(coord[' + i + '])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                }
            };
            categoryShape(category_shapes);
            tempStr += "</div>";
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new MoveGentSpeelpleinenApp(); // Make an instance of the MoveGentSpeelpleinenApp
    app.init(); // Initialize the app
}

speelterreinen_avontuurlijkspelen.onclick = function () {
    function MoveGentSpeelpleinenApp() {

        // URL of the Search API
        this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/speelterreinen.json?callback=json_callback';
        // The results within the JSON-object
        this._moveGentData;
        // UI generated
        this._uiGenerated = false;

        // Initialize App
        this.init = function() {
            console.log('1. Initialize the app');

            this.loadData();
        }

        // Load the data from the API
        this.loadData = function() {
            console.log('2. Load the Data');

            var that = this;// Hack --> Closure

            var xhr = new XMLHttpRequest();
            xhr.open('get', this.API_URL, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if(xhr.status == 200) {
                    var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                    /*data = data.sort(function (a, b) {
                     if (a.name > b.name) {
                     return 1;
                     }
                     if (a.name < b.name) {
                     return -1;
                     }
                     // a must be equal to b
                     return 0;
                     });*/
                    that._moveGentData = data;
                    that.updateUI();
                } else {
                    reject(status);
                }
            }
            xhr.onerror = function() {
                reject(Error('Network Error!'));
            }
            xhr.send();

        };

        // Update the User Interface (UI)
        this.updateUI = function() {
            console.log('3. Update UI');

            if(!this._uiGenerated) {
                this.generateCardsUI(); // Call the function generateCardsUI
                this._uiGenerated = true;
            }

        };

        // Generate the albums as a table with rows
        this.generateCardsUI = function() {
            console.log('4. Generate UI with cards');
            var tempStr = '<div id="results_speelterreinen">';
            category_shapes = [];
            console.log(this._moveGentData.length);
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                var string = "avontuurlijk";
                if (event.properties.functies.indexOf(string) !== -1) {

                    for (var c = 0; c<(event.geometry.coordinates.length); c++) {
                        var array = [];
                        category_shapes.push(array);
                        for (var d=0; d<(event.geometry.coordinates[c].length); d++) {
                            var longitude = event.geometry.coordinates[c][d][0];
                            var lattitude = event.geometry.coordinates[c][d][1];
                            var obj = {lat: lattitude ,lng: longitude};
                            array.push(obj);
                            // console.log("coordinate" + (d+1) + " : " + obj.lat + ", " + obj.lng);
                        }
                        console.log(coord[i]);
                    }

                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.naam + '</h1>';
                    tempStr += '<p>' + event.properties.functies + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_shape(coord[' + i + '])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                }
            };
            categoryShape(category_shapes);
            tempStr += "</div>";
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new MoveGentSpeelpleinenApp(); // Make an instance of the MoveGentSpeelpleinenApp
    app.init(); // Initialize the app
}

speelterreinen_speeltoestellen.onclick = function () {
    function MoveGentSpeelpleinenApp() {

        // URL of the Search API
        this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/speelterreinen.json?callback=json_callback';
        // The results within the JSON-object
        this._moveGentData;
        // UI generated
        this._uiGenerated = false;

        // Initialize App
        this.init = function() {
            console.log('1. Initialize the app');

            this.loadData();
        }

        // Load the data from the API
        this.loadData = function() {
            console.log('2. Load the Data');

            var that = this;// Hack --> Closure

            var xhr = new XMLHttpRequest();
            xhr.open('get', this.API_URL, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if(xhr.status == 200) {
                    var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                    /*data = data.sort(function (a, b) {
                     if (a.name > b.name) {
                     return 1;
                     }
                     if (a.name < b.name) {
                     return -1;
                     }
                     // a must be equal to b
                     return 0;
                     });*/
                    that._moveGentData = data;
                    that.updateUI();
                } else {
                    reject(status);
                }
            }
            xhr.onerror = function() {
                reject(Error('Network Error!'));
            }
            xhr.send();

        };

        // Update the User Interface (UI)
        this.updateUI = function() {
            console.log('3. Update UI');

            if(!this._uiGenerated) {
                this.generateCardsUI(); // Call the function generateCardsUI
                this._uiGenerated = true;
            }

        };

        // Generate the albums as a table with rows
        this.generateCardsUI = function() {
            console.log('4. Generate UI with cards');
            var tempStr = '<div id="results_speelterreinen">';
            category_shapes = [];
            console.log(this._moveGentData.length);
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                var string = "speeltoestel";
                if (event.properties.functies.indexOf(string) !== -1) {

                    for (var c = 0; c<(event.geometry.coordinates.length); c++) {
                        var array = [];
                        category_shapes.push(array);
                        for (var d=0; d<(event.geometry.coordinates[c].length); d++) {
                            var longitude = event.geometry.coordinates[c][d][0];
                            var lattitude = event.geometry.coordinates[c][d][1];
                            var obj = {lat: lattitude ,lng: longitude};
                            array.push(obj);
                            // console.log("coordinate" + (d+1) + " : " + obj.lat + ", " + obj.lng);
                        }
                        console.log(coord[i]);
                    }

                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.naam + '</h1>';
                    tempStr += '<p>' + event.properties.functies + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_shape(coord[' + i + '])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                }
            };
            categoryShape(category_shapes);
            tempStr += "</div>";
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new MoveGentSpeelpleinenApp(); // Make an instance of the MoveGentSpeelpleinenApp
    app.init(); // Initialize the app
}

hondenvoorzieningen_tegel.onclick = function () {

    function MoveGentDogsApp() {

        // URL of the Search API
        this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/hondenvoorzieningen.json?callback=json_callback';
        // The results within the JSON-object
        this._moveGentData;
        // UI generated
        this._uiGenerated = false;

        // Initialize App
        this.init = function() {
            console.log('1. Initialize the app');

            this.loadData();
        }

        // Load the data from the API
        this.loadData = function() {
            console.log('2. Load the Data');

            var that = this;// Hack --> Closure

            var xhr = new XMLHttpRequest();
            xhr.open('get', this.API_URL, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if(xhr.status == 200) {
                    var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                    /*data = data.sort(function (a, b) {
                     if (a.name > b.name) {
                     return 1;
                     }
                     if (a.name < b.name) {
                     return -1;
                     }
                     // a must be equal to b
                     return 0;
                     });*/
                    that._moveGentData = data;
                    that.updateUI();
                } else {
                    reject(status);
                }
            }
            xhr.onerror = function() {
                reject(Error('Network Error!'));
            }
            xhr.send();

        };

        // Update the User Interface (UI)
        this.updateUI = function() {
            console.log('3. Update UI');

            if(!this._uiGenerated) {
                this.generateCardsUI(); // Call the function generateCardsUI
                this._uiGenerated = true;
            }

        };

        // Generate the albums as a table with rows
        this.generateCardsUI = function() {
            console.log('4. Generate UI with cards');
            var tempStr = '<div id="results_hondenvoorzieningen">';
            coord_lat = [];
            coord_lgt = [];
            category_marker = [];
            console.log(this._moveGentData.length);
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                var string = "Anti-hondenpoeptegel";
                if (event.properties.Soort.indexOf(string) !== -1) {
                    var location = [event.geometry.coordinates[0], event.geometry.coordinates[1]];
                    console.log(location);
                    category_marker.push(location);
                    data_id = event.properties.name;
                    coord_lgt.push(event.geometry.coordinates[0]);
                    coord_lat.push(event.geometry.coordinates[1]);
                    console.log("id: " + data_id);
                    console.log("lattitude: " + coord_lat[i]);
                    console.log("longitude: " + coord_lgt[i]);

                    var obj = {lat: coord_lat, lng: coord_lgt};

                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.Soort + '</h1>';
                    tempStr += '<h3>' + event.properties.Straat + ' ' + event.properties.Huisnummer + ', ' + event.properties.Postcode + ' ' + event.properties.Gemeente + '</h3>';
                    tempStr += '<p>' + event.properties.Plaatsomschrijving + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_marker(coord_lat[' + i + '], coord_lgt[' + i + ']);" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                }
            };
            tempStr += '</div>';
            categoryMarker(category_marker);
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new MoveGentDogsApp(); // Make an instance of the MoveGentDogsApp
    app.init(); // Initialize the app

    // show result list
    function showList(className){
        var elements = document.getElementsByClassName(className);
        for(var i = 0, length = elements.length; i < length; i++) {
            elements[i].style.display = 'block';
        }
    }

    showList('movegent-results');
}

hondenvoorzieningen_toilet.onclick = function () {

    function MoveGentDogsApp() {

        // URL of the Search API
        this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/hondenvoorzieningen.json?callback=json_callback';
        // The results within the JSON-object
        this._moveGentData;
        // UI generated
        this._uiGenerated = false;

        // Initialize App
        this.init = function() {
            console.log('1. Initialize the app');

            this.loadData();
        }

        // Load the data from the API
        this.loadData = function() {
            console.log('2. Load the Data');

            var that = this;// Hack --> Closure

            var xhr = new XMLHttpRequest();
            xhr.open('get', this.API_URL, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if(xhr.status == 200) {
                    var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                    /*data = data.sort(function (a, b) {
                     if (a.name > b.name) {
                     return 1;
                     }
                     if (a.name < b.name) {
                     return -1;
                     }
                     // a must be equal to b
                     return 0;
                     });*/
                    that._moveGentData = data;
                    that.updateUI();
                } else {
                    reject(status);
                }
            }
            xhr.onerror = function() {
                reject(Error('Network Error!'));
            }
            xhr.send();

        };

        // Update the User Interface (UI)
        this.updateUI = function() {
            console.log('3. Update UI');

            if(!this._uiGenerated) {
                this.generateCardsUI(); // Call the function generateCardsUI
                this._uiGenerated = true;
            }

        };

        // Generate the albums as a table with rows
        this.generateCardsUI = function() {
            console.log('4. Generate UI with cards');
            var tempStr = '<div id="results_hondenvoorzieningen">';
            coord_lat = [];
            coord_lgt = [];
            category_marker = [];
            console.log(this._moveGentData.length);
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                var string = "Hondentoilet";
                if (event.properties.Soort.indexOf(string) !== -1) {
                    var location = [event.geometry.coordinates[0], event.geometry.coordinates[1]];
                    console.log(location);
                    category_marker.push(location);
                    data_id = event.properties.name;
                    coord_lgt.push(event.geometry.coordinates[0]);
                    coord_lat.push(event.geometry.coordinates[1]);
                    console.log("id: " + data_id);
                    console.log("lattitude: " + coord_lat[i]);
                    console.log("longitude: " + coord_lgt[i]);

                    var obj = {lat: coord_lat, lng: coord_lgt};

                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.Soort + '</h1>';
                    tempStr += '<h3>' + event.properties.Straat + ' ' + event.properties.Huisnummer + ', ' + event.properties.Postcode + ' ' + event.properties.Gemeente + '</h3>';
                    tempStr += '<p>' + event.properties.Plaatsomschrijving + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_marker(coord_lat[' + i + '], coord_lgt[' + i + ']);" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                }
            };
            tempStr += '</div>';
            categoryMarker(category_marker);
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new MoveGentDogsApp(); // Make an instance of the MoveGentDogsApp
    app.init(); // Initialize the app

    // show result list
    function showList(className){
        var elements = document.getElementsByClassName(className);
        for(var i = 0, length = elements.length; i < length; i++) {
            elements[i].style.display = 'block';
        }
    }

    showList('movegent-results');
}

hondenvoorzieningen_losloopweide.onclick = function () {

    function MoveGentDogsApp() {

        // URL of the Search API
        this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/hondenvoorzieningen.json?callback=json_callback';
        // The results within the JSON-object
        this._moveGentData;
        // UI generated
        this._uiGenerated = false;

        // Initialize App
        this.init = function() {
            console.log('1. Initialize the app');

            this.loadData();
        }

        // Load the data from the API
        this.loadData = function() {
            console.log('2. Load the Data');

            var that = this;// Hack --> Closure

            var xhr = new XMLHttpRequest();
            xhr.open('get', this.API_URL, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if(xhr.status == 200) {
                    var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                    /*data = data.sort(function (a, b) {
                     if (a.name > b.name) {
                     return 1;
                     }
                     if (a.name < b.name) {
                     return -1;
                     }
                     // a must be equal to b
                     return 0;
                     });*/
                    that._moveGentData = data;
                    that.updateUI();
                } else {
                    reject(status);
                }
            }
            xhr.onerror = function() {
                reject(Error('Network Error!'));
            }
            xhr.send();

        };

        // Update the User Interface (UI)
        this.updateUI = function() {
            console.log('3. Update UI');

            if(!this._uiGenerated) {
                this.generateCardsUI(); // Call the function generateCardsUI
                this._uiGenerated = true;
            }

        };

        // Generate the albums as a table with rows
        this.generateCardsUI = function() {
            console.log('4. Generate UI with cards');
            var tempStr = '<div id="results_hondenvoorzieningen">';
            coord_lat = [];
            coord_lgt = [];
            category_marker = [];
            console.log(this._moveGentData.length);
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                var string = "Losloopweide";
                if (event.properties.Soort.indexOf(string) !== -1) {
                    var location = [event.geometry.coordinates[0], event.geometry.coordinates[1]];
                    console.log(location);
                    category_marker.push(location);
                    data_id = event.properties.name;
                    coord_lgt.push(event.geometry.coordinates[0]);
                    coord_lat.push(event.geometry.coordinates[1]);
                    console.log("id: " + data_id);
                    console.log("lattitude: " + coord_lat[i]);
                    console.log("longitude: " + coord_lgt[i]);

                    var obj = {lat: coord_lat, lng: coord_lgt};

                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.Soort + '</h1>';
                    tempStr += '<h3>' + event.properties.Straat + ' ' + event.properties.Huisnummer + ', ' + event.properties.Postcode + ' ' + event.properties.Gemeente + '</h3>';
                    tempStr += '<p>' + event.properties.Plaatsomschrijving + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detail_marker(coord_lat[' + i + '], coord_lgt[' + i + ']);" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                }
            };
            tempStr += '</div>';
            categoryMarker(category_marker);
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new MoveGentDogsApp(); // Make an instance of the MoveGentDogsApp
    app.init(); // Initialize the app

    // show result list
    function showList(className){
        var elements = document.getElementsByClassName(className);
        for(var i = 0, length = elements.length; i < length; i++) {
            elements[i].style.display = 'block';
        }
    }

    showList('movegent-results');
}

toeristischeWandelroutes.onclick = function () {
    map.data.forEach(function(feature) {
        map.data.remove(feature);
    });

    initMap();

    map.data.loadGeoJson('https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/GEOJSON/toeristischeWandelroutes.json');
}

clear.onclick = function () {
    //reset filter
    document.getElementById('sportcentra_options').style.display = "none";
    document.getElementById('speelterreinen_options').style.display = "none";
    document.getElementById('hondenvoorzieningen_options').style.display = "none";
    document.getElementById('wandelroutes_options').style.display = "none";
    document.getElementById('parken').checked = false;
    document.getElementById('sportcentra').checked = false;
    document.getElementById('speelterreinen').checked = false;
    document.getElementById('hondenvoorzieningen').checked = false;
    document.getElementById('wandelroutes').checked = false;

    // Hide map data
    map.data.forEach(function(feature) {
        map.data.remove(feature);
    });

    // reset lattitude, longitude and zoom of map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(51.0535,3.7304),
        mapTypeId: 'terrain'
    });

    // Remove list elements
    document.getElementById('movegent-results').innerHTML = '<div class="movegent-results"></div>';

}

btn_map.onclick = function () {
    document.getElementById('movegent-results').style.display = 'none';
    document.getElementById('map').style.display = 'block';

    //initMap();

}

btn_list.onclick = function () {
    document.getElementById('movegent-results').style.display = 'inline';
    document.getElementById('map').style.display = 'none';
}

btn_geolocation.onclick = function () {


    document.getElementById('movegent-results').style.display = 'none';
    document.getElementById('map').style.display = 'block';

    var infoWindow = new google.maps.InfoWindow({map: map});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }
}