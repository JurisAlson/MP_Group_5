function createNewPost(title, description, imageUrl) {
  const postDiv = document.createElement('div');
  postDiv.classList.add('News_Post');

  const titleH2 = document.createElement('h2');
  titleH2.textContent = title;

  const imageElement = document.createElement('img');
  imageElement.src = imageUrl;
  imageElement.alt = title;

  const descriptionP = document.createElement('p');
  descriptionP.textContent = description;

  const readMoreLink = document.createElement('a');
  readMoreLink.href = '#';
  readMoreLink.textContent = 'Read More';

  postDiv.appendChild(titleH2);
  postDiv.appendChild(imageElement);
  postDiv.appendChild(descriptionP);
  postDiv.appendChild(readMoreLink);

  return postDiv;
}

function savePostToLocalStorage(title, description, imageUrl) {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.push({ title, description, imageUrl });
  localStorage.setItem('posts', JSON.stringify(posts));
}

function loadPostsFromLocalStorage() {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  const feedContainer = document.querySelector('.Feed_Container');

  posts.forEach(post => {
    const newPost = createNewPost(post.title, post.description, post.imageUrl);
    feedContainer.appendChild(newPost);
  });
}

window.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementsByClassName('Logo')[0];
  const sideBar = document.getElementsByClassName('Side_Navbar')[0];

  toggleButton.addEventListener('click', () => {
    sideBar.classList.toggle('active');
  });

  document.getElementById('show-create-post-form').addEventListener('click', function() {
    var createPostForm = document.getElementById('create-post-form');
    if (createPostForm.style.display === 'none') {
      createPostForm.style.display = 'block';
    } else {
      createPostForm.style.display = 'none';
    }
  });

  const createPostForm = document.getElementById('create-post-form');
  const feedContainer = document.querySelector('.Feed_Container');

  createPostForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('post-title').value;
    const description = document.getElementById('post-description').value;
    const imageFile = document.getElementById('post-image').files[0];

    const reader = new FileReader();
    reader.onload = function() {
      const imageUrl = reader.result;
      const newPost = createNewPost(title, description, imageUrl);
      feedContainer.appendChild(newPost);
      savePostToLocalStorage(title, description, imageUrl);
    }
    reader.readAsDataURL(imageFile);
    createPostForm.reset();
  });

  loadPostsFromLocalStorage();
});