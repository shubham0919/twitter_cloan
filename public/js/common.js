//Textarea Post Button Active Handler
$("#postTextarea, #replyTextarea").keyup((event) => {
  let textbox = $(event.target);
  let value = textbox.val().trim();
  let isModal = textbox.parents('.modal').length == 1;

  let submitButton = isModal ? $('#submitReplyButton') : $("#submitPostButton");

  if (submitButton.length == 0) {
    return alert("No submit button found");
  }
  if (value == "") {
    submitButton.prop("disabled", true);
    return;
  }
  submitButton.prop("disabled", false);
});

$('#replyModal').on('show.bs.modal',(event) => {
  let button = $(event.relatedTarget);
  let postId = getPostIdElement(button)
  $('#submitReplyButton').data('id',postId)

  $.get('/api/post/' + postId,result => {
    outputPost(result,$('#originalPostContainer')) 
  })
})

$('#replyModal').on('hidden.bs.modal',() => $('#originalPostContainer').html(''))

//Post Data Handler
$("#submitPostButton, #submitReplyButton").click(() => {
  let button = $(event.target);

  let isModal = button.parents('.modal').length == 1;
  let textbox = isModal ? $('#replyTextarea') : $("#postTextarea");
  

  let data = {
    content: textbox.val(),
  };

  if (isModal) {
    let id =button.data().id
    if (id == null) return alert('Button id is Null')
    data.replyto = id
  }

  
  $.post("/api/post", data, (postData, status, xhr) => {


    if (postData.replyto) {
      location.reload()      
    }
    else{
      let html = createPostHtml(postData);
      $(".postcontainer").prepend(html);
      textbox.val("");
      button.prop("disabled", true);
    }
  });
});

$(document).on("click",".likebutton", () => {
    let button = $(event.target)
    let postId = getPostIdElement(button)

    if (postId === undefined) return;

    $.ajax({
      url : `/api/post/${postId}/like`,
      type : 'PUT',
      success : (postData) => {
        button.find('span').text(postData.likes.length || '') 
      }
    })
})



function getPostIdElement(element) {
  let isRoot = element.hasClass('post')
  let rootElement = isRoot == true ? element : element.closest('.post')
  let postId = rootElement.data().id
  return postId
}

function createPostHtml(postData) {
  let postedby = postData.postedby;
  if (postedby._id === undefined ) {
      return console.log('User object not populet');
  }
  let displayName = `${postedby.fistname} ${postedby.lastname}`;
  let timestamp = timeDifference(new Date(), new Date(postData.createdAt));

  let replyFlag = ''
  if (postData.replyto) {
    if (!postData.replyto._id) {
      return alert('Reply to is not populated')
    }else if (!postData.replyto.postedby._id) {
      return alert('posted by is not populated')
    }
    let replytoUsername = postData.replyto.postedby.username

    replyFlag = `<div class='replyFlag'>
                  Replying to <a href='/profile/${replytoUsername}'>@${replytoUsername}</a>
                </div>`
  }

  return `<div class="post" data-id='${postData._id}'>
            <div class="maincontentcontainer">
                <div class="userimagecontainer">
                    <img src="${postedby.profilepic}">
                </div>
                <div class="postcontentcontainer">
                    <div class="header">
                        <a href="/profile/${postedby.username}" class='displayname'>${displayName}</a>
                        <span class="username">@${postedby.username}</span>
                        <span class="date">${timestamp}</span>
                    </div>
                    ${replyFlag}
                    <div class="postbody">
                        <span>${postData.content}</span>
                    </div>
                    <div class="postfooter">
                        <div class="postbuttoncontainer">
                            <button data-bs-toggle="modal" data-bs-target='#replyModal'>
                                <i class="fa-regular fa-comment"></i>
                            </button>
                        </div>
                        <div class="postbuttoncontainer">
                            <button>
                                <i class="fa-solid fa-retweet"></i>
                            </button>
                        </div>
                        <div class="postbuttoncontainer">
                            <button class='likebutton'>
                                <i class="fa-regular fa-heart"></i>
                                <span>${postData.likes.length || ''}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}


function timeDifference(current, previous) {

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if(elapsed/1000 < 30) return 'Just now'
       return Math.round(elapsed/1000) + ' seconds ago';   
  }

  else if (elapsed < msPerHour) {
       return Math.round(elapsed/msPerMinute) + ' minutes ago';   
  }

  else if (elapsed < msPerDay ) {
       return Math.round(elapsed/msPerHour ) + ' hours ago';   
  }

  else if (elapsed < msPerMonth) {
      return Math.round(elapsed/msPerDay) + ' days ago';   
  }

  else if (elapsed < msPerYear) {
      return Math.round(elapsed/msPerMonth) + ' months ago';   
  }

  else {
      return Math.round(elapsed/msPerYear ) + ' years ago';   
  }
}


function outputPost(result, container) {
  container.html('')
  if (!Array.isArray(result)) {
    result = [result]
  }

  result.forEach(result => {
      let html = createPostHtml(result)
      container.append(html)
  });

  if (result.length == 0) {
      container.append('<span>Nopthing to show</span>')
  }
}