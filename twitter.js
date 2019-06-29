const axios = require("axios");
const cherio = require("cherio");

const getHTMLFromTwitter = async (url) => {
    let { data } = await axios.get(url);
    let $ = cherio.load(data);
    let tweets = [];
    $(".tweet-text").each( (index, value) => {
    	let tweet = $(value).text();
    	tweet = tweet.replace(/\n/g, " <br> ")
    	tweet = tweet.replace(/(\|)/g, "");
    	getEntities(tweet);
    	$("a", value).each( (index, hashTag) => {
    		let href = $(hashTag).attr("href");
	    	let text = $(hashTag).text();
		    let hashTagElement = getHashTag(text, href);
		    tweet = tweet.replace(text, hashTagElement);
    	});
    	let userName = $(".twitter-atreply", value).text();
    	tweets[index] = tweet;
    });
    // console.log(tweets);
}

const getHashTag = (hashTag, href) => {
	return `<a href="https://twitter.com${href}">${hashTag}</a>`
}

const getEntities = (text) => {
	let words = text.split(/(?:,| )+/);
	words.map( word => word[0] === word[0].toUpperCase() ? `<strong>${word}</strong>` : word)
	console.log(words);
}

module.exports = getHTMLFromTwitter;