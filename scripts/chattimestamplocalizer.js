// ==UserScript==
// @name         BOTG Chat Timestamp Localizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BOTG Chat Timestamp Localizer
// @author       Marvin George
// @match        http://baronsofthegalaxy.com/comms.aspx
// @require  https://momentjs.com/downloads/moment.min.js
// @require  https://momentjs.com/downloads/moment-timezone-with-data-2012-2022.min.js
// @require  http://code.jquery.com/jquery-1.7.1.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        none
// ==/UserScript==

function log(text){
    if(true){
        console.log(text);
    }
}

function convertTimezone (timetext, format) {
    var timeStr     = timetext;
    var origTime    = moment.tz (timeStr, format, true, "America/Los_Angeles");
    var localTime   = origTime.tz (Intl.DateTimeFormat().resolvedOptions().timeZone).format("MM/DD HH:mm");

    return localTime;
}

function isDateText(text, format){
    var date = moment.tz (text, format, true, "America/Los_Angeles");
    if(date._isValid){
        log("Valid! :");log(date);
        return true;
    } else {
        log("Not valid:"+date);
        return false;
    }
}

function localizeDates() {
    'use strict';

    log("replaceChatTimeStamps");

    const chatTable = document.getElementById('ctl00_ContentPlaceHolder1_gvCommDisplayThread');
    var spans = chatTable.getElementsByTagName('span');
    for(var i=0;i<spans.length;i++){
        if(isDateText(spans[i].innerText,"MM/DD hh:mm A")){
spans[i].innerText = convertTimezone(spans[i].innerText,"MM/DD hh:mm A");
        }
    }

}

function localizeDatesInMessages() {
    'use strict';

    log("replaceChatTimeStamps");

    const chatTable = document.getElementById('ctl00_ContentPlaceHolder1_upComms');
    var tds = chatTable.getElementsByTagName('td');
    for(var i=0;i<tds.length;i++){
        if(isDateText(tds[i].innerText,"MM/DD/YY hh:mm A")){
            log("found date: "+tds[i].innerText);
            tds[i].innerText = convertTimezone(tds[i].innerText,"MM/DD/YY hh:mm A");
        }
    }

}



waitForKeyElements("#ctl00_ContentPlaceHolder1_gvCommDisplayThread", localizeDates);
waitForKeyElements("#ctl00_ContentPlaceHolder1_upComms", localizeDatesInMessages);