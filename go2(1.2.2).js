// этот файл надо будет дописать...

// не обращайте на эту функцию внимания 
// она нужна для того чтобы правильно читать входные данные
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

// вот эту функцию собственно надо написать
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
console.log(JSON.stringify(http, undefined, 2));
