console.log("========================");
console.log("INSIDE script2.js");
console.log("========================");



function submit_create_event() {

    console.log("========================");
    console.log("Inside submit_create_event()");
    console.log("========================");
    //var eventDate = "7/111";
    var eventDate = document.forms["create-event-form"]["eventDate"].value;
    // var eventHour = document.forms["create-event-form"]["eventHour"].value;

    console.log("eventDate :" + eventDate );


    var eventName = document.forms["create-event-form"]["eventName"].value;
    var eventLocation = document.forms["create-event-form"]["eventLocation"].value;
    var eventDes = document.forms["create-event-form"]["eventDes"].value;
    var courseName = document.forms["create-event-form"]["courseName"].value;



    alert("Event : " + eventName + "\n" +
        "Location : " + eventLocation + "\n" +
        "Date : " + eventDate + "\n" +
            "Description : " + eventDes + "\n" +
            "Course Name : " + courseName + "\n" +
        "Event Created Successfully...");

    // check if it already exist

    //TODO


    document.getElementById("create-event-form").submit();



}