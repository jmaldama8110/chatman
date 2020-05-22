const socket = io()

const $messageForm = document.querySelector('form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendGeolocationButton = document.querySelector('#but_send_geolocation')

const $messages = document.querySelector('#messages')
const $message_template = document.querySelector('#message_template').innerHTML
const $message_template_geoloc = document.querySelector('#message_template_geoloc').innerHTML
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const {nickname, room} = Qs.parse(location.search, { ignoreQueryPrefix: true } )

const autoscroll = () => {
    
    // New Message Element
    const $newMessage = $messages.lastElementChild

    // get the Height of the last New Message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible Height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled? this is calculated here!
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset ) {
        $messages.scrollTop = $messages.scrollHeight
    }

}

// recibe el mensaje y difundido, evento 'NewMsg'
socket.on('NewMsg', (newMsg) =>{

    console.log(newMsg)
    const html = Mustache.render($message_template,{
        nicknameFromServer: newMsg.nickname,
        messageFromServer: newMsg.text,
        createdAtFromServer: moment(newMsg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

// recibe un mensaje de enviar localizacion 'sendLocationMsg'
socket.on('sendLocationMsg', (msg) =>{
    console.log(msg)

    const html = Mustache.render($message_template_geoloc,{
        nicknameFromServer: msg.nickname,
        messageFromServer: msg.url,
        createdAtFromServer: moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})


// actualizacion de lista de usuarios

socket.on('roomData', ({room, users}) => {
    
    const html = Mustache.render($sidebarTemplate,{
            room,
            users
    })
    document.querySelector('#sidebar').innerHTML = html

})

/// envia mensaje con el evento submit (boton)
$messageForm.addEventListener('submit',(e) => {

    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')

    const message = $messageFormInput.value

    socket.emit('postMessage',message, (error) => {
        
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if( error ){
            return console.log(error)
        }

        console.log('Message delivered!..')

    })
    
})
// envia mensaje con el evento submit (boton) Geolocalization
$sendGeolocationButton.addEventListener('click', ()=>{
    
    if( !navigator.geolocation ){
        return alert('Geolocalizacion no soportada!')
    }
    $sendGeolocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition( (position)=> {
            socket.emit('sendGeolocation',{     long: position.coords.longitude,
                                                lat: position.coords.latitude   }, (responseMsg) =>{
                                                    console.log('Server response->'+responseMsg)
                                                } )
        } )
        $sendGeolocationButton.removeAttribute('disabled')
})

socket.emit('join', { nickname,room },(error)=>{

    if( error ){
        alert(error)
        location.href = '/'
    }

} )
