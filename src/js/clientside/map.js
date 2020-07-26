
const L = require('leaflet');
let map;

// LeafLet erwartet [Latitude, Longitude]
// GeoJSON beinhaltet [Longitude, Latitude]
// latLong wandelt GeoJSON Format in passendes Leaflet Format um
function latLong (coordinates) {
  const coord = [];
  coordinates.forEach(element => {
    coord.push([element[1], element[0], element[2]]);
  });
  return coord;
}
// Initialisierung der Karte ohne Daten
function createMap (container) {
  console.log(container);
  // Erstellt ein Map Objekt innerhalb des <div> Elements "container"
  map = new L.Map(container, {
    scrollWheelZoom: false
  });
  // Einfügen des Kartenmaterials(Hintergrund) zur Karte map
  const layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  map.addLayer(layer);
  console.log(map);
  return map;
}

// Einfügen der Daten data in Karte m
function addData (m, data) {
  console.log(m);
  // Pfade zwischen einzelne Knoten der Daten in rot zeichnen
  L.polyline(latLong(data.features[0].geometry.coordinates), { color: 'red' }).addTo(m);
  L.geoJSON(data.responseJSON).addTo(m);
  // Anpassung des Kartenausschnittes an gezeichnete Route
  // Route sollte innerhalb des Kartenausschnittes vollkommen zu sehen sein
  m.fitBounds(latLong(data.features[0].geometry.coordinates));
}

module.exports = {
  createMap: createMap,
  addData: addData
};
