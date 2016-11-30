// Variables
var btn_map = document.getElementById('btn_map');
var btn_list = document.getElementById('btn_list');
var btn_geolocation = document.getElementById('btn_geolocation');
var show_all = document.getElementById('show_all');
var sportcentra = document.getElementById('sportcentra');
var speelterreinen = document.getElementById('speelterreinen');
var parken = document.getElementById('parken');
var hondenvoorzieningen = document.getElementById('hondenvoorzieningen');
var wandelroutes = document.getElementById('wandelroutes');
var toeristische_wandelroutes = document.getElementById('toeristische_wandelroutes');
var btn_clear = document.getElementById('btn_clear');
var map;
var data_id;
var coord_lat = [];
var coord_lgt = [];
var coord = [];
var category_marker = [];
var category_shapes = [];
var stroke_color = [];
var fill_color = [];
var iconBase = "content/";
var icon_array = [];
var icon;
var icons = {
    antihondenpoep: {
        icon: iconBase + "antihondenpoeptegel.png"
    },
    hondentoilet: {
        icon: iconBase + "hondentoilet.png"
    },
    losloopweide: {
        icon: iconBase + "losloopweide.png"
    },
    sporthal: {
        icon: iconBase + "sporthal.png"
    },
    zwembad: {
        icon: iconBase + "zwembad.png"
    },
    buitensport: {
        icon: iconBase + "buitensport.png"
    }
};

window.onload = function () {
    btn_map.style.display = "none";
    showAll();
}

