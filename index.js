//switch for checking history
let checkingHistory = false;

$(document).ready(() => {
    //hide form
    $('form').toggle();
    //populate newsfeed with first 5 tweets
    for (let i = 0; i < 6; i++) {
        //get data for tweet from streams.home array
        let handle = streams.home[i].user;
        let fullMessage = streams.home[i].message;
        //remove tag from message
        //extracting a hash tag
        let tagIndex = fullMessage.indexOf("#");
        if (tagIndex !== -1) {
            var message = fullMessage.slice(0, tagIndex);
            var tagss = fullMessage.slice(tagIndex);
        } else {
            var message = fullMessage;
            var tagss = "";
        }
        let timestamp = streams.home[i].created_at;
        //create tweet
        let $tweet = tweetMaker(handle, message, timestamp, tagss)
        $tweet.appendTo($("#newsfeed"))
    }
    //keep track of tweet location
    let index = 6;

    //keep newsfeed updated
    setInterval(() => {
        //check streams.home array
        if (streams.home.length - 1 > index && checkingHistory === false) {
            //create tweet
            let handle = streams.home[index].user;
            let fullMessage = streams.home[index].message;
            //remove tag from message
            //extracting a hash tag
            let tagIndex = fullMessage.indexOf("#");
            if (tagIndex !== -1) {
                var message = fullMessage.slice(0, tagIndex);
                var tagss = fullMessage.slice(tagIndex);
            } else {
                var message = fullMessage;
                var tagss = "";
            }

            let timestamp = streams.home[index].created_at;
            let $tweet = tweetMaker(handle, message, timestamp, tagss);
            $tweet.prependTo($("#newsfeed"))
            //update tweet location
            index++;
            //delete last tweet
            $("#newsfeed")
                .children()
                .last()
                .remove();
        }
    }, 0);


    //click event for cancel button
    $("#cancel").on("click", () => {
        $("h1").slideDown('slow');
        $("form").toggle();
        $("#new-tweet").fadeIn(1000);
    });

    //click event for new tweet
    $("#new-tweet").on("click", () => {
        //reset form field
        $('.form-field').val("");
        //show form
        $("form").slideDown('slow');
        $('h1').slideUp('slow');
        //toggle new tweet button
        $("#new-tweet").toggle();
    })

    //update values of inputs
    $(".form-field").change(function (e) {
        let val = e.target.value;
        $(e.target).attr("value", val);
    })




    //click event for submit form
    $('.create-tweet').on('submit', function (event) {
        index += 1;
        event.preventDefault()
        let values = $(this).serializeArray()
        //get handle
        let handle = values[0].value;
        let fullMessage = values[1].value;
        let timestamp = new Date();

        //immediately post tweet
        let tagIndex = fullMessage.indexOf("#");
        if (tagIndex !== -1) {
            var message = fullMessage.slice(0, tagIndex);
            var tagss = fullMessage.slice(tagIndex);
        } else {
            var message = fullMessage;
            var tagss = "";
        }
        $tweet = tweetMaker(handle, message, timestamp, tagss);
        $tweet.prependTo($("#newsfeed"))

        //delete last tweet
        $("#newsfeed")
            .children()
            .last()
            .remove();


        //create tweet and add to tweets array
        const tweet = {
            user: handle,
            message: fullMessage,
            created_at: timestamp
        };
        //add tweet as second to last element in array to avoid repeat post
        streams.home.splice(streams.home.length - 2, 0, tweet);
        //show title
        $("h1").slideDown('slow');
        //hide form
        $("form").toggle();
        $("#new-tweet").toggle();
    })

});





//create tweets
const tweetMaker = (handle, message, timestamp, tags) => {
    //create tweet div
    const $tweet = $('<div></div>');
    $tweet.attr("class", "tweet");
    //create tweet handle
    const $handle = $("<a>")
    $handle.text("@" + handle.toLowerCase());
    $handle.appendTo($tweet)
    //add click listener to handle
    $handle.on("click", event => {
        //get user
        let user = $(event.target)
            .text()
            .slice(1);
        //refresh feed with user tweets
        getHistory(user);
        $("#newsfeed").fadeOut(0)
        $("#newsfeed").fadeIn(1000)
    });
    //create correct timestamp
    let time = moment(timestamp).fromNow();
    //create tweet message
    const $message = $("<p class='message'>");
    let tweetBody = message;
    $message.text(tweetBody);
    $message.appendTo($tweet)

    //create tag 
    const $tag = $("<p>");
    $tag.attr("class", "tweet-tags");
    $tag.text(tags);
    //click event for tag
    $tag.on("click", event => {
        //get user
        let tag = $(event.target)
            .text()
        //refresh feed with user tweets
        timeInterval = 0;
        getTagHistory(tag);
        $("#newsfeed").fadeOut(0)
        $("#newsfeed").fadeIn(1000)
    });
    $tag.appendTo($tweet);

    const $time = $("<p>");
    $time.attr("id", "time");
    $time.text(time);
    $time.appendTo($tweet)
    //return created tweet
    return $tweet;
}

