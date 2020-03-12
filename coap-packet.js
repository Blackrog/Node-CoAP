/*

Just a test

*/



const token = new Buffer.from('Noob');

const dgram       = require('dgram')
    , packet      = require('coap-packet')
    , parse       = packet.parse
    , generate    = packet.generate
    , payload     = new Buffer.from('Hello World')
    , message     = generate({ payload: payload, token: token})
    , port        = 5683
    , client      = dgram.createSocket("udp4")
    , server      = dgram.createSocket("udp4")

    // console.log(parse(payload));

server.bind(port, function() {
  client.send(message, 0, message.length, 5683, "localhost", function(err, bytes) {
    client.close()
  })
})

server.on('message', function(data) {
    console.log(parse(data))
  console.log(parse(data).payload.toString())
  server.close()
})