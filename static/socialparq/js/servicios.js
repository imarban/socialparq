$(function() {
//HOJA CON LOS AJAX

  //FORMA DE REGISTRO 
  $(".error").hide();
	$(".send-registro").click(function() {

		var username = jQuery("input.username").val(); 
		var email = jQuery("input.email").val();
		var pass = jQuery("input.password").val();
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

		if ((username == "")) {
			$(".error-username").show();
			$("input.username").focus();
			return false;
		}

		if ((correo == "")  || (reg.test(email) == false)) {
			$(".error-correo").show();
			$("input.correo").focus();
			return false;
		}

		if ((pass == "")) {
			$(".error-username").show();
			$("input.username").focus();
			return false;
		}

		var dataString = 'username='+ username + '&email=' + email + '&pass=' + pass; 

		jQuery.ajax({
			type: "POST",
			url: "http://www.inffinix.com/wp-content/themes/bigbangwp/bin/send.php",
			data: dataString,
			success: function() {
			jQuery('#contact_form').html("<div id='message'></div>");
			jQuery('#message').html("<h2>&nbsp;</h2>")

			.hide()
			.fadeIn(1500, function() {
				jQuery('#message').append("<p style='font-size:17px; float:left;'>Thank you, we'll contact you shorly.</p>");
			});
			}
		});
		return false;

	});
});
