
const toggleButton = document.getElementsByClassName('Logo')[0]
const sideBar = document.getElementsByClassName('Side_Navbar')[0]

toggleButton.addEventListener('click', () => {
    sideBar.classList.toggle('active')
})
// localStorage.clear();
class Discussion {
    static idCounter = 1;
  
    constructor(title, content) {
      this.id = Discussion.idCounter++;
      this.title = title;
      this.content = content;
      this.comments = [];
    }
  
    addComment(comment) {
      this.comments.push(comment);
    }
  
    toJSON() {
      return {
        id: this.id,
        title: this.title,
        content: this.content,
        comments: this.comments
      };
    }
  
    static toDiscussionObject(json) {
      const discussion = new Discussion(json.title, json.content);
      discussion.id = json.id;
      discussion.comments = json.comments;
      return discussion;
    }
  }

function getDiscussionsAsArray(){
    const storedDiscussions = JSON.parse(localStorage.getItem('discussions')) || [];
    const discussions = storedDiscussions.map(discussion => Discussion.toDiscussionObject(discussion));
    return discussions;
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("show-create-discussion-form").addEventListener("click", function() {
        var createDiscussionForm = document.getElementById("create-discussion-form");
        createDiscussionForm.style.display = "block";
    });
    function displayDiscussions() {
        container = document.querySelector('.Feed_Container')
        container.innerHTML = '';
        const discussions = getDiscussionsAsArray();
        console.log("________________________________")
        discussions.forEach(discussion => {
            const message = `ID: ${discussion.id}\n title: ${discussion.title} \n content: ${discussion.content} \n comments: ${discussion.comments}`
            console.log(message);
            const discussionElement = document.createElement('div');
            discussionElement.className = 'News_Post';
            discussionElement.innerHTML = `
            <span class="display-none">${discussion.id}</span>
            <h2>${discussion.title}</h2>
            <p>${discussion.content}</p>
            <a href="#" class="read-more">Read more</a>
            <div class="extended-content">  
            <ul class="text-white scroll-container">
                ${discussion.comments.map(comment => `<li>${comment}</li>`).join('')}
            </ul>
            <div class="comment-form">
                <textarea placeholder="Join the discussion.."></textarea>
                <button class="comment-btn">Comment</button> <button class="Cancel-btn">Cancel</button>
            </div>
            </div>
          `;
            container.appendChild(discussionElement);
            const commentButton = discussionElement.querySelector('.comment-btn');
            commentButton.addEventListener('click', function () {
                const discussionId = discussionElement.querySelector('.display-none').textContent;
                const commentTextarea = discussionElement.querySelector('textarea').value;
                addComment(parseInt(discussionId), commentTextarea); 
            });
            const readMoreLink = discussionElement.querySelector('.read-more');
            readMoreLink.addEventListener('click', function (e) {
                e.preventDefault();
                const extendedContent = discussionElement.querySelector('.extended-content');
                const isExtended = extendedContent.classList.contains('show');

                document.querySelectorAll('.extended-content.show').forEach(content => {
                    if (content !== extendedContent) {
                        content.classList.remove('show');
                    }
                });
                extendedContent.classList.toggle('show', !isExtended);
            });
        });
    }
    function createDiscussion() {
        const title = document.getElementById("discussionTitle").value;
        const content = document.getElementById("discussionContent").value;
        const discussions = getDiscussionsAsArray();

        const myDiscussion = new Discussion(title, content);
        discussions.push(myDiscussion);

        localStorage.setItem('discussions', JSON.stringify(discussions));
        displayDiscussions();
    }
    function createDiscussionManually(title, content) {
        const discussions = getDiscussionsAsArray();

        const myDiscussion = new Discussion(title, content);
        myDiscussion.addComment("Elmers Glue Fixes a Car");
        myDiscussion.addComment("Max Verstappen Wins Again");
        discussions.push(myDiscussion);

        localStorage.setItem('discussions', JSON.stringify(discussions));
    }
    function addComment(id, comment) {
        const discussions = getDiscussionsAsArray();
        const discussionIndex = discussions.findIndex(discussion => discussion.id === id);
        if (discussionIndex !== -1) {
            discussions[discussionIndex].addComment(comment);
            localStorage.setItem('discussions', JSON.stringify(discussions));
            console.log(`Comment added to discussion ${id}.`);
            console.log(discussions[discussionIndex].comments);
        } else {
            console.log(`Discussion with ID ${id} not found.`);
        }
        displayDiscussions();
    }
    // createDiscussionManually("The Formula 1 drama","Low low low")
    displayDiscussions();
    document.getElementById("publish-button").addEventListener("click", createDiscussion);
});

// const myDiscussion = new Discussion("Example Discussion", "This is the content of the discussion.");
// myDiscussion.addComment("Great discussion!");
// myDiscussion.addComment("Interesting topic.");
// discussions.push(myDiscussion); 

// localStorage.setItem('discussions', JSON.stringify(discussions));

// const retrievedDiscussions = JSON.parse(localStorage.getItem('discussions')).map(discussion => Discussion.toDiscussionObject(discussion));
// console.log(retrievedDiscussions);