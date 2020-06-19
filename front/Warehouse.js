import React, { useState, useEffect } from 'react'

import { connect } from 'react-redux'
import { updateNomenclature, getNomenclatures } from '../../actions/warehouse/nomenclaturesActions'
import { getOrderById, updateOrderStatus, postOrderComment, updateOrderService, putMaster, postPayment, postInvoice, postOrderService } from '../../actions/orders/ordersAction'
import { getTransfers, getTransfersByFilter } from '../../actions/warehouse/transfersActions'
import { getWarehouses, getStock } from '../../actions/warehouse/warehousesActions'
import { getFilter } from '../../actions/filters/filtersActions'
import { getPresets, postPresets, deletePresets } from '../../actions/presets/presetsActions'

import { useStyles } from './style/Styles'

import {
  Box,
  Paper,
  Divider,
  Button,
  Typography,
  Grid,
  AppBar,
  Tabs,
  Tab,
  TextField,
  CircularProgress,
  IconButton,
  InputBase,
  Popover,
  Dialog,
  DialogTitle,
} from '@material-ui/core'

import FilterListIcon from '@material-ui/icons/FilterList'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import StarIcon from '@material-ui/icons/Star'
import Header from '../Header'

import moment from 'moment'
import 'moment/locale/ru'

import { SimpleTable } from '../Elements/SimpleTable'
import { PaginateFooter } from '../Elements/PaginateFooter'

import lodash from 'lodash'
import { WarehousesTab } from './Tabs/WarehousesTab'
import { NomenclaturesTab } from './Tabs/NomenclaturesTab'
import { TransfersTab } from './Tabs/TransfersTab'
import { StockTab } from './Tabs/StockTab'
import { Link } from 'react-router-dom'
import { IncomesTab } from './Tabs/IncomesTab'
import { OutcomesTab } from './Tabs/OutcomesTab'
import { getIncomes } from '../../actions/warehouse/incomesActions'
import { getOutcomes } from '../../actions/warehouse/outcomesActions'

