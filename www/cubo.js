
var va,
	vb,
	vg,
	tx,
	ty,
	tz;
va=0;
vb=0;
vg=0;
tx=0;
ty=0;
tz=0;
// para canvas 
var width=0;
var height=0; 
var	c; // Objeto Canvas: 
var	ctx; //Contexto del canvas: 
var Cubo1;

var varista=0;
var cLoop;
var cCont;


var SratonAbajo;
SratonAbajo=false;
var mXant,mYant;
var aXant,aYant;
var contador=0;
//SISTEMA DE REF
//El sistema cartesiano de referencia es con:
//				Xpositiva a la derecha, 
//				Y positiva hacia abajo, 
//				Z positiva hacia dentro del plano
//El origen esta (400,400,200)

var porcentajeperspectiva=0.1;
var OC=[400,400,200];
	//Origen de coordenadas se posiciona en el punto  400, 400, 200
var PV=[0,0,-200];
	//PV es el punto de vista

//ROTACIONES Y TRASLACIONES
var alfa=0, beta=0, gamma=0;
	//alfa angulo rotación en el plano XY
	//beta angulo rotación en el plano YZ
	//gamma angulo rotación en el plano ZX
var Ma=[],Mb=[],Mg=[],Vt=[];
	//Ma Matriz de rotación plano XY
	//   cos(alfa)	sen(alfa)	0
	//	-sen(alfa)	cos(alfa)	0
	//	0			0			1

	//Mb Matriz de rotación plano YZ
	//   1			0			0
	//	0			cos(beta)	sen(beta)
	//	0			-sen(beta)	cos(beta)

	//Mg Matriz de rotación plano ZX
	//   cos(gamma)	0			sen(gamma)
	//   0			1			0
	//	-sen(gamma)	0			cos(gamma)

	//Vt Vector traslación = (traslacionX,traslacionY,traslacionZ)	

/////////////////********
//OBJETO CUBO
/////////////*************
function Cubo(arista,puntoVista,PuntoOrigen){
//Cubo es el conjunto de vertices
this.Origen=new Array();
this.Origen=PuntoOrigen;
this.PV= new Array();
this.PV=puntoVista;
this.arista=arista;
//angulo rotación plano XY
this.alfa=0;
//angulo rotación plano YZ
this.beta=0;
//angulo rotación plano ZX
this.gamma=0;
//Traslacion en el sist de ref
this.VectorTraslacion=[0,0,0];
//Conjunto de vertices referidas al sistema de ref
this.Vertice=new Array();
//Las caras contendran sus propios vertices
this.Cara=new Array();
//Distancia Media de cada cara al punto de vista
this.DistCaraPV=new Array();
//Las caras ordenadas según su lejanía al punto de vista de Mas lejano [0] a mas cercano[6]
this.OrdenCaraDist=new Array();

this.IniciaCubo=IniCubo;
this.CalculaDistCaraPV= CalDistCaraPV;
this.Draw=DrawCubo;
this.RotayTraslada=RotacionTraslacion;

this.IniciaCubo();
//this.CalculaDistCaraPV();
this.Draw();


}
function IniCubo(){
	//Los vertices se definen con unos para que luego se puedan escalar con el valor de la arista
	this.Vertice[0]=[-1,-1,-1],
	this.Vertice[1]=[1,-1,-1],
	this.Vertice[2]=[1,1,-1],
	this.Vertice[3]=[-1,1,-1],
	this.Vertice[4]=[-1,-1,1],
	this.Vertice[5]=[1,-1,1],
	this.Vertice[6]=[1,1,1],
	this.Vertice[7]=[-1,1,1];

	//Cada cara contiene a sus propio vertices ordenados
	this.Cara[0]=[0,1,2,3];
	this.Cara[0].color="#3300ff";
	this.Cara[1]=[1,5,6,2];
	this.Cara[1].color="#ff0000";
	this.Cara[2]=[5,4,7,6];
	this.Cara[2].color="#ffff00";
	this.Cara[3]=[4,0,3,7];
	this.Cara[3].color="#ff6600";
	this.Cara[4]=[0,1,5,4];
	this.Cara[4].color="#00ff00";
	this.Cara[5]=[7,6,2,3];
	this.Cara[5].color="#990099";

};


