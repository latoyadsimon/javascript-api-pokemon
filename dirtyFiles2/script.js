// import fetch from "node-fetch";

// type colors from ref
const typeColor = {
  bug: "#26de81",
  dark: "#736c75",
  dragon: "#ffeaa7",
  electric: "#fed330",
  fairy: "#FF0069",
  fighting: "#30336b",
  fire: "#f0932b",
  flying: "#81ecec",
  grass: "#00b894",
  ground: "#EFB549",
  ghost: "#a55eea",
  ice: "#74b9ff",
  normal: "#95afc0",
  poison: "#6c5ce7",
  psychic: "#a29bfe",
  rock: "#2d3436",
  steel: "#89A1B0",
  water: "#0190FF",
};
// if i wanna change the colors later, use this ref for colors:
// https://www.pokemonaaah.net/artsyfartsy/colordex/

const allPokeUrl = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
const pokeUrl = "https://pokeapi.co/api/v2/pokemon/";

//random number generator
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

let max = 0;
let pokeNeeded = 30;
let pokeNums = [];
let pokeData = [];
let pokemonData;
let allCards;
let allPokeCards;
let imageWrapperSet;
let filler = `./assets/images/crewmate-among-us-big-keychains.jpg`;

//this randomly selects 30 pokemon based off all pokemon currently in the pokeapi
const selectNumbers = (data) => {
  max = data.count;

  if (pokeNums.length > 0 && pokeNums.length < 30) {
    pokeNeeded = 30 - pokeNums.length;
    console.log("30 -", pokeNums.length, "=", pokeNeeded);
  }

  for (let i = 1; i <= pokeNeeded; i++) {
    let poke = getRandomInt(max);
    if (data.results.includes(data.results[poke]) && !pokeNums.includes(poke)) {
      pokeNums.push(poke);
      pokeData.push(data.results[poke]);
    }
  }

  console.log("Now this is pokeNums.length: ", pokeNums.length);

  if (pokeNums.length < 30) {
    selectNumbers(data);
  } else {
    console.log("this is pokeNums: ", pokeNums);
  }
};

//logic to make everything work
//this fetches data from the pokeapi
const getData = () => {
  return fetch(allPokeUrl).then((res) => res.json());
};

//this takes the chosen 30 to get information on from the api
async function getNumbers() {
  const data = await getData();
  selectNumbers(data);

  const promises = [];

  for (let pokeInfo of pokeData) {
    const url = pokeInfo.url;
    promises.push(fetch(url).then((res) => res.json()));
  }

  Promise.all(promises).then((results) => {
    pokemonData = results.map((result) => {
      //we want an image to show up every time
      let imgResult = "";
      imageWrapperSet = "img-wrapper";

      //tells me if a pokemon doesn't have an image
      if (
        result.sprites["front_default"] === null &&
        result.sprites["front_shiny"] === null &&
        result.sprites["other"]["official-artwork"]["front_default"] === null
      ) {
        console.log(
          "does default equal null for",
          result.name,
          "?: ",
          result.sprites["front_default"] === null
        );
        console.log(
          "does shiny equal null for",
          result.name,
          "?: ",
          result.sprites["front_shiny"] === null
        );
        console.log(
          "does other equal null for",
          result.name,
          "?: ",
          result.sprites["other"]["official-artwork"]["front_default"] === null
        );
        console.log(
          "this is hp for",
          result.name,
          ":",
          result["stats"][0]["base_stat"]
        );
      }

      // ------------------------------
      //setting the images that it does have
      if (result.sprites["front_default"] === null) {
        imgResult = result.sprites["front_shiny"];
      }

      if (
        result.sprites["front_shiny"] === null &&
        result.sprites["front_default"] === null
      ) {
        imgResult =
          result.sprites["other"]["official-artwork"]["front_default"];
      }
      if (
        result.sprites["front_shiny"] === null &&
        result.sprites["front_default"] === null &&
        result.sprites["other"]["official-artwork"]["front_default"] === null
      ) {
        imgResult = filler;
        console.log("this is what imgResult is now: ", imgResult);
        imageWrapperSet = "noImg";
        console.log("this is imageWrapperSet: ", imageWrapperSet);
      } else {
        imgResult = result.sprites["front_default"];
      }

      //will catch any nulls/undefined that gets through
      if (imgResult === undefined || imgResult === null) {
        imgResult = filler;
        imageWrapperSet = "noImg";
      }

      return {
        name: result.name.toUpperCase(),
        image: imgResult,
        id: result.id,
        type: result.types.map((type) => type.type.name).join(" - "),
        alt: "image of the pokemon: " + result.name,
        hp: result["stats"][0]["base_stat"],
        statAttack: result.stats[1].base_stat,
        statDefense: result.stats[2].base_stat,
        statSpeed: result.stats[5].base_stat,
      };
    });

    console.log("this is pokemonData: ", pokemonData);

    const pokeCards = pokemonData.map((poke) => buildPokeCard(poke));

    for (let card of pokeCards) {
      collectionsGrid.append(card);
    }

    // setting up main to favorites switch
    allCards = document.querySelectorAll(".card");

    for (let elm of allCards) {
      elm.addEventListener("click", function () {
        getCollections();
        let parentElmID = elm.parentElement.id;
        // console.log("parentElmID: ", parentElmID);
        // console.log("this is the elm: ", elm);
        let elmID = elm.id;
        // console.log("this is the elmID: ", elmID);
        let direction = "";
        if (parentElmID === "main") {
          //only want them to have a team of 6 pokemon
          if (favsCollection.length < 6) {
            console.log(
              "this is favsCollection.length: ",
              favsCollection.length
            );
            direction = "toFavs";
            console.log(direction);
          } else {
            console.log("You already have 6 pokemon on your Team!");
          }
        } else {
          direction = "toMain";
          console.log(direction);
        }

        updateCollections(elm, direction);
      });
    }
  });
}
getNumbers();

