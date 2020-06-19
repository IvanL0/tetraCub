import { put, takeLatest, select, call } from 'redux-saga/effects'
import handlingResponseActions from '../actions/handlingResponse/handlingResponseActions'
import { postOrder, putMasters, putTags } from '../actions/orders/ordersAction'
import { postNomenclature } from '../actions/warehouse/nomenclaturesActions'
import lodash from 'lodash'

const RES_ERRORS = 'RES_ERRORS'
const RES_DATA = 'RES_DATA'

export default function* callToOrders() {
  yield takeLatest('CREATE_ORDER', post)
}

function* post({payload}){
  
  try{
    console.log('UPDATE_OFFICES_PAYLOAD', payload)
    
    let errorsObject = {errors: {}}
    
    let senderObj = {}, // Full sendObj
        nomObject = {}, // nomenclature API
        orderObject = {}, // orders API
        masterObj = {}, // orders/masters API
        tagsObj = {} // orders/tags API
    
    var nomenclatureResponse, 
        orderResponse, 
        mastersResponse, 
        tagsResponse
    
    payload.map(item => {
      if(item.required){
        Object.entries(item).reduce(([key, value]) => {
          if(typeof value === 'string' && lodash.isEmpty(value) && key !== 'required'){
            errorsObject.errors[key] = ['Поле не может быть пустым']
          } 
        })
      }
    })
    
    if(Object.keys(errorsObject.errors).length > 0){
      yield put(handlingResponseActions(false, RES_ERRORS, errorsObject))
      return false
    } 
    
    payload.map(item => {
      if(item.required){
        Object.entries(item).reduce(([key, value]) => {
          senderObj[key] = value // isEmpty validation complete
        })
      }
    })

    console.log('NOMENCLATURE_SEND_OBJ', senderObj)
    
    if(!senderObj.nomenclature_id){
      nomObject = {
        title: senderObj.title,
        brand: senderObj.brand,
        model: senderObj.model,
        serial: senderObj.serial,
        appearance: senderObj.appearance,
        color: senderObj.color,
        additional_equipment: senderObj.additional_equipment,
      }
      nomenclatureResponse = yield call(postNomenclature, nomObject)
      
      if(nomenclatureResponse.errors){
        console.log('nomenclatureResponse', nomenclatureResponse)
        yield put(false, RES_ERRORS, nomenclatureResponse)
        return false
      }
      yield put({type: 'MEMORY', payload: {nomenclature_id: nomenclatureResponse.data.data.id}})
    }

    // console.log('nomenclatureResponse', nomenclatureResponse)
    
    if(!senderObj.order_id){
      orderObject = {
        contact_id: senderObj.contact_id,
        nomenclature_id: senderObj.nomenclature_id ? senderObj.nomenclature_id.parseInt() : nomenclatureResponse.data.data.id,
        organization_id: senderObj.organization_id,
        work_id: senderObj.work_id,
        diagnostics_days: parseInt(senderObj.diagnostics_days),
        // recomendation: senderObj.recomendation
      }
      
      orderResponse = yield call(postOrder, orderObject)
      
      if(orderResponse.errors){
        console.log('orderResponse', orderResponse)
        yield put(handlingResponseActions(false, RES_ERRORS, orderResponse))
        return false
      }
      yield put({type: 'MEMORY', payload: {order_id: orderResponse.data.data.id}})
    }
    
    if(!senderObj.sendMasters){
      masterObj = {
        id: senderObj.order_id ? parseInt(senderObj.order_id) : orderResponse.data.data.id,
        masters: senderObj.masters_ids,
      }
      
      mastersResponse = yield call(putMasters, masterObj)
      
      if(mastersResponse.errors){
        console.log('mastersResponse', mastersResponse)
        yield put(handlingResponseActions(false, RES_ERRORS, mastersResponse))
        return false
      }
      yield put({type: 'MEMORY', payload: {sendMasters: true}})
    }
    
    if(!senderObj.sendTags){
      tagsObj = {
        id: senderObj.order_id ? parseInt(senderObj.order_id) : orderResponse.data.data.id,
        tags: senderObj.tags_ids,
      }
      
      tagsResponse = yield call(putTags, tagsObj)
      
      if(tagsResponse.errors){
        console.log('tagsResponse', tagsResponse)
        yield put(handlingResponseActions(false, RES_ERRORS, tagsResponse))
        return false
      }
      yield put({type: 'MEMORY', payload: {sendTags: true}})
    }
    
    yield put({type: 'CLEAR_MEMORY'})
    yield put(handlingResponseActions(false, RES_DATA))
    
  } catch(e){
    console.log(e)
  }
}