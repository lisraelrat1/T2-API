const btoa = require('btoa')
const db = require('../database/models');
const Album = db.Album;

module.exports = {
getAlbums : async (req,res) => {
    const albums = await Album.findAll();
    var fullUrl = req.protocol + '://' + req.get('host')

    albums.forEach(element => {
      element.dataValues['artist'] = fullUrl + `/artists/${element.artist_id}`;
      element.dataValues['tracks'] = fullUrl + `/albums/${element.id}/tracks`;
      element.dataValues['self'] = fullUrl + `/albums/${element.id}`;
    });

    return res.status(200).send(albums); 
},

//Obtener álbum por AlbumId
getAlbum : async (req, res) => {
    const { album_id } = req.params;
  
    const album = await Album.findOne({
      where: {
        id: album_id,
      },
    });
  
    if (!album) {
      return res.status(400).send({
        message: `No album found with the id ${album_id}`,
      });
    }
    var fullUrl = req.protocol + '://' + req.get('host')
    album.dataValues['artist'] = fullUrl + `/artists/${album.artist_id}`;
    album.dataValues['tracks'] = fullUrl + `/albums/${album.id}/tracks`;
    album.dataValues['self'] = fullUrl + `/albums/${album.id}`;

    return res.status(200).send(album);
},

//Obtener todos los albums con ArtistId
getAllArtistAlbums : async (req, res) => {
    const { artist_id } = req.params;

    const artist = await db.Artist.findOne({
      where:{
        id: artist_id
      }
    })

    if (!artist){
      return res.status(400).send({
      message: `No artist found with id ${artist_id }`
        }
      )};
  
    const albums = await Album.findAll({
      where: {
        artist_id: artist_id,
      },
    });

    var fullUrl = req.protocol + '://' + req.get('host')

    albums.forEach(element => {
      element.dataValues['artist'] = fullUrl + `/artists/${element.artist_id}`;
      element.dataValues['tracks'] = fullUrl + `/albums/${element.id}/tracks`;
      element.dataValues['self'] = fullUrl + `/albums/${element.id}`;
    });

    return res.status(200).send(albums);
},

//Crea Album
createAlbum : async (req, res) => {
    const { artist_id } = req.params;
    const { name, genre } = req.body;
    var fullUrl = req.protocol + '://' + req.get('host')

    if (!name || !genre) {
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

    let albumidExists = await Album.findOne({
      where: {
        id: codificar(`${name}:${artist_id}`),
      },
    });
  
    if (albumidExists) {
      albumidExists.dataValues['artist'] = fullUrl + `/artists/${albumidExists.artist_id}`;
      albumidExists.dataValues['tracks'] = fullUrl + `/albums/${albumidExists.id}/tracks`;
      albumidExists.dataValues['self'] = fullUrl + `/albums/${albumidExists.id}`;

      return res.status(409).send({
        message: 'An album with that id already exists!',
        body: albumidExists,
      });
    }

    let artist = await db.Artist.findOne({
        where: {
          id: artist_id,
        },
      });
    
    if (!artist) {
        return res.status(422).send({
          message: `No artist were found for the artist with id ${artist_id}`,
        });
      }
  
    try {

      let identificador = codificar(`${name}:${artist_id}`);

      let newalbum = await Album.create({
        id: identificador,
        artist_id: artist_id,
        name: name,
        genre: genre,
      });
      newalbum.dataValues['artist'] = fullUrl + `/artists/${newalbum.artist_id}`;
      newalbum.dataValues['tracks'] = fullUrl + `/albums/${newalbum.id}/tracks`;
      newalbum.dataValues['self'] = fullUrl + `/albums/${newalbum.id}`;
      return res.status(201).send(newalbum);
    } catch (err) {
      return res.status(400).send({
        message: `Error: ${err.message}`,
      });
    }
  },

deleteAlbum : async (req, res) => {
    const { album_id } = req.params;
    if (!album_id) {
      return res.status(400).send({
        message: 'Please provide a id for the album you are trying to delete!',
      });
    }
  
    const album = await Album.findOne({
      where: {
        id: album_id
      },
    });
  
    if (!album) {
      return res.status(404).send({
        message: `No album found with the id ${album_id}`,
      });
    }
  
    try {
      await album.destroy();
      return res.status(204).send({
        message: `Album ${album_id} has been deleted!`,
      });
    } catch (err) {
      return res.status(400).send({
        message: `Error: ${err.message}`,
      });
    }
  },
}