const collectionsGrid = document.querySelector("#main");
const favoritesGrid = document.querySelector("#favs");
const trainerGrid = document.querySelector(".type-trainer");
const updateTrainerType = document.querySelector(".updateTrainerType");
const fetchNewPokemonBtn = document.querySelector("#new-pokemon-btn");

const sortBtn = document.querySelectorAll(".sortBtn");
const trainerBtn = document.querySelector(".trainer");
const favSort = document.querySelector(".sortFavs");
const mainSort = document.querySelector(".sortMain");

// going to add a themeColor for the cards based on pokemon type

const buildPokeCard = (pokemonData) => {
  let pokeType;
  let oneType;
  if (pokemonData.type.includes("-")) {
    oneType = pokemonData.type.split(" - ");
    pokeType = oneType[0];
  } else {
    pokeType = pokemonData.type;
  }

  const themeColor = typeColor[pokeType];
  if (themeColor === undefined) {
    console.log(
      "this is the themecolor for",
      pokemonData.name,
      ":",
      themeColor
    );
  }

  const $card = document.createElement("div");
  $card.classList.add("card");
  $card.setAttribute("id", `${pokemonData.name}`);
  $card.setAttribute("style", `background-color:${themeColor}`);
  $card.setAttribute(
    "style",
    `background: radial-gradient(circle at 50% 0%, ${themeColor} 36%, #ffffff 36%)`
  );

  $card.innerHTML = `
    <div id="${pokemonData.id}" class="poke-card" >
        <div class="card-body" 
       
        >
            <p class="hp">
                <span>HP</span>
                ${pokemonData.hp}
            </p>
            <div class=${imageWrapperSet}>
                <img src=${pokemonData.image} />
            </div>
            <h2 class="poke-name">${pokemonData.name}</h2>
            <div class="types">
                <span style="background: ${themeColor}">${pokemonData.type}</span>
         
            </div>
            <div class="stats">
                <div>
                    <h3>${pokemonData.statAttack}</h3>
                    <p>Attack</p>
                </div>
                <div>
                    <h3>${pokemonData.statDefense}</h3>
                    <p>Defense</p>
                </div>
                <div>
                    <h3>${pokemonData.statSpeed}</h3>
                    <p>Speed</p>
                </div>
            </div>
        </div>
    </div>
`;

  return $card;
};

//get new pokemon button
fetchNewPokemonBtn.addEventListener("click", () => {
  collectionsGrid.innerHTML = "";
  favoritesGrid.innerHTML = "";
  trainerGrid.innerHTML = "";
  max = 0;
  pokeNeeded = 30;
  pokeNums = [];
  pokeData = [];
  pokemonData;
  favsCollection = [];
  mainCollection = [];
  getNumbers();
});

// ----------

//**using the DOM manipulation practice exercise as a reference for moving and sorting items */
let favsCollection = [];
let mainCollection = [];

let getCollections = () => {
  const newArr1 = Array.from(allCards);
  favsCollection = [];
  mainCollection = [];
  for (let item of newArr1) {
    if (item.parentElement.id === "main") {
      mainCollection.push(item);
    } else {
      favsCollection.push(item);
    }
  }
};

// sending pokemon to favorites and back
const updateCollections = (elm, direction) => {
  console.log("this is the elm: ", elm);
  if (direction === "toFavs") {
    favoritesGrid.append(elm);
    parentElm = elm.parentElement;
    console.log("parentElm id switched: ", parentElm.id);
  } else if (direction === "toMain") {
    collectionsGrid.append(elm);
    parentElm = elm.parentElement;
    console.log("parentElm id switched: ", parentElm.id);
  }

  //this will let the popup have the same data as favs
  trainerGrid.innerHTML = favoritesGrid.innerHTML;

  //slides is only visible here:
  // carousel functions
  const slides = document.querySelectorAll(".trainer-carousel .card");
  console.log("this is slides: ", slides);

  const buttons = document.querySelectorAll(".slide-ctrl-container button");

  let current = Math.floor(Math.random() * slides.length);
  let next = current < slides.length - 1 ? current + 1 : 0;
  let prev = current > 0 ? current - 1 : slides.length - 1;
  const update = () => {
    slides.forEach((slide) => {
      slide.classList.remove("active", "prev", "next");
      slides[current].classList.add("active");
      slides[prev].classList.add("prev");
      slides[next].classList.add("next");
    });
  };

  const goToNum = (number) => {
    current = number;
    next = current < slides.length - 1 ? current + 1 : 0;
    prev = current > 0 ? current - 1 : slides.length - 1;
    update();
  };

  const goToNext = () => {
    current < slides.length - 1 ? goToNum(current + 1) : goToNum(0);
  };
  const goToPrev = () => {
    current > 0 ? goToNum(current - 1) : goToNum(slides.length - 1);
  };

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () =>
      i === 0 ? goToPrev() : goToNext()
    );
  }

  // invoke so it starts with the page
  update();
};

