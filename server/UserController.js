import db from '../dbconfig.js'
import uuidBuffer from 'uuid-buffer'
import uuidv4 from 'uuid/v4.js'
import bcrypt from 'bcrypt'
import multer from 'multer'
import {ErrorHandler, handleError} from '../modules/errors.js'
import twilio from 'twilio'

const accountSid
const authToken
const serviceSid

const client = new twilio(accountSid, authToken)

const saltRounds = 10

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/images')
  },
  filename: function(req, file, cb){
    cb(null, file.originalname + '.jpg')
  }
})

const upload = multer({storage: storage})

class UserController{
  constructor(model){    
    this.getOne = this.getOne.bind(this)
    this.checkCode = this.checkCode.bind(this)
    this.checkPhone = this.checkPhone.bind(this)
    this.getAll = this.getAll.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.updatePassword = this.updatePassword.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.getSocket = this.getSocket.bind(this)
  }
  
  getSocket = () => {
    
  }
  
  auth = async(req, res, next) => {
  
    try{
      const user = await db.User.findOne({
        attributes: ['password', 'uuid'],
        where: req.body.phone ? {phone: req.body.phone} : {email: req.body.email}
      })
      
      const match = await bcrypt.compare(req.body.password, user.dataValues.password)
      
      if(match){
        // console.log('USER_UUID', uuidBuffer.toString(user.dataValues.uuid) )
        res.status(200).send({data: uuidBuffer.toString(user.dataValues.uuid)})
      } else {
        res.status(403).send({message: 'Неверный логин или пароль'})
      }
      
    } catch(err){
      handleError(err, res)
    }
  }
  
  getOne = async(req, res, next) => {
    console.log('REQ_DATA', req.headers.authorization)
    let uuid = req.headers.authorization
    
    try{
      const user = await db.User.findOne({
        attributes: [
          'login', 
          'uuid', 
          'createdAt', 
          'name', 
          'surname', 
          'phone', 
          'is_villager', 
          'notifications', 
          'email'
        ],
        where: {uuid: uuidBuffer.toBuffer(uuid)},
        include: [
          {
            model: db.Images,
            required: false,
            where: {type: 'avatar'}
          },
          {
            model: db.Villages,
            required: false,
          }
        ],
      })
      
      if(Object.keys(user.dataValues).length > 0){
        res.status(200).send({data: user})
      } else {
        res.send({message: 'Invalid token'})
        return
      }
      
    } catch(err){
      throw new ErrorHandler(err.status, err.message)
    }
  }
  
  getAll = (req, res, next) => {
    console.log('USER_HEADERS', req.headers.authorization)
    let uuid = req.headers.authorization
    
    db.User
    .findAll({ 
      attributes: 
        [
          'login', 
          'uuid', 
          'createdAt', 
          'name', 
          'surname', 
          'phone', 
          'is_villager', 
          'notifications', 
          'email'
        ],
      where: {uuid: uuidBuffer.toBuffer(uuid)},
      include: [
        {
          model: db.Images,
          required: false,
          where: {type: 'avatar'}
        },
        {
          model: db.Villages,
          required: false,
        }
      ],
    })
    .then(result => {
        console.log('RESULT', result)
        if(result.length > 0){
          res.status(200).send({data: result})
        } else {
          res.send({message: 'Invalid token'})
        }
      }
    )
    .catch(error => console.log(error))
  }
  
  checkPhone = async(req, res, next) => {
    console.log('checkPhone', req.body.phone)
    
    await db.User
    .findOne({ 
      where: {phone: req.body.phone_number},
    })
    .then(result => {
        console.log('RESULT', result)
        if(result){
          res.status(403).send({message: 'Пользователь с таким телефон уже зарегистрирован'})
        } else {
          client.verify.services(serviceSid)
          .verifications
          .create({to: req.body.phone_number, channel: 'sms'})
          .then(verification => {
            console.log(verification.sid)
            res.status(200).send()
          })
        }
      }
    )
    .catch(error => console.log(error))
  }
  