class Warehouse extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      isOpenWarehouse: false,
      isOpenNomenclature: false,
      isOpenTransfer: false,
      isOpenIncomes: false,
      isOpenOutcomes: false,
      isOpenSurveysModal: false,
      tabValue: 0,
      queryParams: '',
      preset: null,
      toSurveyId: null,
      surveyType: null,
      errors: {
        nameError: '',
        loginError: '',
        phoneError: '',
        emailError: '',
        birthdayError: '',
        addressError: '',
        confirmPassword: '',
      }
    }
  }
  
  componentDidMount() {
    this.fetchData()
  }
  
  componentDidUpdate(prevProps, prevState) {
    if(this.props.location.pathname !== prevProps.location.pathname){
      this.fetchData()
    } else if(this.props.location.search !== prevProps.location.search){
      this.handlePreset(this.props.location.search)
      if(this.props.location.pathname == '/warehouses') {
        this.setState({tabValue: 0})
      } else if(this.props.location.pathname == '/warehouses/nomenclatures'){
        this.setState({tabValue: 1})
      } else if(this.props.location.pathname == '/warehouses/stock'){
        this.setState({tabValue: 2})
      } else if(this.props.location.pathname == '/warehouses/transfers'){
        this.setState({tabValue: 3})
        this.props.getTransfersByFilter(this.props.location.search)
      } else if(this.props.location.pathname == '/warehouses/incomes'){
        this.setState({tabValue: 4})
        // this.props.getTransfersByFilter(this.props.location.search)
      } else if(this.props.location.pathname == '/warehouses/outcomes'){
        this.setState({tabValue: 5})
        // this.props.getTransfersByFilter(this.props.location.search)
      }
    }
  }
  
  fetchData = () => {
    // console.log('LOCATION', this.props.location.pathname)
    if(this.props.location.pathname == '/warehouses') {
      this.props.getWarehouses()
      this.setState({tabValue: 0})
    } else if(this.props.location.pathname == '/warehouses/nomenclatures'){
      this.props.getNomenclatures()
      this.setState({tabValue: 1})
    } else if(this.props.location.pathname == '/warehouses/stock'){
      this.props.getStock()
      this.setState({tabValue: 2})
    } else if(this.props.location.pathname == '/warehouses/transfers'){
      // console.log('LOCATION_SEARCH', this.props.location.search)
      if(this.props.location.search){
        this.props.getTransfersByFilter(this.props.location.search)
        this.props.getPresets('transfer')
        this.handlePreset(this.props.location.search)
        this.setState({tabValue: 3})
      } else {
        this.props.getTransfers()
        this.props.getPresets('transfer')
        this.setState({tabValue: 3})
      }
    } else if(this.props.location.pathname == '/warehouses/incomes'){
      if(this.props.location.search){
        // this.props.getTransfersByFilter(this.props.location.search)
        // this.props.getPresets('transfer')
        // this.handlePreset(this.props.location.search)
        this.setState({tabValue: 4})
      } else {
        this.props.getIncomes()
        // this.props.getPresets('transfer')
        this.setState({tabValue: 4})
      }
    } else if(this.props.location.pathname == '/warehouses/outcomes'){
      if(this.props.location.search){
        // this.props.getTransfersByFilter(this.props.location.search)
        // this.props.getPresets('transfer')
        // this.handlePreset(this.props.location.search)
        this.setState({tabValue: 5})
      } else {
        this.props.getOutcomes()
        // this.props.getPresets('transfer')
        this.setState({tabValue: 5})
      }
    }
  }
  
  paginateWarehouses = (value) => {
    this.props.getWarehouses(value)
  }
  
  paginateNomenclatures = (value) => {
    this.props.getNomenclatures(value)
  }
  
  paginateStock = (value) => {
    this.props.getStock(value)
  }
  
  paginateTransfers = (value) => {
    this.props.getTransfers(value)
  }
  
  openWarehouseModal = (value) => {
    const { isOpenWarehouse } = this.state
    if(value === 'update'){
      this.props.getWarehouses()
      this.setState({isOpenWarehouse: !isOpenWarehouse})
    } else {
      this.setState({isOpenWarehouse: !isOpenWarehouse})
    }
  }
  
  openNomenclatureModal = (value) => {
    const { isOpenNomenclature } = this.state
    if(value === 'update'){
      this.props.getNomenclatures()
      this.setState({isOpenNomenclature: !isOpenNomenclature})
    } else {
      this.setState({isOpenNomenclature: !isOpenNomenclature})
    }
  }
  
  openTransferModal = (value) => {
    const { isOpenTransfer } = this.state
    if(value === 'update'){
      this.props.getTransfers()
      this.setState({isOpenTransfer: !isOpenTransfer})
    } else {
      this.setState({isOpenTransfer: !isOpenTransfer})
    }
  }
  
  openIncomeModal = (value) => {
    const { isOpenIncomes } = this.state
    if(value === 'update'){
      this.props.getIncomes()
      this.setState({isOpenIncomes: !isOpenIncomes})
    } else {
      this.setState({isOpenIncomes: !isOpenIncomes})
    }
  }
  
  openOutcomeModal = (value) => {
    const { isOpenOutcomes } = this.state
    if(value === 'update'){
      this.props.getOutcomes()
      this.setState({isOpenOutcomes: !isOpenOutcomes})
    } else {
      this.setState({isOpenOutcomes: !isOpenOutcomes})
    }
  }
  
  getFilterByType = (type) => {
    this.props.getFilter(type)
  }
  
  fetchByFilter = (data) => {
    this.props.getTransfersByFilter(data)
  }
  
  handlePreset = (query) => {
    let obj = {}
    
    const urlParams = new URLSearchParams(query)
    
    for(var pair of urlParams.entries()) {  
      if(pair[0].match(/\[(\w+)?\]$/)){
        var key = pair[0].replace(/\[(\w+)?\]/, '')
        if (!obj[key]) obj[key] = {}
        var index = /\[(\w+)\]/.exec(pair)[1]
        obj[key][index] = pair[1]
      } else {
        obj[pair[0]] = pair[1]
      }
    }
    this.setState({preset: obj})
  }
  
  getPresets = (type) => {
    this.props.getPresets(type)
  }
  
  createPreset = (type, data) => {
    this.props.createPreset(type, data)
  }
  
  deletePreset = (resource, id) => {
    this.props.deletePreset(resource, id)
  }
  
  openSurveysModal = (value, id, type) => {
    const { isOpenSurveysModal } = this.state
    if(value === 'update'){
      // this.props.getWarehouses()
      this.setState({isOpenSurveysModal: !isOpenSurveysModal})
    } else {
      this.setState({isOpenSurveysModal: !isOpenSurveysModal, toSurveyId: id, surveyType: type})
    }
  }
 
  render(){
    const { 
      warehouses, 
      nomenclatures, 
      transfers, 
      stock, 
      incomes, 
      outcomes, 
      filter, 
      presets 
    } = this.props
        
    const { 
      errors,
      preset,
      isOpenWarehouse,
      isOpenNomenclature,
      isOpenTransfer,
      isOpenIncomes,
      isOpenOutcomes,
      isOpenSurveysModal,
      tabValue,
      toSurveyId,
      surveyType,
    } = this.state
    
    // console.log('PRESET_STATE', preset)
        
    return (
      <Box className='container'>
        <Header />
          <WarehouseTabs 
            toSurveyId={toSurveyId}
            surveyType={surveyType}
            tabValue={tabValue}
            warehouses={warehouses}
            nomenclatures={nomenclatures}
            transfers={transfers}
            stock={stock}
            incomes={incomes}
            outcomes={outcomes}
            filters={filter}
            isOpenWarehouse={isOpenWarehouse}
            isOpenNomenclature={isOpenNomenclature}
            isOpenTransfer={isOpenTransfer}
            isOpenIncomes={isOpenIncomes}
            isOpenOutcomes={isOpenOutcomes}
            isOpenSurveysModal={isOpenSurveysModal}
            openWarehouseModal={this.openWarehouseModal}
            openNomenclatureModal={this.openNomenclatureModal}
            openTransferModal={this.openTransferModal}
            openIncomeModal={this.openIncomeModal}
            openOutcomeModal={this.openOutcomeModal}
            openSurveysModal={this.openSurveysModal}
            paginateWarehouses={this.paginateWarehouses}
            paginateNomenclatures={this.paginateNomenclatures}
            paginateStock={this.paginateStock}
            paginateTransfers={this.paginateTransfers}
            getFilterByType={this.getFilterByType}
            fetchByFilter={this.fetchByFilter}
            presets={presets}
            preset={preset}
            getPresets={this.getPresets}
            postPreset={this.createPreset}
            deletePreset={this.deletePreset}
          />
      </Box>
    )
  }
}

