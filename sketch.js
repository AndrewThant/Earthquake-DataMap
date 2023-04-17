let mapimg;
let earthquake;
let time;
let val;

//lat lon value of center
const cLon = 0;
const cLat = 0;
const zoom = 1;

const dropdown = document.querySelector(".dropdown");
const timeTag = document.getElementById("time");

function preload() {
  // Get stored value or default value
  time = localStorage.getItem("time") || "all_month";

  //getting world map data
  mapimg = loadImage(
    "https://api.mapbox.com/styles/v1/mapbox/dark-v8/static/0,0,1,0,0/1280x512?access_token=pk.eyJ1IjoicnVzcy1tdCIsImEiOiJjbGdobTU5NmgwbXhvM2ZwbXRjeG84aDl2In0.92AiH-OFPkT5DonBZ4tlpw"
  );
  // getting earthquake data
  earthquake = loadStrings(
    `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${time}.csv`
  );

  //time will be set according to selected value
  dropdown.addEventListener("change", () => {
    val = dropdown.value;
    window.location.reload();
    switch (val) {
      case "30":
        localStorage.setItem("time", "all_month");

        break;
      case "7":
        localStorage.setItem("time", "all_week");

        break;
      case "1":
        localStorage.setItem("time", "all_day");

        break;
    }
  });
}

//Calculating x and y corrdinates from lat, lon with WebMercator Formula
function mercX(lon) {
  lon = radians(lon);
  const a = (256 / PI) * pow(2, zoom);
  const b = lon + PI;
  return a * b;
}
function mercY(lat) {
  lat = radians(lat);
  const a = (256 / PI) * pow(2, zoom);
  const b = tan(PI / 4 + lat / 2);
  const c = PI - log(b);
  return a * c;
}

//drawing visualization on map
function setup() {
  createCanvas(1250, 512);
  translate(width / 2, height / 2);
  imageMode(CENTER);
  image(mapimg, 0, 0);

  timeTag.innerHTML = `(${val ? val : 30} ${val === 1 ? "Day" : "Days"})`;

  let cx = mercX(cLon);
  let cy = mercY(cLat);

  if (earthquake) {
    for (let i = 0; i < earthquake.length; i++) {
      const data = earthquake[i].split(/,/);
      let col = color(255, 0, 255, 150);

      let lat = data[1];
      let lon = data[2];
      let x = mercX(lon) - cx;
      let y = mercY(lat) - cy;

      //getting magnitude from csv data
      //mag is measured in log
      let mag = data[4];

      //change log value to normal value
      mag = pow(10, mag);
      mag = sqrt(mag);
      let magmax = sqrt(pow(10, 10));

      //map out the value
      let d = map(mag, 0, magmax, 0, 500);

      //change color if mag is high
      if (d > 5) {
        col = color(255, 0, 0, 150);
      }
      stroke(col);
      fill(col);
      ellipse(x, y, d, d);
    }
  }
}
