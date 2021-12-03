
function initMap() {
    var map, marker, lat, lng;
    navigator.geolocation.watchPosition((position) => {
        // console.log(position.coords);
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: { lat: lat, lng: lng },
            mapTypeId:google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            
        });
        marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map
        });
        google.maps.event.addListener(marker,'click',function() {
        var pos = map.getZoom();
        map.setZoom(18);
        map.setCenter(marker.getPosition());
        });
        // console.log(lat)
        // console.log(lng)
        const get = getStation(lat,lng,1);
        console.log(get)
    });
        
}

let getStation = async function () {
    const postTarget = (lat,lng,dis) =>{
    const url = `https://smuat.megatime.com.tw/taiwanlottery/api/Home/Station`
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Encrypt":"0"
        },
        body: JSON.stringify({
            "lat": lat, 
            "lon": lng,
            "distance": dis

        })
    }
    
    return fetch(url,request)        
        .then(response => response.json())
        .then(json => {
            var spots = []
            for (let i =0; i < json.content.list.length; i++ ){
                spots.push(json.content.list[i])
            }
            console.log(spots)
            return spots;
        })  
    }
    postTarget(25.074687, 121.575157,1) 
    
    
    
}
// map = Vue.createApp({
//     data(){
//         return{
//             map:{}, 
//             marker:{}, 
//             lat:0, 
//             lng:0,
//         }
//     },
//     mounted(){
//         this.initMap()
//     },
//     methods:{
//         initMap() {
//         navigator.geolocation.watchPosition((position) => {
//         // console.log(position.coords);
//         lat = position.coords.latitude;
//         lng = position.coords.longitude;
//         map = new google.maps.Map(document.getElementById('map'), {
//             zoom: 14,
//             center: { lat: lat, lng: lng },
//             mapTypeId:google.maps.MapTypeId.ROADMAP,
//             disableDefaultUI: true,
//             zoomControl: false,
//             mapTypeControl: false,
//             scaleControl: false,
//             streetViewControl: false,
//             rotateControl: false,
//             fullscreenControl: false,
//         });
//         marker = new google.maps.Marker({
//             position: { lat: lat, lng: lng },
//             map: map
//         });
//         google.maps.event.addListener(marker,'click',function() {
//         var pos = map.getZoom();
//         map.setZoom(18);
//         map.setCenter(marker.getPosition());
//         });
//         });
//         }
//     }
// }).mount('#map')