// Functions
function showAll() {
    if (show_all.checked) {
        document.getElementById('movegent-results').innerHTML = '<div class="movegent-results"></div>';

        // Hide options buttons
        document.getElementById('sportcentra_options').style.display = "none";
        document.getElementById('speelterreinen_options').style.display = "none";
        document.getElementById('hondenvoorzieningen_options').style.display = "none";
        document.getElementById('wandelroutes_options').style.display = "none";
        document.getElementById('parken').checked = false;
        document.getElementById('speelterreinen').checked = false;
        document.getElementById('hondenvoorzieningen').checked = false;
        document.getElementById('wandelroutes').checked = false;
        document.getElementById('sportcentra').checked = false;

        initMap();

        // Load result list
        function sportcentra() {
            // Load result list
            //var icon;
            function sportcentraList() {

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
                    category_marker = [];
                    icon = [];
                    for(var i = 0;i<this._moveGentData.length;i++) {
                        var event = this._moveGentData[i];
                        if (event.properties.type == "Sporthal") {
                            icon.push(icons.sporthal.icon);
                        }
                        else if (event.properties.type == "Zwembaden") {
                            icon.push(icons.zwembad.icon);
                        }
                        else {
                            icon.push(icons.buitensport.icon);
                        }
                        var location = [event.geometry.coordinates[0], event.geometry.coordinates[1]];
                        console.log(location);
                        category_marker.push(location);
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
                        tempStr += '<a id="' + data_id + '" onclick="detailMarker(coord_lat['+ i +'], coord_lgt['+ i +'], icon['+ i +']);" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                        tempStr += '</div>';
                        tempStr += '</section>';
                        tempStr += '<br>';
                    };
                    categoryMarkers(category_marker, icon);
                    tempStr += '</div>';
                    document.querySelector('.movegent-results').innerHTML += tempStr;
                };
            };
            var app = new sportcentraList(); // Make an instance of the sportcentraList
            app.init(); // Initialize the app
        }
        function parken() {
            function parkenList() {

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
                    stroke_color = [];
                    fill_color = [];
                    category_shapes = [];
                    for(var i=0;i<this._moveGentData.length;i++) {
                        var event = this._moveGentData[i];
                        stroke_color.push(event.properties.stroke);
                        fill_color.push(event.properties.fill);
                        data_id = event.properties.name;
                        if (event.geometry.coordinates != null) {
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
                        }
                        else {
                            var array = [];
                            category_shapes.push(array);
                        }

                        tempStr += '<section class="results" data-id="' + i + '">';
                        tempStr += '<div class="results_left">';
                        tempStr += '<h1>' + event.properties.OBJECTNAAM + '</h1>';
                        tempStr += '<h3>' + event.properties.KLASSEMENT + '</h3>';
                        tempStr += '<p>' + event.properties.SECTOR + '</p>';
                        tempStr += '</div>';
                        tempStr += '<div class="results_right">';
                        tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                        tempStr += '<a id="' + data_id + '" onclick="detailShape(coord[' + i + '])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                        tempStr += '</div>';
                        tempStr += '</section>';
                        tempStr += '<br>';
                        console.log(i);
                    };
                    categoryShape(category_shapes, stroke_color, "#00FF00");

                    tempStr += '</div>';
                    document.querySelector('.movegent-results').innerHTML += tempStr;
                };
            };
            var app = new parkenList();
            app.init();
        }
        function speelterreinen() {
            function speelterreinenList() {
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
                    stroke_color = [];
                    fill_color = [];
                    category_shapes = [];
                    for(var i=0;i<this._moveGentData.length;i++) {
                        var event = this._moveGentData[i];
                        stroke_color.push(event.properties.stroke);
                        fill_color.push(event.properties.fill);
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
                            tempStr += '<section class="results" data-id="' + i + '">';
                            tempStr += '<div class="results_left">';
                            tempStr += '<h1>' + event.properties.naam + '</h1>';
                            tempStr += '<p>' + event.properties.functies + '</p>';
                            tempStr += '</div>';
                            tempStr += '<div class="results_right">';
                            tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                            tempStr += '<a id="' + data_id + '" onclick="detailShape(coord[' + i + '], stroke_color['+ i +'], fill_color['+ i +'])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                            tempStr += '</div>';
                            tempStr += '</section>';
                            tempStr += '<br>';
                            console.log(i);
                        }
                    };
                    categoryShape(category_shapes, stroke_color, "#FF0000");

                    tempStr += "</div>";
                    document.querySelector('.movegent-results').innerHTML += tempStr;
                };
            };
            var app = new speelterreinenList();
            app.init();
        }
        function honden() {
            function hondenList() {

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
                        if (event.properties.Soort == "Hondentoilet") {
                            icon.push(icons.hondentoilet.icon);
                        }
                        else if (event.properties.Soort == "Anti-hondenpoeptegel") {
                            icon.push(icons.antihondenpoep.icon);
                        }
                        else {
                            icon.push(icons.losloopweide.icon);
                        }
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
                        tempStr += '<a id="' + data_id + '" onclick="detailMarker(coord_lat['+ i +'], coord_lgt['+ i +'], icon['+ i +']);" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                        tempStr += '</div>';
                        tempStr += '</section>';
                        tempStr += '<br>';
                        console.log(i);
                    };
                    console.log(icon);
                    categoryMarkers(category_marker, icon);
                    tempStr += '</div>';
                    document.querySelector('.movegent-results').innerHTML += tempStr;
                };
            };

            var app = new hondenList(); // Make an instance of the hondenList
            app.init(); // Initialize the app
        }
        function wandelroutes() {
            function wandelroutesList() {

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
                    coord = [];
                    for(var i=0;i<this._moveGentData.length;i++) {
                        var event = this._moveGentData[i];
                        var array = [];
                        for (var c = 0; c < event.geometry.coordinates.length; c++) {
                            var location = {lat: event.geometry.coordinates[c][1], lng: event.geometry.coordinates[c][0]};
                            array.push(location);
                        }
                        coord.push(array);
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
                    drawLines(coord);
                    tempStr += '</div>';
                    document.querySelector('.movegent-results').innerHTML += tempStr;
                };
            };
            var app = new wandelroutesList();
            app.init();
        }

        sportcentra();
        honden();
        speelterreinen();
        parken();
        wandelroutes();
    }
    else {
        clearResults();
    }
}