//evitar eval()
//eval(‘objecto.’ + nombreDelAtributo + ‘=valorDelAtributo’);
//se podría cambiar por
//objeto[nombreDelAtributo] = valorDelAtributo;
function CalDistCaraPV(){
	var DifX=0,DifY=0,DifZ=0,DifCu=0, Dif=0;

	for(var i=0; i<this.Cara.length; i++){
		DifX=(this.Vertice[this.Cara[i][0]][0]+
			this.Vertice[this.Cara[i][1]][0]+
			this.Vertice[this.Cara[i][2]][0]+
			this.Vertice[this.Cara[i][3]][0])/4 - this.PV[0];
		DifY=(this.Vertice[this.Cara[i][0]][1]+
			this.Vertice[this.Cara[i][1]][1]+
			this.Vertice[this.Cara[i][2]][1]+
			this.Vertice[this.Cara[i][3]][1])/4 - this.PV[1];
		DifZ=(this.Vertice[this.Cara[i][0]][2]+
			this.Vertice[this.Cara[i][1]][2]+
			this.Vertice[this.Cara[i][2]][2]+
			this.Vertice[this.Cara[i][3]][2])/4 - this.PV[2];
		
		DifCu=Math.pow(DifX,2)+Math.pow(DifY,2)+Math.pow(DifZ,2);
		Dif=Math.sqrt(DifCu);
		this.DistCaraPV[i]=Dif;
		this.DistCaraPV[i].ind=i;
	
	}

	var ArraySort=new Array();
	ArraySort=this.DistCaraPV;
	var ArrayNum=[0,1,2,3,4,5];
	var Aux;
	for (var i=0;i<ArraySort.length-1;i++){
		for (var j=ArraySort.length-1;j>i;j--)
		if(ArraySort[j]>=ArraySort[j-1]){
			Aux=ArraySort[j];
			ArraySort[j]=ArraySort[j-1];
			ArraySort[j-1]=Aux;
			Aux=ArrayNum[j];
			ArrayNum[j]=ArrayNum[j-1];
			ArrayNum[j-1]=Aux;
		}
	};
	this.OrdenCaraDist=ArrayNum;


};
var DrawCubo= function(){
	//recalcula posicion de vertices
	for (i=0; i<this.Vertice.length;i++){
		this.Vertice[i]=this.RotayTraslada(this.Vertice[i],this.alfa,this.beta,this.gamma,this.VectorTraslacion);
	}
	//calcula la distancia media de cada cara y saca el orden de ditancias
	this.CalculaDistCaraPV();
	
	//dibuja cada cara n orden de lejania

	for (var i=3; i<this.OrdenCaraDist.length;i++){

		ctx.strokeStyle = "#ffffff";
		 ctx.lineWidth = 1;
		
		ctx.fillStyle =this.Cara[this.OrdenCaraDist[i]].color;
;
		ctx.beginPath();
	
		var X=this.Vertice[this.Cara[this.OrdenCaraDist[i]][0]][0]-this.Vertice[this.Cara[this.OrdenCaraDist[i]][0]][0]*this.Vertice[this.Cara[this.OrdenCaraDist[i]][0]][2]*porcentajeperspectiva;
	    var Y=this.Vertice[this.Cara[this.OrdenCaraDist[i]][0]][1]-this.Vertice[this.Cara[this.OrdenCaraDist[i]][0]][1]*this.Vertice[this.Cara[this.OrdenCaraDist[i]][0]][2]*porcentajeperspectiva;
	 
		X=X*this.arista/2+this.Origen[0];
		Y=Y*this.arista/2+this.Origen[1];
	
	    ctx.moveTo(X, Y);

		var X=this.Vertice[this.Cara[this.OrdenCaraDist[i]][1]][0]-this.Vertice[this.Cara[this.OrdenCaraDist[i]][1]][0]*this.Vertice[this.Cara[this.OrdenCaraDist[i]][1]][2]*porcentajeperspectiva;
	    var Y=this.Vertice[this.Cara[this.OrdenCaraDist[i]][1]][1]-this.Vertice[this.Cara[this.OrdenCaraDist[i]][1]][1]*this.Vertice[this.Cara[this.OrdenCaraDist[i]][1]][2]*porcentajeperspectiva;
	    X=X*this.arista/2+this.Origen[0];
		Y=Y*this.arista/2+this.Origen[1];
	
	    ctx.lineTo(X, Y);

		var X=this.Vertice[this.Cara[this.OrdenCaraDist[i]][2]][0]-this.Vertice[this.Cara[this.OrdenCaraDist[i]][2]][0]*this.Vertice[this.Cara[this.OrdenCaraDist[i]][2]][2]*porcentajeperspectiva;
	    var Y=this.Vertice[this.Cara[this.OrdenCaraDist[i]][2]][1]-this.Vertice[this.Cara[this.OrdenCaraDist[i]][2]][1]*this.Vertice[this.Cara[this.OrdenCaraDist[i]][2]][2]*porcentajeperspectiva;
	    X=X*this.arista/2+this.Origen[0];
		Y=Y*this.arista/2+this.Origen[1];

	    ctx.lineTo(X, Y);

		var X=this.Vertice[this.Cara[this.OrdenCaraDist[i]][3]][0]-this.Vertice[this.Cara[this.OrdenCaraDist[i]][3]][0]*this.Vertice[this.Cara[this.OrdenCaraDist[i]][3]][2]*porcentajeperspectiva;
	    var Y=this.Vertice[this.Cara[this.OrdenCaraDist[i]][3]][1]-this.Vertice[this.Cara[this.OrdenCaraDist[i]][3]][1]*this.Vertice[this.Cara[this.OrdenCaraDist[i]][3]][2]*porcentajeperspectiva;
	    X=X*this.arista/2+this.Origen[0];
		Y=Y*this.arista/2+this.Origen[1];

	    ctx.lineTo(X, Y);

		var X=this.Vertice[this.Cara[this.OrdenCaraDist[i]][0]][0]-this.Vertice[this.Cara[this.OrdenCaraDist[i]][0]][0]*this.Vertice[this.Cara[this.OrdenCaraDist[i]][0]][2]*porcentajeperspectiva;
	    var Y=this.Vertice[this.Cara[this.OrdenCaraDist[i]][0]][1]-this.Vertice[this.Cara[this.OrdenCaraDist[i]][0]][1]*this.Vertice[this.Cara[this.OrdenCaraDist[i]][0]][2]*porcentajeperspectiva;
	    X=X*this.arista/2+this.Origen[0];
		Y=Y*this.arista/2+this.Origen[1];

	    ctx.lineTo(X, Y);
	   
	    ctx.closePath();  
	    ctx.fill();  
	    ctx.stroke();
	}
};