//sorting the pokemon
const sortData = (direction, parentId) => {
  let container = "";
  let newArr = "";

  //   console.log("this is favsCollection.length: ", favsCollection.length);
  //this pinpoints what collection we want to sort through
  if (parentId === "sortMain") {
    container = document.getElementById("main");
    newArr = mainCollection;
  } else if (parentId === "sortFavs") {
    container = document.getElementById("favs");
    newArr = favsCollection;
  } else {
    container = document.getElementById("main");
    newArr = Array.from(allCards);
  }

  console.log("here is allCards array: ", Array.from(allCards));
  console.log("here is mainCollection: ", mainCollection);
  console.log("here is favsCollection: ", favsCollection);

  if (direction === "desc") {
    const sortCB = (a, b) => {
      if (a.id < b.id) return 1;
      else if (a.id > b.id) return -1;
      else return 0;
    };
    newArr.sort(sortCB);
  } else {
    const sortCB = (a, b) => {
      if (a.id > b.id) return 1;
      else if (a.id < b.id) return -1;
      else return 0;
    };
    newArr.sort(sortCB);
  }
  newArr.forEach((item) => {
    container.append(item);
  });
};

for (let elm of sortBtn) {
  elm.addEventListener("click", function () {
    let parentId = elm.parentElement.id;
    let direction = elm.dataset.sortdir;
    getCollections();
    sortData(direction, parentId);
  });
}

trainerBtn.addEventListener("click", function () {
  let chosenFew = [];

  getCollections();
  console.log("using favsCollection:", favsCollection);
  console.log("using pokemonData: ", pokemonData);

  if (favsCollection.length < 6) {
    console.log("Choose six pokemon for your team!");
    trainerGrid.innerHTML = `<h1>Choose six pokemon for your team!</h1>`;
  } else {
    for (let poke of favsCollection) {
      for (let mon of pokemonData) {
        if (poke.id === mon.name) {
          chosenFew.push(mon);
        }
      }
    }
    console.log("this is the chosenFew: ", chosenFew);

    console.log(getMostCommonTypes(chosenFew));
  }
});

//this looks for the type majority in the favorites collection
function getMostCommonTypes(chosenFew) {
  const result = {};
  let allTypes = [];
  let allTypesFlat = [];

  for (const item of chosenFew) {
    if (item.type.includes("-")) {
      console.log("two types located");
      let multitype = item.type.split(" - ");
      allTypes.push(multitype);
    } else {
      allTypes.push(item.type);
    }
    console.log("this is allTypes: ", allTypes);

    allTypesFlat = allTypes.flat();
    console.log("this is a flat of allTypes: ", allTypesFlat);
  }

  for (const item of allTypesFlat) {
    if (result[item] === undefined) {
      result[item] = 1;
    } else {
      result[item] += 1;
    }
  }

  console.log("this is the result of types: ", result);
  let max = 0;
  let maxType = [];
  for (const type in result) {
    if (result[type] > max) {
      max = result[type];
      maxType = [];
      maxType.push(type);
    } else if (result[type] === max) {
      maxType.push(type);
    } else {
      max = max;
    }
  }
  console.log("this is the max: ", max);
  console.log("this is the maxType: ", maxType);

  let finalMessage = "";
  if (maxType.length > 1) {
    finalMessage = `You chose a variety of different pokemon! <br> You don't stick to just one type, You are an all-around type of trainer!`;
  } else {
    finalMessage = `You chose a majority of ${maxType[0].toUpperCase()} type pokemon! <br> That makes you a(n) ${maxType} type Pokemon Trainer!!`;
  }

  updateTrainerType.innerHTML = finalMessage;
  return finalMessage;
}

const modalOpen = "[data-open]";
const modalClose = "[data-close]";
const isVisible = "is-visible";

const openModal = document.querySelectorAll(modalOpen);
const closeModal = document.querySelectorAll(modalClose);

// full site modal "open buttons"
for (const elm of openModal) {
  elm.addEventListener("click", function () {
    const modalId = this.dataset.open;
    document.getElementById(modalId).classList.add(isVisible);
  });
}

for (const elm of closeModal) {
  elm.addEventListener("click", function () {
    this.parentElement.parentElement.parentElement.classList.remove(isVisible);
    updateTrainerType.innerHTML = "";
  });
}
