let shopList = []
let myLat,myLng,marker,map
let a = -1
function initMap() {    
    navigator.geolocation.watchPosition((position) => {
        let lat = position.coords.latitude;
        myLat = lat;
        let lng = position.coords.longitude;
        myLng = lng;
        map = new goole.maps.Map(document.getElementById('map'), {
            center: { lat: myLat, lng: myLng },
            zoom: 14,
        mapTypeId:'terrain',
        disableDefaultUI: true,
    });
    postTarget(myLat,myLng,2)
    let index = 0;
    for (const shop of shopList) {
        console.log('New Marker')
        // console.log(marker)
        let marker = new google.maps.Marker({
            title: shop.name + '\n' + shop.address,
            index:index,
            position: new google.maps.LatLng(shop.lat,shop.lon),
            icon: './icons/圖片3_modified.png',
            map: map,
        })
        marker.addListener('click',() =>  {
            map.setZoom(18);
            map.setCenter(marker.getPosition());
            
        });
    index ++;
    }
    
})
    // setCarousel()
};
const postTarget = (lat , lng , dis) => { 
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
    fetch(url,request)        
        .then(response => response.json())
        .then(json => {
            // console.log(json. content.list)
            let spots = json.content.list
            for (const spot of spots) {
                shopList.push(spot);
            }

        })  
} 
// function setCarousel(){
//     $('.container').slick()
// }      
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
