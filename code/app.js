let drop = document.getElementById('drop');
let searchField = document.getElementById('search-field');
var result;
let displayPhotoOn = (trgt) => (photo) => {
    let node = document.createElement('DIV');
    node.className = 'photo-container';
    node.addEventListener('click', () => node.remove());
    let img = new Image();
    img.src = photo.src;
    img.alt = searchField.value;
    node.appendChild(img);
    trgt.insertBefore(node, trgt.firstChild);
};
let convertFlickrPhoto = (flickrPhoto) => ({ src: flickrPhoto.url_s });
let convertFromFlickrPhotos = (flickrPhotos) => flickrPhotos.map(convertFlickrPhoto);
let displayPhotosOn = (trgt) => (photos) => photos.forEach(displayPhotoOn(trgt));
let addImagesIfEnter = (ev) => [ev].filter((ev) => ev.keyCode === 13).forEach(addImages);
let clearSearchField = () => searchField.value = '';
searchField.addEventListener('keydown', addImagesIfEnter);
function retrieveFlickrPhotos() {
    return fetch(`https://api.flickr.com/services/rest/?` +
        `method=flickr.photos.search&api_key=437d9159d11ffaefdc98c84d0e55b3a9&text=${searchField.value}` +
        `&per_page=3&format=json&nojsoncallback=1&extras=url_s&sort=relevance`)
        .then((data) => data.json())
        .then((data) => data.photos.photo);
}
function addImages() {
    retrieveFlickrPhotos()
        .then(convertFromFlickrPhotos)
        .then(displayPhotosOn(drop))
        .then(clearSearchField);
}
addImages();
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./app-sw.js').then(function (reg) {
        // registration worked
        console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch(function (error) {
        // registration failed
        console.log('Registration failed with ' + error);
    });
}
;
