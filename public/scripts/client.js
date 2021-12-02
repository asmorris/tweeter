/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  const counterText = document.getElementById("counter-text");
  const submitButton = document.getElementById("submit-button");
  const tweetArea = document.getElementById("tweet-text");
  const errorDiv = document.getElementsByClassName("error")[0];
  const addTweet = document.getElementsByClassName("add-tweet")[0];
  const scrollToTop = document.getElementsByClassName("scroll-to-top")[0];

  // creates singular tweet element
  const createTweetElement = (tweet) => {
    return $(`<article class="tweet">
        <header class="tweet-header">
          <div><img src=${tweet.user.avatars}/><span>${
      tweet.user.name
    }</span></div>
          <span class="user-name">${tweet.user.handle}</span>
        </header>
        <section class="tweet-body">${escapeTweetText(
          tweet.content.text
        )}</section>
        <footer class="tweet-footer">
          <span>
            ${timeago.format(tweet.created_at)}
          </span>
          <div>
            <i class="fas fa-flag"></i><i class="fas fa-retweet"></i
            ><i class="fas fa-heart"></i>
          </div>
        </footer>
      </article>`);
  };

  const escapeTweetText = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // renders all tweets from array of tweets
  const renderTweets = (tweets) => {
    tweets.forEach((tweet) => {
      const $tweet = createTweetElement(tweet);
      $("#tweets-container").append($tweet);
    });
  };

  // Loads all tweets from GET /tweets
  const loadTweets = () => {
    $.ajax("/tweets", { method: "GET" }).then(function (results) {
      renderTweets(results.reverse());
    });
  };

  loadTweets();

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    submitTweet();
  });

  // Submitting tweet with validations in the conditionals
  // Submits as a post to /tweets
  const submitTweet = () => {
    const serializedString = $("form").serialize();
    if (counterText.innerHTML <= 0) {
      errorDiv.innerHTML =
        "<span><i class='fas fa-exclamation-triangle'></i>You're too thoughtful for just one tweet! Please shorten the length.</span>";
      errorDiv.classList.remove("hidden");
    } else if (counterText.innerHTML == 140) {
      errorDiv.innerHTML =
        "<span><i class='fas fa-exclamation-triangle'></i>How can we know your thoughts without text? Please add content to your tweet!.</span>";
      errorDiv.classList.remove("hidden");
    } else {
      $.ajax("/tweets", {
        method: "POST",
        data: serializedString,
      }).then(() => {
        tweetArea.value = "";
        counterText.innerHTML = 140;
        $.ajax("/tweets", { method: "GET" }).then(function (results) {
          const $tweet = createTweetElement(results.at(-1));
          $("#tweets-container").prepend($tweet);
        });
      });
      if (!errorDiv.classList.contains("hidden")) {
        errorDiv.classList.add("hidden");
      }
    }
  };

  const focusOnTweet = () => {
    tweetArea.focus();
  };

  addTweet.addEventListener("click", focusOnTweet);

  // Submits tweet via enter instead of having to click tweet button
  tweetArea.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      submitTweet();
    }
  });

  window.onscroll = () => {
    if (
      document.body.scrollTop > 30 ||
      document.documentElement.scrollTop > 30
    ) {
      scrollToTop.classList.remove("hidden");
    } else {
      scrollToTop.classList.add("hidden");
    }
  };

  scrollToTop.addEventListener("click", () => {
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTo({ top: 0, behavior: "smooth" });
  });
});
