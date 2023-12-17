// import fetch from "node-fetch";
// something is causing the file not to work, switching to script3
//it was something in html causing file not to work, switching back to script2
//use script3 for backup

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
      //   console.log(
      //     "this is the art im looking for: ",
      //     data.results[poke].sprites
      //   );
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
        let filler = `./assets/images/crewmate-among-us-big-keychains.jpg`;
        imgResult = filler;
      } else {
        imgResult = result.sprites["front_default"];
      }

      return {
        name: result.name.toUpperCase(),
        // image: result.sprites["front_default"] || result.sprites["front_shiny"] || result.sprites["other"]["official-artwork"]["front_default"],
        // image: result.sprites["other"]["official-artwork"]["front_default"],
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
    // return pokemonData;
    const pokeCards = pokemonData.map((poke) => buildPokeCard(poke));

    for (let card of pokeCards) {
      collectionsGrid.append(card);
    }

    // setting up main to favorites switch
    allCards = document.querySelectorAll(".card");
    // console.log("this is allCards: ", allCards)
    // allPokeCards = document.querySelectorAll(".poke-card");
    // console.log("this is allPokeCards: ", allPokeCards)

    for (let elm of allCards) {
      elm.addEventListener("click", function () {
        getCollections();
        let parentElmID = elm.parentElement.id;
        console.log("parentElmID: ", parentElmID);
        // let elm = elm;
        console.log("this is the elm: ", elm);
        let elmID = elm.id;
        console.log("this is the elmID: ", elmID);
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
        // updateCollections(elm.id, direction)
        // getCollections();
        updateCollections(elm, direction);
        // getCollections();
      });
    }
  });
}
getNumbers();

// console.log("this is allCards: ", allCards)
//this doesn't work out here

const collectionsGrid = document.querySelector("#main");
const favoritesGrid = document.querySelector("#favs");
const trainerGrid = document.querySelector(".type-trainer");
const updateTrainerType = document.querySelector(".updateTrainerType");
const fetchNewPokemonBtn = document.querySelector("#new-pokemon-btn");

const sortBtn = document.querySelectorAll(".sortBtn");
const trainerBtn = document.querySelector(".trainer");
const favSort = document.querySelector(".sortFavs");
const mainSort = document.querySelector(".sortMain");

// going to add a themeColor based on pokemon type

