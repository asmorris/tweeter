$(document).ready(function () {
  const tweetArea = document.getElementById("tweet-text");
  const counterText = document.getElementById("counter-text");
  let target = 0;

  tweetArea.addEventListener("keyup", function (event) {
    target = event.currentTarget.value.length;
    counterText.innerHTML = `${140 - target}`;

    if (140 - target < 0) {
      counterText.classList.add("counter-negative");
    } else {
      counterText.classList.remove("counter-negative");
    }
  });
});
