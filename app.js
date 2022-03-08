const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql');

const url = "https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3"

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ras050701",
    database: 'exam'
});

async function scrapeData(){
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const listItems = $(".plainlist ul li");
        const countries = [];
        listItems.each((idx, el) => {
            const country = {name: "", iso3: ""};
            country.name = $(el).children("a").text();
            country.iso3 = $(el).children("span").text();
            countries.push(country);
        });
        for(var i = 0; i <= countries.length-1; i++){
            let dataName = countries[i].name;
            let dataISO = countries[i].iso3;
            con.query(`INSERT INTO Countries VALUES("${dataName}", "${dataISO}")`);
        }
        con.end();
    } catch (err) {
        console.error(err);
    }
}
scrapeData();
