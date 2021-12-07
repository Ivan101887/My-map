let shopList = []
let myLat, myLng, marker, map
const initMap = () => {
    navigator.geolocation.watchPosition((position) => {
        let lat = position.coords.latitude;
        myLat = lat;
        let lng = position.coords.longitude;
        myLng = lng;
    })
    map = new goole.maps.Map(document.getElementById('map'), {
        center: { lat: myLat, lng: myLng },
        zoom: 14,
        mapTypeId: 'terrain',
        disableDefaultUI: true,
    });
    let index = 0;
    for (const shop of shopList) {
        console.log('New Marker')
        // console.log(marker)
        let marker = new google.maps.Marker({
            title: shop.name + '\n' + shop.address,
            index: index,
            position: new google.maps.LatLng(shop.lat, shop.lon),
            icon: './icons/圖片3_modified.png',
            map: map,
        })
        marker.addListener('click', () => {
            map.setZoom(18);
            map.setCenter(marker.getPosition());

        });
        index++;
    }
};

// const setStation = () => {
//     postTarget(myLat, myLng, 1)
//     for (let shop of shopList) {
//         let code = ``
//     }
// }
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
            console.log(json.content.list)
            let spots = json.content.list
            for (const spot of spots) {
                shopList.push(spot);
            }

        })
}
function setCarousel() {
    $('.container').slick()
}
