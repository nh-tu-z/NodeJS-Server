var socket = io('http://0.tcp.ngrok.io:12823/')

socket.on('Server-echo', function(data){
    $('#txt-response').append(`${data}, `)
})
$(document).ready(function(){
    $('#mrTu').click(function(){
        socket.emit('Client-to-Server','Hello Server!!!')
    })
})