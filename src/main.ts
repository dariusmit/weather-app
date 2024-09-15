//Tool to communicate with API
import axios from "axios";

//Types
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

//Onload actions
window.onload = () => {
  getListView();
  getCachedListView();
  isValueFound = false;
  localStorage.setItem("isFoundValue", String(isValueFound));
  isValueFound1stList = false;
  localStorage.setItem("isFoundValue 1st list", String(isValueFound1stList));
};

//===================================================================================================================================================================================
//1st list functionality below. Data from the API
//===================================================================================================================================================================================

//Variables & Event listeners. 1st list
let savedWeatherArray: weatherType[] = [];
const searchButton: HTMLElement = document.getElementById("search-button")!;
let weatherListDiv: HTMLElement = document.getElementById("weather-list")!;
const searchInput = <HTMLInputElement>document.getElementById("search-input");
let searchInputValue: string = "";
//let ValueObject: any = {};
let isValueFound1stList =
  localStorage.getItem("isFoundValue 1st list") || false;
searchInput.addEventListener("change", updateValue);
searchButton.addEventListener("click", getWeatherData);

//Get data from api. 1st list
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
      //Cia reiketu ideti checka if its not already added value
      if (savedWeatherArray.length === 0) {
        console.log("Array is empty so we can just add the value");
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
        displayForecasts1stList();
      } else {
        for (let i = 0; i < savedWeatherArray.length; i++) {
          console.log(
            "Array is not empty anymore so we need to check if we are trying to add the value that already exists"
          );
          if (doesValueExist1stList() === true) {
            console.log("Trying to add the value that already exists");
            break;
          } else {
            console.log(
              "Values are not equal so we can add new value to the array"
            );
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
            displayForecasts1stList();
            break;
          }
        }
      }
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

//Display data from the API. 1st list
function displayForecasts1stList() {
  getArrayData();
  let div: HTMLElement = document.createElement("div");
  let p: HTMLParagraphElement = document.createElement("p");
  let deleteButton: HTMLElement = document.createElement("button");
  let img: HTMLImageElement = document.createElement("img");
  savedWeatherArray.forEach((item: any) => {
    div.setAttribute("id", `weather-item-` + item.id);
    weatherListDiv.appendChild(div);
    let weatherItemDiv = document.querySelector(`#weather-item-${item.id}`)!;
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
    deleteButton.setAttribute("id", `weather-button-` + item.id);
    weatherItemDiv.appendChild(img);
    weatherItemDiv.appendChild(p);
    weatherItemDiv.appendChild(deleteButton);
  });
  saveView();
  getListView();
}

//Delete logic. 1st list.
weatherListDiv.addEventListener("click", function (e) {
  let element = e.target as HTMLElement;
  if (element.tagName === "BUTTON") {
    console.log("Clicked element.id:" + element.id.replace(/\D/g, ""));
    deleteItem(Number(element.id.replace(/\D/g, "")));
  }
});
function deleteItem(clickID: number): void {
  console.log("Item with the id of: " + clickID + " was deleted!");
  getArrayData();
  savedWeatherArray = savedWeatherArray.filter((item) => {
    return item.id !== clickID;
  });
  for (let i = 0; i < savedWeatherArray.length; i++) {
    savedWeatherArray[i].id = i;
  }
  weatherListDiv.innerHTML = "";
  saveView();
  saveArrayToStorage();
  //This function builds list and calls render function without connecting to API
  displayForecasts1stList();
}

//Does value exist. 1st list.
function doesValueExist1stList(): boolean {
  isValueFound1stList = false;
  savedWeatherArray.forEach((item: any) => {
    if (item.city.toLowerCase() == searchInputValue.toLowerCase()) {
      console.log("Values are equal");
      isValueFound1stList = true;
      localStorage.setItem(
        "isFoundValue 1st list",
        String(isValueFound1stList)
      );
    }
  });
  if (isValueFound1stList) {
    return true;
  } else {
    console.log("Values are not equal");
    isValueFound1stList = false;
    localStorage.setItem("isFoundValue 1st list", String(isValueFound1stList));
    return false;
  }
}

//Function to updatate search input value. 1st list
function updateValue(e: any): void {
  searchInputValue = e.target.value.toLowerCase();
}

//Local cache functions. 1st list
function saveArrayToStorage() {
  localStorage.setItem("weather array", JSON.stringify(savedWeatherArray));
}

function getArrayData() {
  savedWeatherArray = JSON.parse(localStorage.getItem("weather array") || "[]");
}

function saveView() {
  localStorage.setItem("list view", weatherListDiv.innerHTML);
}

