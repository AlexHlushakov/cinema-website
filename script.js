const bigRowBlock = document.querySelector('.big'),
   smallRowBlock = document.querySelectorAll('.small'),
   currentPrice = document.querySelector('.current-price'),
   cinema = document.querySelector('#cinema-selector'),
   time = document.querySelector('#time-selector'),
   movie = document.querySelector('.film-title'),
   buyBtn = document.querySelector('#buy-btn');


let bigRowCount = 76, smallRowCount = 40, ticketPrice = 400;

function fillSeats() {
   for (let i = 0; i < bigRowCount; i++) {
      let seat = document.createElement("div");
      seat.className = "seat-single available";
      bigRowBlock.append(seat);
   }
   for (let i = 0; i < smallRowBlock.length; i++) {
      for (let j = 0; j < smallRowCount; j++) {
         let seat = document.createElement("div")
         seat.className = "seat-single available";
         smallRowBlock[i].append(seat);
      }
   }
}

fillSeats();


cinema.addEventListener("change", () => {
   chosenCinema = cinema.value;
})

time.addEventListener('change', () => {
   chosenTime = time.value;
})

const seats = document.querySelectorAll('.seat-single'),
   dates = document.querySelectorAll('.session-date-item');
console.log(seats);
let chosenSeats = [], chosenDate, chosenMonth, chosenCinema = cinema.value, chosenTime = time.value, chosenMovie = movie.textContent;

for (let i = 0; i < dates.length; i++) {
   dates[i].addEventListener('click', () => {
      for (let date of dates) {
         date.classList.remove('active');
      };
      dates[i].classList.add("active")
      chosenDate = dates[i].childNodes[3].textContent;
      chosenMonth = dates[i].childNodes[1].textContent;
      console.log(chosenDate, chosenMovie, chosenMonth, chosenCinema, chosenTime);
   })
}


for (let seat of seats) {
   console.log(seat);
   seat.addEventListener('click', () => {
      console.log(seat, chosenSeats);
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
   })
}


function updatePrice() {
   let price = chosenSeats.length * ticketPrice;
   currentPrice.innerText = `${price} ₽`;
}

updatePrice();


/*function occupyingSeats() {
   for (let seat of seats) {
      if (seat.className === "seat-single chosen") {
         seat.classList.remove("chosen")
         seat.classList.add("unavailable")
      }
   }
}

function submitToJson() {
   LocalStorage.setItem("selectedMovie", chosenMovie);
   LocalStorage.setItem("selectedCinema", chosenCinema);
   LocalStorage.setItem("selectedMonth", chosenMonth);
   LocalStorage.setItem("selectedDate", chosenDate);
   LocalStorage.setItem("selectedTime", chosenTime);
   LocalStorage.setItem("seats", JSON.stringify(seats));
}

buyBtn.addEventListener('click', () => {
   occupyingSeats();
   submitToJson();
})*/