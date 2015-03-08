$(function() {
//VARIABLES GLOBALES
var pasos;
var pasos = $('section').length;
 
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
  
	//boton de registro
	$(".btn-registrarse").click(function() {
    registro();
	});

	//boton de login
	$(".btn-iniciar").click(function() {
    login();
	});


//ES PARA INICIAR LA APLICACIÓN
//CUANDO TENGAMOS EL SERVICIO LISTO VAMOS A INICIAR ESTA FUNCION
//CHACAMENTE VOY A PONER ESTA FUNCION PARA SIMULARLO
setTimeout(function() { iniciar(); }, 1000);
});
