 if(document.location.pathname == '/edit-profile')
   {

//alert(document.location.pathname);

 google.maps.event.addDomListener(window, 'load', initializelocation);
function initializelocation() {
var input = document.getElementById('pac-input');
var autocomplete = new google.maps.places.Autocomplete(input);
autocomplete.addListener('place_changed', function () {
var place = autocomplete.getPlace();
// place variable will have all the information you are looking for.
console.log(place.geometry['location'].lat());
console.log(place.geometry['location'].lng());
});
}

   }
   
 
   
 $(window).on('load', function() {

  if(document.location.pathname == '/')
  {
    if(!sessionStorage.getItem('session_username'))
    {
      //startIntro();
    }
  }


  /* client 769297266542073
Testing 2149467885280869
  */

   if(document.location.pathname == '/login' || document.location.pathname == '/signup')
  {
     
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '769297266542073',
          cookie     : true,
          xfbml      : true,
          version    : 'v2.6'
        });
          
        FB.AppEvents.logPageView();   
          
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "https://connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
   
   }

}); 


     function startIntro(){
        var intro = introJs();
          intro.setOptions({
            steps: [
              {
                element: '#step1',
                intro: "Create account to come before Join Community"
              },
              {
                element: '#step2',
                intro: "Log in and make yourself a part of the family ",
                position: 'bottom'
              },
              {
                element: '#step3',
                intro: '3D globe with verified Communities',
                position: 'left'
              },
               {
                element: '#aboutusstep',
                intro: 'The iTribe is a social network designed to map out and reconnect with what is known as the greater Israelite Diaspora. Hundreds of millions of people across the globe identify as being the descendants of the ancient people of Israel. This platform is a response to that phenomenon. ',
                position: 'left'
              },
              {
                element: '#step5',
                intro: 'Log in and make yourself a part of the family',
                position: 'left'
              },
              {
                element: '#step6',
                intro: 'You can be responsible for bringing your community on board ',
                position: 'left'
              },
              {
                element: '#step7',
                intro: 'Let your loved ones know about the family reunion ',
                position: 'left'
              },
              {
                element: '#step8',
                intro: 'You can choose to identify with an existing community on the platform',
                position: 'left'
              
              },{
                element: '#step9',
                intro: ' Once you`re in we can start networking by learning and sharing with the global family ',
                position: 'left'
              }
            ]
          });

          intro.start();
      }





$(function () {

 
 
// user profile pic click

    $('#userpicuploadbtn').on('click',function(e) {
      

      $('#userprofilepic').click();

    });

// end 

// Library pic click

    $('#libuploadbtn').on('click',function(e) {
     
      $('#libfileid').click();

    });
    
// end 


     $('.btn-facebook').on('click',function(event) {

    FB.login(function(response) {
        if (response.authResponse) {
         console.log('Welcome!  Fetching your information.... ');
          FB.api('/me?fields=name,email,first_name,last_name,gender,hometown', function(response) {

    //console.log(response);
    console.log('Good to see you, ' + response.name + '.');
             
      var username   = response.name;
      var email      = response.email;
      var password   = response.id;
      var usertype   = 'fb';
      var birthday   = "";//response.birthday;
      var gender     = response.gender;
      

      var userdata    = {username:username,email:email,inckey:password,usertype:usertype,birthday:birthday,gender:gender}; 

    $.post(base_url+"/api/registerfb",userdata, function(resp){   
      
       

        if(resp.id)
        {   
            sessionStorage.setItem("LLLL", 'LLLL');  

            result = resp;

            sessionStorage.setItem("session_tokenid", result.id);
            sessionStorage.setItem("ses_user_email", result.email);
            sessionStorage.setItem("session_username", result.name);
            sessionStorage.setItem("session_fbid", result.password);
            sessionStorage.setItem("session_usertype", result.user_type);

            document.location.href = base_url+"/login";          

        }
        else
        {
            alert("Please try again");
        }   
    
    });       

         });
        } else {
         console.log('User cancelled login or did not fully authorize.');
        }
    },{
        scope: 'email'
    });

     });


    $('a[href="#search"]').on('click', function(event) {
        event.preventDefault();
        $('#search').addClass('open');
        $('#search > form > input[type="search"]').focus();
    });

    



    
    $('#search, #search button.close').on('click keyup', function(event) {
        if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
            $(this).removeClass('open');
        }
    });
    
    
    //Do not include! This prevents the form from submitting for DEMO purposes only!
    $('form').submit(function(event) {
        event.preventDefault();
        return false;
    })
});


$(function () {

  $('.opennavediv').on('click', function(event) {
        event.preventDefault();
        document.getElementById("mySidenav").style.width = "320px";
    });
   $('.closenavediv').on('click', function(event) {
        event.preventDefault();
        document.getElementById("mySidenav").style.width = "0";
    });

    $('.slideoutscreen').on('click', function(event) {
        event.preventDefault();
        goBack();
    });

    $('.hidedivclose').on('click', function(event) {
        alert(5);
        $(".errormsgdiv").remove();        
        event.preventDefault();        
    });
   

    /*function openNav() {
     document.getElementById("mySidenav").style.width = "320px";   
    }

    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
    }*/

});


$(".readmore").on('click touchstart', function(event) {
    var txt = $(".more-content").is(':visible') ? '<i class="fa fa-plus-circle"></i>' : '<i class="fa fa-minus-circle"></i>';
    $(this).parent().prev(".more-content").toggleClass("cg-visible");
    $(this).html(txt);
    event.preventDefault();
});


      $(".mobileuser").click(function () {

    // Set the effect type
    var effect = 'slide';

    // Set the options for the effect type chosen
    var options = { direction: $('.mySelect').val() };

    // Set the duration (default: 400 milliseconds)
    var duration = 500;

    $('#myDiv').toggle(effect, options, duration);
});


function goBack() {

      window.history.go(-1);
}



$(document).ready(function(){

    //setTimeout(function() {  $("#errormsgdiv").hide(); }, 9000);
});


