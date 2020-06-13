const express = require("express");

const Crawler = require("crawler");
const fs = require("fs");

let crawler = new Crawler({
  maxConnections: 10,
  // This will be called for each crawled page
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      fs.createWriteStream(res.options.filename).write(res.body);
    }
    done();
  },
});

crawler.queue({
  uri:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/F1_green_flag.svg/1200px-F1_green_flag.svg.png",
  filename: "myImage.jpg",
  encoding: null,
  jQuery: false,
});

console.log("dkm");
