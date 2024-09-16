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
  getArrayData();
  getCachedListArray();
  getCurrentPage1();
  getCurrentPage2();
  updateCurrentpage1View();
  updateCurrentpage2View();
  updateRecords1stListView();
  updateRecords2ndListView();
  displayForecasts1stList();
  displayForecasts2ndList();
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
const searchInputCity = <HTMLInputElement>(
  document.getElementById("search-input-city")
);
const searchInputZip = <HTMLInputElement>(
  document.getElementById("search-input-zip")
);
const searchInputCoord = <HTMLInputElement>(
  document.getElementById("search-input-coord")
);
const cityLabel = <HTMLInputElement>document.getElementById("city-search");
const zipLabel = <HTMLInputElement>document.getElementById("zip-search");
const coordLabel = <HTMLInputElement>document.getElementById("coord-search");
let searchInputValueCity: string = "";
let searchInputValueZip: string = "";
let searchInputValueCoord: string = "";
let zip = "";
let country_code = "";
let lat = "";
let lon = "";
let city = "";
let cityEnabled = false;
let zipEnabled = false;
let coordEnabled = false;
let cityRadio: HTMLElement = document.getElementById("city")!;
let zipRadio: HTMLElement = document.getElementById("zip")!;
let coordRadio: HTMLElement = document.getElementById("coord")!;
let isValueFound1stList =
  localStorage.getItem("isFoundValue 1st list") || false;
searchInputCity.addEventListener("change", updateValueCity);
searchInputZip.addEventListener("change", updateValueZip);
searchInputCoord.addEventListener("change", updateValueCoord);
searchButton.addEventListener("click", getWeatherData);
cityRadio.addEventListener("click", revealCitySearch);
zipRadio.addEventListener("click", revealZipSearch);
coordRadio.addEventListener("click", revealCoordSearch);

function revealCitySearch() {
  cityEnabled = true;
  if (zipEnabled) {
    zipLabel.style.display = "none";
    searchInputZip.style.display = "none";
    zipEnabled = false;
  }
  if (coordEnabled) {
    coordLabel.style.display = "none";
    searchInputCoord.style.display = "none";
    coordEnabled = false;
  }
  searchInputCity.style.display = "block";
  cityLabel.style.display = "block";
}

function revealZipSearch() {
  zipEnabled = true;
  if (cityEnabled) {
    cityLabel.style.display = "none";
    searchInputCity.style.display = "none";
    cityEnabled = false;
  }
  if (coordEnabled) {
    coordLabel.style.display = "none";
    searchInputCoord.style.display = "none";
    coordEnabled = false;
  }
  searchInputZip.style.display = "block";
  zipLabel.style.display = "block";
}

