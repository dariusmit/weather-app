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

//let weatherList: weatherType[] = [];
let savedWeatherList: weatherType[] = [];
//let paginatedSavedWeatherList: Array<Object> = [];
//let weatherId: number = 0;
let savedWeatherId: number;
let currentPageGlobal: number = 1;
let itemsPerPageGlobal: number = 3;

const testPaginationButton: HTMLElement =
  document.getElementById("test-pages")!;
const searchButton: HTMLElement = document.getElementById("search-button")!;
let weatherListDiv: HTMLElement = document.getElementById("weather-list")!;
const testArrayButton: HTMLElement = document.getElementById("test-array")!;
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
        localStorage.getItem("weather array") === null
          ? []
          : JSON.parse(localStorage.getItem("weather array") || "[]");

      savedWeatherId =
        localStorage.getItem("weather id") === null
          ? 0
          : Number(localStorage.getItem("weather id"));

      //Add data from API to local array
      savedWeatherList.push({
        id: (savedWeatherId = savedWeatherId + 1),
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
      saveArrayToStorage();
      saveWeatherId();
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

function saveWeatherId() {
  localStorage.setItem("weather id", String(savedWeatherId));
}

//Save view to local storage
function saveViewToStorage() {
  localStorage.setItem("weather data", weatherListDiv.innerHTML);
}

//Save array to local storage
function saveArrayToStorage() {
  localStorage.setItem("weather array", JSON.stringify(savedWeatherList));
}

function getArrayData() {
  savedWeatherList = JSON.parse(localStorage.getItem("weather array") || "[]");
}

function renderList() {
  weatherListDiv.innerHTML = localStorage.getItem("weather data") || "";
}

//Render weather forecasts list
function constructList() {
  const div: HTMLElement = document.createElement("div");
  const p: HTMLParagraphElement = document.createElement("p");
  const deleteButton: HTMLElement = document.createElement("button");
  const img: HTMLImageElement = document.createElement("img");

  savedWeatherList.forEach((item) => {
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
  });
  saveViewToStorage();
  //paginate(currentPageGlobal, itemsPerPageGlobal);
}

//What type is EVENT?
function updateValue(e: any): void {
  searchInputValue = e.target.value.toLowerCase();
}

function paginate(currentPage: number, itemsPerPage: number) {
  for (let i = 0; i < savedWeatherList.length; i++) {
    if (
      i >= (currentPage - 1) * itemsPerPage &&
      i < currentPage * itemsPerPage
    ) {
      console.log(savedWeatherList[i]);
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
  savedWeatherList = savedWeatherList.filter((item) => {
    return item.id !== clickedID;
  });
  saveArrayToStorage();
}

//Event listeners
searchInput.addEventListener("change", updateValue);
searchButton.addEventListener("click", getWeatherData);
testArrayButton.addEventListener("click", (): void => {
  console.log(JSON.stringify(savedWeatherList, undefined, 2));
});
prevPageButton.addEventListener("click", prevPage);
nextPageButton.addEventListener("click", nextPage);
testPaginationButton.addEventListener("click", () => {
  paginate(currentPageGlobal, itemsPerPageGlobal);
});

//Remove list item Event listener from view only
weatherListDiv.addEventListener("click", function (e) {
  let element = e.target as HTMLElement;
  if (element.tagName === "BUTTON") {
    element.parentElement!.remove();
    saveViewToStorage();
    saveArrayToStorage();
  }
});

//Get saved weather data from local storage
getArrayData();
//Call list render function
renderList();
