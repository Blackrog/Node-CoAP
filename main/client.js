const coap  = require('coap');
const prompt = require('prompt');

//Request start below

//To switch the token length, go into coap/lib/agent.js and swap "Change" comments accordingly

//Prompt inputs to fill temprature and method type, below
prompt.start();

console.log('Enter a temperature value: ');
prompt.get(['temp', 'method'], (err, prompt) => {
  const req   = coap.request({
    host: "localhost", //To which server the client wants to connect to //Put localhost on both server and client to test locally
    port: 5683,                                                                                                 //Put aws Public-DNS to connect to aws ec2 instance
    method: prompt.method, // 1, GET // 2, POST // 3, PUT // 4, DELETE // Get's value from the prompt
    pathname: "/",
    confirmable: true, //if confirmable is false tokens dosent need to match(optional), if true tokens has to match.
  });
  
  //Date below
  let date = new Date();
  
  //Imaginary data below
  const time = date.getTime()/1000;
  const name = "client1";
  const str_len = name.length;
  const temp = prompt.temp;//Math.floor(Math.random()*20)
  const hum = Math.floor(Math.random()*100)
  
  
  //Buffer content below
  const msg_len = name.length+4+1+1+1;
  
  let buffer_len = msg_len;
  let buffer = Buffer.alloc(buffer_len)
  let buf_wr_loc = 0;
  
  buffer.writeUInt32LE(time, buf_wr_loc)
  buf_wr_loc += 4;
  buffer.writeUInt8(str_len, buf_wr_loc)
  buf_wr_loc += 1;
  buffer.write(name, buf_wr_loc)
  buf_wr_loc += str_len;
  buffer.writeUInt8(temp, buf_wr_loc);
  buf_wr_loc += 1;
  buffer.writeUInt8(hum, buf_wr_loc);
  
  const data = new Buffer.from(buffer);
  
  //Request send payload  
  console.log('Payload sent! +', data);
  req.end(data)//data = buffer payload
  
  
  //When the clients gets a response from the server, below
  req.on('response', function(res) {
    console.log("Payload received +: ", res.payload);
    console.log('The humudity was ' + res.payload);
    // res.pipe(process.stdout)
  })
  
});  

