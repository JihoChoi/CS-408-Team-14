console.log("========================");
console.log("INSIDE script3.js");
console.log("========================");



function submit_create_rsvp() {

    console.log("========================");
    console.log("Inside submit_create_rsvp()");
    console.log("========================");
    //var eventDate = "7/111";
    var invite = document.forms["create-rsvp-form"]["invite"].value;
    // var eventHour = document.forms["create-event-form"]["eventHour"].value;



    alert("Yes, you are going!");

    // check if it already exist

    //TODO


    document.getElementById("create-rsvp-form").submit();



}