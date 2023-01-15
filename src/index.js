import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// const axios = require('axios');

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

let page = 1;
const optionsLightbox = { 
  captions: true,
  captionsData: 'alt',   
  captionDelay: 250,
  enableKeyboard: true,
  animationSpeed: 150,
  fadeSpeed: 200,
};

const lightbox = new SimpleLightbox('.gallery a', optionsLightbox);

async function onsubmit(event) {
    event.preventDefault()
    card.innerHTML=''; 
    page = 1;
    const name = input.value;
    if (name) {
      try {
        const data = await fetchImages(name)
        if (data.hits.length === 0) {          
          Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please, try again') 
          return         
        } else  {
          createMarkup(data.hits)
        butLoadMore.style.visibility = "visible";
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
        lightbox.refresh();
  
        }
      } catch (error) {
        Notiflix.Notify.failure('Error, try again')
      }  
      
    }    
    
    console.log(name)   

          
}

async function fetchImages(name) {

  try {
    const resp =await axios.get(`${BASE_URL}?key=${KEY}&q=${name}&${OPTIONS}&per_page=40&page=${page}`)
    page+=1;
    return resp.data;
    
  } catch (error) {
    throw new Error(Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`));
  }  
      
};

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


async function loadMore (event) {
  
  const name = input.value;      
  try {
    const data = await fetchImages(name)   
    if (data.hits.length === 0) {
      
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please, try again')
      butLoadMore.style.visibility = "hidden"
    }
    createMarkup(data.hits)
    lightbox.refresh();

} 
   catch (error) {
    console.log(error)
  }
       
};