function WarehouseTabs(props){
  const classes = useStyles()
  const {
    tabValue,
  } = props
  
  useEffect(() => {}, [])

  return(
    <Box className={classes.profile}>
      <AppBar position="static" className={classes.appBar} style={{padding: 0}}>
        <Box>
          <Typography variant='body2' style={{paddingLeft: '10px', fontWeight: 500, color: '#808080'}}>Склад</Typography>
          <Typography variant='h5' style={{padding: '5px 0 0 10px', fontWeight: 500}}>Информация по складам</Typography>
        </Box>
      </AppBar>
      <AppBar position="static" className={classes.tableAppBar} style={{padding: '10px 0 0 0'}}>
        <Tabs value={tabValue} style={{width: '100%', paddingLeft: '15px'}}>
          <Tab component={Link} to='/warehouses' label="Склады" className={classes.tabs}/>
          <Tab component={Link} to='/warehouses/nomenclatures' label="Номенклатура" className={classes.tabs}/>
          <Tab component={Link} to='/warehouses/stock' label="Остатки" className={classes.tabs}/>
          <Tab component={Link} to='/warehouses/transfers' label="Перемещения" className={classes.tabs}/>
          <Tab component={Link} to='/warehouses/incomes' label="Оприходования" className={classes.tabs}/>
          <Tab component={Link} to='/warehouses/outcomes' label="Списания" className={classes.tabs}/>
        </Tabs>
        {
        tabValue === 0 ?
          <WarehousesTab {...props}/> :
        tabValue === 1 ?
          <NomenclaturesTab {...props}/> :
        tabValue === 2 ?
          <StockTab {...props}/> :
        tabValue === 3 ?
          <TransfersTab {...props}/> :
        tabValue === 4 ?
          <IncomesTab {...props}/> :
        tabValue === 5 ?
          <OutcomesTab {...props}/> :
        null
      }
      </AppBar>
    </Box>
  )
}

const mapStateToProps = state => ({
  warehouses: state.warehouses,
  nomenclatures: state.nomenclatures,
  stock: state.stock,
  transfers: state.transfers,
  incomes: state.incomes,
  outcomes: state.outcomes,
  filter: state.filter,
  presets: state.presets,
  handlingResponse: state.handlingResponse,
})

const mapDispatchToProps = dispatch => ({
  getWarehouses: (value) => dispatch(getWarehouses(value)),
  getNomenclatures: (value) => dispatch(getNomenclatures(value)),
  getStock: (value) => dispatch(getStock(value)),
  getTransfers: (value) => dispatch(getTransfers(value)),
  getFilter: (type) => dispatch(getFilter(type)),
  getIncomes: (type) => dispatch(getIncomes(type)),
  getOutcomes: (type) => dispatch(getOutcomes(type)),
  getTransfersByFilter: (data) => dispatch(getTransfersByFilter(data)),
  getPresets: (type) => dispatch(getPresets(type)),
  createPreset: (type, data) => dispatch(postPresets(type, data)),
  deletePreset: (resource, id) => dispatch(deletePresets(resource, id)),
  clearResponse: () => dispatch({type: 'CLEAR'}),
})

export default connect(mapStateToProps, mapDispatchToProps)(Warehouse)