function showSportCentra() {
    if (sportcentra.checked) {
        document.getElementById('movegent-results').innerHTML = '<div class="movegent-results"></div>';
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
        document.getElementById('show_all').checked = false;

        // Hide map data
        //map.data.forEach(function(feature) {
        //    map.data.remove(feature);
        //});

        //initMap();

        // Load map data
        //map.data.loadGeoJson('https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/GEOJSON/sportcentra.json');

        // Load result list
        function sportcentraList() {

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
                category_marker = [];
                icon = [];
                for(var i = 0;i<this._moveGentData.length;i++) {
                    var event = this._moveGentData[i];
                    if (event.properties.type == "Sporthal") {
                        icon.push(icons.sporthal.icon);
                    }
                    else if (event.properties.type == "Zwembaden") {
                        icon.push(icons.zwembad.icon);
                    }
                    else {
                        icon.push(icons.buitensport.icon);
                    }
                    var location = [event.geometry.coordinates[0], event.geometry.coordinates[1]];
                    console.log(location);
                    category_marker.push(location);
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
                    tempStr += '<a id="' + data_id + '" onclick="detailMarker(coord_lat['+ i +'], coord_lgt['+ i +'], icon['+ i +']);" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                };
                initMap();
                categoryMarkers(category_marker, icon);
                tempStr += '</div>';
                document.querySelector('.movegent-results').innerHTML = tempStr;
            };
        };

        var app = new sportcentraList(); // Make an instance of the sportcentraList
        app.init(); // Initialize the app

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
        document.getElementById('movegent-results').innerHTML = '<div class="movegent-results"></div>';
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
        document.getElementById('show_all').checked = false;

        // Hide map data
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });

        initMap();

        // Load map data
        map.data.loadGeoJson('https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/GEOJSON/speelterreinen.json');

        function speelterreinenList() {

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
                    tempStr += '<a id="' + data_id + '" onclick="detailShape(coord[' + i + '])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
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

        var app = new speelterreinenList(); // Make an instance of the speelterreinenList
        app.init(); // Initialize the app

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
    }
}

