const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

fetch("https://cards-against-humanity-api.herokuapp.com/sets")
    .then(res => res.json())
    .then(json => {
        json.forEach((setObject, key) => {
            fetch(`https://cards-against-humanity-api.herokuapp.com/sets/${setObject.setName}`)
                .then(res => res.json())
                .then(json => {
                    let createStream = fs.createWriteStream(path.join(__dirname, "data", "sets", `${setObject.setName}.json`));
                    createStream.write(JSON.stringify(json, null, 4));
                    createStream.end();
                    console.log(`Created File : ${setObject.setName}.json`);
                });
        });
    });