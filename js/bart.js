


$(function() {
	//api call to get all the stations	
	$.ajax({
		type: "GET",
		url: "http://bart.lettyli.xyz/stations",
		dataType: "json",
		success: function(data) {
		
			$.each(data, function(i, items) {
				//console.log(items);
				$.each(items, function(j, item) {
					//console.log(item.name);
					//console.log(item);
					var srcStation = document.getElementById("srcStations");
					var desStation = document.getElementById("desStations");
					var option1 = document.createElement("option");
					var option2 = document.createElement("option");

					option1.text = item.name.toString();
					option1.value = item.abbr.toString();
					option2.text = item.name.toString();
                                        option2.value = item.abbr.toString();
					try {
						srcStation.add(option1, null);
						desStation.add(option2, null);
					} catch (err) {
						console.log('err in adding option');
						srcStation(option1);
						desStation(option2);
					}			
				});
			});
		}
	});
	

});


//refresh for every 30 seconds
var interval = window.setInterval(search, 30000);

//triggers by clicking button
function search() {
	var srcStationInfo = document.getElementById('srcStationInfo');
	
	//get selected source and destation stations
	var srcSelected = $('#srcStations').find(":selected").val();
	var desSelected = $('#desStations').find(":selected").val();
	//console.log(srcSelected);
	//console.log(desSelected);

	getTrains(srcSelected, desSelected);
	getSrc(srcSelected);

}


function getTrains(srcSelected, desSelected) {
	var stime = "";
	var trainInfo = document.getElementById('trainInfo');
	var countDown = document.getElementById('countDown');

	$('ul').empty();
	//api call to get trains
	$.ajax({
		type: "GET",
		url: "http://bart.lettyli.xyz/trips?source="+srcSelected+"&dest="+desSelected,
		dataType: "json",
		success: function(data) {
			var items = data.trip;
			var list = "";
			$.each(items, function(i, item) {
				//console.log(item);
				//console.log(i);
				if(i == 0) {
					var dt = new Date(Date.now());
					getstime = item['@origTimeMin'];
					ntime = "";
					ntime += dt.getFullYear()+"/";
					nMonth = dt.getMonth()+1;
					if(nMonth<10) {ntime += '0';}
					ntime += nMonth+"/";
					nDay = dt.getDate();
					if(nDay<10) {ntime += '0';}
					ntime += nDay+" ";

					var st = getstime.split(" ");
					var sti = st[0].split(":");
					var sHour = sti[0];
					var sMin = sti[1];
					if(st[1] == "AM" && sHour == 12){sHour="00";}
					if(st[1] == "PM") {sHour=parseInt(sHour,10)+ 12;}
					var stime = ntime+sHour+":"+sMin+":00";

					console.log(stime);
					//use countdown library
					$("#countDown").countdown(stime, function(event) {
						$(this).text(
							event.strftime('%H:%M:%S')
						);
					});


					getMapInfo(srcSelected, desSelected, stime);

				}
				$("<li>Departure time: "+item['@origTimeMin']+"</li>").appendTo(trainInfo);
				$("<li>Fare: "+item['@fare']+"</li>").appendTo(trainInfo);
				$("<li>Arrival time:"+item['@destTimeMin']+"</br></br></li>").appendTo(trainInfo);
			});
		}
	});
}


function getSrc(srcSelected){
	// api call to get source station info
	$.ajax({
		type: "GET",
		url: "http://bart.lettyli.xyz/station?source="+srcSelected,
		dataType: "json",
		success: function(data) {
			var info = data.station;
			var statInfo = "<p>Name: "+info.name+"</br>";
			statInfo += "City: "+info.city+"</br>";
			statInfo += "County: "+info.county+"</br>";
			statInfo += "Address: "+info.address+"</br>";
			statInfo += "Intro: "+info.intro['#cdata-section']+"</br>";
			statInfo += "Cross Street: "+info.cross_street['#cdata-section']+"</br>";
			statInfo+= "</p>";
			//console.log(statInfo);
			//console.log(info);

			srcStationInfo.innerHTML = statInfo;
			

		}
	});
}



//get lat and lng
function getMapInfo(srcSelected, desSelected, stime) {
        var srcLat, srcLng, desLat, desLng;
        $.ajax({
                type: "GET",
                url: "http://bart.lettyli.xyz/station?source="+srcSelected,
                dataType: "json",
                success: function(data) {
                        var info = data.station;
                        srcLat = info.gtfs_latitude;
                        srcLng = info.gtfs_longitude;
                        //console.log(srcLat);
               
        $.ajax({
                type: "GET",
                url: "http://bart.lettyli.xyz/station?source="+desSelected,
                dataType: "json",
                success: function(data) {
                        var info = data.station;
                        desLat = info.gtfs_latitude;
                        desLng = info.gtfs_longitude;

			myMap(srcLat, srcLng, desLat, desLng, stime);
                }
        });
		}
	});
}



function myMap(srcLat, srcLng, desLat, desLng, stime) {
	var src = new google.maps.LatLng(srcLat, srcLng);
	var des = new google.maps.LatLng(desLat, desLng);
	var directionsDisplay = new google.maps.DirectionsRenderer();
	var directionsService = new google.maps.DirectionsService();
	directionsDisplay.setMap(null);

	var request = {
		origin: src,
		destination: des,
		travelMode: 'TRANSIT'
	};
	var mapProp= {
		center: src,
		zoom:10,
	};
	console.log(srcLat+srcLng+desLat+desLng+stime);
	var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
	directionsDisplay.setMap(map);
	
	directionsService.route(request, function(result, status) {
		if (status == 'OK') {
			directionsDisplay.setDirections(result);
		}
	});
}





