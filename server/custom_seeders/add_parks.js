var db = require('../models/index.js');

const fetch = require('node-fetch');

let getImages = (park) => {
  let images = park.images.slice(1).map((img) => {
    return img.url;
  });
  return images;
};

async function fetchParks(start) {
  let response = await fetch(`https://developer.nps.gov/api/v1/parks?fields=images,url&limit=250&start=${start * 250 + 1}&api_key=${process.env.NPS_API_KEY}`);
  let data = await response.json();
  return data;
}

async function compileParks() {
  let parkData0 = await fetchParks(0);
  let parkData1 = await fetchParks(1);
  let parkData2 = await fetchParks(2);
  let parks = [...parkData0.data, ...parkData1.data, ...parkData2.data];

  parks = parks.map((park) => {
    return {
      name: park.fullName,
      image: park.images[0] ? park.images[0].url : '',
      images: getImages(park),
      states: park.states.split(','),
      description: park.description,
      lat: park.latLong.split(', ')[0].split(':')[1],
      lng: park.latLong.split(', ')[1] ? park.latLong.split(', ')[1].split(':')[1] : null,
      url: park.url,
      parkCode: park.parkCode,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  });

  return parks.filter((park) => park.image !== "");
}

compileParks().then((parks) => {
  db.Park.bulkCreate(parks).then(() => {
    console.log('created');
    db.sequelize.close();
  })
  .catch((err) => {
    console.log(err);
  })
})
