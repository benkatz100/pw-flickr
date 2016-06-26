let drop = document.getElementById('drop');
let searchField: HTMLInputElement = <HTMLInputElement>document.getElementById('search-field');
var result: any;

interface FlickrPhoto {
  url_s: string;
}
interface Photo {
  src: string;
}
let displayPhotoOn = (trgt: HTMLElement) => (photo: Photo) => {
  let node: HTMLElement = document.createElement('DIV');
  node.className = 'photo-container';
  node.addEventListener('click', () => node.remove());
  let img: HTMLImageElement = new Image();
  img.src = photo.src;
  node.appendChild(img);
  trgt.insertBefore(node, trgt.firstChild);
}

let convertFlickrPhoto: (fp: FlickrPhoto) => Photo = (flickrPhoto: FlickrPhoto) => ({src: flickrPhoto.url_s});
let convertFromFlickrPhotos = (flickrPhotos: Array<FlickrPhoto>) => flickrPhotos.map(convertFlickrPhoto);
let displayPhotosOn = (trgt: HTMLElement) => (photos: Array<Photo>) => photos.forEach(displayPhotoOn(trgt));
let addImagesIfEnter = (ev: KeyboardEvent) => [ev].filter((ev: KeyboardEvent) => ev.keyCode === 13).forEach(addImages);
let clearSearchField = () => searchField.value = '';

searchField.addEventListener('keydown', addImagesIfEnter);

function retrieveFlickrPhotos() {
  return fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=437d9159d11ffaefdc98c84d0e55b3a9&text=${searchField.value}&per_page=3&format=json&nojsoncallback=1&extras=url_s&sort=relevance`)
    .then((data: any) => data.json())
    .then((data: any) => data.photos.photo);
}

function addImages() {
  retrieveFlickrPhotos()
    .then(convertFromFlickrPhotos)
    .then(displayPhotosOn(drop))
    .then(clearSearchField)
}

addImages();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./app-sw.js').then(function(reg: any) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error: string) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
};
