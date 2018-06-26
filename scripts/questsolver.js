// ==UserScript==
// @name         BOTG Quest Solver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BOTG Quest Solver
// @author       Marvin George
// @match        http://baronsofthegalaxy.com/corporate_politics.aspx?eventid=*
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @require http://algebra.js.org/javascripts/algebra-0.2.6.min.js
// @grant        none
// ==/UserScript==

function log(logmessage){
if(false){
    console.log(logmessage);
}
}

function solveQuests() {
    'use strict';

    var eventInfo = document.getElementById('ctl00_ContentPlaceHolder1_fvEventMainInfo');
    var strongs = eventInfo.getElementsByTagName("strong");
    for(var i = 0; i<strongs.length; i++){

        if(isValidQuestDescription(strongs[i])){

           var planetName = solvePlanetName(strongs[i].childNodes[0].data);
            var distance = solveDistance(strongs[i].childNodes[2].data);

            var coord1 = solveCoordinates(strongs[i].childNodes[6].data);
            var coord2 = solveCoordinates(strongs[i].childNodes[8].data);
            var coord3 = solveCoordinates(strongs[i].childNodes[10].data);

            log("coordinate1.x: "+coord1.x+ " - coordinate1.y: "+coord1.y);
            log("coordinate2.x: "+coord2.x+ " - coordinate2.y: "+coord2.y);
            log("coordinate3.x: "+coord3.x+ " - coordinate3.y: "+coord3.y);

            var xMin = Math.min(coord1.x,coord2.x,coord3.x);
            var xMax = Math.max(coord1.x,coord2.x,coord3.x);
            var yMin = Math.min(coord1.y,coord2.y,coord3.y);
            var yMax = Math.max(coord1.y,coord2.y,coord3.y);

            log(xMin);
            log(xMax);
            log(yMin);
            log(yMax);

            var targetX =[];
            var targetY =[];

            if(xMax - xMin == 0){
                targetX[0]=xMin-distance;
                targetX[1]=xMin;
                targetX[2]=xMin+distance;
            } else if (xMax - xMin == distance){
                targetX[0]=xMin;
                targetX[1]=xMax;
            } else if (xMax - xMin == 2*distance){
                targetX[0]=xMin+distance;
            }

            if(yMax - yMin == 0){
                targetY[0]=yMin-distance;
                targetY[1]=yMin;
                targetY[2]=yMin+distance;
            } else if (yMax - yMin == distance){
                targetY[0]=yMin;
                targetY[1]=yMax;
            } else if (yMax - yMin == 2*distance){
                targetY[0]=yMin+distance;
            }


            log(targetX);
            log(targetY);

            //Output

            var br1 = document.createElement ('br');
            var br2 = document.createElement ('br');
            var resultPlanet = document.createElement ('strong');
            resultPlanet.innerHTML = 'Solved location name: '+planetName;
            strongs[i].parentElement.appendChild(br1);
            strongs[i].parentElement.appendChild(br2);
            strongs[i].parentElement.appendChild(resultPlanet);

            for(var possibleX=0; possibleX<targetX.length; possibleX++){
               for(var possibleY=0; possibleY<targetY.length; possibleY++){

                   if((targetX[possibleX] == coord1.x && targetY[possibleY] == coord1.y) || (targetX[possibleX] == coord2.x && targetY[possibleY] == coord2.y) || (targetX[possibleX] == coord3.x && targetY[possibleY] == coord3.y)){
                       continue;
                   }

                   var brCoordinate = document.createElement ('br');
                   var resultCoordinate = document.createElement ('strong');
                   resultCoordinate.innerHTML = 'Possible coordinate: ( '+targetX[possibleX]+' : '+targetY[possibleY]+' )';
                   strongs[i].parentElement.appendChild(brCoordinate);
                   strongs[i].parentElement.appendChild(resultCoordinate);

               }
            }





    }
}
}

function solvePlanetName(text){
    if(text.includes("Nth ")){
        var indexN=text.indexOf("Nth ");
        var n = parseInt(text.substr(indexN+4,indexN+5));
        log(n);

        var indexBracket1=text.indexOf("(");
        var indexBracket2=text.indexOf(")");
        var letterArray = text.substr(indexBracket1+3,indexBracket2).split(" ");
        log(letterArray);
        var planetName = "";
        for(var letterIndex = n-1; letterIndex<letterArray.length; letterIndex+=5){
            planetName=planetName+letterArray[letterIndex];
        }
        log("Planetname: "+planetName);
        return planetName;

    }
}

function solveDistance(text){
    var indexBracket1=text.indexOf("(");
    var indexBracket2=text.indexOf(")");
    var numberArray = text.substr(indexBracket1+3,indexBracket2).split(" , ");
    log(numberArray);

    var result = -1;

    if((numberArray[0] % numberArray[1] == 0) && (numberArray[1] % numberArray[2] == 0) && (numberArray[2] % numberArray[3] == 0)){
        //divide
        result = numberArray[3]/(numberArray[1]/numberArray[2]);
    } else {
        //substract
        result = numberArray[3]-(numberArray[1]-numberArray[2]);
    }
    log("Distance: "+result);
    return result;
}

function solveCoordinates(text){
var indexColon=text.indexOf(":");
    var ret = {x:solveSingleCoordinate(text.substr(0,indexColon)), y:solveSingleCoordinate(text.substr(indexColon+1,text.length))};
    return ret;

}

function solveSingleCoordinate(text){
        log("solving "+text);
    var eq = algebra.parse(text.replace(" ","").replace("x","*").replace("?","a"));
    return eq.solveFor("a");
}

function isValidQuestDescription(strong){
var foundPlanethName = false;
    var foundDistance = false;
    var foundCoordinates = false;

    for(var i = 0; i<strong.childNodes.length; i++){
        if(typeof strong.childNodes[i].data !== 'undefined'){
        if(strong.childNodes[i].data.startsWith("Planet Name:")){
           foundPlanethName=true;
           }

        if(strong.childNodes[i].data.startsWith("Distance:")){
           foundDistance=true;
           }

        if(strong.childNodes[i].data.startsWith("Coordinates:")){
           foundCoordinates=true;
           }
        }
    }

    return foundCoordinates && foundDistance && foundPlanethName;
}

waitForKeyElements("#ctl00_ContentPlaceHolder1_fvEventMainInfo", solveQuests);
