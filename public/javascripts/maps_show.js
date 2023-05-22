// Initialize and add the map and the marker
let map;

const mapDiv = document.getElementById("map");
const sightingLat = document.getElementById("lat");
const sightingLng = document.getElementById("lng");

async function initMap() {
    // Location of the sighting
    const position = { lat: parseFloat(sightingLat.innerHTML), lng: parseFloat(sightingLng.innerHTML) };

    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const { Marker } = await google.maps.importLibrary("marker");

    // The map, centered at The Diamond
    map = new Map(mapDiv, {
        zoom: 12,
        center: position,
        disableDefaultUI: true,
        mapId: "SIGHTING_MAP",
    });

    // The marker
    const marker = new Marker({
        map: map,
        position: position,
        title: "SIGHTING_LOCATION",
    });


    // map.addListener("click", (e) => {
    //     moveMarker(e.latLng.lat(), e.latLng.lng(), map, marker, true)
    // })

}

// const moveMarker = (lat, lng, map, marker, from_click) => {
//     marker.setPosition({lat: lat, lng: lng});
//     if (from_click){
//         sightingLat.value = lat;
//         sightingLng.value = lng;
//     }
// };

initMap();
//
// function updateMapFromInput() {
//     moveMarker(parseFloat(sightingLat.value), parseFloat(sightingLng.value), map, marker, true);
// }
// sightingLat.addEventListener("change", updateMapFromInput);
// sightingLng.addEventListener("change", updateMapFromInput);