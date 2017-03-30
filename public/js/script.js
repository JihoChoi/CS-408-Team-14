/*
  static nav bar
*/

console.log("========================");
console.log("INSIDE script.js");
console.log("========================");
// console.log("user.fullName: " + user.fullName);
// console.log("user.email: " + user.email);
// console.log("courses.length: " + courses.length);
// console.log("tempCourse[0]: " + tempCourse[0].name);
// console.log("tempCourse[1]: " + tempCourse[1].name);







// #################################################
// Layout
// #################################################


function profile_popup(user, email) {

    console.log(user);

    // alert("Profile Pop-up");
    alert(
        "+=============================\n" +
        "| Profile" + "\n" +
        "+=============================\n" +
        "| name  : " + user + "\n" +
        // "| email : " + email + "\n" +
        "+=============================");


}

function setting_popup() {
    // alert("Setting Pop-up");

    alert(
        "+=============================\n" +
        "| Setting Coming Soon" + "\n" +
        "+=============================");


}







function countCourse(allcoursename) {

    console.log(allcoursename);

    var counter = 0;
    for (var i=0; i< allcoursename.length; i++) {
        if (allcoursename != null) {
            counter++;
        }
    }
    document.getElementById("count").innerHTML = 5 + 6;

}



function submit_create_subgroup() {

    var subgroupname = document.forms["create-subgroup-form"]["subName"].value;

    if (subgroupname.length == 0) {
        alert("Please input a subgroup name!\n");
        return;
    }

    if ( subgroupname.indexOf(' ') >= 0 ) {
        alert("You cannot include space to subgroup name!\n");
        return;
    }

    if (confirm("Do you want to create "+subgroupname+"?") == true) {
        alert("You created " + subgroupname + "!");
        document.getElementById("create-subgroup-form").submit();
    }



}



// #################################################
// Manage Courses functions
// #################################################

function join_request_prompt(courses) {
    var course_name = document.forms["join-course-form"]["join_course_name"].value;


    console.log("Join Course");
    console.log(courses);
    console.log("   course_name      " + course_name);

    if (course_name.length == 0) {
        alert("Please Select a Course!\n");
        return;
    }

    if (Array.isArray(course_name)) {
        alert("Please Select Only One Course!\n\n" +
            "You Selected " + course_name.length + " Courses.");
        alert("Nice Try! :)\n");
        return;
    }

    // checking if courses already joined
    var json = [];
    var toSplit = courses.split(",");
    for (var i = 0; i < toSplit.length; i++) {
        json.push(toSplit[i]);
    }
    // console.log(json);
    for (var i = 0; i < json.length; i++) {
        if (json[i] == course_name) {
            console.log("already has the course");
            alert("You already joined "+course_name+"!");
            return;
        }
    }

    if (confirm("Do you want to join "+course_name+"?") == true) {
        alert("You joined "+course_name+"!");
        document.getElementById("join-course-form").submit();
    }

    // document.getElementById("join-course-form").submit();
}



function create_request_prompt(all_courses) {
    var course_name = document.forms["create-course-form"]["create_course_name"].value;
    var course_full_name = document.forms["create-course-form"]["create_course_full_name"].value;
    var semester = document.forms["create-course-form"]["semester"].value;
    var description = document.forms["create-course-form"]["description"].value;

    // TODO check if the course exists

    console.log("Create Course");
    console.log("   course_name      " + course_name);
    console.log("   course_full_name " + course_full_name);
    console.log("   semester         " + semester);
    console.log("   description      " + description);

    if ( course_name != course_name.toUpperCase() ) {
        alert("course name cannot contain lowercase!");
        return;
    }
    // if( !parseInt(course_name) ) {
    //     alert("course name should contain number!");
    //     return
    // }

    // checking if courses already joined
    var json = [];
    var toSplit = all_courses.split(",");
    for (var i = 0; i < toSplit.length; i++) {
        json.push(toSplit[i]);
    }
    // console.log(json);
    for (var i = 0; i < json.length; i++) {
        if (json[i] == course_name) {
            console.log("already has the course");

            alert("Cannot create the course!\n" +
                "There already is "+course_name+"!\n" +
                "Please Join the Existing Course!");
            return;
        }
    }


    if (confirm("Do you want to create "+course_name+" "+semester+"?") == true) {
        alert("You created "+course_name+"!");

        document.getElementById("create-course-form").submit();
    }
}


function delete_request_prompt() {
    var course_name = document.forms["delete-course-form"]["delete_course_name"].value;

    console.log("Delete Course");
    console.log("   course_name      " + course_name);


    if (Array.isArray(course_name)) {
        alert("Please Select Only One Course!\n\n" +
            "You Selected " + course_name.length + " Courses.");
        return;
    }


    if (confirm("Do you want to leave "+course_name+"?") == true) {
        alert("You left "+course_name+"!");

        document.getElementById("delete-course-form").submit();
    }

    // document.getElementById("join-course-form").submit();
}



