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

let fetchImages = async (park) => {
  try {
    let url = 'https://api.cognitive.microsoft.com/bing/v7.0/images/search' + '?q=' + encodeURIComponent(park.fullName);
    let header = {'Ocp-Apim-Subscription-Key': process.env.BING_SEARCH_API_KEY};
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    return data.value;
  } catch(e) {
    console.log(e);
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function compileParks() {
  let parkData0 = await fetchParks(0);
  let parkData1 = await fetchParks(1);
  let parkData2 = await fetchParks(2);
  let parks = [...parkData0.data, ...parkData1.data, ...parkData2.data];
  let compiledParks = [];
  for (let i = 0; i < parks.length; i++) {
    let park = parks[i];
    await timeout(1100);
    let imageResponse = await fetchImages(park);
    let thumbnails = imageResponse.slice(0,5).map((img) => img.thumbnailUrl);
    let images = imageResponse.slice(0,5).map((img) => img.contentUrl);
    compiledParks.push({
      name: park.fullName,
      image: images.length > 0 ? images[0] : null,
      images: images,
      thumbnail: thumbnails.length > 0 ? thumbnails[0] : null,
      thumbnails: thumbnails,
      states: park.states.split(','),
      description: park.description,
      lat: park.latLong.split(', ')[0].split(':')[1],
      lng: park.latLong.split(', ')[1] ? park.latLong.split(', ')[1].split(':')[1] : null,
      url: park.url,
      parkCode: park.parkCode,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    console.log(compileParks[compiledParks.length - 1]);
  }

  return compiledParks.filter((park) => park.image !== null);
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
