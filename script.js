// import fetch from "node-fetch";

const allPokeUrl = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";

//random number generator
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

let max = 0;
let pokeNeeded = 30;
let pokeNums = [];

const selectNumbers = (data) => {
    max = data.count;
   

   if (pokeNums.length > 0 && pokeNums.length < 30) {
        pokeNeeded = 30 - pokeNums.length;
        console.log("30 -", pokeNums.length, "=", pokeNeeded);
        
    }


     for(let i = 1; i <= pokeNeeded; i++)  {
        let poke = getRandomInt(max);
        if(data.results.includes(data.results[poke]) && !pokeNums.includes(poke)) {
            pokeNums.push(poke);
            // console.log(data.results[poke]);


        }
     }

     console.log("Now this is pokeNums.length: ", pokeNums.length)

     
     if(pokeNums.length < 30){
        //  console.log("still needed: ", pokeNeeded);
         selectNumbers(data);
        }else {

            console.log("this is pokeNums: ", pokeNums)
        }
}

// const getPokeData = (data) => {

// }

//logic to make everything work
const getData = fetch(allPokeUrl);

const result = getData
.then((res)=> res.json())
.then((data) => {
    console.log(selectNumbers(data))
    // let selectedPoke = selectNumbers(data);
//    console.log("this is selectedPoke: ", selectedPoke)
// return data
})