////////////////////////////////////
///RUTINAS
////////////////////////////////////


var RotacionTraslacion= function(Vxyz,a,b,g,Txyz){
	//document.write( "<br />" );
	//document.write("Vxyz"+Vxyz);
	var Ma=[],Mb=[],Mg=[];
	if(isNaN(a)){a=0;};
	if(isNaN(b)){b=0;};
	if(isNaN(c)){c=0;};
	if(isNaN(Txyz[0])){Txyz[0]=0;};
	if(isNaN(Txyz[1])){Txyz[1]=0;};
	if(isNaN(Txyz[2])){Txyz[2]=0;};
	if(isNaN(Vxyz[0])){Vxyz[0]=0;};
	if(isNaN(Vxyz[1])){Vxyz[1]=0;};
	if(isNaN(Vxyz[2])){Vxyz[2]=0;};
	//document.write( "<br />" );
	//document.write("Txyz"+Txyz);
	
	//para multiplicar matrices siempre tengo que tener dos indices
	var MatrizVxyz=new Array();
	MatrizVxyz[0]=new Array();
	MatrizVxyz[0][0]=Vxyz[0];
	MatrizVxyz[0][1]=Vxyz[1];
	MatrizVxyz[0][2]=Vxyz[2];
	
	if(a!=0){
		Ma[0]=new Array();
		Ma[1]=new Array();
		Ma[2]=new Array();
		Ma[0][0]=Math.cos(a);
		Ma[0][1]=Math.sin(a);
		Ma[0][2]=0;
		Ma[1][0]=-Math.sin(a);
		Ma[1][1]=Math.cos(a);
		Ma[1][2]=0;
		Ma[2][0]=0;
		Ma[2][1]=0;
		Ma[2][2]=1;
		MatrizVxyz= MultMatrix(MatrizVxyz,Ma);
	}
	if(b!=0){
		Mb[0]=new Array();
		Mb[1]=new Array();
		Mb[2]=new Array();
		Mb[0][0]=1;
		Mb[0][1]=0;
		Mb[0][2]=0;
		Mb[1][0]=0;
		Mb[1][1]=Math.cos(b);
		Mb[1][2]=-Math.sin(b);
		Mb[2][0]=0;
		Mb[2][1]=Math.sin(b);
		Mb[2][2]=Math.cos(b);
		MatrizVxyz= MultMatrix(MatrizVxyz,Mb);
	}
	if(g!=0){
		Mg[0]=new Array();
		Mg[1]=new Array();
		Mg[2]=new Array();
		Mg[0][0]=Math.cos(g);
		Mg[0][1]=0;
		Mg[0][2]=Math.sin(g);
		Mg[1][0]=0;
		Mg[1][1]=1;
		Mg[1][2]=0;
		Mg[2][0]=-Math.sin(g);
		Mg[2][1]=0;
		Mg[2][2]=Math.cos(g);
		MatrizVxyz= MultMatrix(MatrizVxyz,Mg);
	}
	Vxyz[0]=MatrizVxyz[0][0];
	Vxyz[1]=MatrizVxyz[0][1];
	Vxyz[2]=MatrizVxyz[0][2];
	
	Vxyz[0]=Vxyz[0]+Txyz[0];
	Vxyz[1]=Vxyz[1]+Txyz[1];
	Vxyz[2]=Vxyz[2]+Txyz[2];
	//document.write( "<br />" );
	//document.write("Vxyz"+Vxyz);
	return Vxyz;
	
};
var clearctx = function() {
		ctx.clearRect(0, 0, width, height);
		
};
function MultMatrix(A,B){
	//i indice filas  comienza a contar desde cero luego ia maxima = A.length-1
	//j indice columnas comienza a contar desde cero luego ja maxima = A[0].length-1
	var C=new Array();
	for(var ic = 0; ic < A.length; ic++){
		C[ic]=new Array();
		for(var jc = 0; jc < B[0].length; jc++){
			C[ic][jc]=0;
			for(var k = 0; k < A[0].length; k++){
				C[ic][jc]+=A[ic][k]*B[k][jc];
			}
		}
	}
	//document.write( "<br />" );
	//document.write("C"+C);
	return C;
};
/////////////////
//PROCEDIMIENTO
////////////////
function DimensionaPosiciona (){

	width=$(window).innerWidth();
	height=$(window).innerHeight(); 
	c.offsetLeft=0;
	c.offsetTop=0;
	ctx.canvas.width  = width;
	ctx.canvas.height  = height;
	if (height<width){
		varista=height/2;
				  
		}else{
		varista=width/2;
	};
	OC=[width/2,height/2,varista];
	PV=[0,0,-varista];
};

