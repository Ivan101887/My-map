let shopList = [];
let myLat, myLng;

//onload function
function initMap() {
    // console.log('aaaa')
    // setMap();
    locateUsers();
    document.querySelector('.d-mode').onclick = () => { switchShow() }
    // console.log(myLat, myLng)

}

function locateUsers() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                //使用者緯度
                lat = position.coords.latitude;
                myLat = lat;
                //使用者經度
                lng = position.coords.longitude;
                myLng = lng;
                console.log('定位成功/n你在' + myLat + "," + myLng)
                resolve();
            },
            (error) => {
                console.log('抱歉無法取得您的位置')
                reject();
            }
        )
    })
}


const setMap = () => {
    let lat, lng
    console.log('aaaa')
    //取得定位
    navigator.geolocation.getCurrentPosition((position) => {
        //使用者緯度
        lat = position.coords.latitude;
        //使用者經度
        lng = position.coords.longitude;
        //呼叫postTarget取資料
        console.log(lat, lng)
        postTarget(lat, lng, 1);
        //初始化google map
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: { lat: lat, lng: lng },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
        });


        //依站點資訊新增map上的標記
        let markerList = []


        for (const shop of shopList) {
            let marker = new google.maps.Marker({
                title: shop.name + '\n' + shop.address,
                position: new google.maps.LatLng(shop.lat, shop.lon),
                // icon: './icons/圖片3_modified.png',
                map: map,
            })
            marker.setIcon('./icons/圖片3_modified.png')
            markerList.push(marker);
            //監聽圖標
            marker.addListener('click', () => {
                map.setZoom(18);
                map.setCenter(marker.getPosition());
                //初始畫圖標
                for (let i of markerList) {
                    // console.log('reset icon')
                    if (i.icon === './icons/圖片4_modified.png') { i.setIcon('./icons/圖片3_modified.png') }
                    else continue;
                }
                //click to change icon
                if (marker.icon === './icons/圖片3_modified.png') {
                    console.log('change icon')
                    marker.setIcon('./icons/圖片4_modified.png')
                }
            });
        }

        newInfoCard(lat, lng)
    });
}
//切換列表\地圖顯示
const switchShow = () => {
    let x = document.querySelector('.content')
    let y = document.querySelector('.l-container')
    let w = document.querySelector('#opt-m')
    let z = document.querySelector('#opt-l')
    //如果在地圖模式就隱藏地圖顯示列表
    if (x.style.display === 'block') {
        x.style.display = 'none'
        y.style.display = 'block'
        w.style.display = 'none'
        z.style.display = 'block'
        //如果列表模式就隱藏列表顯示地圖
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
let newInfoCard = (lat, lng) => {
    const origin = document.querySelector('.l-container')
    for (let shop of shopList) {
        const url = "http://www.google.com/maps/dir/" + lat + "," + lng + "/" + shop.address
        const item = `<div class="l-box">
            <div class="l-head">
              <div class="l-t-name">
                ${shop.name}
              </div>
              <div>${shop.distance}公里</div>
            </div>
            <div class="l-t_detail">
              <div style="padding: 5px 0px;">${shop.address}</div>
              <div>
                <a href= ${url} target='_blank'>
                  <button class="l-dir" type="button" value="導航">
                    導航
                  </button>
                </a>
              </div>
            </div>
          </div>`
        origin.innerHTML += item;
    }
}





