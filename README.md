<!-- Instructions for the assignment -->

You are going to create your own website that fetches and displays real data from an API. A user can add and remove these items from a "favorites" list and has the ability to sort the data.

🛠 Requirements:
Fetch data from an API (resource provided below) and display up to 30 items from that request in your HTML.
In your HTML you will display the array of data you get back (i.e. if it was an array of movies, you would display the list of movies).
Display a minimum of 3 values from the object in the array of data you get back for each item. (i.e. movie name, movie description, cover image).
HTML for each item should be created programmatically. This means the html is created based on the data received from the API - if 10 items are fetched, 10 blocks of HTML are created to display the data, etc.
Build a function to add selected items from the array of data to a "favorites" list. i.e.:
You fetch a list of 30 movies from an API and display it in a "collection" in your HTML.
When a user selects an item(s) from the "collection" to add to the "favorites" list, the item(s) are removed from the collection and added to the "favorites" list.
Build a function to remove an item from the "favorites" list.
When a user removes an item from the "favorites" list, the item is added back to the "collection" of items.
Build a toggle function that sorts the items in the collection and "favorites" list alphabetically (A-Z) and vice versa (Z-A).
You must display the total sum of some piece of data from the list. (i.e. if you had a list of pokemon, you could total the number of common, rare and legendary pokemon in the list). You cannot total the number of items in the array, it must be a value from the data object.
The website must be built with pure HTML, CSS and JavaScript (no third party css or js libraries).
The items retrieved from the API must be displayed in styled HTML. (i.e. if you were working with the pokeAPI you could display the data in a "card" design with the image, attack, hitpoints, etc).
The website must be mobile responsive across desktop, ipad/tablet and mobile phones.

💡 Tips:
Fetching data from an API can take a few milliseconds. This means you cannot create the HTML items from your API data until it is done fetching. This also means you cannot add click events to the HTML items before they're created.
Flow: Fetch data => build HTML items from data => add click events when HTML is done being built.

📁 Resources
Free Public APIs
Element Append

//remember to

npm install node-fetch

\*\*this is going to make a node_modules folder and some package.json and a package-lock.json files.

<!-- My notes -->

Resource List
API used:
https://pokeapi.co/

Style Guides for colors and designs -
for colors :
https://www.pokemonaaah.net/artsyfartsy/colordex/

Pokemon Card Generator
https://medium.com/@cwrworksite/pokemon-card-generator-using-css-and-javascript-5fdecb282911
