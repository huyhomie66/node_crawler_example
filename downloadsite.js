const url = require("url");
const path = require("path");
const Crawler = require("simplecrawler");
const fs = require("node-fs");

let downloadSite = function (initialURL, callback) {
  let myCrawler = new Crawler(initialURL),
    domain = url.parse(initialURL).hostname;

  myCrawler.interval = 250;
  myCrawler.maxConcurrency = 5;

  myCrawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
    // Parse url
    let parsed = url.parse(queueItem.url);

    // Rename / to index.html
    if (parsed.pathname === "/") {
      parsed.pathname = "/index.html";
    }

    // Where to save downloaded data
    let outputDirectory = path.join(__dirname, domain);

    // Get directory name in order to create any nested dirs
    let dirname = outputDirectory + parsed.pathname.replace(/\/[^/]+$/, "");

    // Path to save file
    let filepath = outputDirectory + parsed.pathname;

    // Check if DIR exists
    fs.exists(dirname, function (exists) {
      // If DIR exists, write file
      if (exists) {
        fs.writeFile(filepath, responseBuffer, function () {});
      } else {
        // Else, recursively create dir using node-fs, then write file
        fs.mkdir(dirname, 0755, true, function () {
          fs.writeFile(filepath, responseBuffer, function () {});
        });
      }
    });

    console.log(
      "I just received %s (%d bytes)",
      queueItem.url,
      responseBuffer.length
    );
    console.log(
      "It was a resource of type %s",
      response.headers["content-type"]
    );
  });

  // Fire callback
  myCrawler.on("complete", function () {
    callback();
  });

  // Start Crawl
  myCrawler.start();
};

downloadSite("https://www.npmjs.com/package/phantom", function () {
  console.log("Done!");
});
