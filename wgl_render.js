function Color(r,g,b,a){
    this.r = r/255;
    this.g = g/255;
    this.b = b/255;
    this.a = a;
}
function getShaderFile(url,WGL,type,callback){
    //type=1 - vertex
    //type=0 - fragment
      $.ajax({
    url:url,
    success: function (data){
      callback(data,type);
    }
  });
}
var WGL = function (canvas){
    this.canvas=canvas;
    this.gl = canvas.getContext("webgl", { antialias: false }) ||canvas.getContext("experimental-webgl", { antialias: false });
    this.vertex_Shader;
    this.fragment_Shader;
    this.pixelSize = 4;
    this.supported=true;
    this.program;
    this.init = false;
    this.setShader = function(url,type){
            var code;
          if(!(this.gl instanceof Object)){
            return false;
        }
        $.ajax({url: url,async:false,dataType:'html', success: function(result){
            //' Synchronous XMLHttpRequest on the main thread' yeah yeah i know...
            code = result;
        }});
        code = code.replace(new RegExp(".points.", 'g'), this.pixelSize);
        var t;
      
        if(type===1){
            t = this.gl.VERTEX_SHADER;
        }else{
            
             t = this.gl.FRAGMENT_SHADER;
        }
        var tmp = this.gl.createShader(t);
         this.gl.shaderSource( tmp, code );
         this.gl.compileShader( tmp );
        if(type===1){
            this.vertex_Shader = tmp;
            console.log("vertex shader set");
            console.log(this.vertex_Shader);
        }else{
            this.fragment_Shader = tmp;
            console.log("fragment shader set");
            console.log(this.fragment_Shader);
        }
    }
    this.setPixelSize = function(size){
        this.pixelSize = size;
    }
    this.prepareProgram = function(){
        if(!this.gl){
            console.warn("webgl not supported");
            this.supported=false;
            return false
        }
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program,this.vertex_Shader);
        this.gl.attachShader(this.program,this.fragment_Shader);
        this.gl.linkProgram(this.program);
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, buffer );
        var linked = this.gl.getProgramParameter( this.program, this.gl.LINK_STATUS );
        if(!linked){
            var lastError = this.gl.getProgramInfoLog( this.program );
            window.console.error( "Error in program linking: " + lastError );

            this.gl.deleteProgram( this.program );
            return null;
        }else{
            this.gl.useProgram(this.program);
        }
        console.log("program set");
        console.log(this.program);
        
    }
    this.setUniform = function(name,type,data){
          if(!(this.program instanceof WebGLProgram)){
            console.warn("call init first");
            return false;
          }   
        var tmp = this.gl.getUniformLocation( this.program, name );
        switch(type){
            case "float":
                this.gl.uniform1f (tmp, data[0]); 
                break;
            case "float_array":
                this.gl.uniform1fv (tmp, data);     
                break;
            case "vec2":
                this.gl.uniform2f (tmp,  data[0], data[1]);
                break;
            case "vec2_array":
                this.gl.uniform2fv (tmp,  data);
                break;
            case "vec3":
                this.gl.uniform3f (tmp,  data[0], data[1], data[2]); 
                break;
            case "vec3_array":
                this.gl.uniform3fv (tmp,  data); 
                break;
            case "vec4":
                this.gl.uniform4f (tmp,  data[0], data[1], data[2], data[3]);
                break;
            case "vec4_array":
                this.gl.uniform4fv (tmp,  data);
                break;
            case "mat2":
                this.gl.uniformMatrix2fv(tmp, false, data);//4x element array
                break;
            case "mat3":
                 this.gl.uniformMatrix3fv(tmp, false, data);//9x element array
                 break;
            case "mat4":
                 this.gl.uniformMatrix4fv(tmp, false, data);
                 break;          
        }      
    }
    this.setFillColor = function(color,name){
        if(!(this.program instanceof WebGLProgram)){
            console.warn("call init first");
            return false;
        }
        
         var colorLocation = this.gl.getUniformLocation( this.program, name );
        if(color instanceof Color ){
            this.gl.uniform4f( colorLocation, color.r, color.g, color.b, color.a);
            console.log("fill color set");
            console.log("R: "+color.r+" G: "+color.g+" B:"+color.b);
            return true;
        }else{
             this.gl.uniform4f( colorLocation, 0, 0, 0, 1);
            console.warn("argument has to be instance of Color");
            return false;
        } 
    }
    this.setClearColor = function(color){
          if(this.init===false || !(this.gl instanceof Object)){
            console.warn("call init first");
            return false;
        }   if(color instanceof Color ){
            this.gl.clearColor( color.r, color.g, color.b, color.a);
            return true;
        }else{
             this.gl.clearColor(0.9, 0.9, 0.9, 1.0);
            console.log("setting default clear color");
            return false;
        } 
    }
    this.setAttribute = function(name, size, type, normalized, stride, offset){
          if(!(this.program instanceof WebGLProgram)){
            console.warn("call init first");
            return false;
        }
         var tmp = this.gl.getAttribLocation(this.program, name);
         this.gl.vertexAttribPointer(tmp, size, type, normalized,stride, offset);
         this.gl.enableVertexAttribArray(tmp);
        return true;
    }
    this.drawPixel = function(x,y){
        this.gl.bufferData( this.gl.ARRAY_BUFFER, new Float32Array( [(x*this.pixelSize)+0.5,     (y*this.pixelSize)+0.5] ), this.gl.STATIC_DRAW );
        this.gl.drawArrays( this.gl.POINTS, 0, 1 );
    }
    this.drawArray = function(data){
        this.gl.bufferData( this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW );
        this.gl.drawArrays( this.gl.POINTS, 0, data.length/2 );
    }
    this.init = function(){
        this.prepareProgram();
        this.init=true;
    }
}