// #################################################
// Courses functions
// #################################################


function add_post() {

    var text = document.forms["post-note-form"]["text_input"].value;
    var course_name = document.forms["post-note-form"]["course_name"].value;
    var user_name = document.forms["post-note-form"]["user_name"].value;

    // alert(course_name + user_name + text);

    if (confirm("Do you want to post?") == true) {
        alert("Note Posted!");

        document.getElementById("post-note-form").submit();
    }

}

// header and navigation bar
/*
document.getElementById("header-navigation-bar").innerHTML = 

      '<nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">' +
          '<div class="navbar-header">' +
              '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">' +
                  '<span class="sr-only">Toggle navigation</span>' +
                  '<span class="icon-bar"></span>' +
                  '<span class="icon-bar"></span>' +
                  '<span class="icon-bar"></span>' +
              '</button>' +
              '<a class="navbar-brand" href="index.html">Coconut Watr</a>' +
          '</div>' +

          '<ul class="nav navbar-top-links navbar-right">' +
              '<li class="dropdown">' +
                  '<a class="dropdown-toggle" data-toggle="dropdown" href="#">' +
                      '<i class="fa fa-envelope fa-fw"></i> <i class="fa fa-caret-down"></i>' +
                  '</a>' +
                  '<ul class="dropdown-menu dropdown-messages">' +
                      '<li>' +
                          '<a href="#">' +
                              '<div>' +
                                  '<strong>John Smith</strong>' +
                                  '<span class="pull-right text-muted">' +
                                      '<em>Yesterday</em>' +
                                  '</span>' +
                              '</div>' +
                              '<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...</div>' +
                          '</a>' +
                      '</li>' +
                      '<li>' +
                          '<a class="text-center" href="#">' +
                              '<strong>Read All Messages</strong>' +
                              '<i class="fa fa-angle-right"></i>' +
                          '</a>' +
                      '</li>' +
                  '</ul>' +
              '</li>' +


              '<li class="dropdown">' +
                  '<a class="dropdown-toggle" data-toggle="dropdown" href="#">' +
                      '<i class="fa fa-user fa-fw"></i> <i class="fa fa-caret-down"></i>' +
                  '</a>' +
                  '<ul class="dropdown-menu dropdown-user">' +
                      '<li><a href="#"><i class="fa fa-user fa-fw"></i> User Profile</a>' +
                      '</li>' +
                      '<li><a href="#"><i class="fa fa-gear fa-fw"></i> Settings</a>' +
                      '</li>' +

                      '<li class="divider"></li>' +


                      // this two below buttons need to be combined.
                      '<li><a href="#"><i class="fa fa-sign-out fa-fw"></i> Logout</a>' +
                      '</li>' +

                      '<form name="logout" id="logout" method="post" action="/logout">' +
                          '<input type="hidden" name="perform_logout" value="1">' +
                          '<input type="submit" value="Logout" id="perform_logout_button">' +
                          '<a href="/logout" style="display:none;" id="logout_link">Logout</a>' +
                      '</form>' +

                      '<script type="text/javascript">' +
                         '$("#perform_logout_button").hide();' +
                         '$("#logout_link").click(function() {' +
                            'document.logout_form.submit(); return false; ' +
                         '});' +
                      '</script>' +

                  '</ul>' +
              '</li>' +
              // user.email +
              '<li></li>' +
          '</ul>' +

          '<div class="navbar-default sidebar" role="navigation">' +
              '<div class="sidebar-nav navbar-collapse">' +
                  '<ul class="nav" id="side-menu">' +

                      '<li>' +
                          '<a href="dashboard.html"><i class="fa fa-dashboard fa-fw"></i> Dashboard</a>' +
                      '</li>' +

                      '<li>' +
                          '<a href="#"><i class="fa fa-sitemap fa-fw"></i> Courses<span class="fa arrow"></span></a>' +
                          '<ul class="nav nav-second-level">' +
                              '<li>' +
                                  '<a href="addClass.html">Add Class</a>' +
                              '</li>' +

    // TODO make javascript forloop to make courses.length size of menu when there are a real data 
    //                           '<li>' +
    //                               '<a href="/course/' + tempCourse[0].name.toLowerCase() + '">'+tempCourse[0].name+'</a>' +
    //                           '</li>' +
    //
    //                           '<li>' +
    //                               '<a href="/course/' + tempCourse[1].name.toLowerCase() + '">'+tempCourse[1].name+'</a>' +
    //                           '</li>' +

                              '<li>' +
                                  '<a href="class.html">!{user.fullName}</a>' +
                              '</li>' +


                              '<li>' +
                                  '<a href="#">[Class Name]</a>' +
                              '</li>' +
                          '</ul>' +
                      '</li>' +
                  '</ul>' +
              '</div>' +
          '</div>' +
      '</nav>';
*/