function showHonden() {
    if (hondenvoorzieningen.checked) {
        document.getElementById('movegent-results').innerHTML = '<div class="movegent-results"></div>';
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
        document.getElementById('show_all').checked = false;

        initMap();

        // Hide map data
        //map.data.forEach(function(feature) {
          //  map.data.remove(feature);
        //});

        function hondenList() {

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
                category_marker = [];
                icon = [];
                for(var i=0;i<this._moveGentData.length;i++) {
                    var event = this._moveGentData[i];
                    if (event.properties.Soort == "Hondentoilet") {
                        icon.push(icons.hondentoilet.icon);
                    }
                    else if (event.properties.Soort == "Anti-hondenpoeptegel") {
                        icon.push(icons.antihondenpoep.icon);
                    }
                    else {
                        icon.push(icons.losloopweide.icon);
                    }
                    var location = [event.geometry.coordinates[0], event.geometry.coordinates[1]];
                    console.log(location);
                    category_marker.push(location);
                    data_id = event.properties.name;
                    coord_lgt.push(event.geometry.coordinates[0]);
                    coord_lat.push(event.geometry.coordinates[1]);
                    console.log("id: " + data_id);
                    console.log("lattitude: " + coord_lat[i]);
                    console.log("longitude: " + coord_lgt[i]);
                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.Soort + '</h1>';
                    tempStr += '<h3>' + event.properties.Straat + ' ' + event.properties.Huisnummer + ', ' + event.properties.Postcode + ' ' + event.properties.Gemeente + '</h3>';
                    tempStr += '<p>' + event.properties.Plaatsomschrijving + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a id="' + data_id + '" onclick="detailMarker(coord_lat['+ i +'], coord_lgt['+ i +'], icon['+ i +']);" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                };
                console.log(icon);
                categoryMarkers(category_marker, icon);
                tempStr += '</div>';
                document.querySelector('.movegent-results').innerHTML = tempStr;
            };
        };

        var app = new hondenList(); // Make an instance of the hondenList
        app.init(); // Initialize the app

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
    document.getElementById('movegent-results').innerHTML = '<div class="movegent-results"></div>';
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
        document.getElementById('show_all').checked = false;

        // Hide map data
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });

        initMap();

        // Load map data
        map.data.loadGeoJson('https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/GEOJSON/parken.json');

        function parkenList() {

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
                    tempStr += '<a id="' + data_id + '" onclick="detailShape(coord[' + i + '])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                };
                tempStr += '</div>';
                document.querySelector('.movegent-results').innerHTML = tempStr;
            };
        };

        var app = new parkenList(); // Make an instance of the parkenList
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
    document.getElementById('movegent-results').innerHTML = '<div class="movegent-results"></div>';
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
        document.getElementById('show_all').checked = false;

        // Hide map data
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });

        initMap();

        // show map data
        //map.data.loadGeoJson('https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/GEOJSON/wandelroutes.json');

        function wandelroutesList() {

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
                coord = [];
                for(var i=0;i<this._moveGentData.length;i++) {
                    var event = this._moveGentData[i];
                    var array = [];
                    for (var c = 0; c < event.geometry.coordinates.length; c++) {
                        var location = {lat: event.geometry.coordinates[c][1], lng: event.geometry.coordinates[c][0]};
                        array.push(location);
                    }
                    coord.push(array);
                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + "Wandelroute " + (i + 1) + '</h1>';
                    tempStr += '<h3>' + "Afstand: " + event.properties.Afstand + " meter" + '</h3>';
                    tempStr += '<p>' + "Staptijd: " + event.properties.TijdTXT2 + " minuten" + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a data-id="'+ i +'" onclick="detailLine(coord['+ i +'])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                };
                tempStr += '</div>';
                drawLines(coord);
                document.querySelector('.movegent-results').innerHTML = tempStr;
            };
        };

        var app = new wandelroutesList(); // Make an instance of the wandelroutesList
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

function showSportcentraDetail(name) {

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
        icon_array = [];
        var icon;
        console.log(this._moveGentData.length);
        for(var i=0;i<this._moveGentData.length;i++) {
            var event = this._moveGentData[i];
            if (event.properties.type == name) {
                if (name == "Sporthal") {
                    icon_array.push(icons.sporthal.icon);
                    icon = icons.sporthal.icon;
                }
                else if (name == "Zwembaden") {
                    icon_array.push(icons.zwembad.icon);
                    icon = icons.zwembad.icon;
                }
                else {
                    icon_array.push(icons.buitensport.icon);
                    icon = icons.buitensport.icon;
                }
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
                tempStr += '<a id="' + data_id + '" onclick="detailMarker(coord_lat['+ i +'], coord_lgt['+ i +'], icon_array['+ i +']);" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                tempStr += '</div>';
                tempStr += '</section>';
                tempStr += '<br>';
                console.log(i);
            }
        };
        tempStr += "</div>";
        initMap();
        categoryMarker(category_marker, icon);
        document.querySelector('.movegent-results').innerHTML = tempStr;
    };
};

function showSpeelpleinenDetail(name) {

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
        stroke_color = [];
        fill_color = [];
        console.log(this._moveGentData.length);
        for(var i=0;i<this._moveGentData.length;i++) {
            var event = this._moveGentData[i];
            var string = name;
            stroke_color.push(event.properties.stroke);
            fill_color.push(event.properties.fill);
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
                tempStr += '<a id="' + data_id + '" onclick="detailShape(coord[' + i + '], stroke_color['+ i +'], fill_color['+ i +'])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                tempStr += '</div>';
                tempStr += '</section>';
                tempStr += '<br>';
                console.log(i);
            }
        };
        initMap();
        categoryShape(category_shapes, stroke_color, fill_color);
        tempStr += "</div>";
        document.querySelector('.movegent-results').innerHTML = tempStr;
    };
};

