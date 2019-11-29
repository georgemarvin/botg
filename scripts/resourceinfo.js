// ==UserScript==
// @name         BOTG Resource Info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BOTG Resource Info
// @author       Marvin George
// @match        http://baronsofthegalaxy.com/assets.aspx
// @require  http://code.jquery.com/jquery-1.7.1.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        none
// ==/UserScript==

function log(text){
    if(false){
        console.log(text);
    }
}

function start() {
    'use strict';

    log("add resource availability column");

    var darkTables = document.getElementsByClassName('TableDark');
    log("darkTables: ");
    log(darkTables);

    for(var j=0;j<darkTables.length;j++){
        var mgrid = darkTables[j].getElementsByClassName('mGrid');
        log("mgrid: ");
        log(mgrid);

        if(mgrid.length==1 ||mgrid.length==2){

            var body = mgrid[mgrid.length-1].children[0];

    //log(body)

    for(var i=0;i<body.children.length;i++){

        var row = body.children[i];

        if(i==0){
            if(body.children.length>1){
            var header = document.createElement('th')
            header.innerHTML = "#turns_rem";
            row.appendChild(header);
            }
        } else {
log(row)

        var req = parseInt(row.children[1].innerHTML.replace(',',''));
        var out = parseInt(row.children[2].innerHTML.replace(',',''));
        var available = parseInt(row.children[4].innerHTML.replace(',',''));

        //log(req);
        //log(out);
        //log(available);

        var info = document.createElement('td');
        info.setAttribute("align", "right");

        if(req>out){

            var turnsRemaining = available/(req-out);

            var text = Math.round(turnsRemaining);
            if(turnsRemaining>999){
                text = ''+Math.round(turnsRemaining/1000)+'K';
            }

            info.innerHTML = text;
        }

        row.appendChild(info);
        }

    }
        }

    }


}


waitForKeyElements("#ctl00_ContentPlaceHolder1_repCorpAssetStructure_ctl00_gvCorpAssetsStructureComponenets", start);
