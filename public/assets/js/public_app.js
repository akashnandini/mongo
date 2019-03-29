$(document).ready(function () {
  //Save the article from scrape
  $(".save").click(function (event) {
    event.preventDefault();
    var button = $(this);
    var id = button.attr("id");
    $.ajax("/save/" + id, {
      //$.ajax(`/save/${id}`, {
      method: "PUT"
    }).then(function (data) {
      console.log(data);
    }
    );
    location.reload();
  });

  //Save Note 
  $("#save-note").click(function (event) {
    event.preventDefault();
    var id = $(this).attr('data');
    console.log("id==" + id);
    var noteText = $('#note-input').val();
    $('#note-input').val('');
    $.ajax("/note/" + id, {
      method: "POST",
      data: { text: noteText }
    }).then(function (data) {
      console.log(data);
    })
    $('#note-modal').modal('toggle');
  });

 //Delete the article
  $(document).on("click", ".delete-btn", function() {
    var thisId = $(this).attr("data");
    $.ajax({
      method: "DELETE",
      url: "/delete/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
      });
      location.reload();
  });

  // Opening the note modal
 
    $(document).on("click", ".note-btn", function() {
    event.preventDefault();
    var id = $(this).attr("data");
    console.log(id);
    $('#articleId').text(id);
    $('#save-note').attr('data', id);
    $.ajax("/articles/"+id, {
      method: "GET"
    }).then(function (data) {
      console.log(data)
      $('#articlesDesc').empty();

      for (var i = 0; i < data.note.length; i++) {
        $("#articlesDesc").append("<p>" + data.note[i].text + "<button class='btn btn-danger closeNote' attrId=" + data.note[i]._id + "  article_Id=" + id + ">X</button></p>");
      }
      
    })
    $('#note-modal').modal('toggle');
  });

  
//Delete notes for Article 
$(document).on("click", ".closeNote", function() {
  var noteId   = $(this).attr("attrId");
  var article_Id = $(this).attr("article_Id");  
  $.ajax({
    method: "POST",
    url: "/del_note/" + $(this).attr("article_Id") + "/" + $(this).attr("attrId")
    
  })
    // With that done, 
    .then(function(data) {
      console.log(data);
      $('#note-modal').toggle();
      location.reload();
  
    });
  });
});