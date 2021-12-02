
var map, marker, lat, lng;
function initMap() {
    navigator.geolocation.watchPosition((position) => {
        // console.log(position.coords);
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: { lat: lat, lng: lng }
        });
        marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map
        });
    });
}