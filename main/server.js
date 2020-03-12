const coap    = require('coap')
const server  = coap.createServer({})
const Datastore = require('nedb')
const db = new Datastore({ filename: './database', autoload: true });

const port = 5683;
const host = 'localhost'; //Put amazon Public-DNS here

//Executes function when the server gets a request
server.on('request', function(req, res) {
  console.log('We got a request!!');
  console.log('Logging request: \n', req._packet);
  // console.log('Logging response: ', res);

  //When the server gets a request in form of a GET, POST, etc. it puts the data into variables
  //Has to be in a specific order to work(client.js has the right order)
  const code = req.code;
  const data = req.payload;
  let pos = 0;
  const time_val = data.readUInt32LE(pos)
  pos += 4;
  const str_len = data.readUInt8(pos);
  pos += 1;
  const str_val = data.toString("ascii", pos, str_len+pos);
  pos += str_len;
  const temp_val = data.readUInt8(pos);

  pos += 1;
  const hum_val = data.readUInt8(pos);


  //Depending on the request type diffrent stuff gets peformed
  if (code === '0.01') {
    console.log("It was a GET request!!")
    db.find({ temp: {$in: [temp_val]}}, function (err, docs) {
      query = docs;
      return query;
    });
    setTimeout(() => {
      try {
        let Response = `${query[0].hum}`;
        res.end(Response);
      } catch (error) {
        res.end('There is no time with that value');
      }
    }, 7);
    
  } 
  
  
  else if (code === '0.02') {
    console.log('It was a POST request!!')
    db.insert([{ time: time_val, name: str_val, temp: temp_val, hum: hum_val }], function (err, newDocs) {});

    res.end('Done!')
  }
  
  
//No functions with code 3 and 4 just a respondse message  
  else if (code = 3) {
    console.log('It was a PUT request')
    res.end('Done!')
  }
  
  
  
  else if (code = 4) {
    console.log('It was a DELETE request!!')
    res.end('Done!')
  } else {
    console.log("Response sent!!")
    res.end('Done!')
  }

  
  console.log('Response payload sent!!');
})



//The server stats listening on this port
server.listen(port,host, () => {
  console.log('server started on port and address:' + port + host);
})



// server.listen(function() {
//   console.log('server started')
// })
