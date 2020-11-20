// ! DOM
const places = document.getElementById('places')
const addMarker = document.getElementById('add-marker')
const modal = document.getElementById('modal')
const form = document.getElementById('form')

// ! Globals
// const data = JSON.parse(localStorage.getItem('markers'))
const formIsValid = {
  name: false,
  address: false,
  phone: false,
  lat: false,
  lng: false,
}

let dataMarker = []

// Proveedor de plano
const tilesProvider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

// render map
const myMap = L.map('myMap').setView([38.265408, -0.698902], 12)
L.tileLayer(tilesProvider, {
  maxZoom: 18,
}).addTo(myMap)

// Default markers
const markers = [
  {
    name: 'IES Severo Ochoa',
    address: 'Carrer Illueca, 28, 03206 Elx, Alicante',
    phone: '+34 966 912 260',
    coords: {
      lat: 38.27986449706615,
      lng: -0.7157742977142335,
    },
  },
  {
    name: 'Carrefour Elche',
    address: 'Avenida de Crevillente 31, 03293 Elx, Alicante',
    phone: '+34 602 582 625',
    coords: {
      lat: 38.257868,
      lng: -0.727646,
    },
  },
  {
    name: 'C.C. Plaza Mar 2',
    address: 'Avinguda de Dénia s/n, 03016 Alacant, Alicante',
    phone: '+34 965 268 557',
    coords: {
      lat: 38.3552203,
      lng: -0.4715857,
    },
  },
  {
    name: 'Carrefour Santa Pola',
    address: 'Calle Lérida 10, 03130 Santa Pola, Alicante',
    phone: '+34 644 862 497',
    coords: {
      lat: 38.199111,
      lng: -0.561998,
    },
  },
  {
    name: 'Universidad Miguel Hernández Elche',
    address: 'Avenida de la Universidad de Elche s/n, 03202 Elche, Alicante',
    phone: '+34 966 658 500',
    coords: {
      lat: 38.274814,
      lng: -0.6861645,
    },
  },
]

// ! Functions

// Center view
const clickZoom = (e) => {
  myMap.setView(e.target.getLatLng())
}

const onMapDblClick = (e) => {
  const { lat, lng } = e.latlng
  // Remove zoom on dblclick
  myMap.doubleClickZoom.disable()

  // Show Lat and Lng
  alert(`Las coordenadas del punto seleccionado son: ${lat}, ${lng}`)
}

const getData = () => {
  const data = JSON.parse(localStorage.getItem('markers'))
  places.innerHTML = ''
  return data
}

// Print markers and show popUps
const printMarkers = () => {
  const data = getData()

  data === null ? (dataMarker = markers) : (dataMarker = data)
  dataMarker.map((mark, id) => {
    const { name, address, phone } = mark
    const { lat, lng } = mark.coords

    // Print Menu markers
    const item = document.createElement('li')
    item.classList.add('menu__list-item')
    item.innerHTML = ` 
      <p data-id="${id}" data-name="${name}" data-address="${address}" data-phone="${phone}" data-lat="${lat}" data-lng="${lng}">${name}</p>
      <span data-action="remove" data-id="${id}" data-name="${name}" data-address="${address}" data-phone="${phone}" data-lat="${lat}" data-lng="${lng}">Delete</span>
    `
    places.append(item)

    // Print markers on map
    let marker = L.marker([lat, lng]).addTo(myMap)
    marker
      .bindPopup(
        `
          <h2>${name}</h2>
          <p><strong>Dirección</strong>: ${address} </p>
          <p><strong>Teléfono</strong>: <a href="${phone}">${phone}</a> </p>
        `
      )
      .on('click', clickZoom)
  })
}

// Remove markers
const removeMarkers = (id) => {
  const data = getData()

  if (data === null) {
    markers.splice(id, 1)
    setMarkersToLocalStorage(markers)
    printMarkers()
  } else {
    data.splice(id, 1)
    setMarkersToLocalStorage(data)
    printMarkers()
  }
}

places.addEventListener('click', (e) => {
  const { action, id } = e.target.dataset

  if (action === 'remove') removeMarkers(id)
})

// Check Form Values
const checkFormFields = (field) => {
  switch (field.name) {
    case 'name':
      field.value.length > 0
        ? (formIsValid.name = true)
        : (formIsValid.name = false)
      break
    case 'address':
      field.value.length > 0
        ? (formIsValid.address = true)
        : (formIsValid.address = false)
      break
    case 'phone':
      field.value.length > 0
        ? (formIsValid.phone = true)
        : (formIsValid.phone = false)
      break
    case 'lat':
      field.value.length > 0
        ? (formIsValid.lat = true)
        : (formIsValid.lat = false)
      break
    case 'lng':
      field.value.length > 0
        ? (formIsValid.lng = true)
        : (formIsValid.lng = false)
      break
  }
}

const setMarkersToLocalStorage = (dataMarker) => {
  localStorage.setItem('markers', JSON.stringify(dataMarker))
}

const addNewMarker = (name, address, phone, lat, lng) => {
  const data = getData()

  data === null ? (dataMarker = markers) : (dataMarker = data)
  const newMarker = {
    name: name,
    address: address,
    phone: phone,
    coords: {
      lat: lat,
      lng: lng,
    },
  }
  dataMarker.push(newMarker)
  setMarkersToLocalStorage(dataMarker)
}

// ! Events

// Center marker and open popup to click on menu
places.addEventListener('click', (e) => {
  const { name, address, phone, lat, lng } = e.target.dataset
  myMap.flyTo([lat, lng], 18)

  L.popup()
    .setLatLng([lat, lng])
    .setContent(
      `
          <h2>${name}</h2>
          <p><strong>Dirección</strong>: ${address} </p>
          <p><strong>Teléfono</strong>: <a href="${phone}">${phone}</a> </p>
        `
    )
    .openOn(myMap)
})

form.addEventListener('change', (e) => {
  checkFormFields(e.target)
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const { name, address, phone, lat, lng } = e.target
  if (
    formIsValid.name === true &&
    formIsValid.address === true &&
    formIsValid.phone === true &&
    formIsValid.lat === true &&
    formIsValid.lng === true
  ) {
    addNewMarker(name.value, address.value, phone.value, lat.value, lng.value)
    printMarkers()
    form.reset()
  }
})

// Render app
window.addEventListener('load', () => {
  // if (data === null) setMarkersToLocalStorage()
  //setMarkersToLocalStorage()
  printMarkers()
})

myMap.on('dblclick', onMapDblClick)

// Add Marker
// myMap.on('dblclick', (e) => {
//   let latLng = myMap.mouseEventToLatLng(e.originalEvent)
//   L.marker([latLng.lat, latLng.lng]).addTo(myMap)
// })

// Al hacer click sale un alert
// function onMapClick(e) {
//   alert('You clicked the map at ' + e.latlng)
// }
