let drop = document.getElementById('drop');
let searchField = document.getElementById('search-field');
let searchButton = document.querySelector('.search-button');
var result;
let displayPhotoOn = (trgt) => (photo) => {
    let node = document.createElement('DIV');
    node.className = 'photo-container';
    node.addEventListener('click', () => node.remove());
    let img = new Image();
    img.src = photo.src;
    node.appendChild(img);
    trgt.appendChild(node);
};
let convertFlickrPhoto = (flickrPhoto) => ({ src: flickrPhoto.url_s });
let convertFlickrPhotos = (flickrPhotos) => flickrPhotos.map(convertFlickrPhoto);
let displayPhotosOn = (trgt) => (photos) => photos.forEach(displayPhotoOn(trgt));
let addImagesIfEnter = (ev) => [ev].filter((ev) => ev.keyCode === 13).forEach(addImages);
searchButton.addEventListener('click', addImages);
searchField.addEventListener('keydown', addImagesIfEnter);
function addImages() {
    fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=437d9159d11ffaefdc98c84d0e55b3a9&text=${searchField.value}&per_page=3&format=json&nojsoncallback=1&extras=url_s`)
        .then((data) => data.json())
        .then((data) => data.photos.photo)
        .then(convertFlickrPhotos)
        .then(displayPhotosOn(drop));
}
addImages();
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/app-sw.js').then(function (reg) {
        // registration worked
        console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch(function (error) {
        // registration failed
        console.log('Registration failed with ' + error);
    });
}
;
