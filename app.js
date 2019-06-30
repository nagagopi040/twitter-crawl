const axios = require("axios");
const cherio = require("cherio");

const express = require('express')
const app = express()

const getHTML = async (url) => {
    let { data } = await axios.get(url);
    let $ = cherio.load(data);
    let tweets = [];
    $(".tweet-text").each( (index, value) => {
        let tweet = $(value).text();
        tweet = tweet.replace(/\n/g, " <br> ")
        tweet = tweet.replace(/\\/g, "");
        tweet = getEntities(tweet);
        tweet = tweet.replace(new RegExp("</strong> <strong>", "g"), " ");
        $(".twitter-hashtag", value).each( (index, hashTag) => {
            let href = $(hashTag).attr("href");
            let text = $(hashTag).text();
            let hashTagElement = text && changeLinks(text, href);
            tweet = tweet.replace(text, hashTagElement);
        });
        $(".twitter-atreply", value).each( (index, user) => {
            let href = $(user).attr("href");
            let text = $(user).text();
            let username = text && changeLinks(text, href);
            tweet = tweet.replace(text, username);
        });
        $("a", value).each( (index, media) => {
            let href = $(media).attr("href");
            let text = $(media).text();
            if(text.search(/pic.twitter/g) !== -1) {
                let mediaTag = convertMedia(text, href);
                tweet = tweet.replace(text, mediaTag);
            }
        })
        $(".twitter-timeline-link").each( (index, link) => {
            let href = $(link).attr("href");
            let text = $(link).text();
            let newLink = text && convertMedia(text, href);
            tweet = tweet.replace(text, newLink);
        })
        tweet = tweet.replace(/\\/g, "");
        tweets[index] = tweet;
    });
    return tweets;
}

const changeLinks = (link, href) => {
    return `<a href="https://twitter.com${href}">${link}</a>`
}


const convertMedia = (text, href) => {
    return `<a href="${href}">${text}</a>`
}

const getEntities = (text) => {
    let words = text.split(/(?:,| )+/);
    let newWords = words.map( word => word && word[0].match(/[a-z]|[A_Z]/i) && word[0] === word[0].toUpperCase() ? `<strong>${word}</strong>` : word )
    return newWords.join(" ");
}

 
app.get('/', async (req, res) => {
    let response = await getHTML("https://twitter.com/twitter")
    res.send(response);
})
 
app.listen(3000, () => console.log("Server is Running on: 3000"))