function getListView() {
  weatherListDiv.innerHTML = localStorage.getItem("list view") || "";
}
//===================================================================================================================================================================================
//Search already added forecast functionality below. 2nd list
//===================================================================================================================================================================================
//Variables & Event listeners. 2nd list
let foundValuesArray: any = [];
const searchAlreadyAddedButton = <HTMLButtonElement>(
  document.getElementById("search-button-from-cache")
);
let weatherListAlreadyAddedDiv: HTMLElement = document.getElementById(
  "weather-list-already-added"
)!;
const searchAlreadyAddedInput = <HTMLInputElement>(
  document.getElementById("search-input-from-cache")
);
let searchAlreadyAddedInputValue: string = "";
let foundValueObject: any;
let isValueFound = localStorage.getItem("isFoundValue") || false;
searchAlreadyAddedInput.addEventListener(
  "change",
  updateAlreadyAddedSearchValue
);
searchAlreadyAddedButton.addEventListener("click", buildArrayFromAlreadyAdded);

//Building new array from already added forecasts list. 2nd list
function buildArrayFromAlreadyAdded() {
  console.log("Search input value: " + searchAlreadyAddedInputValue);
  getCachedListArray();
  getArrayData();
  if (searchAlreadyAddedInputValue === "") {
    alert("Please enter city name first");
  } else {
    for (let i = 0; i < savedWeatherArray.length; i++) {
      if (
        savedWeatherArray[i].city.toLowerCase() ==
        searchAlreadyAddedInputValue.toLowerCase()
      ) {
        getFoundValue();
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
            break;
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
    console.log(
      "Whole array:" + JSON.stringify(foundValuesArray, undefined, 2)
    );
  }
}

//Display data. 2nd list
function displayForecasts() {
  getCachedListArray();
  let div: HTMLElement = document.createElement("div");
  let p: HTMLParagraphElement = document.createElement("p");
  let deleteButton: HTMLElement = document.createElement("button");
  let img: HTMLImageElement = document.createElement("img");
  foundValuesArray.forEach((item: any) => {
    div.setAttribute(
      "id",
      `weather-item-cached-` + (foundValuesArray.length - 1)
    );
    weatherListAlreadyAddedDiv.appendChild(div);
    let weatherItemDiv = document.querySelector(
      `#weather-item-cached-${foundValuesArray.length - 1}`
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
    deleteButton.setAttribute(
      "id",
      `weather-button-cached` + (foundValuesArray.length - 1)
    );
    weatherItemDiv.appendChild(img);
    weatherItemDiv.appendChild(p);
    weatherItemDiv.appendChild(deleteButton);
  });
  saveCachedListView();
  getCachedListView();
}

//Delete logic. 2nd list
weatherListAlreadyAddedDiv.addEventListener("click", function (e) {
  let element = e.target as HTMLElement;
  if (element.tagName === "BUTTON") {
    console.log("Clicked element.id:" + element.id.replace(/\D/g, ""));
    //element.parentElement!.remove();
    deleteCachedListItem(Number(element.id.replace(/\D/g, "")));
  }
});
function deleteCachedListItem(clickID: number): void {
  console.log("Item with the id of: " + clickID + " was deleted!");
  getCachedListArray();
  foundValuesArray = foundValuesArray.filter((item: any) => {
    return item.id !== clickID;
  });
  for (let i = 0; i < foundValuesArray.length; i++) {
    foundValuesArray[i].id = i;
  }
  weatherListAlreadyAddedDiv.innerHTML = "";
  saveCachedListArray();
  saveCachedListView();
  buildArrayFromAlreadyAdded();
}

//Does value exist. 2nd list
function doesValueExist(): boolean {
  isValueFound = false;
  getCachedListArray();
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

//Function to updatate search input value. 2nd list
function updateAlreadyAddedSearchValue(e: any): void {
  searchAlreadyAddedInputValue = e.target.value.toLowerCase();
}

//Local cache functions. 2nd list
function saveCachedListArray() {
  localStorage.setItem("cached list array", JSON.stringify(foundValuesArray));
}

function getCachedListArray() {
  foundValuesArray = JSON.parse(
    localStorage.getItem("cached list array") || "[]"
  );
}

function saveCachedListView() {
  localStorage.setItem(
    "cached list view",
    weatherListAlreadyAddedDiv.innerHTML
  );
}

function getCachedListView() {
  weatherListAlreadyAddedDiv.innerHTML =
    localStorage.getItem("cached list view") || "";
}

function saveFoundValue() {
  localStorage.setItem("found value object", JSON.stringify(foundValueObject));
}

function getFoundValue() {
  foundValueObject = JSON.parse(
    localStorage.getItem("found value object") || "{}"
  );
}
