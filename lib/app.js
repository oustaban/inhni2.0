// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

/**
 * @fileOverview This is the js file that loads all the dependencies and init the application.
 * @author <a href="mailto:jleyva@cvaconsulting.com">Juan Leyva</a>
 * @version 1.2
 */


// Base path for all the files required.
requirejs.config({
    paths: {
        root: '..'
    }
});

// Requirements for launching the app, the function is not executed until both
// files are fully loaded.
// We need at least the config.json file with all the settings and the language file.
var required = ['root/externallib/text!root/config.json',
                'root/externallib/text!root/lang/en.json',
                'root/externallib/text!root/lib/worker.js'];

requirejs(required,
function(config, lang, worker) {
    config = JSON.parse(config);

    // Init the app.
    MM.init(config);
    MM.lang.base = JSON.parse(lang);
    MM.webWorker = worker;

    // Once the config and base lang are loaded, we load all the plugins defined in the config.json file.
    requirejs.config({
        baseUrl: 'plugins',
        packages: config.plugins
    });

    // We load extra languages if are present in the config file.
    var lang = MM.lang.determine();
    var extraLang = 'root/externallib/text!root/lang/' + lang + '.json';
    config.plugins.unshift(extraLang);

    requirejs(config.plugins,
        function(extraLang) {
            try {
                var langStrings = JSON.parse(extraLang);
                MM.lang.loadLang('core', lang, langStrings);
            } catch(e) {
                MM.log("Unable to load detected language: " + lang);
            }
            $(document).ready(function() {
                // Load the base layout of the app.
                MM.loadLayout();
                loader2();
                burger();
            });
        }
    );
});

function loader2() {
    var opts = { 
        lines: 13, // The number of lines to draw
        length: 7, // The length of each line
        width: 3, // The line thickness
        radius: 10, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };  

    var target = document.getElementById('loader2');
    var spinner = new Spinner(opts).spin(target);

    var loading = $("#loader2");
    var content = $("#main");

}

function burger() {
    $(".menu-link").click(function() {
        $(".menu-content").toggle();
    });
}

function addAccount() {
    $('#btn-add-account').click(function(e){
        MM.log("Add Account");
        e.preventDefault();
        $('#link-add-account').trigger('click');
    });
}