$("form").on("submit", function (e) {
    var name = $("#name").val();
    var email = $("#email").val();
    var message = $("#message").val();
    var data = {
        contactName: name,
        contactEmail: email,
        message: message
    };

    if(name == "" || email == "" || message == ""){
        $(".failed-message").html('We received your message and we will get back to you asap!');
    }
    else{
        $.ajax({
            headers: { 
                "Accept": "application/json",
                "Security" : "6258fa91-1397-43d8-b89f-df044a8e33dc"
            },
            type: "POST",
            crossDomain: true,
            url: '{{MAILSERVER_URL}}',
            data: json,
            dataType: 'json',
            success: function (result) {
              // Display message back to the user here 
              $("#name").val('');
              $("#email").val('');
              $("#message").val('');
              $(".success-message").html('We received your message and we will get back to you asap!');
            }
          });
    }
    
    e.preventDefault();
});