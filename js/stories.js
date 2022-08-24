"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}
// -------------------------- add a new story -----------------------------
async function addStory(evt) {
  console.debug("addStory", evt);
  evt.preventDefault();

  // grab the author, title and url
  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();
  const newStory = { title, author, url };

  const story = await storyList.addStory(currentUser, newStory);

  const $story = generateStoryMarkup(story, false, Boolean(currentUser));
  $allStoriesList.prepend($story);

  $storyForm.trigger("reset");
  $storyForm.hide();
}

$storyForm.on("submit", addStory);

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(
  story,
  delBtn = false,
  favStar = false,
  edit = false
) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  const trashCan =
    '<span class="trash"><i class="fas fa-trash-alt"></i></span>';
  const pencil = '<span class="edit"><i class="fas fa-pencil-alt"></i></span>';

  let fav;
  if (currentUser) {
    fav = currentUser.isFavorite(story);
  }
  const starType = fav ? "fas" : "far";
  const star = `<span class ="star"><i class="${starType} fa-star"></i></span>`;
  return $(`
      <li id="${story.storyId}">
      ${delBtn ? `${trashCan}` : ""}
      ${favStar ? `${star}` : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        ${edit ? `${pencil}` : ""}
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
// -------------------------- delete story ------------------------------

async function deleteStory(e) {
  console.debug("deleteStory");
  let delID = e.target.parentElement.parentElement.id;
  await storyList.deleteStory(delID);

  putOwnStoriesOnPage();
}

$ownStoriesList.on("click", ".trash", deleteStory);

// -------------------------- favorite story ------------------------------

async function updateFavorite(e) {
  console.debug("updateFavorite");
  let favId = e.target.closest("li").id;
  const story = storyList.stories.find((s) => s.storyId === favId);
  if (currentUser.favorites.some((s) => s.storyId === favId)) {
    await currentUser.removeFavorite(story);
    e.target.classList.replace("fas", "far");
  } else {
    await currentUser.addFavorite(story);
    e.target.classList.replace("far", "fas");
  }
  if ($favStoriesList[0].style.display !== "none") {
    console.log("hi");
    putFavStoriesOnPage();
  }
}
$allStories.on("click", ".star", updateFavorite);
// -------------------------- update story ------------------------------

async function updateStory(evt) {
  console.debug("updateStory", evt);
  evt.preventDefault();

  // grab the author, title and url
  const title = $("#update-title").val();
  const author = $("#update-author").val();
  const url = $("#update-url").val();
  const id = $("#update-id").val();
  const story = { title, author, url };
  await storyList.updateStory(id, story);

  $updateStoryForm.trigger("reset");
  $updateStoryForm.hide();
  putOwnStoriesOnPage();
}
$updateStoryForm.on("submit", updateStory);
// -------------------------- show update story form------------------------------

function showUpdateForm(evt) {
  console.debug("showUpdateForm", evt);
  let id = evt.target.closest("li").id;
  let story = storyList.stories.find((s) => s.storyId === id);
  let index = storyList.stories.findIndex(x => x.storyId === id);

  $("#update-title").val(story.title);
  $("#update-author").val(story.author);
  $("#update-url").val(story.url);
  $("#update-id").val(id);

  $updateStoryForm.show();
}
$ownStoriesList.on("click", ".edit", showUpdateForm);

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage(e) {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of  stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story, false, Boolean(currentUser));
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putFavStoriesOnPage() {
  console.debug("putFavStoriesOnPage");

  $favStoriesList.empty();

  if (currentUser.favorites.length === 0) {
    $favStoriesList.append("<h5>No favorites added!</h5>");
  } else {
    // loop through all of fav stories and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story, false, Boolean(currentUser));
      $favStoriesList.append($story);
    }
  }

  $favStoriesList.show();
}

function putOwnStoriesOnPage() {
  console.debug("putOwnStoriesOnPage");

  $ownStoriesList.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStoriesList.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of user stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story, true, true, true);
      $ownStoriesList.append($story);
    }
  }

  $ownStoriesList.show();
}
