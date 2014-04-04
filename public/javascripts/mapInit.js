// window.onload = function(){
//   mapInit();
// };

function submitForm(coords){
  var form = '<form id="markerForm">Description:<br/><input type="textarea" name="description">';
  form += '<input type="hidden" name="latitude" value="' + coords.lat() + '">';
  form += '<input type="hidden" name="longitude" value="' + coords.lng() + '">';
  form += '<br/><button id="submit">Place Marker</button></form>';
  return form;
}

var infoWindow = new google.maps.InfoWindow();

var mapOptions = {
  center: new google.maps.LatLng(42.4, -71.12),
  zoom: 15
};
var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

function mapInit(){

  google.maps.event.addDomListener(map, 'click', function(e){
    infoWindow.setContent(submitForm(e.latLng));
    infoWindow.setPosition(e.latLng);
    infoWindow.open(map);

    var infoListener = google.maps.event.addDomListener(infoWindow, 'domready', function(infoEvent){
      $("#submit").on("click", function(e){
        e.preventDefault();
        var data = $("#markerForm").serialize();
        $.post('/submitMarker', data, function(res) {
          if(res.err) { alert("Error occurred");
          } else {
            var lat = $('input[name="latitude"]').val(),
                lng = $('input[name="longitude"]').val();
                console.log(lat);
            var marker = new google.maps.Marker({
              position : new google.maps.LatLng(lat, lng),
              map      : map,
              title    : $('input[name="description"]').val()
            });
            infoWindow.close();
            addInfoWindowListener(marker);
          }
        });
      });
      google.maps.event.removeListener(infoListener);
    });
  });

  var loadMarkers = function(){
    $.getJSON("/markers", function(data){
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        var marker = new google.maps.Marker({
          position : new google.maps.LatLng(data[i].latitude, data[i].longitude),
          map      : map,
          title    : data[i].description
        });
        addInfoWindowListener(marker);
      }
    });
  };
  loadMarkers();
}

function addInfoWindowListener(obj){
  google.maps.event.addListener(obj, 'click', function(e){
    infoWindow.setContent(this.title);
    infoWindow.open(map, this);
  });
}

google.maps.event.addDomListener(window, 'load', mapInit);







