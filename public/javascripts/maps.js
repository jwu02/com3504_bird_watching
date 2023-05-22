// Initialize and add the map and the marker
let map;
let marker;

const mapDiv = document.getElementById("map");
const sightingLat = document.getElementById("latitude");
const sightingLng = document.getElementById("longitude");

async function initMap() {
    // Location of The Diamond as the starting point for map
    const position = { lat: 53.3823417, lng: -1.4807941 };

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

    // The marker, positioned at The Diamond
    marker = new Marker({
        map: map,
        position: position,
        title: "SIGHTING_LOCATION",
    });


    map.addListener("click", (e) => {
        moveMarker(e.latLng.lat(), e.latLng.lng(), map, marker, true)
    })

}

const moveMarker = (lat, lng, map, marker, from_click) => {
    marker.setPosition({lat: lat, lng: lng});
    if (from_click){
        sightingLat.value = lat;
        sightingLng.value = lng;
    }
};

initMap();

function updateMapFromInput() {
    moveMarker(parseFloat(sightingLat.value), parseFloat(sightingLng.value), map, marker, true);
}
sightingLat.addEventListener("change", updateMapFromInput);
sightingLng.addEventListener("change", updateMapFromInput);