const cl =console.log;

const movieContainer =document.getElementById('movieContainer');
const backDropId = document.getElementById('backDropId');
const movieModalId = document.getElementById('movieModalId');
const addMovieBtn = document.getElementById('addMovieBtn');
const movieCloseBtns =[...document.querySelectorAll('.movieClose')]
const movieForm=document.getElementById('movieForm');
const titleControl=document.getElementById('title');
const imageUrlControl=document.getElementById('imageUrl');
const ratingControl=document.getElementById('rating');
const contentControl=document.getElementById('content');
const movieSubmitBtn=document.getElementById('movieSubmitBtnId');
const movieUpdateBtn=document.getElementById('movieUpdateBtnId');

const createMovieCards=(arr)=>{
   let result ='';

arr.forEach(movie =>{
    result += `
      <div class="col-md-4">
     <div class="card movieCard" id="${movie.movieId}">
               <figure class="m-0">
                  <img src="${movie.imageUrl}" alt="" title="">

                  <figcaption>
                     <h2 class="font-weight-bold">${movie.title}</h2>
                     <strong>Rating:${movie.rating}/5</strong>
                     <p class="content">
                        ${movie.content}
                     </p>
                     <div>
                        <button class="btn btn-sm nfx-btn bg-light" onclick="onMovieEdit(this)">
                           Edit
                        </button>
                        <button class="btn btn-sm nfx-btn text-white" onclick="onMovieRemove(this)">
                           Remove
                        </button>
                     </div>
                  </figcaption>
               </figure>
            </div>
            </div>
    `
    movieContainer.innerHTML =result;
})
}

let moviesArr=JSON.parse(localStorage.getItem('moviesArr'))||[];
if(moviesArr.length>0){
   createMovieCards(moviesArr);
}

const generateUuid = () => {
   return (
       String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
   ).replace(/[xy]/g, (character) => {
       const random = (Math.random() * 16) | 0;
       const value = character === "x" ? random : (random & 0x3) | 0x8;

       return value.toString(16);
   });
};



const toggleModalBackDrop=() =>{
   backDropId.classList.toggle('visible');
   movieModalId.classList.toggle('visible');
   movieUpdateBtn.classList.add('d-none');
   movieSubmitBtn.classList.remove('d-none');

   movieForm.reset();
}

const onMovieEdit =(ele)=>{
   toggleModalBackDrop();
   let editId =ele.closest('.movieCard').id;
   cl(editId);
   localStorage.setItem('editMovieId',editId);
   movieUpdateBtn.classList.remove('d-none');
   movieSubmitBtn.classList.add('d-none');

   let editMovieObj =moviesArr.find(movie =>movie.movieId===editId);

   titleControl.value = editMovieObj.title;
   contentControl.value = editMovieObj.content;
   imageUrlControl.value = editMovieObj.imageUrl;
   ratingControl.value =editMovieObj.rating;


}
const onMovieAdd=(eve)=>{
   eve.preventDefault();
   let movieObj ={
      title: titleControl.value,
      imageUrl:imageUrlControl.value,
      content:contentControl.value,
      rating:ratingControl.value,
      movieId:generateUuid()
   }
   cl(movieObj);
   movieForm.reset();
   moviesArr.unshift(movieObj);
   localStorage.setItem('moviesArr',JSON.stringify(moviesArr));
   toggleModalBackDrop();
  Swal.fire({
   title:`New movie ${movieObj.title} Added successfully`,
   timer:3000,
   icon:'success'
  })
 
   // createMovieCards(moviesArr);
   //we will create new card of the new movie object

   let div =document.createElement('div');
   div.className ='col-md-4';
   div.innerHTML =
   `
   <div class="card movieCard" id="${movieObj.movieId}">
               <figure class="m-0">
                  <img src="${movieObj.imageUrl}" alt="" title="">

                  <figcaption>
                     <h2 class="font-weight-bold">${movieObj.title}</h2>
                     <strong>Rating:${movieObj.rating}/5</strong>
                     <p class="content">
                        ${movieObj.content}
                     </p>
                     <div>
                        <button class="btn btn-sm nfx-btn bg-light" onclick="onMovieEdit(this)">
                           Edit
                        </button>
                        <button class="btn btn-sm nfx-btn text-white" onclick="onMovieRemove(this)">
                           Remove
                        </button>
                     </div>
                  </figcaption>
               </figure>
            </div>
   `
   movieContainer.prepend(div)
}

movieCloseBtns.forEach(btn=>{
   btn.addEventListener('click',toggleModalBackDrop);
  
})
const onMovieUpdate =(eve)=>{
   let updateMovieId = localStorage.getItem('editMovieId');
   let updatemovieObj = {
      title:titleControl.value,
      imageUrl:imageUrlControl.value,
      content:contentControl.value,
      rating:ratingControl.value,
      movieId : updateMovieId
   }
   cl(updatemovieObj);
   let getIndex =moviesArr.findIndex(movie=> movie.movieId === updateMovieId);
   moviesArr[getIndex] = updatemovieObj;
   localStorage.setItem('moviesArr',JSON.stringify(moviesArr));
   let getMovieCard =document.getElementById(updateMovieId);
   cl(getMovieCard);
   getMovieCard.innerHTML =`

               <figure class="m-0">
                  <img src="${updatemovieObj.imageUrl}" alt="" title="">

                  <figcaption>
                     <h2 class="font-weight-bold">${updatemovieObj.title}</h2>
                     <strong>Rating:${updatemovieObj.rating}/5</strong>
                     <p class="content">
                        ${updatemovieObj.content}
                     </p>
                     <div>
                        <button class="btn btn-sm nfx-btn bg-light" onclick="onMovieEdit(this)">
                           Edit
                        </button>
                        <button class="btn btn-sm nfx-btn text-white" onclick="onMovieRemove(this)">
                           Remove
                        </button>
                     </div>
                  </figcaption>
               </figure>
           
   `


   toggleModalBackDrop()

}

const onMovieRemove =(ele)=>{
 
   Swal.fire({
      title: "Do you want to remove this movie?",
      showCancelButton: true,
      confirmButtonText: "Remove",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
         let removeId =ele.closest('.movieCard').id;
         cl(removeId);
         //remove from array
         let getIndex =moviesArr.findIndex(movie=> movie.movieId ===removeId);

         moviesArr.splice(getIndex,1)
         //remove from ls
         localStorage.setItem('moviesArr',JSON.stringify(moviesArr))

         //remove from ui
         ele.closest('.movieCard').parentElement.remove();

         Swal.fire({
            title:`Movie removed successfully`,
            timer:3000,
            icon:'success'
         })

      }
    });

}
addMovieBtn.addEventListener('click',toggleModalBackDrop);
movieForm.addEventListener('submit',onMovieAdd);
movieUpdateBtn.addEventListener('click',onMovieUpdate);