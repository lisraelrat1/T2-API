const btoa = require('btoa')
const db = require('../database/models');
const Track = db.Track;

module.exports = {
getTracks : async (req,res) => {
    const tracks = await Track.findAll();
    var fullUrl = req.protocol + '://' + req.get('host')

    let tracks_edited = []
    tracks.forEach(element => {
      tracks_edited.push({
        id: element.id,
        album_id: element.album_id,
        name: element.name,
        duration: element.duration,
        times_played: element.times_played,
        artist: fullUrl + `/artists/${element.artist_id}`,
        album: fullUrl + `/albums/${element.album_id}`,
        self: fullUrl + `/tracks/${element.id}`
      })
    });

    return res.status(200).send(tracks_edited);
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

    return res.status(200).send(
      {
        id: track.id,
        album_id: track.album_id,
        name: track.name,
        duration: track.duration,
        times_played: track.times_played,
        artist: fullUrl + `/artists/${track.artist_id}`,
        album: fullUrl + `/albums/${track.album_id}`,
        self: fullUrl + `/tracks/${track.id}`
      }
    );
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

    const artist = await db.Artist.findOne({
      where: {
        id: artist_id
      },
    });
  
    if (!artist) {
      return res.status(400).send({
        message: `No artist with id ${artist_id} was found`,
      });
    }

    let tracks_edited = []
    tracks.forEach(element => {
      tracks_edited.push({
        id: element.id,
        album_id: element.album_id,
        name: element.name,
        duration: element.duration,
        times_played: element.times_played,
        artist: fullUrl + `/artists/${element.artist_id}`,
        album: fullUrl + `/albums/${element.album_id}`,
        self: fullUrl + `/tracks/${element.id}`
      })
    });

    return res.status(200).send(tracks_edited);
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

    const album = await db.Album.findOne({
      where: {
        id: album_id
      }
    })

    if (!album){
      return res.status(400).send({
        message: `No albums were found with id ${album_id}`,
      });
    }

    let tracks_edited = []
    tracks.forEach(element => {
      tracks_edited.push({
        id: element.id,
        album_id: element.album_id,
        name: element.name,
        duration: element.duration,
        times_played: element.times_played,
        artist: fullUrl + `/artists/${element.artist_id}`,
        album: fullUrl + `/albums/${element.album_id}`,
        self: fullUrl + `/tracks/${element.id}`
      })
    });

    return res.status(200).send(tracks_edited);
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
      return res.status(409).send({
        message: 'A track with that id already exists!',
        body: {
          id: trackidExists.id,
          album_id: trackidExists.album_id,
          name: trackidExists.name,
          duration: trackidExists.duration,
          times_played: trackidExists.times_played,
          artist: fullUrl + `/artists/${trackidExists.artist_id}`,
          album: fullUrl + `/albums/${trackidExists.album_id}`,
          self: fullUrl + `/tracks/${trackidExists.id}`
        }
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

      return res.status(201).send(
        {
          id: newtrack.id,
          album_id: newtrack.album_id,
          name: newtrack.name,
          duration: newtrack.duration,
          times_played: newtrack.times_played,
          artist: fullUrl + `/artists/${newtrack.artist_id}`,
          album: fullUrl + `/albums/${newtrack.album_id}`,
          self: fullUrl + `/tracks/${newtrack.id}`
        }
      );
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
      return res.status(404).send({
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


    const artist = await db.Artist.findOne({
      where: {
        id: artist_id,
      },
    });

    if (!artist) {
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
    
    const album = await db.Album.findOne({
      where:{
        id: album_id,
      }
    });

    if (!album) {
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
