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
      return res.status(404).send({
        message: `No artist found with the id ${artist_id}`,
      });
    }

    var fullUrl = req.protocol + '://' + req.get('host')
    artist.dataValues['albums'] = fullUrl + `/artists/${artist.id}/albums`;
    artist.dataValues['tracks'] = fullUrl + `/artists/${artist.id}/tracks`;
    artist.dataValues['self'] = fullUrl + `/artists/${artist.id}`;
    return res.status(200).send(artist);
},

createArtist : async (req, res) => {
    console.log(req.originalUrl)
    const { name, age } = req.body;
    console.log(name, age)
    if (!name || !age) {
      return res.status(400).send({
        message: 'Please provide the artist name and age to create an artist!',
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
  
    if (artistidExists) {
      var fullUrl = req.protocol + '://' + req.get('host')
      artistidExists.dataValues['albums'] = fullUrl + `/artists/${artistidExists.id}/albums`;
      artistidExists.dataValues['tracks'] = fullUrl + `/artists/${artistidExists.id}/tracks`;
      artistidExists.dataValues['self'] = fullUrl + `/artists/${artistidExists.id}`;

      return res.status(409).send({
        message: 'An artist with that id already exists!',
        body: artistidExists,
      });
    }
  
    try {

      let identificador = codificar(name);
      var fullUrl = req.protocol + '://' + req.get('host')

      let newartist = await Artist.create({
        id: identificador,
        name: name,
        age: age,
      });
      newartist.dataValues['albums'] = fullUrl + `/artists/${identificador}/albums`;
      newartist.dataValues['tracks'] = fullUrl + `/artists/${identificador}/tracks`;
      newartist.dataValues['self'] = fullUrl + `/artists/${identificador}`;
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
  
    if (!artist) {
      return res.status(404).send({
        message: `No artist found with the id ${artist_id}`,
      });
    }
  
    try {
      
      await artist.destroy();
      return res.status(204).send({
        message: `Artist ${artist_id} has been deleted!`,
      });
    } catch (err) {
      return res.status(400).send({
        message: `Error: ${err.message}`,
      });
    }
  }
}