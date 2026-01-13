import axios from "axios";

axios
  .get("https://api.carbonintensity.org.uk/intensity/date")
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
