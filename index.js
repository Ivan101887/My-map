let shopList = []
function initMap() {
    setMap();
    document.querySelector('.d-mode').onclick = () => { switchShow() }
}

const setMap = () => {
    //取得定位
    navigator.geolocation.watchPosition((position) => {
        //使用者緯度
        lat = position.coords.latitude;
        //使用者經度
        lng = position.coords.longitude;
        //呼叫postTarget取資料
        postTarget(lat, lng, 1);
        //初始化google map
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: { lat: lat, lng: lng },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
        });
        //依站點資訊新增map上的標記
        for (const shop of shopList) {
            console.log('New Marker')
            let marker = new google.maps.Marker({
                title: shop.name + '\n' + shop.address,
                position: new google.maps.LatLng(shop.lat, shop.lon),
                icon: './icons/圖片3_modified.png',
                map: map,
            })
            //圖標的監聽事件
            marker.addListener('click', () => {
                map.setZoom(18);
                map.setCenter(marker.getPosition());
            });
        }
    });
}

const switchShow = () => {
    let x = document.querySelector('.content')
    let y = document.querySelector('.l-container')
    let w = document.querySelector('#opt-m')
    let z = document.querySelector('#opt-l')

    if (x.style.display === 'block') {
        x.style.display = 'none'
        y.style.display = 'block'
        w.style.display = 'none'
        z.style.display = 'block'

    } else {
        x.style.display = 'block'
        y.style.display = 'none'
        w.style.display = 'block'
        z.style.display = 'none'
    }

}
//send request to 台彩 api
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





