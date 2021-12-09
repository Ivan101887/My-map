let markerList = []
let shopList = [];
let myLat, myLng, map;
let slicker;
let chosen = 1;


//onload function
async function initMap() {
    await locateUsers().then();//根據裝置定位使用者位置
    await postTarget(myLat, myLng, chosen);//搜尋所在位置的台灣彩券行
    initialMyMap(myLat, myLng);//建立新地圖
    setMarkerOnMap();//標記站點位置
    newInfoCard();//動態產生站點列表
    newSlickCard();//生成輪播元件
    setCarousel();//實作輪播效果
    document.querySelector('.d-mode').onclick = () => { switchShow() }//切換顯示模式
    listenSelect();
}


async function listenSelect() {
    document.querySelector('.dist_select').onclick = async (e) => {
        console.log("Success on listening")
        chosen = e.target.value;
        console.log(chosen)
        $('.slick').slick('unslick');//解除slick
        // initMap();
        await postTarget(myLat, myLng, parseInt(chosen));//搜尋所在位置的台灣彩券行
        // setMarkerOnMap();//標記站點位置
        // newInfoCard();//動態產生站點列表
        // newSlickCard();//生成輪播元件
        // setCarousel();//實作輪播效果
        // listenSelect();
    }
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
                console.log('定位成功  你在' + myLat + "," + myLng)
                resolve();
            },
            (error) => {
                alert('抱歉無法取得您所在位置')
                reject();
            }
        )
    })
}

function initialMyMap(latitude, longitude) {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: latitude, lng: longitude },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
    });
}
function setCarousel(params) {
    slicker = $('.slick').slick({
        arrows: false,
        centerMode: true,
        slidesToShow: 3,
        draggable: true,
        infinite: false,
    })
    slicker.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        // console.log(event);
        // console.log(slick);
        console.log(currentSlide);
        console.log(nextSlide);
        markerList[nextSlide].setIcon('./icons/圖片4_modified.png');
        markerList[currentSlide].setIcon('./icons/圖片3_modified.png');
        map.setCenter(markerList[nextSlide].getPosition());
        map.setZoom(18);
    });
}

function setMarkerOnMap() {
    let index = 0;
    markerList = [];
    console.log('標記站點位置')
    for (const shop of shopList) {
        console.log('新標記')
        let marker = new google.maps.Marker({
            title: shop.name + '\n' + shop.address,
            index: index,
            position: new google.maps.LatLng(shop.lat, shop.lon),
            map: map,
        })
        index++;
        marker.setIcon('./icons/圖片3_modified.png')
        markerList.push(marker);
        bindMarkerToSlicker();//marker的點擊事件監聽
    }
}
const bindMarkerToSlicker = () => {
    console.log('start');
    for (let marker of markerList) {
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
                marker.setIcon('./icons/圖片4_modified.png')
            }
            $('.slick').slick('slickGoTo', marker.index);
        });
    }
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
async function postTarget(lat, lng, dis) {
    const url = `https://smuat.megatime.com.tw/taiwanlottery/api/Home/Station`
    shopList = [];
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
            "distance": dis,
        })
    }
    await fetch(url, request)
        .then(response => response.json())
        .then(json => {
            console.log("run postTarget")
            console.log(json.content.list)
            let spots = json.content.list
            for (const spot of spots) {
                shopList.push(spot);
            }
        })
        .catch((error) => {
            console.log(`Error : ${error}`)
        })
}
let newInfoCard = (lat, lng) => {
    const origin = document.querySelector('.l-container')
    origin.innerHTML = ""
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

let newSlickCard = () => {
    const origin = document.querySelector('.slick')
    origin.innerHTML = ""
    for (let shop of shopList) {
        const url = "http://www.google.com/maps/dir/" + lat + "," + lng + "/" + shop.address
        const item = `<div class="box">
            <div class="head">
              <div class="t-name">
                ${shop.name}
              </div>
              <div>${shop.distance}公里</div>
            </div>
            <div class="t_detail">
              <div style="padding: 5px 0px;">${shop.address}</div>
              <div>
                <a href= ${url} target='_blank'>
                <button class="dir" type="button" value="導航">
                  導航
                </button></a>
              </div>
            </div>
          </div>`
        origin.innerHTML += item;
    }
}




