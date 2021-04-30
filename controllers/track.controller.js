const btoa = require('btoa')
const db = require('../database/models');
const Track = db.Track;

module.exports = {
getTracks : async (req,res) => {
    const tracks = await Track.findAll();
    var fullUrl = req.protocol + '://' + req.get('host')

    tracks.forEach(element => {
      element.dataValues['artist'] = fullUrl + `/artists/${element.artist_id}`;
      element.dataValues['album'] = fullUrl + `/albums/${element.album_id}`;
      element.dataValues['self'] = fullUrl + `/tracks/${element.id}`;
    });

    return res.status(200).send(tracks); 
},

//Obtener track por trackId
getTrack : async (req, res) => {
    const { track_id } = req.params;
    var fullUrl = req.protocol + '://' + req.get('host')

    const track = await Track.findOne({
      where: {
        id: track_id,
      },
    });
  
    if (!track) {
      return res.status(400).send({
        message: `No track found with the id ${track_id}`,
      });
    }
    track.dataValues['artist'] = fullUrl + `/artists/${track.album_id}`;
    track.dataValues['self'] = fullUrl + `/tracks/${track.id}`;
    track.dataValues['self'] = fullUrl + `/tracks/${track.id}`;

    return res.status(200).send(track);
},

//Obtener tracks de un artista
getAllArtistTracks : async (req, res) => {
    const { artist_id } = req.params;
    var fullUrl = req.protocol + '://' + req.get('host')

    const tracks = await Track.findAll({
      where: {
        artist_id: artist_id,
      },
    });
  
    if (tracks.length == 0) {
      return res.status(400).send({
        message: `No tracks were found for the artist with id ${artist_id}`,
      });
    }

    tracks.forEach(element => {
      element.dataValues['artist'] = fullUrl + `/artists/${element.artist_id}`;
      element.dataValues['album'] = fullUrl + `/albums/${element.album_id}`;
      element.dataValues['self'] = fullUrl + `/tracks/${element.id}`;
    });

    return res.status(200).send(tracks);
},

//Obtener tracks de un album
getAllAlbumTracks : async (req, res) => {
    const { album_id } = req.params;
    var fullUrl = req.protocol + '://' + req.get('host')
  
    const tracks = await Track.findAll({
      where: {
        album_id: album_id,
      },
    });
  
    if (tracks.length == 0) {
      return res.status(400).send({
        message: `No albums were found with id ${album_id}`,
      });
    }
    tracks.forEach(element => {
      element.dataValues['artist'] = fullUrl + `/artists/${element.artist_id}`;
      element.dataValues['album'] = fullUrl + `/albums/${element.album_id}`;
      element.dataValues['self'] = fullUrl + `/tracks/${element.id}`;
    });

    return res.status(200).send(tracks);
},

//Crea Track
createTrack : async (req, res) => {
    const { album_id } = req.params;
    const { name, duration } = req.body;
    var fullUrl = req.protocol + '://' + req.get('host')

    if (!name || !duration) {
      return res.status(400).send({
        message: 'Please provide the tracks name and duration to create it!',
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

    //Agregar error si no cumple con formato
    let trackidExists = await Track.findOne({
      where: {
        id: codificar(`${name}:${album_id}`),
      },
    });
  
    if (trackidExists) {
      trackidExists.dataValues['artist'] = fullUrl + `/artists/${trackidExists.album_id}`;
      trackidExists.dataValues['self'] = fullUrl + `/tracks/${trackidExists.id}`;
      trackidExists.dataValues['self'] = fullUrl + `/tracks/${trackidExists.id}`;
      return res.status(409).send({
        message: 'A track with that id already exists!',
        body: trackidExists,
      });
    }

    let album = await db.Album.findOne({
        where: {
          id: album_id,
        },
       });
    
    if (!album) {
        return res.status(422).send({
          message: `No tracks were found for the album with id ${album_id}`,
        });
      } 
  
    try {

      let identificador = codificar(`${name}:${album_id}`);

      let newtrack = await Track.create({
        id: identificador,
        artist_id: album.artist_id,
        album_id: album_id,
        name: name,
        duration: duration,
        times_played: 0
      });

      newtrack.dataValues['artist'] = fullUrl + `/artists/${newtrack.album_id}`;
      newtrack.dataValues['self'] = fullUrl + `/tracks/${newtrack.id}`;
      newtrack.dataValues['self'] = fullUrl + `/tracks/${newtrack.id}`;

      return res.status(201).send(newtrack);
    } catch (err) {
      return res.status(400).send({
        message: `Error: ${err.message}`,
      });
    }
  },

  deleteTrack : async (req, res) => {
    const { track_id } = req.params;
    if (!track_id) {
      return res.status(400).send({
        message: 'Please provide a id for the track you are trying to delete!',
      });
    }
  
    const track = await Track.findOne({
      where: {
        id: track_id
      },
    });
  
    if (!track) {
      return res.status(404).send({
        message: `No track found with the id ${track_id}`,
      });
    }
  
    try {
      await track.destroy();
      return res.status(204).send({
        message: `Track ${track_id} has been deleted!`,
      });
    } catch (err) {
      return res.status(400).send({
        message: `Error: ${err.message}`,
      });
    }
  },


//play id
playTrack : async (req, res) => {
  const { track_id } = req.params;

  const track = await Track.findOne({
    where: {
      id: track_id,
    },
  });

  if (!track) {
    return res.status(404).send({
      message: `No track found with the id ${track_id}`,
    });
  }

  try {
    track.times_played += 1;
    track.save();

    return res.status(200).send({
      message: `Track ${track_id} has been played!`,
    });
  } catch (err) {
    return res.status(400).send({
      message: `Error: ${err.message}`,
    });
  }
},

//play artist
playTrackArtist : async (req, res) => {
    const { artist_id } = req.params;
  
    const tracks = await Track.findAll({
      where: {
        artist_id: artist_id,
      },
    });
  
    if (tracks.length==0) {
        return res.status(404).send({
            message: `No artist found with the id ${id}`,
      });
    }
  
    try {
      
      tracks.forEach(track => {
        track.times_played += 1;
        track.save();
      });
  
      return res.status(200).send({
        message: `All the tracks from the artist ${artist_id} have been played!`,
      });
    } catch (err) {
      return res.status(400).send({
        message: `Error: ${err.message}`,
      });
    }
  },

//playAlbum
playTrackAlbum : async (req, res) => {
    const { album_id } = req.params;
  
    const tracks = await Track.findAll({
      where: {
        album_id: album_id,
      },
    });
  
    if (tracks.length==0) {
        return res.status(404).send({
            message: `No album found with the id ${album_id}`,
      });
    }
  
    try {
      tracks.forEach(track => {
        track.times_played += 1;
        track.save();
      });
  
      return res.status(200).send({
        message: `All the tracks from the album ${album_id} have been played!`,
      });
    } catch (err) {
      return res.status(400).send({
        message: `Error: ${err.message}`,
      });
    }
  }
}