  checkCode = async(req, res, next) => {
    client.verify.services(serviceSid)
    .verificationChecks
    .create({to: req.body.phone_number, code: req.body.code})
    .then(async verification_check => {
      if(verification_check.status === 'approved'){
        await db.User.create({
          phone: req.body.phone_number,
          uuid: req.body.uuid,
        })
        .then(result => res.status(200).send({data: result}))
        .catch(err => console.log(err))
      } else {
        res.status(403).send({message: 'Неверный код'})
        return
      }
    })
  }
  
  create = (req, res, next) => {
    let user = req.body
  
    let uuid = uuidv4()
    
    console.log('USER', user.is_villager)
      
    bcrypt.hash(user.password, saltRounds).then(hash => {
      User.create({
        login: user.login,
        name: user.name,
        surname: user.surname,
        email: user.email,
        password: hash,
        phone: user.phone,
        uuid: uuid,
        role: user.role,
        isVillager: user.is_villager,
        notifications: user.notifications,
        area: user.area,
        settlement: user.settlement,
        village_name: user.village_name,
        village_type: user.village_type,
      })
      .then(result => {
        // console.log('RESULT', result)
        res.status(201).send({token: uuid})
      })
      .catch(error => console.log('ERROR', error))
    })
  }
  
  createPassword = async(req, res, next) => {
    let user = req.body
    
    let uuid = req.headers.authorization
        
    bcrypt.hash(user.password, saltRounds).then(async hash => {
      await db.User.update(
        {password: hash},
        {where: {uuid: uuidBuffer.toBuffer(uuid)}}
      )
      
      res.status(201).send()
    })
  }
  
  update = async(req, res, next) => {
    console.log('REQ_PATCH_USER', req.body)
  
    console.log('REQ_HEADERS', req.headers.authorization)
    
    let bufferUuid = uuidBuffer.toBuffer(req.headers.authorization)
    let newObj = {}
    console.log('BUFFER', bufferUuid)
    
    try{
      await db.User
      .update(
        req.body, 
        {where: {uuid: bufferUuid}}
      )
      
      res.status(201).send()
    } catch(err){
      console.log('ERR', err)
    }
  }
  
  updatePassword = (req, res, next) => {
    console.log('REQ_PATCH_USER', req.body)
  
    console.log('REQ_HEADERS', req.headers.authorization)
    
    let bufferUuid = uuidBuffer.toBuffer(req.headers.authorization)
    
    console.log('BUFFER', bufferUuid)
    
    User.findOne({attributes: ['password'], where: {uuid: bufferUuid}})
    .then(resultUser => {
      console.log('RESULT_PASS_USER', resultUser)
      if(resultUser){
        bcrypt.compare(req.body.old_password, resultUser.dataValues.password)
        .then(resultPassword => {
          if(resultPassword){
            bcrypt.hash(req.body.new_password, saltRounds)
            .then(newHash => {
              User.update({password: newHash}, {where:{uuid: bufferUuid}})
              .then(resultNewPass => {
                if(resultNewPass[0] === 1){
                  User.findOne({
                    attributes: ['login', 'uuid', 'createdAt', 'name', 'surname', 'phone', 'is_villager', 'role', 'notifications', 'email'],
                    where: {uuid: uuidBuffer.toBuffer(req.headers.authorization)},
                    include: [{ model: Images, required: false, where: {type: 'avatar'}}],
                  })
                  .then(resultLastUser => res.status(201).send({data: resultLastUser}))
                  .catch(err => console.log(err))
                }
              })
              .catch(err => console.log(err))
            })
          } else {
            res.status(403).send({errors: {password: 'Неверный пароль'}})
          }
        }) 
      }
    })
    .catch(err => console.log(err))
  }
  
  updateStatus = (req, res, next) => {
    let obj = req.body
    let uuid = uuidBuffer.toBuffer(req.headers.authorization)
  }
  
}

export default UserController