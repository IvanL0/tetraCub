import React, { useState, useEffect, useRef, createRef } from 'react'

import { useStyles } from '../style/Styles'
import {
  Box,
  Paper,
  Divider,
  Button,
  Typography,
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
import DeleteIcon from '@material-ui/icons/Delete'

import { FilterElements } from '../../Elements/FilterElements'

import lodash from 'lodash'
import { Link } from 'react-router-dom'

var countSet = []

export default class TransfersFilterContainer extends React.Component{
  constructor(props){
    super(props)
    
    this.state = {
      isOpenFilters: false,
      selectedValues: {},
      anchorEl: null,
      dialogOpen: false,
      presetTitle: '',
      clear: false,
      clearCount: 0,
      presetState: null,
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.preset !== this.props.preset){
      this.handlePreset()
    }
    if(prevState.clearCount !== this.state.clearCount){
      console.log('CDU', this.state.clearCount)
    }
  }
  
  setOpenDialog = (value) => {
    this.setState({dialogOpen: value})
  }
  
  setPresetTitle = (value) => {
    this.setState({presetTitle: value})
  }
  
  getFilters = () => {
    const { isOpenFilters } = this.state
    
    if(isOpenFilters === false){
      this.props.getFilterByType('transfer')
      this.setState({isOpenFilters: true})
    } else {
      this.setState({isOpenFilters: false})
    }
  }
  
  handleInputChange = (key, value) => {
    const { selectedValues } = this.state
    
    console.log('VALUE', value)
    if(key && value){
      let newObj = Object.assign({}, selectedValues[key], {
        ...selectedValues[key],
        ...value,
      })
      let obj = Object.assign({}, selectedValues, {
        ...selectedValues,
        [key]: newObj,
      })
      
      console.log('OBJ', obj)
      this.addToSelection(obj)
    } else {
      this.removeFromSelection(key)
    }
  }
  
  handleCheckChange = (key, value) => {
    const { selectedValues } = this.state
    
    if(key && value){
      let obj = Object.assign({}, selectedValues, {
        ...selectedValues,
        [key]: value
      })
      this.addToSelection(obj)
    } else {
      this.removeFromSelection(key)
    }
  }
  
  handleSelectedSelect = (key, value) => {
    const { selectedValues } = this.state
    
    if(key && value){
      let obj = Object.assign({}, selectedValues, {
        ...selectedValues,
        [key]: value
      })
      this.addToSelection(obj)
    } else {
      this.removeFromSelection(key)
    }
  }
  
  handleSelectedDate = (key, value) => {
    const { selectedValues } = this.state

    if(key && value){
      let obj = Object.assign({}, selectedValues, {
        ...selectedValues,
        [key]: {...value},
      })
      this.addToSelection(obj)
    } else {
      this.removeFromSelection(key)
    }
  }
  
  handleSelectedSearch = (key, value) => {
    const { selectedValues } = this.state

    if(value.length > 0){
      let obj = Object.assign({}, selectedValues, {
        ...selectedValues,
        [key]: value.join(),
      })
      this.addToSelection(obj)
    } else {
      this.removeFromSelection(key)
    }
  }
  
  addToSelection = (obj) => {
    this.setState({selectedValues: obj})
  }
  
  removeFromSelection = (key) => {
    const { selectedValues } = this.state
    
    let newObj = lodash.omit(selectedValues, key)
    this.setState({selectedValues: newObj})
  }
  
  createNewPreset = () => {
    const { presetTitle, selectedValues } = this.state
    
    this.setState({dialogOpen: false})
    this.props.postPreset('transfer', {title: presetTitle, params: selectedValues})
  }
  
  presetsPopover = (e) => {
    this.props.getPresets('transfer')
    this.setState({anchorEl: e.target})
  }
  
  handlePreset = () => {    
    const { preset } = this.props
    
    this.setState({selectedValues: preset ? preset : {}})
    this.clearPreset()
  }
  
  clearPreset = (count) => {
    const { filters, preset } = this.props
    
    const { clear } = this.state
    
    if(count){
      countSet.push(count)
      if(Object.keys(filters.items).length === countSet.length){
        this.setState({clear: false, selectedValues: preset ? preset : {}})
        countSet = []
      } else if(!clear){
        this.setState({clear: true})
      }
    } else {
      this.setState({clear: true})
    }
  }
  
  clearSelectedValues = () => {
    this.setState({selectedValues: {}})
  }
  
  closeToggle = () => {
    this.setState({anchorEl: null})
  }

  render(){
    const {
      isOpenFilters,
      selectedValues,
      anchorEl,
      dialogOpen,
      presetTitle,
      clear,
    } = this.state
    
    let count = Object.keys(selectedValues).length 
    
    // console.log('COUNT', count)
    // console.log('selectedValues', selectedValues)
    
    return(
      <TransfersFilter 
        isOpenFilters={isOpenFilters}
        count={count}
        selectedValues={selectedValues}
        anchorEl={anchorEl}
        dialogOpen={dialogOpen}
        presetTitle={presetTitle}
        clear={clear}
        clearSelectedValues={this.clearSelectedValues}
        getFilters={this.getFilters}
        handleInputChange={this.handleInputChange}
        handleCheckChange={this.handleCheckChange}
        handleSelectedSelect={this.handleSelectedSelect}
        handleSelectedDate={this.handleSelectedDate}
        handleSelectedSearch={this.handleSelectedSearch}
        addToSelection={this.addToSelection}
        createNewPreset={this.createNewPreset}
        presetsPopover={this.presetsPopover}
        handlePreset={this.handlePreset}
        clearPreset={this.clearPreset}
        closeToggle={this.closeToggle}
        setOpenDialog={this.setOpenDialog}
        setPresetTitle={this.setPresetTitle}
        {...this.props}
      />
    )
  }
}

function TransfersFilter(props){
  const classes = useStyles()
    
  useEffect(() => {}, [props.count])
    
  const open = Boolean(props.anchorEl)
  const id = open ? 'simple-popover' : undefined
  
  // console.log('FILTERS', props.filters)
  
  const checkBoxes = lodash.pickBy(props.filters.items, (value, key) => { return value['template'] === 'filters::filter_boolean'})
  
  // console.log('checkBoxes', checkBoxes)
  
  const notCheckBoxes = lodash.pickBy(props.filters.items, (value, key) => { return value['template'] !== 'filters::filter_boolean'})
  
  // console.log('notCheckBoxes', notCheckBoxes)
  
  return (
    <React.Fragment>
      <Paper className={classes.header} elevation={2}>
        <Dialog 
          onClose={() => props.setOpenDialog(false)} 
          aria-labelledby="simple-dialog-title" 
          open={props.dialogOpen}
        >
          <DialogTitle>Название шаблона</DialogTitle>
          <Box className={classes.box} style={{margin: '10px 30px'}}>
            <TextField 
              fullWidth={true}
              label='Название шаблона'
              variant='outlined'
              size='small'
              style={{backgroundColor: '#fff'}}
              onChange={e => props.setPresetTitle(e.target.value)}
            />
          </Box>
          <Button 
            className={classes.confirmButton} 
            onClick={() => props.createNewPreset()}
          >
            Сохранить
          </Button>
        </Dialog>
        <Paper className={classes.root_filter}>
          <Button
            size='small'
            startIcon={<FilterListIcon />}
            onClick={() => props.getFilters()}
          >Фильтр</Button>
          <Divider className={classes.divider} orientation="vertical" />
            <Box className={classes.textCount}>
              <Typography style={{color: '#2196f3'}}>{props.count}</Typography>
            </Box>
          <Divider className={classes.divider} orientation="vertical" />
          <IconButton 
            // aria-describedby={id} 
            size='small' 
            className={classes.iconButton} 
            onClick={props.presetsPopover}
          >
            <StarBorderIcon />
          </IconButton>
          <Popover 
            id={id}
            open={open}
            anchorEl={props.anchorEl}
            onClose={props.closeToggle}
            classes={{
              paper: classes.paper_popover,
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box className={classes.popover_body}>
              <Typography style={{margin: '10px'}}>Выберите шаблон</Typography>
              {
                props.presets.isFetching ?
                props.presets.items.map((item, i) => (
                <Box className={classes.popoverRow} key={i}>
                  <Button 
                    component={Link}
                    to={location => `${location.pathname + '?' + item.query}`}
                    style={{color: '#2196f3'}}
                  >{item.title}</Button>
                  <IconButton 
                    size='small'
                    onClick={() => props.deletePreset('transfer', item.id)}
                  >
                    <DeleteIcon style={{color: '#ccc'}}/>
                  </IconButton>
                </Box>
                  
                )) :
                <CircularProgress />
              }
            </Box>
          </Popover>
          <Divider className={classes.divider} orientation="vertical" />
          <InputBase
            className={classes.input}
            placeholder="Поиск..."
            inputProps={{ 'aria-label': 'search google maps' }}
          />
        </Paper>
        <Button 
          variant='outlined'
          className={classes.modalButton}
          onClick={() => props.openTransferModal()}
        >Добавить трансфер</Button>
      </Paper>
      {
        props.isOpenFilters ? 
        <Paper className={classes.filter} elevation={2}>
          {
            !props.filters.isFetching ?
            <Box style={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', margin: '20px'}}>
              <CircularProgress />
            </Box> : 
            <React.Fragment>
            <Box className={classes.filter_grid}>
            {
              Object.entries(notCheckBoxes).map(([key, value], i) => (
                <FilterElements 
                  key={i}
                  type={value['template'] ? value['template'].slice(16) : null}
                  label={value['name'] ? value['name'] : null}
                  url={value['url'] ? value['url'] : null}
                  itemKey={value['key']}
                  items={value['options']}
                  search={value['url']}
                  handleSelectedSelect={props.handleSelectedSelect}
                  handleSelectedDate={props.handleSelectedDate}
                  handleSelectedSearch={props.handleSelectedSearch}
                  clear={props.clear}
                  preset={props.preset}
                  isOpenFilters={props.isOpenFilters}
                  {...props}
                />
              )) 
            }
            </Box> 
            <Box className={classes.filter_grid}>
            {
              Object.entries(checkBoxes).map(([key, value], i) => (
                <FilterElements 
                  key={i}
                  type={value['template'] ? value['template'].slice(16) : null}
                  label={value['name'] ? value['name'] : null}
                  url={value['url'] ? value['url'] : null}
                  itemKey={value['key']}
                  items={value['options']}
                  search={value['url']}
                  handleSelectedSelect={props.handleSelectedSelect}
                  handleSelectedDate={props.handleSelectedDate}
                  handleSelectedSearch={props.handleSelectedSearch}
                  clear={props.clear}
                  preset={props.preset}
                  isOpenFilters={props.isOpenFilters}
                  {...props}
                />
              )) 
            }
            </Box>
          </React.Fragment>
          }
          <Box style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row'
          }}>
            <Box>
              <Button 
                className={classes.confirmButton}
                onClick={() => props.fetchByFilter(props.selectedValues)}
              >
                Искать
              </Button>
              <Button 
                className={classes.saveButton}
                variant='outlined'
                onClick={() => props.setOpenDialog(true)}
              >
                Сохранить шаблон
              </Button>
            </Box>
              <Button 
                className={classes.clearButton}
                variant='outlined'
                component={Link}
                to={location => `${location.pathname}`}
                onClick={() => props.clearPreset()}
              >
                Очистить
              </Button>
          </Box>
        </Paper> :
        null
      }
    </React.Fragment>
  )
}