let shopList = []
function initMap() {
    var map, marker, lat, lng;
    navigator.geolocation.watchPosition((position) => {
        // console.log(position.coords);
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: { lat: lat, lng: lng },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
        });
        postTarget(lat, lng, 1);

        for (const shop of shopList) {
            console.log('New Marker')
            let marker = new google.maps.Marker({
                title: shop.name + '\n' + shop.address,
                position: new google.maps.LatLng(shop.lat, shop.lon),
                icon: './icons/圖片3_modified.png',
                map: map,
            })
            marker.addListener('click', () => {
                map.setZoom(18);
                map.setCenter(marker.getPosition());

            });
        }
        marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map
        });
        google.maps.event.addListener(marker, 'click', function () {
            map.setZoom(18);
            map.setCenter(marker.getPosition());
        });
        console.log(shopList)
    });

}


const postTarget = (lat, lng, dis) => {
    const url = `https://smuat.megatime.com.tw/taiwanlottery/api/Home/Station`
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Encrypt": "0"
        },
        body: JSON.stringify({
            "lat": lat,
            "lon": lng,
            "distance": dis

        })
    }

    fetch(url, request)
        .then(response => response.json())
        .then(json => {
            console.log("run postTarget")
            console.log(json.content.list)
            let spots = json.content.list
            for (const spot of spots) {
                shopList.push(spot);
            }

        })
}





