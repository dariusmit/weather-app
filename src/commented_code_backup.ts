//let paginatedSavedWeatherList: weatherType[] = [];
//let currentPageGlobal: number = 1;
//let itemsPerPageGlobal: number = 3;
/*
const testPaginationButton: HTMLElement =
  document.getElementById("test-pages")!;
const prevPageButton: HTMLElement = document.getElementById("prev-page")!;
const nextPageButton: HTMLElement = document.getElementById("next-page")!;
*/

//const testArrayButton: HTMLElement = document.getElementById("test-array")!;

/*
function paginate(currentPage: number, itemsPerPage: number) {
  for (let i = 0; i < savedWeatherList.length; i++) {
    if (
      i >= (currentPage - 1) * itemsPerPage &&
      i < currentPage * itemsPerPage
    ) {
      paginatedSavedWeatherList = savedWeatherList.filter((item) => {
        return item.id === savedWeatherList[i].id;
      });
    }
  }}

function prevPage() {
  currentPageGlobal = currentPageGlobal - 1;
  console.log("prev page button clicked");
  console.log("CurrentPage: " + currentPageGlobal);
  paginate(currentPageGlobal, itemsPerPageGlobal);
}

function nextPage() {
  currentPageGlobal = currentPageGlobal + 1;
  console.log("next page button clicked");
  console.log("CurrentPage: " + currentPageGlobal);
  paginate(currentPageGlobal, itemsPerPageGlobal);
}
*/

/*
prevPageButton.addEventListener("click", prevPage);
nextPageButton.addEventListener("click", nextPage);
testPaginationButton.addEventListener("click", () => {
  //paginate(currentPageGlobal, itemsPerPageGlobal);
  console.log(JSON.stringify(paginatedSavedWeatherList, undefined, 2));
});
*/

/*
testArrayButton.addEventListener("click", (): void => {
  console.log(JSON.stringify(savedWeatherList, undefined, 2));
});
*/

//Construct list backup
/*
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
  */