const buildPokeCard = (pokemonData) => {
  let pokeType;
  let oneType;
  if (pokemonData.type.includes("-")) {
    oneType = pokemonData.type.split(" - ");
    // console.log("this is one type: ", oneType);
    // console.log("this is one type[0]: ", oneType[0]);
    pokeType = oneType[0];
  } else {
    pokeType = pokemonData.type;
  }

  console.log("pokeType for ", pokemonData.name, "is: ", pokeType);

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
  //   style = "background-color:${themeColor};";
  $card.setAttribute("id", `${pokemonData.name}`);
  $card.setAttribute("style", `background-color:${themeColor}`);
  $card.setAttribute(
    "style",
    `background: radial-gradient(circle at 50% 0%, ${themeColor} 36%, #ffffff 36%)`
  );
  //   $card.innerHTML = `
  //     <div id="${pokemonData.id}" class="poke-card">
  //                 <div class="card-body">
  //                     <div class="img-wrapper">

  //                         <img src=${pokemonData.image}>
  //                     </div>
  //                     <h3 class="poke-name">${pokemonData.name}</h3>
  //                     <h4 class="types">${pokemonData.type}</h4>
  //                     <h5 class="hp">HP: ${pokemonData.hp}</h5>

  //                 </div>
  //             </div>`;

  $card.innerHTML = `
    <div id="${pokemonData.id}" class="poke-card" >
        <div class="card-body" 
       
        >
            <p class="hp">
                <span>HP</span>
                ${pokemonData.hp}
            </p>
            <div class="img-wrapper">
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
  //   appendTypes(pokemonData.type);
  //   styleCard(themeColor, $card);

  return $card;
};

// let appendTypes = (types) => {
//   console.log("types in appendTypes: ", types);
//   //   types.forEach((item) => {
//   let span = document.createElement("span");
//   span.textContent = types;
//   document.querySelector(".types").appendChild(span);
//   //   });
// };

// let styleCard = (color) => {
//   $card.style.background = `radial-gradient(circle at 50% 0%, ${color} 36%, #ffffff 36%)`;
//   $card.querySelectorAll(".types span").forEach((typeColor) => {
//     typeColor.style.backgroundColor = color;
//   });
// };

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

//**using the DOM manipulation practice exercise as a reference for moving and sorting items */
let favsCollection = [];
let mainCollection = [];

let getCollections = () => {
  const newArr1 = Array.from(allCards);
  //   console.log("heres what Im working with: ", newArr1);
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

// getCollections();
// sending pokemon to favorites and back
// const updateCollections = (id, direction) => {
const updateCollections = (elm, direction) => {
  // let elm = document.getElementById(id);

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

  //this will let the pop have teh same data a favs
  trainerGrid.innerHTML = favoritesGrid.innerHTML;
  //   const newArr1 = Array.from(allCards);
  //   //   console.log("heres what Im working with: ", newArr1);
  //   favsCollection = [];
  //   mainCollection = [];
  //   for (let item of newArr1) {
  //     if (item.parentElement.id === "main") {
  //       mainCollection.push(item);
  //     } else {
  //       favsCollection.push(item);
  //     }
  //   }

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

    //   this will show us what it currently is
    // console.log("prev: ", prev);
    // console.log("current: ", current);
    // console.log("next: ", next);
  };
  // try pressing the arrow buttons now, it should update
  //   console.log("prev: ", prev);
  //   console.log("current: ", current);
  //   console.log("next: ", next);

  const goToNext = () => {
    // console.log("Next");
    current < slides.length - 1 ? goToNum(current + 1) : goToNum(0);
  };
  const goToPrev = () => {
    console.log("Prev");
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

  //   const newArr1 = Array.from(allCards);
  //   //   console.log("heres what Im working with: ", newArr1);
  //   favsCollection = [];
  //   mainCollection = [];
  //   for (let item of newArr1) {
  //     if (item.parentElement.id === "main") {
  //       mainCollection.push(item);
  //     } else {
  //       favsCollection.push(item);
  //     }
  //   }
  console.log("this is favsCollection.length: ", favsCollection.length);

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

  //   if (favsCollection.length === 0) {
  //     container = document.getElementById("main");
  //     newArr = Array.from(allCards);
  //   } else {
  //     if (parentId === "sortMain") {
  //       container = document.getElementById("main");
  //       newArr = mainCollection;
  //     } else if (parentId === "sortFavs") {
  //       container = document.getElementById("favs");
  //       newArr = favsCollection;
  //     }
  //   }

  //   const container = document.getElementById("main");
  console.log("here is allCards array: ", Array.from(allCards));
  console.log("here is mainCollection: ", mainCollection);
  console.log("here is favsCollection: ", favsCollection);

  if (direction === "desc") {
    const sortCB = (a, b) => {
      //   console.log("this is what i sorted: ", a, b);
      //   console.log("this is what i sorted: ", a.id, b.id);
      if (a.id < b.id) return 1;
      else if (a.id > b.id) return -1;
      else return 0;
    };
    newArr.sort(sortCB);
    // console.log("this should be sorted: ", newArr);
  } else {
    const sortCB = (a, b) => {
      //   console.log(a.id, b.id);
      if (a.id > b.id) return 1;
      else if (a.id < b.id) return -1;
      else return 0;
    };
    newArr.sort(sortCB);
    // console.log("this should be sorted: ", newArr);
  }
  newArr.forEach((item) => {
    container.append(item);
  });
};

for (let elm of sortBtn) {
  elm.addEventListener("click", function () {
    // console.log(elm);
    // console.log(elm.dataset.sortdir);
    // console.log("this is the parentElm", elm.parentElement.id);
    let parentId = elm.parentElement.id;
    let direction = elm.dataset.sortdir;
    getCollections();
    sortData(direction, parentId);
  });
}

// for (let elm of trainerBtn) {
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
    // console.log(
    //   "this is most common type function: ",
    //   getMostCommonTypes(chosenFew)
    // );
    console.log(getMostCommonTypes(chosenFew));
    // return getMostCommonTypes(chosenFew);
    //   return chosenFew;
  }
});
// }

//this looks for the type majority in the favorites collection
function getMostCommonTypes(chosenFew) {
  //   let chosenFewSampled;
  const result = {};
  let allTypes = [];
  let allTypesFlat = [];

  for (const item of chosenFew) {
    // console.log("this is the item in chosenFew: ", item);
    // console.log("this is the item.type in chosenFew: ", item.type);
    // if (item.type.includes("-")) {
    //   console.log("two types located");
    //   let multitype = item.type.split(" - ");
    //   console.log("multitype: ", multitype);
    //   chosenFewSampled = [...multitype, ...chosenFew];
    // }
    // console.log("this is chosenFewSampled: ", chosenFewSampled);

    if (item.type.includes("-")) {
      console.log("two types located");
      let multitype = item.type.split(" - ");
      allTypes.push(multitype);
    } else {
      allTypes.push(item.type);
    }
    // allTypes = [...multitype];
    console.log("this is allTypes: ", allTypes);

    allTypesFlat = allTypes.flat();
    console.log("this is a flat of allTypes: ", allTypesFlat);

    // for (const item of allTypesFlat) {
    //   if (result[item] === undefined) {
    //     result[item] = 1;
    //   } else {
    //     result[item] += 1;
    //   }
    // }

    // if (result[item.type] === undefined) {
    //   result[item.type] = 1;
    // } else {
    //   result[item.type] += 1;
    // }
    // console.log("this is the result now: ", result[type]);
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
    // console.log("this is type: ", type);
    // console.log("this is result[type]: ", result[type]);
    // if (type.includes("-")) {
    //   console.log("two types located");
    //   let multitype = type.split(" - ");
    //   console.log("multitype: ", multitype);
    // }
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

  //   return result;
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
