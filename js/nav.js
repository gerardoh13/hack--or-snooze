"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

function navSubmit(evt) {
  console.debug("navSubmit", evt);
  hidePageComponents();
  putStoriesOnPage();
  $storyForm.show()
}

$body.on("click", "#nav-submit", navSubmit);

function navFavorites(evt) {
  console.debug("navFavorites", evt);
  hidePageComponents();
  putFavStoriesOnPage();
}

$body.on("click", "#nav-favorites", navFavorites);

function navOwnStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  putOwnStoriesOnPage();
}

$body.on("click", "#nav-own-stories", navOwnStories);


/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** Show user profile on click on "profile" */

function navProfileClick(evt) {
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
  $updateAccountForm.show()
  updateAccountForm()
}

$navUserProfile.on("click", navProfileClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
