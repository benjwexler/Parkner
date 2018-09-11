// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require_tree .

// let user_phone_number = document.getElementById("phoneNumberSignUp");



// console.log(user_phone_number)

// user_phone_number.value
// console.log(user_phone_number.childNodes[4].value.match(/\d{10}/)[0].length === 10);


// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require_tree .

//Madeline's Apartment: 40.665724, -73.994812
//Farther down from her place: 40.663834, -73.992977

//TIME CONVERSION FUNCTIONS-----------------------------------
let militaryToMeridian = (time) => {
    let colon = time.indexOf(":");
    let hours = eval(time.slice(0, colon));
    let mins = eval(time.slice(colon + 1));
    let merid = "am";
    if (hours === 0) {hours = 12;}
    else if (hours === 24) {hours = 12;}
    else if (hours > 12) {merid = "pm";hours -= 12;}
    if (mins < 10) {mins = `0${mins}`;}
    return `${hours}:${mins}${merid}`;
}
let militaryToSeconds = (time) => {
    let colon = time.indexOf(":");
    let hours = eval(time.slice(0, colon)) * 3600;
    let mins = eval(time.slice(colon + 1)) * 60;
    return hours + mins;
}
let meridianToMilitary = (time) => {
    let hours = eval(time.slice(0, colon));
    let mins = eval(time.slice(colon + 1, time.length-2));
    let merid = time.slice(time.length-2);

    if (hours === 12) {
        hours = 0;
    }
    if (merid === "pm") {
        hours += 12;
    }

    if (hours < 10) {
        hours = "0" + hours;
    }
}
//------------------------------------------------------------

//CHECKS TO SEE IF CURB CURRENTLY NEEDS PAYMENT---------------
let isNotCurrentlyPaid = (curbObj) => {
    let currentDay = (new Date()).getDay();
    let currentTimeAsSecs = militaryToSeconds(`${(new Date()).getHours()}:${(new Date()).getMinutes()}`);
    let ans = false;
    for (let i = 0; i < curbObj.properties.rules.length; i++) {
        for (let o = 0; o < curbObj.properties.rules[i].times.length; o++) {
            if ((curbObj.properties.rules[i].times[o].days.includes(currentDay) && (currentTimeAsSecs >= militaryToSeconds(curbObj.properties.rules[i].times[o].time_of_day_start) &&  currentTimeAsSecs <= militaryToSeconds(curbObj.properties.rules[i].times[o].time_of_day_end))) && curbObj.properties.rules[i].price[0].price_per_hour.amount === 0) {
                console.log(curbObj.properties.rules[i].times[o]);
                return true;
            }
        }
    }
    return ans;
}
//------------------------------------------------------------

//MAP DATES---------------------------------------------------
let mapDates = () => {
    let now = new Date();
    
    let originalIndex = now.getDay();

    console.log(originalIndex);
    console.log(now);
    
    
    datesOfWeek[now.getDay()] = now;


    let datesMapped = 0;
    let newIndex = originalIndex + 1;


    while (datesMapped !== 6) {
        //if (newIndex > 6) {newIndex = 0;}

        let nowCompare = new Date();
        
    
        /*if (newIndex > originalIndex) {
            console.log(newIndex);
            //console.log(Math.abs(originalIndex-newIndex));
            nowCompare.setDate(nowCompare.getDate() + (Math.abs(originalIndex-newIndex)));
            console.log(nowCompare.toLocaleString());
            datesOfWeek[newIndex] = new Date(nowCompare);
        }*/
        
        console.log(newIndex);
        //console.log(Math.abs(originalIndex-newIndex));
        nowCompare.setDate(nowCompare.getDate() + (Math.abs(newIndex-originalIndex)));
        console.log(nowCompare.toLocaleString());
        datesOfWeek[newIndex] = new Date(nowCompare);   
        

    
        datesMapped++;
        newIndex++;
    }

    console.log(datesOfWeek);
}
//------------------------------------------------------------