$( window ).load(function() {
	//$.vmouse.moveDistanceThreshold=100;
	$('body').append( '<canvas id="c" style="position: absolute;">Your browser does not support the canvas element.</canvas>' );
	c = document.getElementById('c');
	ctx = c.getContext('2d');

	DimensionaPosiciona ();
	Cubo1=new Cubo(varista,PV,OC);
	
	ctx.fillStyle = Cubo1.Cara[Cubo1.OrdenCaraDist[5]].color;
	ctx.fillRect(0, 0, width, height); 
	Cubo1.Draw();
	
	/*
	$('#c').bind("vmousemove",function(e){ 
		e.originalEvent.preventDefault();
		e.preventDefault();
		if(SratonAbajo==true ){
			aXant=e.pageX;
			aYant=e.pageY;
			vb=-(aYant-mYant)/100;
			vg=(aXant-mXant)/100;
			mXant=aXant;
			mYant=aYant;
			clearctx();
			Cubo1.alfa=va;
			Cubo1.beta=vb;
			Cubo1.gamma=vg;
			Cubo1.VectorTraslacion[0]=tx;
			Cubo1.VectorTraslacion[1]=ty;
			Cubo1.VectorTraslacion[2]=tz;
			ctx.fillStyle = Cubo1.Cara[Cubo1.OrdenCaraDist[5]].color;
			ctx.fillRect(0, 0, width, height); 
			Cubo1.Draw();
			//console.log('moveAbajo')		
		};		
	});  
	 */
	$('#c').bind( "vmousedown",function(e){
	e.originalEvent.preventDefault();
	e.preventDefault();
		//if(SratonAbajo==false){
			mXant=e.pageX;
			mYant=e.pageY;	
		//}
		//SratonAbajo=true;
		//console.log('down')
		contador=0;
		cCont=setInterval(contar,100);
		$('#c').unbind("vmousemove");
		$('#c').bind("vmousemove",function(e){ 
			e.originalEvent.preventDefault();
			e.preventDefault();
			clearInterval(cLoop);
			contador=0;
			//if(SratonAbajo==true ){
				aXant=e.pageX;
				aYant=e.pageY;
				if ((aXant-mXant)*(aXant-mXant)+(aYant-mYant)*(aYant-mYant) > 4 ){
				vb=-(aYant-mYant)/100;
				vg=(aXant-mXant)/100;
				mXant=aXant;
				mYant=aYant;
				clearctx();
				Cubo1.alfa=va;
				Cubo1.beta=vb;
				Cubo1.gamma=vg;
				Cubo1.VectorTraslacion[0]=tx;
				Cubo1.VectorTraslacion[1]=ty;
				Cubo1.VectorTraslacion[2]=tz;
				ctx.canvas.width  = width;
				ctx.canvas.height  = height;
				ctx.fillStyle = Cubo1.Cara[Cubo1.OrdenCaraDist[5]].color;
				ctx.fillRect(0, 0, width, height); 
				Cubo1.Draw();
				}else{
				mXant=aXant;
				mYant=aYant;

				}
				//console.log('moveAbajo')		
			//};		
		});  
	});    

	$('#c').bind( "vmouseup vmouseout",function(e){ 
		e.originalEvent.preventDefault();
		e.preventDefault();
		//SratonAbajo=false;
		clearInterval(cCont);
		clearInterval(cLoop);
		$('#c').unbind("vmousemove");
		if(contador>1){
			vb=0;
			vg=0;
		}
		cLoop=setInterval(CuboLoop,20);
	});  


	$(window).on('resize',function() {
		DimensionaPosiciona ();
		Cubo1.Origen=OC;
		Cubo1.PV=PV;
		Cubo1.arista=varista;
	});

});