function revealCoordSearch() {
  coordEnabled = true;
  if (cityEnabled) {
    cityLabel.style.display = "none";
    searchInputCity.style.display = "none";
    cityEnabled = false;
  }
  if (zipEnabled) {
    zipLabel.style.display = "none";
    searchInputZip.style.display = "none";
    zipEnabled = false;
  }
  searchInputCoord.style.display = "block";
  coordLabel.style.display = "block";
}
//Get data from api. 1st list
async function getWeatherData(): Promise<void> {
  //Radio selection functionality to switch between inputs and api calls
  let testSearchInputValue = "";
  const api_key = VITE_API_KEY;
  const api_url = "https://api.openweathermap.org/data/2.5/weather?";
  let api_url_options = ``;
  if (cityEnabled) {
    testSearchInputValue = searchInputValueCity;
    api_url_options = `q=${city}` + `&units=metric` + `&appid=${api_key}`;
    searchInputValueZip = "";
    searchInputValueCoord = "";
    searchInputZip.value = "";
    searchInputCoord.value = "";
  }

  if (zipEnabled) {
    testSearchInputValue = searchInputValueZip;
    api_url_options =
      `zip=${zip},${country_code}` + `&units=metric` + `&appid=${api_key}`;
    searchInputValueCity = "";
    searchInputValueCoord = "";
    searchInputCoord.value = "";
    searchInputCity.value = "";
  }

  if (coordEnabled) {
    testSearchInputValue = searchInputValueCoord;
    api_url_options =
      `lat=${lat}` + `&lon=${lon}` + `&units=metric` + `&appid=${api_key}`;
    searchInputValueZip = "";
    searchInputValueCity = "";
    searchInputCity.value = "";
    searchInputZip.value = "";
  }

  if (testSearchInputValue === "") {
    alert("Please enter value first");
  } else {
    //For production turbut just use VITE_API_KEY in VERCEL ir turetu veikti
    try {
      const { data } = await axios.get(api_url + api_url_options);
      const sunriseUnix: number = data.sys.sunrise;
      const sunsetUnix: number = data.sys.sunset;
      const sunrise: Object = new Date(sunriseUnix * 1000);
      const sunset: Object = new Date(sunsetUnix * 1000);
      getArrayData();
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
        updateRecords1stListView();
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
            updateRecords1stListView();
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
  weatherListDiv.innerHTML = "";
  createPaginatedArray1(currentPage1);
  buildHTML1();
}

function displayForecasts2ndList() {
  getCachedListArray();
  weatherListAlreadyAddedDiv.innerHTML = "";
  createPaginatedArray2(currentPage2);
  buildHTML2();
}

function buildHTML1() {
  paginated1stArray.forEach((item: any) => {
    let div: HTMLElement = document.createElement("div");
    let p: HTMLParagraphElement = document.createElement("p");
    let deleteButton: HTMLElement = document.createElement("button");
    div.setAttribute("id", `weather-item-` + item.id);
    weatherListDiv.appendChild(div);
    let weatherItemDiv = document.querySelector(`#weather-item-${item.id}`)!;
    p.textContent = "City: " + item.city + " Country: " + item.country;
    p.classList.add("paragraph");
    deleteButton.innerHTML = "Delete";
    deleteButton.classList.add("button", "is-danger");
    deleteButton.setAttribute("id", `weather-button-` + item.id);
    weatherItemDiv.appendChild(p);
    weatherItemDiv.appendChild(deleteButton);
  });
  savePaginatedView1();
  getPaginatedView1();
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
  displayForecasts1stList();
  updateRecords1stListView();
}

//Does value exist. 1st list.
function doesValueExist1stList(): boolean {
  isValueFound1stList = false;
  savedWeatherArray.forEach((item: any) => {
    if (item.city.toLowerCase() == searchInputValueCity.toLowerCase()) {
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

//Function to updatate search input values. 1st list
function updateValueCity(e: any): void {
  searchInputValueCity = e.target.value.toLowerCase();
  city = searchInputValueCity;
}
function updateValueZip(e: any): void {
  searchInputValueZip = e.target.value;
  let separatedZipInputArray = searchInputValueZip.split(", ");
  separatedZipInputArray[0] = separatedZipInputArray[0].replace(/\s/g, "");
  separatedZipInputArray[1] = separatedZipInputArray[1].replace(/\s/g, "");
  zip = separatedZipInputArray[0];
  country_code = separatedZipInputArray[1];
  console.log(zip, country_code);
}
function updateValueCoord(e: any): void {
  searchInputValueCoord = e.target.value;
  let separatedCoordInputArray = searchInputValueCoord.split(", ");
  separatedCoordInputArray[0] = separatedCoordInputArray[0].replace(/\s/g, "");
  separatedCoordInputArray[1] = separatedCoordInputArray[1].replace(/\s/g, "");
  lat = separatedCoordInputArray[0];
  lon = separatedCoordInputArray[1];
  console.log(lat, lon);
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

function savePaginatedView1() {
  localStorage.setItem("paginated list view 1", weatherListDiv.innerHTML);
}

function getPaginatedView1() {
  weatherListDiv.innerHTML =
    localStorage.getItem("paginated list view 1") || "";
}

function savePaginatedView2() {
  localStorage.setItem(
    "paginated list view 2",
    weatherListAlreadyAddedDiv.innerHTML
  );
}

function getPaginatedView2() {
  weatherListAlreadyAddedDiv.innerHTML =
    localStorage.getItem("paginated list view 2") || "";
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
  document.getElementById("search-input-city-from-cache")
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
            displayForecasts2ndList();
            updateRecords2ndListView();
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
          displayForecasts2ndList();
          updateRecords2ndListView();
        }
      }
      /*
      //This does not seem to work correctly
      else {
        alert("Forecast does not exist in already added forecasts list");
        break;
      }
      */
    }
    console.log(
      "Whole array:" + JSON.stringify(foundValuesArray, undefined, 2)
    );
  }
}

//Display data. 2nd list
function displayForecasts() {
  getCachedListArray();
  weatherListAlreadyAddedDiv.innerHTML = "";
  paginated2ndArray.forEach((item: any) => {
    let div: HTMLElement = document.createElement("div");
    let p: HTMLParagraphElement = document.createElement("p");
    let deleteButton: HTMLElement = document.createElement("button");
    let img: HTMLImageElement = document.createElement("img");
    div.setAttribute("id", `weather-item-cached-` + item.id);
    weatherListAlreadyAddedDiv.appendChild(div);
    let weatherItemCachedDiv = document.querySelector(
      `#weather-item-cached-${item.id}`
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
    p.classList.add("paragraph");
    deleteButton.innerHTML = "Delete";
    deleteButton.classList.add("button", "is-danger");
    deleteButton.setAttribute("id", `weather-button-cached` + item.id);
    weatherItemCachedDiv.appendChild(img);
    weatherItemCachedDiv.appendChild(p);
    weatherItemCachedDiv.appendChild(deleteButton);
  });
  savePaginatedView2();
  displayForecasts2ndList();
}

//Delete logic. 2nd list
weatherListAlreadyAddedDiv.addEventListener("click", function (e) {
  let element = e.target as HTMLElement;
  if (element.tagName === "BUTTON") {
    console.log("Clicked element.id:" + element.id.replace(/\D/g, ""));
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
  displayForecasts();
  updateRecords2ndListView();
}

function buildHTML2() {
  paginated2ndArray.forEach((item: any) => {
    let div: HTMLElement = document.createElement("div");
    let p: HTMLParagraphElement = document.createElement("p");
    let deleteButton: HTMLElement = document.createElement("button");
    let img: HTMLImageElement = document.createElement("img");
    div.setAttribute("id", `weather-cached-item-` + item.id);
    weatherListAlreadyAddedDiv.appendChild(div);
    let weatherItemCachedDiv = document.querySelector(
      `#weather-cached-item-${item.id}`
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
    p.classList.add("paragraph");
    deleteButton.innerHTML = "Delete";
    deleteButton.classList.add("button", "is-danger");
    deleteButton.setAttribute("id", `weather-button-` + item.id);
    weatherItemCachedDiv.appendChild(img);
    weatherItemCachedDiv.appendChild(p);
    weatherItemCachedDiv.appendChild(deleteButton);
  });
  savePaginatedView2();
  getPaginatedView2();
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

function saveFoundValue() {
  localStorage.setItem("found value object", JSON.stringify(foundValueObject));
}

function getFoundValue() {
  foundValueObject = JSON.parse(
    localStorage.getItem("found value object") || "{}"
  );
}
//===================================================================================================================================================================================
//Pagination 1st list
//===================================================================================================================================================================================
//Global variable for both lists
const itemsPerPage = 10;
//===================================================================================================================================================================================
let currentPage1 = 1;
let paginated1stArray: Array<Object> = [];
const pageDownButton1: HTMLElement = document.getElementById("prev-page-1")!;
const pageUpButton1: HTMLElement = document.getElementById("next-page-1")!;
pageUpButton1.addEventListener("click", nextPage1);
pageDownButton1.addEventListener("click", prevPage1);
const currentPage1Container: HTMLElement = document.getElementById(
  "current-page-1-container"
)!;

const recordsCountContainer1: HTMLElement = document.getElementById(
  "records-1st-list-container"
)!;

function updateCurrentpage1View() {
  currentPage1Container.innerHTML = "";
  currentPage1Container.innerHTML = String(currentPage1);
}

function updateRecords1stListView() {
  recordsCountContainer1.innerHTML = "";
  recordsCountContainer1.innerHTML = String(savedWeatherArray.length);
}

function saveCurrentPage1() {
  localStorage.setItem("current page 1", String(currentPage1));
}

function getCurrentPage1() {
  currentPage1 = Number(localStorage.getItem("current page 1") || 1);
}

function savePaginatedArray1() {
  localStorage.setItem("paginated array 1", JSON.stringify(paginated1stArray));
}

function getPaginatedArray1() {
  paginated1stArray = JSON.parse(
    localStorage.getItem("paginated array 1") || "[]"
  );
}

function createPaginatedArray1(currentPage: number) {
  getPaginatedArray1();
  paginated1stArray = [];
  for (let i = 0; i < savedWeatherArray.length; i++) {
    if (
      i >= (currentPage - 1) * itemsPerPage &&
      i < currentPage * itemsPerPage
    ) {
      paginated1stArray.push(savedWeatherArray[i]);
    }
  }
  savePaginatedArray1();
}

function prevPage1() {
  getCurrentPage1();
  if (currentPage1 === 1) {
    alert("This is already first page");
    saveCurrentPage1();
  } else {
    currentPage1 = currentPage1 - 1;
    console.log("prev page button clicked. Pagination function called");
    getArrayData();
    weatherListDiv.innerHTML = "";
    createPaginatedArray1(currentPage1);
    buildHTML1();
    saveCurrentPage1();
  }
  updateCurrentpage1View();
}

function nextPage1() {
  getCurrentPage1();
  getPaginatedArray1();
  getArrayData();
  if (paginated1stArray.length === savedWeatherArray.length) {
    alert("This is already last page");
    saveCurrentPage1();
  } else {
    getCurrentPage1();
    if (currentPage1 <= Math.floor(savedWeatherArray.length / itemsPerPage)) {
      currentPage1 = currentPage1 + 1;
      console.log("next page button clicked. Pagination function called ");
      getArrayData();
      weatherListDiv.innerHTML = "";
      createPaginatedArray1(currentPage1);
      buildHTML1();
      saveCurrentPage1();
    } else {
      alert("This is already last page");
      saveCurrentPage1();
    }
  }
  updateCurrentpage1View();
}
//===================================================================================================================================================================================
//Pagination 2nd list
//===================================================================================================================================================================================
let currentPage2 = 1;
let paginated2ndArray: Array<Object> = [];
const pageDownButton2: HTMLElement = document.getElementById("prev-page-2")!;
const pageUpButton2: HTMLElement = document.getElementById("next-page-2")!;
pageUpButton2.addEventListener("click", nextPage2);
pageDownButton2.addEventListener("click", prevPage2);
const currentPage2Container: HTMLElement = document.getElementById(
  "current-page-2-container"
)!;
const recordsCountContainer2: HTMLElement = document.getElementById(
  "records-2nd-list-container"
)!;

function updateCurrentpage2View() {
  currentPage2Container.innerHTML = "";
  getCurrentPage2();
  currentPage2Container.innerHTML = String(currentPage2);
}

function updateRecords2ndListView() {
  recordsCountContainer2.innerHTML = "";
  recordsCountContainer2.innerHTML = String(foundValuesArray.length);
}

function saveCurrentPage2() {
  localStorage.setItem("current page 2", String(currentPage2));
}

function getCurrentPage2() {
  currentPage2 = Number(localStorage.getItem("current page 2") || 1);
}

function savePaginatedArray2() {
  localStorage.setItem("paginated array 2", JSON.stringify(paginated2ndArray));
}

function getPaginatedArray2() {
  paginated2ndArray = JSON.parse(
    localStorage.getItem("paginated array 2") || "[]"
  );
}

function createPaginatedArray2(currentPage: number) {
  getPaginatedArray2();
  paginated2ndArray = [];
  for (let i = 0; i < foundValuesArray.length; i++) {
    if (
      i >= (currentPage - 1) * itemsPerPage &&
      i < currentPage * itemsPerPage
    ) {
      paginated2ndArray.push(foundValuesArray[i]);
    }
  }
  savePaginatedArray2();
}

function prevPage2() {
  getCurrentPage2();

  if (currentPage2 === 1) {
    alert("This is already first page");
    saveCurrentPage2();
  } else {
    currentPage2 = currentPage2 - 1;
    console.log("prev page button clicked. Pagination function called");
    getCachedListArray();
    weatherListAlreadyAddedDiv.innerHTML = "";
    createPaginatedArray2(currentPage2);
    buildHTML2();
    saveCurrentPage2();
  }
  updateCurrentpage2View();
}

function nextPage2() {
  getCurrentPage2();
  getPaginatedArray2();
  getCachedListArray();
  if (paginated2ndArray.length === foundValuesArray.length) {
    alert("This is already last page");
    saveCurrentPage2();
  } else {
    getCurrentPage2();
    if (currentPage2 <= Math.floor(foundValuesArray.length / itemsPerPage)) {
      currentPage2 = currentPage2 + 1;
      console.log("next page button clicked. Pagination function called ");
      getCachedListArray();
      weatherListAlreadyAddedDiv.innerHTML = "";
      createPaginatedArray2(currentPage2);
      buildHTML2();
      saveCurrentPage2();
    } else {
      alert("This is already last page");
      saveCurrentPage2();
    }
  }
  updateCurrentpage2View();
}