//RETRIEVE DATE-----------------------------------------------
let retrieveDate = (dayInt) => {
    for (let h = 0; h < datesOfWeek.length; h++) {
        if (datesOfWeek[h] !== "") {
            if (dayInt === datesOfWeek[h].getDay()) {
                return datesOfWeek[h];
            }
        }
    }
}
//------------------------------------------------------------

//CHECKS TO SEE IF PARKING SPANS ARE CONTIGUOUS---------------
let isContiguous = (lastLowerBound, currentUpperBound) => {
    if (lastLowerBound === "24:00") {lastLowerBound = "00:00";}
    if (lastLowerBound === currentUpperBound) {return true;}
    else {return false;}
}
//------------------------------------------------------------

//CHECKS TO SEE WHEN WE CAN'T PARK ANYMORE--------------------
let findMoveByDatetime = (ruleObj, spe) => {
    let workingRuleObj = ruleObj; //<--avoid manipulating global data

    
    let rightNowObj = new Date();
    let rightNowMilitary = `${rightNowObj.getHours()}:${rightNowObj.getMinutes()}`; 
    let rightNowSeconds = militaryToSeconds(`${rightNowObj.getHours()}:${rightNowObj.getMinutes() < 10 ?  "0" + rightNowObj.getMinutes().toString() : rightNowObj.getMinutes()}`);
    let todayDayKey = daysOfWeek[rightNowObj.getDay()];
    let todayDayIndex = daysOfWeek.indexOf(daysOfWeek[rightNowObj.getDay()]);


    let startKey;
    let startRange;
    let found = false;
    for (let t in workingRuleObj.daysWithSpans) {
        if (t === todayDayKey) {
            for (let s = 0; s < workingRuleObj.daysWithSpans[t].length; s++) {
                let checkSpan = {upperBound: militaryToSeconds(workingRuleObj.daysWithSpans[t][s].split("-")[0]), lowerBound: militaryToSeconds(workingRuleObj.daysWithSpans[t][s].split("-")[1])};
                if (rightNowSeconds >= checkSpan.upperBound && rightNowSeconds <= checkSpan.lowerBound) {
                    found = true;
                    startKey = t;
                    startRange = s;
                    console.log("Found Allowed Current Range!")
                    console.log(`Today: ${t} Current Time: ${rightNowSeconds} Current Range: ${checkSpan.upperBound}-${checkSpan.lowerBound}`);
                    console.log(`Today: ${t} Current Time: ${rightNowMilitary} Current Range: ${workingRuleObj.daysWithSpans[t][s].split("-")[0]}-${workingRuleObj.daysWithSpans[t][s].split("-")[1]}`);
                    break;
                }
            }
        }
    }
    if (startKey === undefined) {
        alert("This spot is not currently available");
        spe.setMap(null);
    }

    let daysChecked = 0;
    let dayOfWeekIndex = daysOfWeek.indexOf(startKey);
    let rangesChecked = [];
    while (daysChecked < daysOfWeek.length) {

        let rangeIndex;
        if (daysChecked === 0) {rangeIndex = startRange;}
        else {rangeIndex = 0;}
        
        
        console.log("--------");
        console.log(daysOfWeek[dayOfWeekIndex]);
        
        
        let moveByObj = false;
        //{day: daysOfWeek[dayOfWeekIndex], maximumHour: workingRuleObj.daysWithSpans[daysOfWeek[dayOfWeekIndex]][r]};  
        
        
        for (let r = rangeIndex; r < workingRuleObj.daysWithSpans[daysOfWeek[dayOfWeekIndex]].length; r++) {
            rangesChecked.push({day: daysOfWeek[dayOfWeekIndex], range: workingRuleObj.daysWithSpans[daysOfWeek[dayOfWeekIndex]][r]});
            if (rangesChecked.length === 1) {                    
                console.log(`First Range Checked: ${rangesChecked[rangesChecked.length-1].range}`);
            }
            else if (rangesChecked.length > 1){
                if (!isContiguous(rangesChecked[rangesChecked.length-2].range.split("-")[1], rangesChecked[rangesChecked.length-1].range.split("-")[0])) {
                    console.log("gap found");
                    console.log(`Current Checked Range: ${rangesChecked[rangesChecked.length-1].range}`);
                    return rangesChecked[rangesChecked.length-2];
                }
                console.log(`Current Checked Range: ${rangesChecked[rangesChecked.length-1].range}`);
            }
        }

        console.log("--------");

        daysChecked++;
        dayOfWeekIndex++;
        if (dayOfWeekIndex === daysOfWeek.length) {
            dayOfWeekIndex = 0;
        }
    }
}
//------------------------------------------------------------

