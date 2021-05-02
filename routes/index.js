const { Router } = require('express');
const artists = require('../controllers').artists;
const albums = require('../controllers').albums;
const tracks = require('../controllers').tracks;

const router = Router();

router.get('/', (req, res) => res.send('Welcome'))

//Artist
//Obtiene todos los artistas
router.get('/artists', artists.getArtists);
//Obtiene artista por ID
router.get('/artists/:artist_id', artists.getArtist);

//Obtiene todos los albums del artista
router.get('/artists/:artist_id/albums', albums.getAllArtistAlbums)
//Obtiene todas las canciones del artista
router.get('/artists/:artist_id/tracks', tracks.getAllArtistTracks);

//Crea un artista
router.post('/artists', artists.createArtist);

//Crea un album
router.post('/artists/:artist_id/albums', albums.createAlbum);

//Elimina un artistas
router.delete('/artists/:artist_id', artists.deleteArtist);

//Reproducheroku logs --taile todas las canciones de un artista
router.put('/artists/:artist_id/albums/play', tracks.playTrackAlbum)

//Album
//Obtiene todos los albums
router.get('/albums', albums.getAlbums);
//Obtiene album por ID
router.get('/albums/:album_id', albums.getAlbum);
//Obtiene todas las canciones del álbum
router.get('/albums/:album_id/tracks', tracks.getAllAlbumTracks);

//Crea un track
router.post('/albums/:album_id/tracks', tracks.createTrack);

//Elimina un album
router.delete('/albums/:album_id', albums.deleteAlbum);

//Reproduce todas las canciones de un album
router.put('/albums/:album_id/tracks/play', tracks.playTrackAlbum)

//Track
//Obtiene todos los tracks
router.get('/tracks', tracks.getTracks);
//Obtiene track por ID
router.get('/tracks/:track_id', tracks.getTrack);

//Elimina un track
router.delete('/tracks/:track_id', tracks.deleteTrack);

//Reproduce una cancion 
router.put('/tracks/:track_id/play', tracks.playTrack)

module.exports = router;