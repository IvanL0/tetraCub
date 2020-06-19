import axios from 'axios'
import { sqlErrorsActions } from "../actions/SQLErrors/sqlErrorsActions"
import store from '../store/configureStore'
import { invalidUserToken } from '../actions/Users/userActions'
import { url } from './url'


const instance = axios.create({
  baseURL: url,
})

instance.defaults.headers.get['Accept'] = 'application/json'
instance.defaults.headers.post['Accept'] = 'application/json'
instance.defaults.headers.post['Content-Type'] = 'application/json'

instance.interceptors.response.use(
  null, 
  err => {
    const { status, data, config } = err.response

    console.log('INSTANCE__STATUS', status)

    if(status === 401){
      localStorage.removeItem('@HVStore')
      invalidToken()
    } else if(status === 500){
      console.log('STATUS__500', status)
      resErrors(status, null, store.dispatch)
    } else {
      return err.response
    }
  }
)

export default instance