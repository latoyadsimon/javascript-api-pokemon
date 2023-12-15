// import fetch from "node-fetch";

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
      // console.log(data.results[poke]);
      console.log(
        "this is the art im looking for: ",
        data.results[poke].sprites
      );
    }
  }

  console.log("Now this is pokeNums.length: ", pokeNums.length);

  if (pokeNums.length < 30) {
    //  console.log("still needed: ", pokeNeeded);
    selectNumbers(data);
  } else {
    console.log("this is pokeNums: ", pokeNums);
  }
};

// const getPokeData = (data) => {

// }

//logic to make everything work

//this fetches data from the pokeapi
const getData = () => {
  return fetch(allPokeUrl).then((res) => res.json());
};

//this takes the chosen 30 to get information on
async function getNumbers() {
  const data = await getData();
  // console.log("this is the data.count: ", data.count)
  selectNumbers(data);
  // console.log("this is selectNumberse(data): ", selectNumbers(data))
  // console.log("do we have the pokeNums: ", pokeNums)
  // console.log("do we have the pokeNums[0]: ", pokeNums[0])
  // console.log("do we have the pokeData: ", pokeData)
  // console.log("do we have the pokeData[0].url: ", pokeData[0].url)
  // let pokeUrlMap = pokeNums.map((pokeNum) => pokeUrl + `${pokeNum}`);
  // console.log("this is the pokeUrlMap", pokeUrlMap)

  const promises = [];

  for (let pokeInfo of pokeData) {
    // console.log("this is pokeInfo: ", pokeInfo)
    // console.log("this is pokeInfo: ", pokeInfo.url)
    const url = pokeInfo.url;
    promises.push(fetch(url).then((res) => res.json()));
  }

  Promise.all(promises).then((results) => {
    pokemonData = results.map((result) => {
      //we want an image to show up every time
      let imgResult = "";

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
        !result.sprites["other"]["official-artwork"]["front_default"] === null
      ) {
        let filler = `./assets/images/crewmate among us big keychains.jpg`;
        imgResult = filler;
      } else {
        imgResult = result.sprites["front_default"];
      }
      return {
        name: result.name,
        // image: result.sprites["front_default"] || result.sprites["front_shiny"] || result.sprites["other"]["official-artwork"]["front_default"],
        // image: result.sprites["other"]["official-artwork"]["front_default"],
        image: imgResult,
        id: result.id,
        type: result.types.map((type) => type.type.name).join(" - "),
        alt: "image of the pokemon: " + result.name,
        hp: result["stats"][0]["base_stat"],
      };
    });

    console.log("this is pokemonData: ", pokemonData);
    // return pokemonData;
    const pokeCards = pokemonData.map((poke) => buildPokeCard(poke));

    for (let card of pokeCards) {
      collectionsGrid.append(card);
    }
    allCards = document.querySelectorAll(".card");
    // console.log("this is allCards: ", allCards)
    allPokeCards = document.querySelectorAll(".poke-card");
    // console.log("this is allPokeCards: ", allPokeCards)

    for (let elm of allCards) {
      elm.addEventListener("click", function () {
        let parentElmID = elm.parentElement.id;
        console.log("parentElmID: ", parentElmID);
        // let elm = elm;
        console.log("this is the elm: ", elm);
        let elmID = elm.id;
        console.log("this is the elmID: ", elmID);
        let direction = "";
        if (parentElmID === "main") {
          direction = "toFavs";
          console.log(direction);
        } else {
          direction = "toMain";
          console.log(direction);
        }
        // updateCollections(elm.id, direction)
        updateCollections(elm, direction);
      });
    }
  });
}
getNumbers();
// console.log("this is allCards: ", allCards)
//this doesn't work out here

const collectionsGrid = document.querySelector("#main");
const favoritesGrid = document.querySelector("#favs");
const fetchNewPokemonBtn = document.querySelector("#new-pokemon-btn");

const buildPokeCard = (pokemonData) => {
  const $card = document.createElement("div");
  $card.classList.add("card");
  $card.innerHTML = `
    <div id="${pokemonData.id}" class="poke-card">
                <div class="card-body">
                    <div class="img-wrapper">

                        <img src=${pokemonData.image}>
                    </div>
                    <h3>${pokemonData.name}</h3>
                    <h4>${pokemonData.type}</h4>
                    <h5>HP: ${pokemonData.hp}</h5>
                    
                </div>
            </div>`;
  return $card;
};

//get new pokemon button
fetchNewPokemonBtn.addEventListener("click", () => {
  collectionsGrid.innerHTML = "";
  max = 0;
  pokeNeeded = 30;
  pokeNums = [];
  pokeData = [];
  pokemonData;
  getNumbers();
});

// const fetchAllCards = (pokemon) => {

// }
// const addCard = (pokemonData) => {
//     const pokeCard = document.createElement("div");
//     pokeCard.setAttribute("class", "poke-card");
//     pokeCard.setAttribute("id", pokemonData.id);

//     const cardBody = document.createElement("div");
//     cardBody.setAttribute("class", "card-body");

//     const image = document.createElement("img");
//     image.setAttribute("src", pokemonData.image);
//     image.setAttribute("alt", pokemonData.alt);

//     const titleDiv = document.createElement("div");
//     titleDiv.innerText = pokemonData.name;
//     const titleH3 = document.createElement("h3");
//     titleH3.innerText = pokemonData.type;

//     cardBody.append(image);
//     cardBody.append(titleDiv);
//     cardBody.append(titleH3);
//     pokeCard.append(cardBody);
//     collectionsGrid.append(pokeCard)
// }

// ----------

// async function moveItems() {
//     const data = await getNumbers();

//     console.log("the data I waited for: ", data)

//     const allCards = document.querySelectorAll(".card");
// console.log("this is allCards: ", allCards)
//     const allPokeCards = document.querySelectorAll(".poke-card");
// console.log("this is allPokeCards: ", allPokeCards)
// }

// moveItems()

// sending pokemon to favs and back
// const updateCollections = (id, direction) => {
const updateCollections = (elm, direction) => {
  // let elm = document.getElementById(id);

  console.log("this is the elm: ", elm);
  if (direction === "toFavs") {
    favoritesGrid.append(elm);
    parentElm = elm.parentElement;
    console.log("parentElm id switched: ", parentElm.id);
  } else if (direction === "toMain") {
    collectionsGrid.appendChild(elm);
    parentElm = elm.parentElement;
    console.log("parentElm id switched: ", parentElm.id);
  }
};
