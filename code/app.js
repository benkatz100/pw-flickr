var drop = document.getElementById('drop');
var searchField = document.getElementById('search-field');
var result;
var displayPhotoOn = function (trgt) { return function (photo) {
    var node = document.createElement('DIV');
    node.className = 'photo-container';
    node.addEventListener('click', function () { return node.remove(); });
    var img = new Image();
    img.src = photo.src;
    node.appendChild(img);
    trgt.insertBefore(node, trgt.firstChild);
}; };
var convertFlickrPhoto = function (flickrPhoto) { return ({ src: flickrPhoto.url_s }); };
var convertFromFlickrPhotos = function (flickrPhotos) { return flickrPhotos.map(convertFlickrPhoto); };
var displayPhotosOn = function (trgt) { return function (photos) { return photos.forEach(displayPhotoOn(trgt)); }; };
var addImagesIfEnter = function (ev) { return [ev].filter(function (ev) { return ev.keyCode === 13; }).forEach(addImages); };
var clearSearchField = function () { return searchField.value = ''; };
searchField.addEventListener('keydown', addImagesIfEnter);
function retrieveFlickrPhotos() {
    return fetch("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=437d9159d11ffaefdc98c84d0e55b3a9&text=" + searchField.value + "&per_page=3&format=json&nojsoncallback=1&extras=url_s&sort=relevance")
        .then(function (data) { return data.json(); })
        .then(function (data) { return data.photos.photo; });
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
