
const L = require('leaflet');
let map;

function latLong (coordinates) {
  const coord = [];
  coordinates.forEach(element => {
    coord.push([element[1], element[0], element[2]]);
  });
  return coord;
}

function createMap (container) {
  console.log(container);
  map = new L.Map(container);
  const layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  map.addLayer(layer);
  console.log(map);
  return map;
}

function addData (m, data) {
  console.log(m);
  L.polyline(latLong(data.features[0].geometry.coordinates), { color: 'red' }).addTo(m);
  L.geoJSON(data.responseJSON).addTo(m);
  m.fitBounds(latLong(data.features[0].geometry.coordinates));
}

module.exports = {
  createMap: createMap,
  addData: addData
};