function showHondenDetail(name) {

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
        icon_array = [];
        var icon;
        console.log(this._moveGentData.length);
        for(var i=0;i<this._moveGentData.length;i++) {
            var event = this._moveGentData[i];
            var string = name;
            if (event.properties.Soort.indexOf(string) !== -1) {
                if (name == "Hondentoilet") {
                    icon = icons.hondentoilet.icon;
                    icon_array.push(icons.hondentoilet.icon);
                }
                else if (name == "Anti-hondenpoeptegel") {
                    icon = icons.antihondenpoep.icon;
                    icon_array.push(icons.antihondenpoep.icon);
                }
                else {
                    icon = icons.losloopweide.icon;
                    icon_array.push(icons.losloopweide.icon);
                }
                var location = [event.geometry.coordinates[0], event.geometry.coordinates[1]];
                console.log(location);
                category_marker.push(location);
                data_id = event.properties.GentID;
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
                tempStr += '<a id="' + data_id + '" onclick="detailMarker(coord_lat[' + i + '], coord_lgt[' + i + '], icon_array['+ i +']);" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                tempStr += '</div>';
                tempStr += '</section>';
                tempStr += '<br>';
                console.log(i);
            }
        };
        tempStr += '</div>';
        initMap();
        categoryMarker(category_marker, icon);
        document.querySelector('.movegent-results').innerHTML = tempStr;
    };
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(51.0535,3.7304),
        mapTypeId: 'terrain'
    });
}

function categoryMarkers(array, icon) {
    for (var i=0; i<array.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(array[i][1], array[i][0]),
            icon: icon[i],
            map: map
        });
    }
    // To add the marker to the map, call setMap();
    marker.setMap(map);
}

function categoryMarker(array, icon) {
    for (var i=0; i<array.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(array[i][1], array[i][0]),
            icon: icon,
            map: map
        });
    }
    // To add the marker to the map, call setMap();
    marker.setMap(map);
}

function categoryShape(array, strokeColor, fillColor) {
    if (fillColor.constructor === array) {
        for (var i=0; i<array.length; i++) {
            var drawPolygon = new google.maps.Polygon({
                path: array[i],
                strokeColor: strokeColor[i],
                strokeOpacity: 1,
                fillColor: fillColor[i],
                fillOpacity: 0.4
            });
            drawPolygon.setMap(map);
        }
    }
    else {
        for (var i=0; i<array.length; i++) {
            var drawPolygon = new google.maps.Polygon({
                path: array[i],
                strokeColor: strokeColor[i],
                strokeOpacity: 1,
                fillColor: fillColor,
                fillOpacity: 0.4
            });
            drawPolygon.setMap(map);
        }
    }

}

function detailMarker(lat, lgt, icon) {
    document.getElementById('map').style.display = 'block';
    document.getElementById('movegent-results').style.display = 'none';
    btn_map.style.display = "none";
    btn_list.style.display = "";

    var myLatLng = {lat: lat, lng: lgt};
    console.log(lat + " / " + lgt);
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: myLatLng
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: icon
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);
}

function detailShape(array, strokeColor, fillColor) {
    document.getElementById('map').style.display = 'block';
    document.getElementById('movegent-results').style.display = 'none';
    btn_map.style.display = "none";
    btn_list.style.display = "";

    var lattitude = array[0].lat;
    var longitude = array[0].lng;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: {lat: lattitude, lng: longitude},
        mapTypeId: 'terrain'
    });

    var drawPolygon = new google.maps.Polygon({
        path: array,
        strokeColor: strokeColor,
        strokeOpacity: 1,
        fillColor: fillColor,
        fillOpacity: 0.3
    });

    drawPolygon.setMap(map);
    console.log("lat: " + lattitude + " / long: " + longitude);
}

