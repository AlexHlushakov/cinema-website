const firebaseConfig = {
   apiKey: "AIzaSyCsuO-6sH18GVSyAdFSAspbPcdJHSuThR0",
   authDomain: "cinema-web-9498f.firebaseapp.com",
   projectId: "cinema-web-9498f",
   storageBucket: "cinema-web-9498f.appspot.com",
   messagingSenderId: "292019932133",
   appId: "1:292019932133:web:177845f372bf9695ca7d0c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

window.onload = function () {
   fillSeats();
};


// Initialize variables
const bigRowBlock = document.querySelector('.big'),
   smallRowBlock = document.querySelectorAll('.small'),
   currentPrice = document.querySelector('.current-price'),
   cinema = document.querySelector('#cinema-selector'),
   time = document.querySelector('#time-selector'),
   movie = document.querySelector('.film-title'),
   buyBtn = document.querySelector('#buy-btn'),
   dates = document.querySelectorAll('.session-date-item'),
   headerLogo = document.querySelector('.header-logo'),
   moreDesc = document.querySelector('#more-btn'),
   menu = document.querySelector('.menu');


let chosenSeats = [], chosenDate, chosenMonth, chosenCinema = cinema.value, chosenTime = time.value, chosenMovie = movie.textContent, ticketPrice = 400;


// event listeners
headerLogo.addEventListener('click', (e) => {
   e.preventDefault();
   if (menu.className !== 'menu active-menu') {
      menu.classList.add('active-menu')
   } else {
      menu.classList.remove('active-menu')
   }
})

moreDesc.addEventListener('click', (e) => {
   e.preventDefault();
   const description = document.querySelector('.film-description');
   if (description.className !== 'film-description open') {
      description.classList.add('open')
   } else {
      description.classList.remove('open')
   }
})

cinema.addEventListener("change", () => {
   chosenCinema = cinema.value;
   refreshSeats();
})

time.addEventListener('change', () => {
   chosenTime = time.value;
   refreshSeats();
})


function dateListener(currentDate) {
   currentDate.addEventListener('click', () => {
      for (let date of dates) {
         date.classList.remove('active');
      };
      currentDate.classList.add("active");
      chosenDate = currentDate.childNodes[3].textContent;
      chosenMonth = currentDate.childNodes[1].textContent;
      refreshSeats();
   })
}


for (let i = 0; i < dates.length; i++) {
   if (dates[i].className === "session-date-item active") {
      chosenDate = dates[i].childNodes[3].textContent;
      chosenMonth = dates[i].childNodes[1].textContent;
      dateListener(dates[i]);
   } else {
      dateListener(dates[i]);
   }
}




buyBtn.addEventListener('click', () => {
   occupyingSeats(chosenSeats);
   saveToFirestore().then(() => {
      chosenSeats = [];
      console.log("saving is finished");
      updatePrice();
   });
})




//functions

function refreshSeats() {
   bigRowBlock.innerHTML = '';
   smallRowBlock[0].innerHTML = '';
   smallRowBlock[1].innerHTML = '';
   fillSeats();
}


function fillSeats() {
   async function getSeats() {
      const snapshot = await db.collection('movie').doc(`${chosenMovie}`).collection(`${chosenCinema}`).doc(`${chosenDate}` + `${chosenMonth}`).collection(`${chosenTime}`).get()
      return snapshot.docs.map(doc => doc.data());
   }
   getSeats().then(
      function (results) {
         console.log(results)
         for (let item of results) {
            let textId = item.elemId, cl = item.class;
            if (textId.includes('bigRowBlock_')) {
               let seat = document.createElement("div");
               seat.className = cl;
               seat.id = textId;
               bigRowBlock.append(seat);
            } else if (textId.includes('smallRowBlock_1block')) {
               let seat = document.createElement("div")
               seat.className = cl;
               seat.id = textId;
               smallRowBlock[0].append(seat);
            } else if (textId.includes('smallRowBlock_2block')) {
               let seat = document.createElement("div")
               seat.className = cl;
               seat.id = textId;
               smallRowBlock[1].append(seat);
            }
         }
         chosenSeats = [];
         updatePrice();
         chooseSeat();
         console.log(`${chosenMovie}`, `${chosenCinema}`, `${chosenDate}` + `${chosenMonth}`, `${chosenTime}`);
      }
   );
}

function chooseSeat() {
   const seats = document.querySelectorAll('.seat-single')
   console.log(seats);
   for (let seat of seats) {
      seat.addEventListener('click', () => {
         if (seat.className === "seat-single available") {
            seat.classList.remove("available")
            seat.classList.add("chosen")
            chosenSeats.push(seat);
            updatePrice();
         } else if (seat.className === "seat-single chosen") {
            seat.classList.remove("chosen")
            seat.classList.add("available")
            chosenSeats.pop(seat);
            updatePrice();
         } else if (seat.className === "seat-single unavailable") {
            alert("This seat is already booked. Please choose another one")
         }
         console.log(seat, chosenSeats);
      })
   }
}


function updatePrice() {
   let price = chosenSeats.length * ticketPrice;
   currentPrice.innerText = `${price} ₽`;
}


function occupyingSeats(seats) {
   for (let seat of seats) {
      if (seat.className === "seat-single chosen") {
         seat.classList.remove("chosen")
         seat.classList.add("unavailable")
      }
   }
}


async function saveToFirestore() {
   if (chosenSeats === false) return;
   else {
      console.log("firestore info:", `${chosenMovie}`, `${chosenCinema}`, `${chosenDate}` + `${chosenMonth}`, `${chosenTime}`, chosenSeats);
      for (let seat of chosenSeats) {
         await db.collection('movie').doc(`${chosenMovie}`).collection(`${chosenCinema}`).doc(`${chosenDate}` + `${chosenMonth}`).collection(`${chosenTime}`).doc(`${seat.id}`).set({
            class: seat.className,
            elemId: seat.id
         })
         console.log(seat + " saved");
      }
   }
}



//service function for cleaning seats layout from unavailables

function clearSeats() {
   const seats = document.querySelectorAll('.seat-single');
   chosenSeats = [];
   for (let seat of seats) {
      if (seat.className === "seat-single chosen") {
         seat.classList.remove("chosen");
         seat.classList.add("available");
         chosenSeats.push(seat);
      } else if (seat.className === "seat-single unavailable") {
         seat.classList.remove("unavailable");
         seat.classList.add("available");
         chosenSeats.push(seat);
      }
   }
   saveToFirestore(seats).then(() => {
      chosenSeats = [];
      console.log("seats reloaded");
   });
}