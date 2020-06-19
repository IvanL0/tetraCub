import React, { useState } from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { NavigationContainer } from '@react-navigation/native'

import { connect } from 'react-redux'

import { 
  Dimensions, 
  StyleSheet, 
  View, 
  AsyncStorage,
  TouchableOpacity,
  Text,
  TextInput,
  StatusBar,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import DiscussionsListScreen from './Tags/Discussions/DiscussionsListScreen'
import PollsScreen from './Tags/Polls/PollsScreen'
import MeetingsListScreen from './Tags/Meetings/MeetingsListScreen'
import NoticesScreen from './Tags/Notices/NoticesScreen'
import DocumentsScreen from './Tags/Documents/DocumentsScreen'
import StatisticsScreen from './Tags/Statistics/StatisticsScreen'
// import Documents from '../Menu/Documents'
// import MainBoards from '../Menu/MainBoards'
// import Statistics from '../Menu/Statistics'

import { styles } from './ForumStyle'

const {height, width} = Dimensions.get('window')

const Tab = createMaterialTopTabNavigator()

class ForumScreen extends React.Component{
  static navigationOptions = {
    header: null,
  }
  
  constructor(props){
    super(props)
    
    this.state = {
      isOpenMenu: false,
      isOpenDropdownMenu: false,
    }
  }
  
  openMenu = (value) => {
    this.setState({isOpenMenu: value})
  }
  
  openDropdownMenu = () => {
    const { isOpenDropdownMenu } = this.state
    this.setState({isOpenDropdownMenu: !isOpenDropdownMenu})
  }
  
  handleMenuChange = (to) => {
    this.setState({isOpenMenu: false})
    this.props.navigation.navigate(to)
  }
  
  render(){
    const { isOpenMenu, isOpenDropdownMenu } = this.state
    
    return (
      <NavigationContainer>
        <SafeAreaView style={{backgroundColor: '#64b5f6'}}/>
        <Header 
          navigation={this.props.navigation} 
          openMenu={this.openMenu}
          openDropdownMenu={this.openDropdownMenu}
          isOpenDropdownMenu={isOpenDropdownMenu}
        />
        <TouchableWithoutFeedback onPress={() => this.openDropdownMenu()}>
        <Tab.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#64b5f6',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 16,
              fontWeight: 'bold',
            },
          }}
          initialRouteName="Discussions"
          tabBarOptions={{
            activeTintColor: '#fff',
            labelStyle: { fontSize: 14 },
            style: { backgroundColor: '#64b5f6' },
            scrollEnabled: true
          }}
          // swipeEnabled={true}
        >
          <Tab.Screen
            name="Discussions"
            options={{ tabBarLabel: 'Обсуждения' }}
          >
            {props => <DiscussionsListScreen navigation={this.props.navigation}/>}
          </Tab.Screen>
          <Tab.Screen
            name="Polls"
            component={PollsScreen}
            options={{ tabBarLabel: 'Опросы' }}
          />
          <Tab.Screen
            name="Profile"
            options={{ tabBarLabel: 'Мероприятия' }}
          >
            {props => <MeetingsListScreen navigation={this.props.navigation}/>}
          </Tab.Screen>
          <Tab.Screen
            name="Notices"
            component={NoticesScreen}
            options={{ tabBarLabel: 'Объявления' }}
          />
          <Tab.Screen
            name="Documents"
            options={{ tabBarLabel: 'Документы' }}
          >
            {props => <DocumentsScreen navigation={this.props.navigation}/>}
          </Tab.Screen>
          <Tab.Screen
            name="Statistics"
            options={{ tabBarLabel: 'Статистика' }}
          >
            {props => <StatisticsScreen navigation={this.props.navigation}/>}
          </Tab.Screen>
        </Tab.Navigator>
        </TouchableWithoutFeedback>
        {
          isOpenMenu ?
          <MenuOpen 
            openMenu={this.openMenu} 
            handleMenuChange={this.handleMenuChange}
          /> :
          null
        }   
      </NavigationContainer>
      
    )
  }
}

function Header(props){
  return(
    <View style={styles.header}>
      {
        props.isOpenDropdownMenu ?
        <DropDownMenu /> :
        null
      }
      <TouchableOpacity 
        style={styles.headerLeft}
        onPress={() => props.navigation.navigate('Village')}
      >
        <View style={styles.headerIcon}>
          <Ionicons name='ios-arrow-back' size={20} color={'#464646'}/>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.headerTitle}
        onPress={() => props.openDropdownMenu()}
      >
        <Text style={{fontSize: 20, color: '#fff', fontWeight: '500'}}>Форум</Text>
        <Ionicons     
          name='md-funnel' 
          size={22}
          style={{
            marginLeft: 10,
            color: '#fff'
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.headerRight}
        onPress={() => props.openMenu(true)}
      >
        <Ionicons name='ios-add' size={30} color={'#fff'}/>
      </TouchableOpacity>
    </View>
  )
}

function MenuOpen(props){
  return(
    <View style={styles.menu}>
      <View style={styles.menuItems}>
        <View style={styles.menuTitleView}>
          <Text style={styles.menuTitle}>Добавить</Text>
        </View>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => props.handleMenuChange('CreateDiscussion')}
        >
          <Text style={styles.menuItem}>Обсуждение</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => props.handleMenuChange('CreatePoll')}
        >
          <Text style={styles.menuItem}>Опрос</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => props.handleMenuChange('CreateMeeting')}
        >
          <Text style={styles.menuItem}>Мероприятие</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => props.handleMenuChange('CreateNotice')}
        >
          <Text style={styles.menuItem}>Объявление</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => props.handleMenuChange('CreateDocument')}
        >
          <Text style={styles.menuItem}>Документ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuButtonCancel}
          onPress={() => props.openMenu(false)}
        >
          <Text style={[styles.menuItemCancel, {color: '#e57373', marginTop: 5}]}>Отмена</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function DropDownMenu(props){
  return(
    <View style={styles.dropDown}>
      <View style={styles.dropDownContent}>
        <TouchableOpacity style={styles.dropDownButton}>
          <Text style={styles.dropDownButtonText}>Популярные</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dropDownButton}>
          <Text style={styles.dropDownButtonText}>Новые</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dropDownButton}>
          <Text style={styles.dropDownButtonText}>Все</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
})

const mapDispatchToProps = dispatch => ({
  setPhone: (phone) => dispatch({type: 'GET_AUTH_PHONE', payload: phone})
})

export default connect(mapStateToProps, mapDispatchToProps)(ForumScreen)