function detailLine(array) {
    document.getElementById('map').style.display = 'block';
    document.getElementById('movegent-results').style.display = 'none';
    btn_map.style.display = "none";
    btn_list.style.display = "";

    var lattitude = array[0].lat;
    var longitude = array[0].lng;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: {lat: lattitude, lng: longitude},
        mapTypeId: 'terrain'
    });

    var drawPolyline = new google.maps.Polyline({
        path: array,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1,
        strokeWeight: 2
    });

    drawPolyline.setMap(map);

    var marker = new google.maps.Marker({
        position: array[0],
        map: map
    });
    marker.setMap(map);

    var marker2 = new google.maps.Marker({
        position: array[array.length-1],
        map: map
    });
    marker2.setMap(map);
}

function drawLines(array) {
    document.getElementById('map').style.display = 'block';
    document.getElementById('movegent-results').style.display = 'none';

    var colors = ["#E1A2AC", "#FDC300", "#56AF31", "#39B6AB", "#FF0000", "#00FF00", "#0000FF", "#FF00FF", "#F0F0F0"];


    for (var i = 0; i < array.length; i++) {
        var rand = colors[Math.floor(Math.random() * colors.length)];

        var drawPolyline = new google.maps.Polyline({
            path: array[i],
            geodesic: true,
            strokeColor: rand,
            strokeOpacity: 1,
            strokeWeight: 3
        });
        drawPolyline.setMap(map);
    }
}

function showList(className){
    var elements = document.getElementsByClassName(className);
    for(var i = 0, length = elements.length; i < length; i++) {
        elements[i].style.display = 'block';
    }
}

function clearResults() {
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
    document.getElementById('show_all').checked = false;

    // Hide map data
    map.data.forEach(function(feature) {
        map.data.remove(feature);
    });

    initMap();

    // Remove list elements
    document.getElementById('movegent-results').innerHTML = '<div class="movegent-results"></div>';
}

// Eventhandlers
sportcentra_zwembad.onclick = function () {
    var app = new showSportcentraDetail("Zwembaden"); // Make an instance of the showSportcentraDetail
    app.init(); // Initialize the app
}

sportcentra_sporthal.onclick = function () {
    var app = new showSportcentraDetail("Sporthal"); // Make an instance of the showSportcentraDetail
    app.init(); // Initialize the app
}

sportcentra_buitensport.onclick = function () {
    var app = new showSportcentraDetail("Buitensporten"); // Make an instance of the showSportcentraDetail
    app.init(); // Initialize the app
}

speelterreinen_voetbal.onclick = function () {
    var app = new showSpeelpleinenDetail("voetbal"); // Make an instance of the showSpeelpleinenDetail
    app.init(); // Initialize the app
}

speelterreinen_basketbal.onclick = function () {
    var app = new showSpeelpleinenDetail("basketbal"); // Make an instance of the showSpeelpleinenDetail
    app.init(); // Initialize the app
}

speelterreinen_skate.onclick = function () {
    var app = new showSpeelpleinenDetail("skate"); // Make an instance of the showSpeelpleinenDetail
    app.init(); // Initialize the app
}

speelterreinen_petanque.onclick = function () {
    var app = new showSpeelpleinenDetail("petanque"); // Make an instance of the showSpeelpleinenDetail
    app.init(); // Initialize the app
}

speelterreinen_zandbak.onclick = function () {
    var app = new showSpeelpleinenDetail("zandbak"); // Make an instance of the showSpeelpleinenDetail
    app.init(); // Initialize the app
}

speelterreinen_avontuurlijkspelen.onclick = function () {
    var app = new showSpeelpleinenDetail("avontuur"); // Make an instance of the showSpeelpleinenDetail
    app.init(); // Initialize the app
}

speelterreinen_speeltoestellen.onclick = function () {
    var app = new showSpeelpleinenDetail("speeltoestellen"); // Make an instance of the showSpeelpleinenDetail
    app.init(); // Initialize the app
}

