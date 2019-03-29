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
    //$('#note-input').val('');
    $.ajax("/note/" + id, {
      method: "POST",
      data: { text: noteText }
    }).then(function (data) {
      console.log(data);
    })
    $('#note-modal').modal('toggle');
  });

  // event handler for deleting from saved
  /*$(".delete-btn").click(function (event) {
    event.preventDefault();
    console.log("delete");
    var id = $(this).attr("data");
    console.log("id==" + id);
    $.ajax("/remove/:id", {
      type: "PUT"
    }).then(function () {
      location.reload();
    })
  });*/

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

  // event handler for opening the note modal
  //$(".note-btn").click(function (event) {
    $(document).on("click", ".note-btn", function() {
      //var thisId = $(this).attr("data");
    event.preventDefault();
    var id = $(this).attr("data");

    console.log(id);
    $('#articleId').text(id);
    //$('#save-note').attr('data', id);
    $.ajax("/articles/"+id, {
      method: "GET"
    }).then(function (data) {
      console.log(data)
      //console.log("nandini==="+data[0].note.length);
      console.log("NOTES");

      $('#articlesDesc').empty();

      for (var i = 0; i < data.notes.length; i++) {
        $("#articlesDesc").append("<p>" + data.notes[i].text + "<button class='closeNote' attrId=" + data.notes[i]._id + ">X</button></p");
      }
      /*if (data.notes.length > 0) {
        data.notes.forEach(v => {
          $('.articlesDesc').append($(`<li class='list-group-item'>${v.text}<button type='button' class='btn btn-danger btn-sm float-right btn-deletenote' data='${v._id}'>X</button></li>`));
        })
      }
      else {
        $('.articlesDesc').append($(`<li class='list-group-item'>No notes for this article yet</li>`));
        //console.log("Nandini")
      }*/


    })
    $('#note-modal').modal('toggle');
  });

  // $('.btn-deletenote').click(function (event) {})
  $(document).on('click', '.btn-deletenote', function () {
    event.preventDefault();
    console.log($(this).attr("data"))
    const id = $(this).attr("data");
    console.log(id);
    $.ajax(`/note/${id}`, {
      type: "DELETE"
    }).then(function () {
      $('#note-modal').modal('toggle');
    });
  });

});