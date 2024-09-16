### Weather App using Open Weather Map Current Weather Data API built with HTML, CSS and TypeScript.

- For styling both vanilla CSS and Bulma.io library was used.
- Axios library was used to communicate with the API.
- ENV file was used to hide the API key.
- Project was built and deployed using Vercel here: https://weather-app-sand-delta-40.vercel.app/

### Implemented functions

- Search by City, Country, Zip or Coordinates.
- Displaying 2 lists.
- Forecasts Delete functionality from both lists.
- Local storage to save Forecasts, Current page and Records count data.
- Script tag was moved to Head section.
- Error handling implemented. See console and alert boxes for errors.

### Missing functions

- Periodic automatic weather data updation.

### Known bugs

- Input field value and array generated from API call value comparison function bugs. Local letters like e and ė causes bugs and allow to add duplicate records since function considers
  that city named Kelmė and Kelme is not the same. ZIP code validation errors sometimes cause duplicate records.
- Missing error message for second list when value can't be found in first list.
