

// header and navigation bar
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
                      '<li><a href="login.html"><i class="fa fa-sign-out fa-fw"></i> Logout</a>' +
                      '</li>' +

                      '<script type="text/javascript">' +
                          '$(\'#perform_logout_button\').hide();' +
                          '$(\'#logout_link\').click(function() {' +
                              'document.logout_form.submit(); return false; });' +
                      '</script>' +
                  '</ul>' +
              '</li>' +
              '[User name]' +
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

                              '<li>' +
                                  '<a href="class.html">CS180</a>' +
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























