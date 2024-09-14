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

let savedWeatherArray: weatherType[] = [];
const searchButton: HTMLElement = document.getElementById("search-button")!;
let weatherListDiv: HTMLElement = document.getElementById("weather-list")!;
const searchInput = <HTMLInputElement>document.getElementById("search-input");
let searchInputValue: string = "";

window.onload = () => {
  renderList();
  getCachedListView();
  getArrayData();
  isValueFound = false;
  localStorage.setItem("isFoundValue", String(isValueFound));
};

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
      getArrayData();
      savedWeatherArray.push({
        id: savedWeatherArray.length,
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

function saveArrayToStorage() {
  localStorage.setItem("weather array", JSON.stringify(savedWeatherArray));
}

function constructList() {
  getArrayData();
  let div: HTMLElement = document.createElement("div");
  let p: HTMLParagraphElement = document.createElement("p");
  let deleteButton: HTMLElement = document.createElement("button");
  let img: HTMLImageElement = document.createElement("img");
  savedWeatherArray.forEach((item) => {
    div.setAttribute("id", `item-` + savedWeatherArray.length);
    weatherListDiv.appendChild(div);
    let weatherItemDiv = document.querySelector(
      `#item-${savedWeatherArray.length}`
    )!;
    img.src = `${item.conditions}` + `.png`;
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
    deleteButton.setAttribute("id", String(item.id));
    weatherItemDiv.appendChild(img);
    weatherItemDiv.appendChild(p);
    weatherItemDiv.appendChild(deleteButton);
  });
  saveViewToStorage();
  renderList();
}

function saveViewToStorage() {
  localStorage.setItem("weather data", weatherListDiv.innerHTML);
}

function getArrayData() {
  savedWeatherArray = JSON.parse(localStorage.getItem("weather array") || "[]");
}

function renderList() {
  weatherListDiv.innerHTML = localStorage.getItem("weather data") || "";
}

function updateValue(e: any): void {
  searchInputValue = e.target.value.toLowerCase();
}

searchInput.addEventListener("change", updateValue);
searchButton.addEventListener("click", getWeatherData);

weatherListDiv.addEventListener("click", function (e) {
  let element = e.target as HTMLElement;
  if (element.tagName === "BUTTON") {
    console.log("Clicked element.id:" + element.id);
    element.parentElement!.remove();
    deleteItem(Number(element.id));
  }
});

function deleteItem(clickID: number): void {
  console.log("Item with the id of: " + clickID + " was deleted!");
  savedWeatherArray = savedWeatherArray.filter((item) => {
    return item.id !== clickID;
  });
  //Reindex array
  for (let i = 0; i < savedWeatherArray.length; i++) {
    savedWeatherArray[i].id = i;
  }
  weatherListDiv.innerHTML = "";
  saveViewToStorage();
  saveArrayToStorage();
  constructList();
}
//=========================================================================================================
//Search already added forecast functionality below
//=========================================================================================================
const searchAlreadyAddedButton = <HTMLButtonElement>(
  document.getElementById("search-button-from-cache")
);
const searchAlreadyAddedInput = <HTMLInputElement>(
  document.getElementById("search-input-from-cache")
);
let searchAlreadyAddedInputValue: string = "";

function updateAlreadyAddedSearchValue(e: any): void {
  searchAlreadyAddedInputValue = e.target.value.toLowerCase();
}

searchAlreadyAddedInput.addEventListener(
  "change",
  updateAlreadyAddedSearchValue
);

searchAlreadyAddedButton.addEventListener("click", buildArrayFromAlreadyAdded);

let foundValuesArray: any = [];
let foundValueObject: any = {};

function buildArrayFromAlreadyAdded() {
  console.log("Search input value: " + searchAlreadyAddedInputValue);
  getFoundValue();
  getCachedListArray();
  for (let i = 0; i < savedWeatherArray.length; i++) {
    if (
      savedWeatherArray[i].city.toLowerCase() ==
      searchAlreadyAddedInputValue.toLowerCase()
    ) {
      if (Object.keys(foundValueObject).length !== 0) {
        console.log(
          "Object is not null so we need to check if it's equal to previously found value"
        );
        if (doesValueExist() === true) {
          console.log("Trying to add the value that already exists");
          break;
        } else {
          console.log(
            "Values are not equal so we can add found value to the array"
          );
          foundValueObject = savedWeatherArray[i];
          foundValuesArray.push(foundValueObject);
          for (let i = 0; i < foundValuesArray.length; i++) {
            foundValuesArray[i].id = i;
          }
          saveCachedListArray();
          saveFoundValue();
          displayForecasts();
        }
      } else {
        console.log("Object is null so we can just assign found value to it");
        foundValueObject = savedWeatherArray[i];
        foundValuesArray.push(foundValueObject);
        for (let i = 0; i < foundValuesArray.length; i++) {
          foundValuesArray[i].id = i;
        }
        saveCachedListArray();
        saveFoundValue();
        displayForecasts();
      }
    }
  }
  console.log("Whole array:" + JSON.stringify(foundValuesArray, undefined, 2));
}

let isValueFound = localStorage.getItem("isFoundValue") || false;

function doesValueExist(): boolean {
  isValueFound = false;
  foundValuesArray.forEach((item: any) => {
    if (item.city.toLowerCase() == searchAlreadyAddedInputValue.toLowerCase()) {
      console.log("doesValueExist function output: " + true);
      isValueFound = true;
      localStorage.setItem("isFoundValue", String(isValueFound));
    }
  });
  if (isValueFound) {
    return true;
  } else {
    console.log("doesValueExist function output: " + false);
    isValueFound = false;
    localStorage.setItem("isFoundValue", String(isValueFound));
    return false;
  }
}

let weatherListAlreadyAddedDiv: HTMLElement = document.getElementById(
  "weather-list-already-added"
)!;

function displayForecasts() {
  let div: HTMLElement = document.createElement("div");
  let p: HTMLParagraphElement = document.createElement("p");
  let deleteButton: HTMLElement = document.createElement("button");
  let img: HTMLImageElement = document.createElement("img");
  foundValuesArray.forEach((item: any) => {
    div.setAttribute("id", `item-cached-` + foundValuesArray.length);
    weatherListAlreadyAddedDiv.appendChild(div);
    let weatherItemDiv = document.querySelector(
      `#item-cached-${foundValuesArray.length}`
    )!;
    img.src = `${item.conditions}` + `.png`;
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
    deleteButton.setAttribute("id", String(item.id));
    weatherItemDiv.appendChild(img);
    weatherItemDiv.appendChild(p);
    weatherItemDiv.appendChild(deleteButton);
  });
  saveCachedListView();
}

function saveCachedListArray() {
  localStorage.setItem("cached list array", JSON.stringify(foundValuesArray));
}

function saveCachedListView() {
  localStorage.setItem(
    "cached list view",
    weatherListAlreadyAddedDiv.innerHTML
  );
}

function saveFoundValue() {
  localStorage.setItem("found value object", JSON.stringify(foundValueObject));
}

function getCachedListArray() {
  foundValuesArray = JSON.parse(
    localStorage.getItem("cached list array") || "[]"
  );
}

function getCachedListView() {
  weatherListAlreadyAddedDiv.innerHTML =
    localStorage.getItem("cached list view") || "";
}

function getFoundValue() {
  foundValueObject = JSON.parse(
    localStorage.getItem("found value object") || "{}"
  );
}
//------------------------------------
weatherListAlreadyAddedDiv.addEventListener("click", function (e) {
  let element = e.target as HTMLElement;
  if (element.tagName === "BUTTON") {
    console.log("Clicked element.id:" + element.id);
    element.parentElement!.remove();
    deleteCachedListItem(Number(element.id));
  }
});

function deleteCachedListItem(clickID: number): void {
  console.log("Item with the id of: " + clickID + " was deleted!");
  foundValuesArray = foundValuesArray.filter((item: any) => {
    return item.id !== clickID;
  });
  //Reindex array
  for (let i = 0; i < foundValuesArray.length; i++) {
    foundValuesArray[i].id = i;
  }
  weatherListAlreadyAddedDiv.innerHTML = "";
  saveCachedListArray();
  saveCachedListView();
  saveFoundValue();
  buildArrayFromAlreadyAdded();
}
//=========================================================================================================
