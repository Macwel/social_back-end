import { Table, Column, Model, PrimaryKey, AllowNull, HasOne } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import User from './User';

@Table({
  timestamps: true,
  freezeTableName: true,
  tableName: 'profile',
  underscored: true,
  modelName: 'Profile',
  paranoid: true,
})
export default class Profile extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: DataTypes.BIGINT,
    autoIncrement: true,
  })
  id: number;

  @AllowNull(true)
  @Column({
    type: DataTypes.STRING(255),
  })
  location: string;

  @AllowNull(true)
  @Column({
    type: DataTypes.STRING(255),
  })
  banner: string;

  @AllowNull(true)
  @Column({
    type: DataTypes.STRING(25),
  })
  phone: string;

  @AllowNull(true)
  @Column({
    type: DataTypes.STRING(255),
  })
  avatar: string;

  @HasOne(() => User)
  user: User;

  @AllowNull(true)
  @Column({
    type: DataTypes.STRING(100),
  })
  instagram: string;

  @AllowNull(true)
  @Column({
    type: DataTypes.STRING(100),
  })
  twitter: string;

  @AllowNull(true)
  @Column({
    type: DataTypes.STRING(100),
  })
  website: string;

  @AllowNull(true)
  @Column({
    type: DataTypes.DATEONLY,
  })
  birthday: Date;
}