//MASTER FUNCTION, GETS LAT/LNG-------------------------------***
let getCoords = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) =>{
            userDataFromLocation["lat"] = position.coords.latitude;
            userDataFromLocation["lon"] = position.coords.longitude;
            getRulesFromCoords();
        });
    } else {
        console.log("Not supported");
    }
}
//------------------------------------------------------------

let getRulesFromCoords = () => {
    axios.get(`https://api.coord.co/v1/search/curbs/bylocation/all_rules?latitude=${userDataFromLocation["lat"]}&longitude=${userDataFromLocation["lon"]}&radius_km=0.05&temp_rules_window_start=&temp_rules_window_end=&primary_use=park&permitted_use=park&vehicle_type=all&access_key=${coordcoAPIKEY}`)
    .then((response) => {
        console.log(response);
    
        //CREATE MAP, ADD USER POS ICON AND RADIUS--------------------------------------------------------------------------
        let map = new google.maps.Map(document.getElementById("map_canvas"), {
            center: {
                lat: userDataFromLocation["lat"], 
                lng: userDataFromLocation["lon"]
            },
            zoom: 18,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        document.getElementById("display").innerText = "Select a curb.";
        parkData.loc = {lat: userDataFromLocation["lat"], lng: userDataFromLocation["lon"]}; 
        let userMarker = new google.maps.Marker({
            map: map,
            position: {
                lat: userDataFromLocation["lat"], 
                lng: userDataFromLocation["lon"]
            },
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10
            },
            title: "User Position"
        });
        let userRadius = new google.maps.Circle({
            map: map,
            radius: 50,    
            fillColor: "#9999ff",
            strokeColor: "#0000e6",
            strokeWeight: .5,
        });
        userRadius.bindTo("center", userMarker, "position");
        //------------------------------------------------------------------------------------------------------------------

        let allCurbs = []; //<--- hold all valid curb objects
        //LOOPING THROUGH ALL CURBS-----------------------------------------------------------------------------------------------------------------------------
        for (let x = 0; x < response.data.features.length; x++) { 

            //LOOP THROUGH CURB'S START & END COORDS AND CREATE A LINE OBJ FOR IT IF THAT COORD OBJ IS VALID----------------
            let blockWholeLine = [];
            for (let y = 0; y < response.data.features[x].geometry.coordinates.length; y ++) {
                if (isNotCurrentlyPaid(response.data.features[x])) {
                    blockWholeLine.push({lat: response.data.features[x].geometry.coordinates[y][1], lng: response.data.features[x].geometry.coordinates[y][0]});
                }
            }
            let blockWhole = new google.maps.Polyline({
                path: blockWholeLine,
                geodesic: true,
                strokeColor: "#0066cc",
                strokeOpacity: 1.0,
                strokeWeight: 7,
                zIndex: 1
            });
            allCurbs.push(blockWhole);
            //--------------------------------------------------------------------------------------------------------------

            //CREATE EVENT CLICK LISTENER FOR EACH LINE---------------------------------------------------------------------
            blockWhole.addListener("click", ()=>{
                let moveByFinal;
                console.log("-----------------------------------------------------");
                console.log("-----------------------------------------------------");

                console.log(x);

                //CHANGE CLICKED LINE COLOR TO GREEN AND OTHERS TO RED------------------------------------------------------
                blockWhole.strokeColor = "#00ff00";
                blockWhole.setOptions({strokeColor: "#00ff00"});
                for (let c = 0; c < allCurbs.length; c++) {
                    if (allCurbs[c] !== blockWhole) {
                        allCurbs[c].strokeColor = "#FF0000";
                        allCurbs[c].setOptions({strokeColor: "#FF0000"});
                    }
                }
                //----------------------------------------------------------------------------------------------------------
            
        
                master:
                for (let z = 0; z < response.data.features[x].properties.rules.length; z++) {
                    if ((response.data.features[x].properties.rules[z].primary === "park" || response.data.features[x].properties.rules[z].permitted.includes("park"))  && response.data.features[x].properties.rules[z].price[0].price_per_hour.amount === 0) {
                        console.log(`RELEVANT CURB PARKING RULE #${(z+1)} OUT OF ${response.data.features[x].properties.rules.length} IN TOTAL:----`);
                        //CONVERT TIME PROPERTIES FOR EACH DAY INTO SINGLE OBJECT (A) WITH A RANGE
                        let daysInDayOfWeeks = [];
                        let ruleTimes = response.data.features[x].properties.rules[z].times;
                        for (let a = 0; a < ruleTimes.length; a++) {
                            for (let b = 0; b < ruleTimes[a].days.length; b++) {
                                /*AS REAL TIME*/ //daysInDayOfWeeks.push({daysAsInts: ruleTimes[a].days[b], daysAsWeekday: daysOfWeek[ruleTimes[a].days[b]], span: `${militaryToMeridian(ruleTimes[a].time_of_day_start)}-${militaryToMeridian(ruleTimes[a].time_of_day_end)}`});
                                /*AS MILITARY TIME*/ daysInDayOfWeeks.push({daysAsInts: ruleTimes[a].days[b], daysAsWeekday: daysOfWeek[ruleTimes[a].days[b]], span: `${ruleTimes[a].time_of_day_start}-${ruleTimes[a].time_of_day_end}`});
                                /*AS SECONDS:*/ //daysInDayOfWeeks.push({daysAsInts: ruleTimes[a].days[b], daysAsWeekday: daysOfWeek[ruleTimes[a].days[b]], span: `${militaryToSeconds(ruleTimes[a].time_of_day_start)}-${militaryToSeconds(ruleTimes[a].time_of_day_end)}`});
                            }
                        }
                        
                        //SORT (A) OBJECTS' RANGE PROPERTIES INTO ANOTHER OBJECT (B) REPERESENTING ENTIRE WEEK BASED ON THEIR DAYS
                        let spansInWeek  = {paid: {status: false, rate: null}, daysWithSpans: {"Su": [], "M": [], "T": [], "W": [], "Thr": [], "F": [], "Sa": []}, otherInfo: response.data.features[x].properties.metadata};
                        for (let a = 0; a < daysInDayOfWeeks.length; a++) {
                            for (let b in spansInWeek.daysWithSpans) {
                                if (daysInDayOfWeeks[a].daysAsWeekday === b) {
                                    spansInWeek.daysWithSpans[b].push(daysInDayOfWeeks[a].span);
                                }
                            }
                        }
                        for (let c in spansInWeek.daysWithSpans) {
                            spansInWeek.daysWithSpans[c].sort();
                        }

                        //GIVE (B) A PROPERTY WITH INFO REGARDING PAYMENT DATA JUST IN CASE
                        if (response.data.features[x].properties.rules[z].price[0].price_per_hour.amount !== 0) {
                            spansInWeek.paid.status = true;
                            spansInWeek.paid.rate = response.data.features[x].properties.rules[z].price[0].price_per_hour.amount;
                        }

                        console.log("Rule with MetaData and Day Spans:");
                        console.log(spansInWeek);

                        //console.log(findMoveByDatetime(spansInWeek));
                        moveByFinal = findMoveByDatetime(spansInWeek, blockWhole);
                        if (moveByFinal !== undefined) {
                            moveByFinal.curbCoords = {start: {lat: response.data.features[x].geometry.coordinates[0][1], lng: response.data.features[x].geometry.coordinates[0][0]}, end: {lat: response.data.features[x].geometry.coordinates[1][1], lng: response.data.features[x].geometry.coordinates[1][0]}};
                            moveByFinal.profile = spansInWeek;
                        }
                    }
                }
                console.log("-----------------------------------------------------");
                console.log("-----------------------------------------------------");

                
                if (moveByFinal !== undefined) {
                    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    document.getElementById("display").innerText = `A car parked here must be moved by ${militaryToMeridian(moveByFinal.range.split("-")[1])} on ${retrieveDate(daysOfWeek.indexOf(moveByFinal.day)).toLocaleDateString("en-US", options)}`;
                    parkData.all = moveByFinal;


                    let milTime = moveByFinal.range.split("-")[1];
                    let spDate = retrieveDate(daysOfWeek.indexOf(moveByFinal.day));

                    
                    parkData.moveByDate = new Date(spDate.getFullYear(), spDate.getMonth(), spDate.getDate(), eval(milTime.split(":")[0]), eval(milTime.split(":")[1]), 0); 

                    console.log(parkData);

                    //PLUG INTO FORM INPUT ELEMENTS HERE
                    //document.getElementById("park_session_loc_lat").value = (parkData.all.curbCoords.start.lat + parkData.all.curbCoords.end.lat)/2;
                    //document.getElementById("park_session_loc_lng").value = (parkData.all.curbCoords.start.lng + parkData.all.curbCoords.end.lng)/2;
                    document.getElementById("start_lat").value = parkData.all.curbCoords.start.lat;
                    document.getElementById("end_lat").value = parkData.all.curbCoords.end.lat;
                    document.getElementById("start_long").value = parkData.all.curbCoords.start.lng;
                    document.getElementById("end_long").value = parkData.all.curbCoords.end.lng;
                    document.getElementById("move_by").value = parkData.moveByDate;
                }
                else {
                    document.getElementById("display").innerText = "A car can stay here all week";
                
                }
            });
            blockWhole.setMap(map);
        }  
    })
    .catch((error) => {
        console.log(error);
    });
}

//------------------------------------------------------------

//RENDER SHOW MAP---------------------------------------------
let renderOldMap = () => {
    let mapShow = new google.maps.Map(document.getElementById("map_canvas"), {
      center: {
          //READ LAT AND LNG ELEMENTS
          lat: (Number(document.getElementById("curbStartLat").innerHTML) + Number(document.getElementById("curbEndLat").innerHTML))/2 , 
          lng: (Number(document.getElementById("curbStartLng").innerHTML) + Number(document.getElementById("curbEndLng").innerHTML))/2 
      },
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    let blockWholeShow = new google.maps.Polyline({
      //READ LAT AND LNG ELEMENTS
      path: [{lat: Number(document.getElementById("curbStartLat").innerHTML), lng: Number(document.getElementById("curbStartLng").innerHTML)}, {lat: Number(document.getElementById("curbEndLat").innerHTML), lng: Number(document.getElementById("curbEndLng").innerHTML)}],
      geodesic: true,
      strokeColor: "#0066cc",
      strokeOpacity: 1.0,
      strokeWeight: 7,
      zIndex: 1
    });
    blockWholeShow.setMap(mapShow);
}
//------------------------------------------------------------




let userDataFromLocation = {};
let parkData = {};
let geocodioAPIKey = "e2b570b6bbfb2e7b0b0044b25f05eb7989b0794";
let coordcoAPIKEY = "5r5gSXX5MxG4qx3xB9DvgIPP3Rrjuwx2VWUGE-LYbIA";
let daysOfWeek = ["Su", "M", "T", "W", "Thr", "F", "Sa"];
let datesOfWeek = ["", "", "", "", "", "", ""];




//------------------------------------------------------------
/*

*REMEMBER TO USE THE RIGHT MAP ELEMENT

PUT THIS IN HEADER ABOVE OWN SCRIPT:
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyCIny_pi_-OpegLTAf2iV4ebra20U62ciM"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>


PUT THIS IN NEW PARKING SESSION AT BOTTOM:
    <script>
        mapDates(); #<-- populates dates for the next week
        getCoords(); #<-- do basically everything

        #if using a fake button use this to tie the fake button to the form
        document.getElementById("setReminder").addEventListener("click", ()=>{
            document.getElementsByClassName("actions")[0].firstElementChild.click();
        });
    </script>


PUT THIS AT BOTTOM OF SHOW:
    <script>
        #this reads hidden display elements so make it reads the correct ones
        renderOldMap();
    </script>
*/
//------------------------------------------------------------