var CuboLoop= function(){
	//if(SratonAbajo==false){
		clearctx();
		Cubo1.alfa=va;
		Cubo1.beta=vb;
		Cubo1.gamma=vg;
		Cubo1.VectorTraslacion[0]=tx;
		Cubo1.VectorTraslacion[1]=ty;
		Cubo1.VectorTraslacion[2]=tz;
		
		ctx.canvas.width  = width;
		ctx.canvas.height  = height;
		ctx.fillStyle = Cubo1.Cara[Cubo1.OrdenCaraDist[5]].color;
		ctx.fillRect(0, 0, width, height); 
		Cubo1.Draw();

		if ((va*va)<0.00001  && (vb*vb)<0.00001 & (vg*vg) <0.00001){
			clearInterval(cLoop);
			}else{
				vb-=vb*0.05;
				va-=va*0.05;
				vg-=vg*0.05;
		}
	//}	
};
var contar= function(){
contador++
};

/* Mapeado imagen

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">  
<html xmlns="http://www.w3.org/1999/xhtml">  
<head>  
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />  
<title>Mapping</title>  
<script type="text/javascript">  
function $(x){return document.getElementById(x);} 
function textureMap(ctx, texture, pts) { 
    //Mapeo UV basado en Regla de Crámer para resolución de ecuaciones lineales y en  
    //la obtención de determinantes por regla de Sarrus (Gracias a Andrea Griffini, AKA 6502 )
    var tris = [[0, 1, 2], [2, 3, 0]]; 
    for (var t=0; t<2; t++) { 
        var pp = tris[t]; 
        var x0 = pts[pp[0]].x, x1 = pts[pp[1]].x, x2 = pts[pp[2]].x; 
        var y0 = pts[pp[0]].y, y1 = pts[pp[1]].y, y2 = pts[pp[2]].y; 
        var u0 = pts[pp[0]].u, u1 = pts[pp[1]].u, u2 = pts[pp[2]].u; 
        var v0 = pts[pp[0]].v, v1 = pts[pp[1]].v, v2 = pts[pp[2]].v; 
        ctx.save(); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); 
        ctx.lineTo(x2, y2); ctx.closePath(); ctx.clip(); 
        var delta = u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2; 
        var delta_a = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2; 
        var delta_b = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2; 
        var delta_c = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2 
                      - v0*u1*x2 - u0*x1*v2; 
        var delta_d = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2; 
        var delta_e = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2; 
        var delta_f = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2 
                      - v0*u1*y2 - u0*y1*v2; 
        ctx.transform(delta_a/delta, delta_d/delta, 
                      delta_b/delta, delta_e/delta, 
                      delta_c/delta, delta_f/delta); 
        ctx.drawImage(texture, 0, 0); 
        ctx.restore(); 
    } 
} 
function getInterPoints(ctx,x1,y1,x2,y2,from,to,step,nPoints,inv){ 
    var tx,ty; 
    var x=x2-x1; 
    var y=y2-y1; 
    var dist=Math.sqrt(Math.pow(x,2)+Math.pow(y,2)); 
    var angle=Math.atan(y/x); 
    var seg=dist/nPoints; 
    tx=x1; 
    ty=y1; 
    for(var i=from,j=to;i<(to+1);i+=(step),j-=step){ 
            tx+=seg*Math.cos(angle); 
            ty+=seg*Math.sin(angle); 
            if(!inv) 
                ns.points[i]={x:tx,y:ty}; 
            else 
                ns.points[j]={x:tx,y:ty}; 
    } 
} 
var ns={points:[]}; 
onload=function(){ 
    var nPoints=10; 
    var ctx=$('c').getContext('2d'); 
    var tl={x:100,y:20}; 
    var tr={x:500,y:10}; 
    var bl={x:20,y:500}; 
    var br={x:700,y:590}; 
    ns.points[0]={x:tl.x,y:tl.y}; 
    ns.points[nPoints]={x:tr.x,y:tr.y}; 
    ns.points[((nPoints+1)*(nPoints+1))-(nPoints+1)]={x:bl.x,y:bl.y}; 
    ns.points[(nPoints+1)*(nPoints+1)-1]={x:br.x,y:br.y}; 
    getInterPoints(ctx,tl.x,tl.y,tr.x,tr.y,1,nPoints,1,nPoints,0); 
    getInterPoints(ctx,bl.x,bl.y,br.x,br.y,((nPoints+1)*(nPoints+1))-(nPoints),(nPoints+1)*(nPoints+1)-1,1,nPoints,0); 
    getInterPoints(ctx,bl.x,bl.y,tl.x,tl.y,nPoints+1,(nPoints*nPoints)-1,(nPoints+1),nPoints,1); 
    getInterPoints(ctx,tr.x,tr.y,br.x,br.y,(nPoints*2)+1,((nPoints+1)*(nPoints+1))-(nPoints),(nPoints+1),nPoints,0); 
    for(var i=nPoints+1;i<(nPoints+1)*nPoints;i+=nPoints+1){ 
        getInterPoints(ctx,ns.points[i].x,ns.points[i].y,ns.points[i+nPoints].x,ns.points[i+nPoints].y,i+1,i+nPoints-1,1,nPoints); 
    } 
    var texture=$('i'), 
    ancho=texture.width/nPoints, 
    alto=texture.height/nPoints; 
    var faces=Math.pow(nPoints,2); 
    var superior=0,supT=0,top=0; 
    var inferior=nPoints+1,infT=nPoints+1; 
    for(var z=1,g=0;z<faces+1;z++,g++){ 
        if(g>nPoints-1){ 
            g=0; 
            top++; 
            supT+=nPoints+1; 
            infT+=nPoints+1; 
            superior=supT; 
            inferior=infT; 
        }else if(g){ 
            superior+=1; 
            inferior+=1; 
        } 
        var uv0=[((g+1)*ancho)-ancho,((top+1)*alto)]; 
        var uv1=[((g+1)*ancho)-ancho,((top+1)*alto)-alto]; 
        var uv2=[((g+1)*ancho),((top+1)*alto)-alto]; 
        var uv3=[((g+1)*ancho),((top+1)*alto)]; 
        var pts=[ 
                 {x:ns.points[inferior].x,y:ns.points[inferior].y,u:uv0[0],v:uv0[1]}, 
                 {x:ns.points[superior].x,y:ns.points[superior].y,u:uv1[0],v:uv1[1]}, 
                 {x:ns.points[superior+1].x,y:ns.points[superior+1].y,u:uv2[0],v:uv2[1]}, 
                 {x:ns.points[inferior+1].x,y:ns.points[inferior+1].y,u:uv3[0],v:uv3[1]} 
                 ]; 
        textureMap(ctx, texture, pts); 
    } 
} 
</script>  
  
</head>  
  
<body>  
<div id="log"></div>  
<canvas id="c" width="800" height="600"></canvas>  
<img id="i" src="http://www.noticiassin.com/wp-content/uploads/2011/08/La-Gioconda-o-Mona-Lisa.jpg" width="800" height="600" style="display:none" />  
</body>  
</html>  
*/



