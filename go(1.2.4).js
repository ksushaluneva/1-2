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
    let result=`    HTTP/1.1 ${statusCode}
    Server: Apache/2.2.14 (Win32)
    Content-Length: ${body.length}
    Connection: Closed
    Content-Type: text/html; charset=utf-8
    ${statusMessage}`
       console.log(result);
   } 
   function processHttpRequest(method, uri, headers, body) {
       let statusCode=''
       let obj=''
       let body2=body
        .split("&") 
        .map((v) => v.split("=")) 
        let review= body2[0][1] +':'+ body2[1][1]
        let rev= require("fs").readFileSync("passwords.txt").toString() 
        if(uri=="/api/checkLoginAndPassword" && headers.includes('Content-Type: application/x-www-form-urlencoded') && rev.includes(review)){
            statusCode='200 OK'
            body='<h1 style="color:green">FOUND</h1>'
            obj=body
        }else{
            statusCode='500 - Internal Server Error'
            obj='not found'
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
