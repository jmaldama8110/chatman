const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ( { id, nickname, room } ) => {

    nickname = nickname.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if( !( nickname || room ) ){
        return {
            error: 'Usuario y room son requeridos...'
        }

    }

    //avoid only unique nicknames
    const existingUser = users.find( (u) => u.room === room && u.nickname === nickname )
    
    // if previos funciont returns true, user already register
    if( existingUser ){
        return {
            error: 'Usuario ya se encuentra en la lista...'
        }
    }

    // Store user
    const user = { id, nickname, room }
    users.push(user)
    return{ user }


}

const removeUser = ( id ) =>{
    const index = users.findIndex( (u)=>{
        return u.id === id
    })
    if( id !== -1 ){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    const user = users.find ( (u) => u.id === id )

    if( !user )
        return undefined
    return user
}

const getUsersInRoom = (room) => {

    room = room.trim().toLowerCase()
    const list = users.filter( (u)=> u.room === room )
    return list

}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}