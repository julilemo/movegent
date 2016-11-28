function ready(cb) {
    /in/.test(document.readyState)
        ? setTimeout(ready.bind(null, cb), 90)
        : cb();
};

ready(function(){

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
            var tempStr = '';
            console.log(this._moveGentData.length);
            for(var i=0;i<this._moveGentData.length;i++) {
                var event = this._moveGentData[i];
                var string = "voetbal";
                if (event.properties.functies.indexOf(string) !== -1) {
                    tempStr += '<section class="results" data-id="' + i + '">';
                    tempStr += '<div class="results_left">';
                    tempStr += '<h1>' + event.properties.naam + '</h1>';
                    tempStr += '<p>' + event.properties.functies + '</p>';
                    tempStr += '</div>';
                    tempStr += '<div class="results_right">';
                    tempStr += '<a href="" class="orange"><i class="fa fa-star" aria-hidden="true"></i></a>';
                    tempStr += '<a href="" class="blue"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>';
                    tempStr += '</div>';
                    tempStr += '</section>';
                    tempStr += '<br>';
                    console.log(i);
                }
            };
            document.querySelector('.movegent-results').innerHTML = tempStr;
        };
    };

    var app = new MoveGentSpeelpleinenApp(); // Make an instance of the MoveGentSpeelpleinenApp
    app.init(); // Initialize the app

});