// ==UserScript==
// @name         BOTG Traveltime Calculator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BOTG Traveltime Calculator
// @author       Marvin George
// @match        http://baronsofthegalaxy.com/assets.aspx?tid=*
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        none
// ==/UserScript==

function calcTravelTime() {
    'use strict';
    //console.log("Run calcTravelTime");
    var speed = parseInt(document.getElementById('ctl00_ContentPlaceHolder1_lblAssetMilitaryCurrentMovement').innerText);
    //console.log(speed);
    var currentLocationX = parseInt(document.getElementById('ctl00_ContentPlaceHolder1_lblMilitaryCurrLocGalGridX').innerText);
    var currentLocationY = parseInt(document.getElementById('ctl00_ContentPlaceHolder1_lblMilitaryCurrLocGalGridY').innerText);
    //console.log(currentLocationX+" : "+currentLocationY);

    var orderTypeSelectBox = document.getElementById('ctl00_ContentPlaceHolder1_ddlOrderType');
    if(orderTypeSelectBox !=null && orderTypeSelectBox.selectedIndex==1){
        //console.log("Movement selected");
        var coordText = document.getElementById('ctl00_ContentPlaceHolder1_tbMoveToGalGridCoords').value;
        //console.log("coordTextField "+coordText);

        //Calc distance
        var indexOfColon= coordText.indexOf(':');

        var targetX = parseInt(coordText.substring(0,indexOfColon));
        var targetY = parseInt(coordText.substring(indexOfColon+1,coordText.length));

        var diffX = Math.abs(targetX - currentLocationX);
        var diffY = Math.abs(targetY - currentLocationY);

        //console.log("targetX:"+targetX+"  :  targetY:"+targetY);

        var turns = 0;

        if(diffX < diffY){
            console.log("1Distance diagnonal: "+(Math.abs(targetX-currentLocationX)) + " Distance straight: "+ Math.abs((Math.abs(targetY-currentLocationY)-Math.abs(targetX-currentLocationX))));
            //Diagonal
            turns = turns + Math.ceil(diffX/speed);
            //Straight
            turns = turns + Math.ceil(Math.abs(diffY-diffX)/speed);
        } else {
            console.log("2Distance diagnonal: "+(Math.abs(targetY-currentLocationY)) + " Distance straight: "+ Math.abs((Math.abs(targetX-currentLocationX)-Math.abs(targetY-currentLocationY))));
            //Diagonal
            turns = turns + Math.ceil(diffY/speed);
            //Straight
            turns = turns + Math.ceil(Math.abs(diffX-diffY)/speed);
        }

        var addButton = document.getElementById('ctl00_ContentPlaceHolder1_btnSetOrders');
        addButton.value = "Add This Order ("+turns+" turns)";
    } else {
        //console.log("Other order selected");
    }
}

function processTargetChange(){
    console.log("Run processTargetChange");
    var coordinatesTextField = document.getElementById('ctl00_ContentPlaceHolder1_tbMoveToGalGridCoords');
}

function addCoordChangeListener(){
    //console.log("addCoordChangeListener");
    document.getElementById('ctl00_ContentPlaceHolder1_tbMoveToGalGridCoords').addEventListener("input",calcTravelTime);
    document.getElementById('ctl00_ContentPlaceHolder1_tbMoveToGalGridCoords').addEventListener("change",calcTravelTime);
    //document.getElementById('ctl00_ContentPlaceHolder1_tbMoveToGalGridCoords').addEventListener("keyPress",calcTravelTime);
    //document.getElementById('ctl00_ContentPlaceHolder1_tbMoveToGalGridCoords').addEventListener("load",calcTravelTime);
    document.getElementById('ctl00_ContentPlaceHolder1_tbMoveToGalGridCoords').addEventListener("onchange",calcTravelTime);
    calcTravelTime();
}

waitForKeyElements("#ctl00_ContentPlaceHolder1_tbMoveToGalGridCoords", addCoordChangeListener);