hondenvoorzieningen_tegel.onclick = function () {
    var app = new showHondenDetail("Anti-hondenpoeptegel"); // Make an instance of the showHondenDetail
    app.init(); // Initialize the app

    // show result list
    showList('movegent-results');
}

hondenvoorzieningen_toilet.onclick = function () {

    var app = new showHondenDetail("Hondentoilet"); // Make an instance of the showHondenDetail
    app.init(); // Initialize the app

    // show result list
    showList('movegent-results');
}

hondenvoorzieningen_losloopweide.onclick = function () {

    var app = new showHondenDetail("Losloopweide"); // Make an instance of the showHondenDetail
    app.init(); // Initialize the app

    // show result list
    showList('movegent-results');
}

toeristische_wandelroutes.onclick = function () {
    // Hide map data
    map.data.forEach(function(feature) {
        map.data.remove(feature);
    });

    initMap();

    // show map data
    //map.data.loadGeoJson('https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/GEOJSON/wandelroutes.json');

    function toeristischeWandelroutesList() {

        // URL of the Search API
        this.API_URL = 'https://raw.githubusercontent.com/julilemo/1617.nmdad1.gitnotes/master/data/toeristischeWandelroutes.json?callback=json_callback';
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
            coord = [];
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                var array = [];
                for (var c = 0; c < event.geometry.coordinates.length; c++) {
                    var location = {lat: event.geometry.coordinates[c][1], lng: event.geometry.coordinates[c][0]};
                    array.push(location);
                }
                coord.push(array);
                tempStr += '<section class="results" data-id="' + i + '">';
                tempStr += '<div class="results_left">';
                tempStr += '<h1>' + "Toeristische wandelroute " + (i + 1) + '</h1>';
                tempStr += '</div>';
                tempStr += '<div class="results_right">';
                tempStr += '<a class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                tempStr += '<a data-id="'+ i +'" onclick="detailLine(coord['+ i +'])" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                tempStr += '</div>';
                tempStr += '</section>';
                tempStr += '<br>';
                console.log(i);
            };
            tempStr += '</div>';
            drawLines(coord);
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new toeristischeWandelroutesList(); // Make an instance of the wandelroutesList
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

btn_clear.onclick = function () {
    clearResults();
}

btn_map.onclick = function () {
    if (document.getElementById('map').style.display == 'block') {
        document.getElementById('movegent-results').style.display = 'none';
        document.getElementById('map').style.display = 'block';
        btn_map.style.display = "none";
        btn_list.style.display = "";
    }
    else if (show_all.checked || sportcentra.checked || speelterreinen.checked || parken.checked || wandelroutes.checked){
        document.getElementById('movegent-results').style.display = 'none';
        document.getElementById('map').style.display = 'block';
        btn_map.style.display = "none";
        btn_list.style.display = "";
    }
    else {
        document.getElementById('movegent-results').style.display = 'none';
        document.getElementById('map').style.display = 'block';
        google.maps.event.trigger(map, 'resize');
        map.setCenter(new google.maps.LatLng(51.0535,3.7304));
        btn_map.style.display = "none";
        btn_list.style.display = "";
    }
}

btn_list.onclick = function () {
    document.getElementById('movegent-results').style.display = 'inline';
    document.getElementById('map').style.display = 'none';
    btn_list.style.display = "none";
    btn_map.style.display = "";
}

btn_geolocation.onclick = function () {
    function geoLocation() {
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

    if (document.getElementById('map').style.display == 'block') {
        document.getElementById('movegent-results').style.display = 'none';
        document.getElementById('map').style.display = 'block';
        geoLocation();
        btn_map.style.display = "none";
        btn_list.style.display = "";
    }
    else {
        document.getElementById('movegent-results').style.display = 'none';
        document.getElementById('map').style.display = 'block';
        google.maps.event.trigger(map, 'resize');
        geoLocation();
        btn_map.style.display = "none";
        btn_list.style.display = "";
    }
}