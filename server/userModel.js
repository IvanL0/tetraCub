import Sequelize from 'sequelize'
import uuidBuffer from 'uuid-buffer'

class UserModel extends Sequelize.Model{
  static init(sequelize, DataTypes){
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
      },
      login: {
        type: DataTypes.STRING(45), 
        field: 'login',
      },
      name: {
        type: DataTypes.STRING(45),
        field: 'name',
      },
      surname: {
        type: DataTypes.STRING(45),
        field: 'surname',
      },
      email: {
        type: DataTypes.STRING(45),
        field: 'email',
        validate: {
          isEmail: {
            msg: 'Неправильно введен Email'
          }
        }
      },
      password: {
        type: DataTypes.STRING(200),
        field: 'password',
      },
      phone: {
        type: DataTypes.STRING(45),
        field: 'phone',
      },
      uuid: {
        type: DataTypes.UUID,
        field: 'uuid',
        get() {
          let uuid = this.getDataValue('uuid')
          if(uuid){
            return uuidBuffer.toString(uuid)
          }
          return
        },
        set(value){
          let uuid = uuidBuffer.toBuffer(value)
          this.setDataValue('uuid', uuid)
        }
      },
      refresh_token: {
        type: DataTypes.UUIDV4,
        field: 'refresh_token',
      },
      push_token: {
        type: DataTypes.STRING,
        field: 'push_token',
      },
      isVillager: {
        type: DataTypes.INTEGER,
        field: 'is_villager',
      },
      notifications: {
        type: DataTypes.BOOLEAN,
        field: 'notifications',
      },
    },
    {
      freezeTableName: true,
      tableName: 'user',
      modelName: 'user',
      sequelize,
    }
    )
  }
  
  static getId(where) {
    return this.findOne({
      where,
      attributes: ["id"],
      order: [["createdAt", "DESC"]]
    })
  }
  
  static associate(models) {
    this.belongsToMany(models.Villages, {through: models.Villagers, foreignKey: 'user_id'}),
    this.belongsToMany(models.ChatRoom, {through: models.UsersChatrooms, foreignKey: 'user_id'}),
    this.hasMany(models.Images, {foreignKey: 'user_id'})
    this.hasMany(models.VillageBoards, {foreignKey: 'user_id'})
    this.hasMany(models.Adverts, {foreignKey: 'user_id'})
    this.hasMany(models.Messages, {foreignKey: 'user_id'})
  }
}
        
export default UserModel
