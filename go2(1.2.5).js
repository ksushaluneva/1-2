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
    let result=`HTTP/1.1 ${resultat}
    Server: Apache/2.2.14 (Win32)
    Connection: Closed
    Content-Type: text/html; charset=utf-8
    Content-Length: ${body.length}`
       console.log(result);
   } 
   function processHttpRequest(method, uri, headers, body) {
       let resultat=''
       let res2= ''
       let res = ''
       try {
        res=require("fs").readFileSync('file.tx')
    }catch {
        res=''
    }
    if(uri == '/hey/file.txt'){
        resultat='200 OK'
        res = res
    }else{
        resultat='404'
    }
    if(res==''){
        resultat='404'
    }
    if(headers.includes( "Host: student.shpp.me")){
        res2 = require("fs").readFileSync('student')
        console.log('++++++++++++++++++++++')
        console.log(res2)
    }else{
    if(headers.includes("Host: another.shpp.me")){
        res2 = require("fs").readFileSync('another')
        console.log('//////////////')
        console.log(res2)
    }else{
        try{
            res2= require("fs").readFileSync('else')
        }catch{
            resultat='404'
        }
    }
    if(url== '/'){
        url='/index.html'
    }
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
