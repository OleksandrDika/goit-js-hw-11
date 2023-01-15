import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const axios = require('axios');

const form = document.querySelector('#search-form');
const input = document.querySelector('.form_input');
const card = document.querySelector('.gallery');
const butLoadMore = document.querySelector('.load-more');

butLoadMore.addEventListener('click', loadMore);
butLoadMore.style.visibility = "hidden";
form.addEventListener("submit", onsubmit);


const KEY = "32828546-a8b3cc930d15adedebd405197"
const BASE_URL = "https://pixabay.com/api/"
const OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true'


function onsubmit(event) {
    event.preventDefault()
    card.innerHTML=''; 
    const name = input.value;     
    
    console.log(name)
    fetchImages(name).then(data=> {
        console.log(data)
        console.log(data.hits)
        console.log(data.totalHits)

        if (data.hits.length === 0) {          
          Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please, try again') 
          return         
        } else  {
          createMarkup(data.hits)
        butLoadMore.style.visibility = "visible";
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)

        }       
        
    })       
}


let page = 1;
function fetchImages(name) {
   
    const resp = fetch(`${BASE_URL}?key=${KEY}&q=${name}&${OPTIONS}&per_page=40&page=${page}`).then(resp => {
        console.log(resp);
        if (!resp.ok) {
            throw new Error(resp.statusText)
        }        
           page+=1;
           return resp.json();
       
    })
    .catch(err => Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please, try again'))
    return resp;
    
}

function createMarkup (arr) {
    const markup = arr.map(item => `      
    <a class="gallery_item" href="${item.largeImageURL}"><div class="photo-card">
    <img src="${item.webformatURL}" alt="${item.tegs}" loading="lazy" width="400" height="250"/>
    <div class="info">
      <p class="info-item">
        <b>Likes ${item.likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${item.views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${item.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${item.downloads}</b>
      </p>
    </div>
  </div></a>`).join('');
    card.insertAdjacentHTML('beforeend', markup)
}

new SimpleLightbox('.gallery a', 
{ 
captions: true, 
nav: true,
captionDelay: 250, 
}
);

// let gallery = new SimpleLightbox('.gallery a');
// gallery.on('show.simplelightbox', function () {
// 	console.log('SSSS')
// });

function loadMore (event) {
  console.log('OK')
  const name = input.value;
     
  console.log("OK")
  console.log(name)
  fetchImages(name).then(data=> {
      console.log(data.hits)
      console.log(data.totalHits)

      if (data.hits.length === 0) {
        
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please, try again')
      }
      createMarkup(data.hits)

  })    
};


// var gallery = $('.gallery a').simpleLightbox();

// gallery.next();