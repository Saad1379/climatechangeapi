const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { contains } = require("cheerio/lib/static");
const PORT = process.env.PORT || 3000;

const app = express();

const newspapers = [
    {
        name : 'thetimes',
        address : 'https://www.thetimes.co.uk/environment/climate-change',
        baseURL : ''
    },
    {
        name : 'theguardian',
        address : 'https://www.theguardian.com/environment/climate-crisis',
        baseURL : ''
    },
    {
        name : 'thetelegraph',
        address : 'https://www.telegraph.co.uk/climate-change/',
        baseURL : 'https://www.telegraph.co.uk'
    },
    {
        name : 'bbc',
        address : 'https://www.bbc.com/news/science-environment-56837908',
        baseURL : ''
    },
    {
        name : 'washingtonpost',
        address : 'https://www.washingtonpost.com/climate-environment/',
        baseURL : ''
    },
    {
        name : 'missouriindependent',
        address : 'https://missouriindependent.com/category/energy-environment/',
        baseURL : ''
    },
    {
        name : 'latimes',
        address : 'https://www.latimes.com/environment',
        baseURL : ''
    }

]
const articles = [];   
const specificArticles = [];
newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(function(response){
        const html = response.data;
        const $ = cheerio.load(html);
        $('a:contains("climate")', html).each(function(){
            const title = $(this).text();
            const url = $(this).attr('href');
            articles.push({
                title,
                url : newspaper.baseURL + url,
                source : newspaper.name
            })          
        });
    })
});
app.get('/', function(req, res){
    res.send("Welcome to my climate change api")
}); 

app.get('/news', function(req, res){
    res.send(articles)
});

app.get('/news/:newspaperId', async (req, res) => {
    const newspaperId = req.params.newspaperId
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].baseURL
    console.log(newspaperAddress)

    axios.get(newspaperAddress).then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        });
        res.send(specificArticles)

    }).catch(err => console.log(err))
});

app.listen(PORT)