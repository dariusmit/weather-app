//import "https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css";
import axios from "axios";

interface weatherType {
  id: number;
  city: string;
  country: string;
  temp: string;
  humidity: string;
  windspeed: string;
  pressure: string;
  sunrise: string;
  sunset: string;
  conditions: string;
}

let weatherList: weatherType[] = [];
let savedWeatherList: weatherType[] = [];
let weatherId: number = 0;
let currentPageGlobal: number = 1;
let itemsPerPageGlobal: number = 3;

//const app = document.querySelector<HTMLDivElement>("#app")!; //Ka sauktukas reiskia? Ignores null, undefined error
const searchButton: HTMLElement = document.getElementById("search-button")!;
let weatherListDiv: HTMLElement = document.getElementById("weather-list")!;
const testArrayButton: HTMLElement = document.getElementById("test-array")!;
const testPagination: HTMLElement = document.getElementById("test-pages")!;
const prevPageButton: HTMLElement = document.getElementById("prev-page")!;
const nextPageButton: HTMLElement = document.getElementById("next-page")!;
const searchInput = <HTMLInputElement>document.getElementById("search-input");
let searchInputValue: string = "";

async function getWeatherData(): Promise<void> {
  if (searchInputValue === "") {
    alert("Please enter city name first");
  } else {
    const api_key = import.meta.env.VITE_API_KEY;
    const api_url =
      "https://api.openweathermap.org/data/2.5/weather?units=metric";
    let city = searchInputValue;
    try {
      const { data } = await axios.get(
        api_url + `&q=${city}` + `&appid=${api_key}`
      );

      const sunriseUnix: number = data.sys.sunrise;
      const sunsetUnix: number = data.sys.sunset;
      const sunrise: Object = new Date(sunriseUnix * 1000);
      const sunset: Object = new Date(sunsetUnix * 1000);

      savedWeatherList =
        savedWeatherList.length > 0 ? savedWeatherList : weatherList;

      //Add data from API to local array
      savedWeatherList.push({
        id: (weatherId = weatherId + 1),
        city: data.name,
        country: data.sys.country,
        temp: data.main.temp,
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        pressure: data.main.pressure,
        sunrise: sunrise.toString(),
        sunset: sunset.toString(),
        conditions: data.weather[0].icon,
      });
      constructList();
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
    }
  }
}

//Save to local storage
function saveToStorage() {
  localStorage.setItem("weather data", weatherListDiv.innerHTML);
  localStorage.setItem("weather array", JSON.stringify(weatherList));
}

function renderList() {
  savedWeatherList = JSON.parse(localStorage.getItem("weather array") || "[]");
  weatherListDiv.innerHTML = localStorage.getItem("weather data") || "";
}

//Render weather forecasts list
function constructList() {
  const div: HTMLElement = document.createElement("div");
  const p: HTMLParagraphElement = document.createElement("p");
  const deleteButton: HTMLElement = document.createElement("button");
  const img: HTMLImageElement = document.createElement("img");

  weatherList.forEach((item) => {
    div.setAttribute("id", `item-` + item.id);
    div.classList.add("list-item");
    weatherListDiv.appendChild(div);
    let weatherItemDiv = document.querySelector(`#item-${item.id}`)!;
    img.src = `${item.conditions}` + `.png`;
    img.classList.add("conditions-img");
    p.textContent =
      "City: " +
      item.city +
      " Country: " +
      item.country +
      " Temp: " +
      item.temp +
      " Humidity: " +
      item.humidity +
      " Wind speed: " +
      item.windspeed +
      " Pressure: " +
      item.pressure +
      " Sunrise: " +
      item.sunrise +
      " Sunset: " +
      item.sunset;
    deleteButton.innerHTML = "Delete";
    deleteButton.classList.add("delete-item");
    deleteButton.setAttribute("id", String(item.id));
    deleteButton.onclick = function () {
      deleteItem(item.id);
    };
    weatherItemDiv.appendChild(img);
    weatherItemDiv.appendChild(p);
    weatherItemDiv.appendChild(deleteButton);
    saveToStorage();
  });
}

//What type is EVENT?
function updateValue(e: any): void {
  searchInputValue = e.target.value.toLowerCase();
}

function paginate(currentPage: number, itemsPerPage: number) {
  for (let i = 0; i < weatherList.length; i++) {
    if (
      i >= (currentPage - 1) * itemsPerPage &&
      i < currentPage * itemsPerPage
    ) {
      console.log(weatherList[i]);
    }
  }
}

function prevPage() {
  currentPageGlobal = currentPageGlobal - 1;
  console.log("prev page button clicked");
}

function nextPage() {
  currentPageGlobal = currentPageGlobal + 1;
  console.log("next page button clicked");
}

//Remove item from the array, but not from view
function deleteItem(clickedID: number): void {
  console.log("Item with the id of: " + clickedID + " was clicked!");
  weatherList = weatherList.filter((item) => {
    return item.id !== clickedID;
  });
}

//Event listeners
searchInput.addEventListener("change", updateValue);
searchButton.addEventListener("click", getWeatherData);
testArrayButton.addEventListener("click", (): void => {
  console.log(JSON.stringify(weatherList, undefined, 2));
});
prevPageButton.addEventListener("click", prevPage);
nextPageButton.addEventListener("click", nextPage);
testPagination.addEventListener("click", (): void => {
  paginate(currentPageGlobal, itemsPerPageGlobal);
});
//Remove list item Event listener from view only
weatherListDiv.addEventListener("click", function (e) {
  let element = e.target as HTMLElement;
  if (element.tagName === "BUTTON") {
    element.parentElement!.remove();
    saveToStorage();
  }
});

//Call list render function
renderList();
