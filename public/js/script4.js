console.log("========================");
console.log("INSIDE script4.js");
console.log("========================");



function submit_remove_rsvp() {

    console.log("========================");
    console.log("Inside submit_remove_rsvp()");
    console.log("========================");
    //var eventDate = "7/111";
    var invite = document.forms["create-antirsvp-form"]["invite2"].value;
    // var eventHour = document.forms["create-event-form"]["eventHour"].value;


    alert("Invite : " + invite + "\n" +
        "Event Created Successfully...");

    // check if it already exist

    //TODO


    document.getElementById("create-antirsvp-form").submit();


}