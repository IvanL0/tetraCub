import React from 'react'

import {
  StyleSheet,
  Dimensions,
} from 'react-native'

import { 
  shadow, 
  border, 
  backgroundPrimary,
  backgroundSecondary,
  headerRightText,
  headerTitleTextSecondary,
} from '../../constants/styles'

const {height, width} = Dimensions.get('window')

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 10
  },
  header: {
    position: 'relative',
    display: 'flex',
    width: width,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#64b5f6',
    flexDirection: 'row',
    paddingTop: 5,
    zIndex: 100
  },
  headerLeft: {
    // flex: 1,
    // display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 15,
  },
  headerIcon:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15
  },
  headerTitle: {
    // flex: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    fontSize: 26,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },  
  menu: {
    bottom: 0,
    left: 0,
    right: 0,
    marginLeft: 5,
    marginRight: 5,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: 'rgba(243, 246, 250, 0.95)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderLeftColor: '#bbdefb',
    borderBottomColor: '#bbdefb',
    borderRightColor: '#bbdefb',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    zIndex: 10,
  },
  menuItems: {
    display: 'flex',
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    ...border,
  },
  menuButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 10
  },
  menuButtonCancel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#fff',
    borderRadius: 20,
    margin: 10
  },
  menuTitleView: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10
  },
  menuTitle:{
    fontSize: 20,
  },
  menuItem: {
    fontSize: 18,
    margin: 10,
    marginLeft: 20,
    marginRight: 20,
    color: '#000',
  },
  menuItemCancel:{
    fontSize: 20,
    fontWeight: '500',
    margin: 10,
    marginLeft: 20,
    marginRight: 20,
    color: '#000',
  },
  dropDown:{
    position: 'absolute',
    top: 82,
    left: 0,
    right: 0,
    display: 'flex',
  },
  dropDownContent:{
    top: 0,
    padding: 5,
    position: 'absolute',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: 'rgba(243, 246, 250, 0.95)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderLeftColor: '#bbdefb',
    borderBottomColor: '#bbdefb',
    borderRightColor: '#bbdefb',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    zIndex: 10,
  },
  dropDownButton:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 10
  },
  dropDownButtonText:{
    fontSize: 18,
    margin: 10,
    marginLeft: 20,
    marginRight: 20,
    color: '#000',
  }
})