const getTagHistory = tag => {
    checkingHistory = true;
    //getting tag history
    let pastTweets = streams.home.filter(tweet => {
        return tweet.message.indexOf(tag) !== -1
    });
    //clear feed
    $("#newsfeed").html('');
    //add title to newsfeed
    let $user = $("<h4>");
    $user.text(tag);
    $user.appendTo("#newsfeed");
    //populate with up to 5 most recent tweets
    for (let i = pastTweets.length - 1; i > -1; i--) {
        //make sure tweet exits
        if (pastTweets[i]) {
            let handle = pastTweets[i].user;
            let fullMessage = pastTweets[i].message;
            //extracting a hash tag
            let tagIndex = fullMessage.indexOf("#");
            if (tagIndex !== -1) {
                var message = fullMessage.slice(0, tagIndex);
                var tagss = fullMessage.slice(tagIndex);
            } else {
                var message = fullMessage;
                var tagss = "";
            }
            let timestamp = pastTweets[i].created_at;
            let $tweet = tweetMaker(handle, message, timestamp)
            //append to newsfeed
            $tweet.appendTo($("#newsfeed"))
        }
    }
    //add back button
    let $backButton = $("<button>");
    $backButton.attr("type", "button");
    $backButton.attr("class", "btn btn-primary");
    $backButton.attr("id", "top-back");
    $backButton.text("back to feed");
    $backButton.on("click", () => {
        $("#newsfeed").fadeOut(0)
        $("#newsfeed").fadeIn(1000)
        repopFeed();
    });
    $backButton.prependTo($("#newsfeed"));

    //toggle new tweet button off and make sure form is removed
    $("#new-tweet").hide()
    $("form").hide()
}

//get user history
/* 
1. Clears feed
2. Displays 5 most recent tweets of user
3. Displays button to return to feed
*/
const getHistory = user => {
    checkingHistory = true;
    //gets users history
    let pastTweets = streams.home.filter(tweet => tweet.user === user);
    //clear feed
    $("#newsfeed").html('');
    //add title to newsfeed
    let $user = $("<h4>");
    $user.text("@" + user);
    $user.appendTo("#newsfeed");
    //populate with up to 5 most recent tweets
    for (let i = pastTweets.length - 1; i > -1; i--) {
        //make sure tweet exits
        if (pastTweets[i]) {
            let handle = pastTweets[i].user;
            let fullMessage = pastTweets[i].message;
            //extracting a hash tag
            let tagIndex = fullMessage.indexOf("#");
            if (tagIndex !== -1) {
                var message = fullMessage.slice(0, tagIndex);
                var tagss = fullMessage.slice(tagIndex);
            } else {
                var message = fullMessage;
                var tagss = "";
            }
            let timestamp = pastTweets[i].created_at;
            let $tweet = tweetMaker(handle, message, timestamp, tagss)
            //append to newsfeed
            $tweet.appendTo($("#newsfeed"))
        }
        //remove all links
        $("#newsfeed").find("a").each(function () {
            $(this).remove();
        });
    }
    //add back button
    let $backButton = $("<button>");
    $backButton.attr("type", "button");
    $backButton.attr("class", "btn btn-primary");
    $backButton.attr("id", "top-back");
    $backButton.text("back to feed");
    $backButton.on("click", () => {
        $("#newsfeed").fadeOut(0)
        $("#newsfeed").fadeIn(1000)
        repopFeed();
    });
    $backButton.prependTo($("#newsfeed"));

    //toggle new tweet button off and make sure form is removed
    $("#new-tweet").hide()
    $("form").hide()

}

//repopulate feed
const repopFeed = () => {
    //restart refresher
    checkingHistory = false;
    //clear feed
    $("#newsfeed").html('');
    for (let i = streams.home.length - 1; i > streams.home.length - 7; i--) {
        //make sure tweet exits
        let handle = streams.home[i].user;
        let fullMessage = streams.home[i].message;
        //extracting a hash tag
        let tagIndex = fullMessage.indexOf("#");
        if (tagIndex !== -1) {
            var message = fullMessage.slice(0, tagIndex);
            var tagss = fullMessage.slice(tagIndex);
        } else {
            var message = fullMessage;
            var tagss = "";
        }
        let timestamp = streams.home[i].created_at;
        let $tweet = tweetMaker(handle, message, timestamp, tagss)
        //append to newsfeed
        $tweet.appendTo($("#newsfeed"))
    }
    //toggle new tweet button on
    $("#new-tweet").toggle()
}

