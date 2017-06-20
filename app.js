
$(function() {
  var data = [
 
   { 
    action: 'type',
    strings: ["cd ~/Ja"],
    output: ' ',
    postDelay: 100
  },
  { 
    action: 'type',
    strings: ["gcc o_mnie.c -o start^400"],
    output: '<span class="gray">+done [28ms]</span><br>&nbsp;',
    postDelay: 500
  },
  { 
    action: 'type',
   // clear: true,
    strings: ['./start --imie --czym_się_zajmuje --kontakt^400'],
    output: $('.mimik-run-output').html(),
     postDelay: 200
  },
  { 
    action: 'view',
    strings: ["that was easy!", ''],
    postDelay: 200
  }
  
];
  runScripts(data, 0);
});

    var commands = [
        {
            name:'projekty',
            js_fun:false,
            class:'command-projekty'
        },
        {
            name:'help',
            js_fun:false,
            class:'command-help'
        },
        {
            name:'projekty-lista',
            js_fun:false,
            class:'command-projekty-lista'
        }
        
    ];
  function myKeyPress(e){
    var keynum;

    if(window.event) { // IE                    
      keynum = e.keyCode;
    } else if(e.which){ // Netscape/Firefox/Opera                   
      keynum = e.which;
    }
      // console.log((keynum));
        var line = $('.prompt').html();
        $('.prompt').html((line+String.fromCharCode(keynum).toLowerCase()));
  }
function funKeyPress(e){
    this.append = function(){
         $('.prompt').html('');
           $('.history').html(history.join('<br>'));
           $('section.terminal').scrollTop($('section.terminal').height());
    }
    this.exec = function(line){
      //  console.log("-----"+line);
       var d=0;
        commands.forEach(function(ele){

            if(line==ele.name){
                if(ele.js_fun===true){
                       console.log("-----"+line);
                    window[ele.name]();
                }else{
                    //console.log($('.command-').html());
                     history.push(''+ $('.command-'+line).html());
                     this.append();
                     d=1;
                }
            }
        });
         if(d==0 ){
                     history.push('<span class="gray">Nie znaleziono komendy</span><br>'+ $('.command-help').html());
                     this.append();
          }
    }
     var keynum;
    if(window.event) { // IE                    
      keynum = e.keyCode;
    } else if(e.which){ // Netscape/Firefox/Opera                   
      keynum = e.which;
    }
     var line = $('.prompt').html();
      if(keynum==8|| keynum==46){
          $('.prompt').html(line.slice(0,-1));
          e.preventDefault();
      }else if(keynum == 13){
        //enter 
           var history = $('.history').html();
           history = history ? [history] : [];
           history.push('$ '+ line);
           this.append();
           this.exec(line.trim().toLowerCase());
      }
  }

function runScripts(data, pos) {
    if(getBrowser()[3]){
        data = [ { 
    action: 'type',
    strings: ["|| Please open me in different browser ||"],
    output: '<span class="gray">I work best in chrome or firefox</span><br>&nbsp;',
    postDelay: 500
  }];
    }
    var prompt = $('.prompt'),
        script = data[pos];
    if(script.clear === true) {
      $('.history').html(''); 
    }
    switch(script.action) {
        case 'type':
          // cleanup for next execution
          //[=================================>] 100% 
          prompt.removeData();
          $('.typed-cursor').text('');
          prompt.typed({
            strings: script.strings,
            typeSpeed: 0,
            callback: function() {
              var history = $('.history').html();
              history = history ? [history] : [];
              history.push('$ ' + prompt.text());
              if(script.output) {
                history.push(script.output);
                prompt.html('');
                $('.history').html(history.join('<br>'));
              }
              // scroll to bottom of screen
              $('section.terminal').scrollTop($('section.terminal').height());
              // Run next script
              pos++;
              if(pos < data.length) {
                setTimeout(function() {
                  runScripts(data, pos);
                }, script.postDelay || 1000);
              }
            }
          });
          break;
        case 'view':
           
              addEventListener("keydown",funKeyPress);  
              addEventListener("keypress",myKeyPress);  
          break;
    }
}
