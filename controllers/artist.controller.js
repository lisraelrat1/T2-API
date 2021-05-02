const btoa = require('btoa');
const db = require('../database/models');
const Artist = db.Artist;

module.exports = {
getArtists : async (req, res) => {
    const artists = await Artist.findAll();
    var fullUrl = req.protocol + '://' + req.get('host')

    artists.forEach(element => {
      element.dataValues['albums'] = fullUrl + `/artists/${element.id}/albums`;
      element.dataValues['tracks'] = fullUrl + `/artists/${element.id}/tracks`;
      element.dataValues['self'] = fullUrl + `/artists/${element.id}`;
    });

    return res.status(200).send(artists); 
},

getArtist : async (req, res) => {
    const { artist_id } = req.params;
    console.log(artist_id)
  
    const artist = await Artist.findOne({
      where: {
        id : artist_id
      },
    });
  
    if (!artist) {
      return res.status(404).send();
    }

    var fullUrl = req.protocol + '://' + req.get('host')
    artist.dataValues['albums'] = fullUrl + `/artists/${artist.id}/albums`;
    artist.dataValues['tracks'] = fullUrl + `/artists/${artist.id}/tracks`;
    artist.dataValues['self'] = fullUrl + `/artists/${artist.id}`;
    return res.status(200).send(artist);
},


//Crea Album
createArtist : async (req, res) => {
  const { name, age } = req.body;
  console.log(name,age)
  var fullUrl = req.protocol + '://' + req.get('host')
  console.log(fullUrl)
  if (!name || !age) {
    return res.status(400).send({
      message: 'Please provide the albums name and genre to create an album!',
    });
  }

  function codificar(string) {
      let identificador = btoa(string)
      if (identificador.length <= 22){
          return identificador
      }
      else {
          return identificador.slice(0,22)
      } 
  }

  let artistidExists = await Artist.findOne({
    where: {
      id: codificar(name),
    },
  });

  console.log('existe artista',artistidExists)

  if (artistidExists) {
    artistidExists.dataValues['albums'] = fullUrl + `/artists/${artistidExists.id}/albums`;
    artistidExists.dataValues['tracks'] = fullUrl + `/artists/${artistidExists.id}/tracks`;
    artistidExists.dataValues['self'] = fullUrl + `/artists/${artistidExists.id}`;

    return res.status(409).send(artistidExists)
  }

  try {

    let identificador = codificar(name);

    let newartist = await Artist.create({
      id: identificador,
      name: name,
      age: age,
    });
    newartist.dataValues['albums'] = fullUrl + `/artists/${newartist.id}/albums`;
    newartist.dataValues['tracks'] = fullUrl + `/artists/${newartist.id}/tracks`;
    newartist.dataValues['self'] = fullUrl + `/artists/${newartist.id}`;
    console.log(newartist)
    return res.status(201).send(newartist);
  } catch (err) {
    return res.status(400).send({
      message: `Error: ${err.message}`,
    });
  }
},

deleteArtist : async (req, res) => {
    const { artist_id } = req.params;
    if (!artist_id) {
      return res.status(400).send({
        message: 'Please provide a id for the artist you are trying to delete!',
      });
    }
  
    const artist = await Artist.findOne({
      where: {
        id: artist_id
      },
    });
    console.log(artist)
  
    if (!artist) {
      return res.status(404).send();
    }
  
    try {
      await artist.destroy();
      return res.status(204).send();
    } catch (err) {
      return res.status(400).send({
        message: `Error: ${err.message}`,
      });
    }
  }
}