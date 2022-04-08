const fs = require("fs");

fs.readFile("./out/index.html",{ encoding: "utf8" }, (error, data) => {
  if (error) {
    console.warn(error)
    return;
  }
  data = data.replace("<head>", `<head><!-- 
  St. Luke's Little Summer
-->`)
  fs.writeFileSync( "./out/index.html" , data);
  console.log("Done");
});
