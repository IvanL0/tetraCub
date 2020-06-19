const initialState = {
  isFetching: false,
  items: []
}

function users(state = initialState, action){
  switch (action.type) {  
    case 'GET_USERS':
      console.log('GET_USERS', action.payload.data.data)
      return Object.assign({}, state, {
        isFetching: true,
        items: action.payload.data.data
      })
    default:
      return state
  }
}

export default users