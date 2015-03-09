$(function() {
//VARIABLES GLOBALES
var pasos;
var pasos = $('section').length;


  function prender_menu(){
		//$("#menu-lateral").toggle();	
		$("#menu-lateral").animate({left: '0em'}, 500, function() { $(this).show();} );
	}
 
  function apagar_menu(){
		$("#menu-lateral").animate({left: '-22em'}, 500, function() { $(this).show();} );
	}

  function apagamos(salida){
		//COMIENZA CON EL DOS PORQUE QUEREMOS APAGAR LAS SECCIONES DE ABAJO 
		for(x=salida;x>=1;x--){
			$(".paso"+x).hide();
		}		

    //APAGAMOS LAS DE ARRIBA
		for(x=salida+1;x<=pasos;x++){
			$(".paso"+x).hide();
		}		
	}

  function prendemos(entrada){	
		//VAMOS A PRENDER LA SECCION ELEGIDA
		$(".paso"+entrada).show();
	} 

	function iniciar(){
		//cambiamos el color de fondo por el azul
		$(".global-container").css({backgroundColor: "#00a0dd",paddingBottom:"inherit"});
		//VAMOS A ESCONDER LAS SECCIONES QUE NO NECESITAMOS
		//PRENDEMOS EL PASO 1  
		apagamos(1);
    prendemos(2);
	}//FINAL DE INICIAR

	function registro(){
		apagamos(2);
    prendemos(3);
	}

	function login(){
	  apagamos(3);
		prendemos(4);
	} 

  //FUNCION PARA PRENDER O APAGAR EL MAPA
	function mapa(){	
	  apagamos(4);
		prendemos(5);
		//FUNCIONES PARA INICIALIZAR EL GOOGLE MAPS, DARLE ESTILOS Y QUE NO SEA ANTES DE ESTO
		initialize();
		$(".pointer").show();
		$(".global-container").css("padding-bottom","0px");
		$("html, body, #map-canvas, .map").css({height: "100%", margin: "0", padding: "0" });
	}
  
	//modal me ayudo
	$(".btn-si").click(function() {
    modal_ejemplo();
	});

	//modal me ayudo
	$(".btn-no").click(function() {
    modal_gracias();
	});

	//boton de registro
	$(".btn-registrarse").click(function() {
    registro();
	});

	$(".menu-lateral li").click(function() {
    apagar_menu();
	});

	//boton de login
	$(".btn-iniciar").click(function() {
    login();
	});

	//boton de login
	$(".send-facebook, .send-inicio").click(function() {
    mapa();
	});

	$(".navbar-toggle").click(function(){
		prender_menu();
	});

	$(".btn-cerrar").click(function(){
		apagar_menu();
	});

	$(".btn-desocupe").click(function(){
	  $("#me_retiro").css({display:"block"});	
	});
  
	//PARA CERRAR EL MODAL
	$(".modals").click(function(){
    $(this).hide();
		$(".overlay").hide();
	});	

	//
	$(".ubica").click(function(){
		$(this).toggleClass("socialparq");
		if ($(this).hasClass("socialparq")){
			$(this).html("SocialParq<img src='/static/socialparq/images/btn-flecha.png' class='btn-flecha' />");
		}else{
			$(this).html("Ubica tu parquímetro<img src='/static/socialparq/images/btn-flecha.png' class='btn-flecha' />");
		}
		$(".ubicalo").toggle(); 
		$(".desoc").toggle();
	});	

//ES PARA INICIAR LA APLICACIÓN
//CUANDO TENGAMOS EL SERVICIO LISTO VAMOS A INICIAR ESTA FUNCION
//CHACAMENTE VOY A PONER ESTA FUNCION PARA SIMULARLO
setTimeout(function() { iniciar(); }, 1500);
});

//PRENDEMOS EL MODAL DE GRACIAS
function modal_gracias(){
	$(".modal-gracias").show();
	$(".modal-gracias").center();
	$(".overlay").show();
};

//PRENDEMOS EL MODAL DE EJEMPLO
function modal_ejemplo(){
	$(".modals").hide();
	$(".modal-ejemplo").show();
	$(".modal-ejemplo").center();
	$(".overlay").show();
};

//MODAL DE TE AYUDO
function modal_ayudo(){
	$(".modals").hide();
	$(".modal-ayudo").show();
	$(".modal-ayudo").center();
	$(".overlay").show();
};
//FUNCION PARA CENTRAR EL CONTENIDO
jQuery.fn.center = function () {
	this.css("position","absolute");
	this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
	$(window).scrollTop()) + "px");
	this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
	$(window).scrollLeft()) + "px");
	return this;
}
