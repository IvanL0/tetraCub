import instance from '../../constants/config'

import { AsyncStorage } from 'react-native'

const RESPONSE_ERRORS = 'RESPONSE_ERRORS'
const RESPONSE_DATA = 'RESPONSE_DATA'

const GET_USERS = 'GET_USERS'
const UPDATE_USER_LOCATION = 'UPDATE_USER_LOCATION'
const UPDATE_USER_INFO = 'UPDATE_USER_INFO'
const GET_USER_BY_ID = 'GET_USER_BY_ID'
const GET_USER = 'GET_USER'
const INVALID_TOKEN = 'INVALID_TOKEN'
const USER_FAILED = 'USER_FAILED'
const CHECK_STATUS = 'CHECK_STATUS'
const GET_USER_PUBLICATIONS = 'GET_USER_PUBLICATIONS'

const uuidv4 = require('uuid/v4')

export const getAllUsers = () => async dispatch => {
  let token = await AsyncStorage.getItem('@HVStore')

  instance.get(`/users/list`,
    {
      body: {
        token: token,
      }
    }
  )
    .then(res => dispatch({type: GET_USERS, payload: res}))
    .catch(err => console.log(err))
}

export const getUser = () => async dispatch => {
  let uuid = await AsyncStorage.getItem('@HVStore')

  instance.get(`/users/user`,
    {
      headers: {
        'Authorization': uuid
      }
    }
  )
  .then(res => res.status !== 200 ? 
    dispatch({type: RESPONSE_ERRORS, payload: res}) : 
    dispatch({type: GET_USER, payload: res}))
  .catch(err => console.log(err))
}

export const updateToken = (token) => async dispatch => {
  if (!token){
    console.log('TOKEN_CLEAR')
    await AsyncStorage.clear()
    dispatch({type: INVALID_TOKEN, res})
  } else {
    console.log('UPDATE_TOKEN')
    await AsyncStorage.setItem('@HVStore', token)
  }
}

export const deleteUser = (id) => async dispatch => {
  instance.post(`/users/delete`,
    {
      body: {
        id: id,
      }
    }
  )
    .then(res => console.log(res))
    // .then(res => dispatch({type: GET_USER_BY_ID, res}))
    .catch(err => console.log(err))
}

export const updateUser = (data) => async dispatch => {

  let uuid = await AsyncStorage.getItem('@HVStore')
  let formData = new FormData()
  
  Object.entries(data).map(([key, value]) => {
    if(key === 'avatar'){
      formData.append(key, {
        uri: value, 
        name: uuidv4(), 
        type: 'image/jpg'
      })
    } else {
      formData.append(key, value)
    }
  }, {})
  
  console.log('FORM_DATA', formData)

  instance.patch(`/users/user`,
    formData,
    {
      headers: {
        'Authorization': uuid,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      }
    }
  )
  .then(res => res.status !== 201 ? 
    dispatch({type: RESPONSE_ERRORS, payload: res}) : 
    dispatch({type: GET_USER, payload: res}))
  .catch(err => console.log(err))
}

export const updateUserStatus = (data) => async dispatch => {

  let uuid = await AsyncStorage.getItem('@HVStore')
  
  let obj = Object.assign({
    village
  })

  instance.patch(`/users/user`,
    data,
    {
      headers: {
        'Authorization': uuid,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      }
    }
  )
  .then(res => res.status !== 201 ? 
    dispatch({type: RESPONSE_ERRORS, payload: res}) : 
    dispatch({type: GET_USER, payload: res}))
  .catch(err => console.log(err))
}

export const updateUserLocation = (location) => async dispatch => {
  instance.post(`/users/location`,
    {
      body: {
        token: location.token,
        village: location.village, 
        area: location.area, 
        settlement: location.settlement, 
        villageLiter: location.villageLiter, 
        villageNumber: location.villageNumber, 
        streetNumber: location.streetNumber, 
        streetName: location.streetName, 
        streetLiter: location.streetLiter,
      }
    }
  )
  // .then(res => console.log(res))
  .then(res => res.data.message === 'WELL_DONE' ? fetchData(location.token, 'location') : dispatch({type: INVALID_TOKEN, res}))
  .catch(err => console.log(err))
}

const fetchData = (token, type) => async dispatch => {
  instance.post(`/users/${type}`,
    {
      body: {
        token: token,
      }
    }
  )
  // .then(res => console.log(res))
  .then(res => 
    res.data.message === 'WELL_DONE' ? 
          type === 'location' ? 
          dispatch({type: UPDATE_USER_LOCATION, res}) : 
          dispatch({type: UPDATE_USER_INFO, res}) : 
      dispatch({type: INVALID_TOKEN, res}))
  .catch(err => console.log(err))
}

export function invalidUserToken(dispatch){
  dispatch({type: INVALID_TOKEN})
}