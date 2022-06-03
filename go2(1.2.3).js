function readHttpLikeInput(){
    var fs = require("fs");
    var res = "";
    var buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);
    let was10 = 0;
    for(;;){ 
        try { fs.readSync(0 /*stdin fd*/, buffer, 0, 1); } catch (e) {break; /* windows */}
        if(buffer[0] === 10 || buffer[0] === 13) {
            if (was10 > 10) 
                break;
            was10++;
        } else 
           was10 = 0;
        res += new String(buffer);
    }

    return res;
   }
   
   let contents = readHttpLikeInput();
   
   function outputHttpResponse(statusCode, statusMessage, headers, body) {
    let date=new Date()
    let result= `            HTTP/1.1 ${statusCode}
            Date: ${date.toUTCString()}
            Server: Apache/2.2.14 (Win32)
            ContentLength:${body.length}
            Connection: Closed
            ContentType: text/html; charset=utf-8
            ${statusMessage}`
       console.log(result);
   } 
   function processHttpRequest(method, uri, headers, body) {
       let statusCode=''
       let obj=''
        if(method==="GET"&& uri.indexOf('/sum?nums=')===0){
            statusCode='200 OK'
            obj= uri.split('=')[1].split(',').reduce((a,b) => Number(a) + Number(b))
        }else{
            statusCode=' 400 Bad Request'
            obj='not found'
        }
        if(method==="GET"&& uri.indexOf("/sum")!== 0){
            statusCode='400 Bad Request'  
            obj='Bad Request'  
        }

       outputHttpResponse(statusCode, obj, headers, body);
    }
   function parseTcpStringAsHttpRequest(string) {
    let parseMethod=/^[A-Za-z]+/gi
    let parseHeaders=[]
    let method=string.match(parseMethod) 
    let uri=string.split(' ')[1] 
    let headers=string.split(/\n/)
    headers.shift()
    for(let i =0; i< headers.length; i++){
        if(headers[i]!=""){
            parseHeaders[i]=headers[i]
        }else{
            break
        }
    }
    let body=string.split('\n\n')[1] || ""
    let pushHeaders=string.match(parseHeaders)
    return { 
    method:method.join(""), 
    uri:uri, 
    headers:parseHeaders, 
    body:body.split('\n')[0]
  };
   }
   
   http = parseTcpStringAsHttpRequest(contents);
   processHttpRequest(http.method, http.uri, http.headers, http.body);
