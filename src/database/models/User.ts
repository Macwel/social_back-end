// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-cycle */
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  Unique,
  BelongsTo,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript';
import { DataTypes, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, Optional } from 'sequelize';
import Follow from './Follow';
import Profile from './Profile';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  fullName: string;
  shortLink?: string;
  profileId: number;
  // profilnumber
  followers?: Follow[];
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IUserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table({
  timestamps: true,
  freezeTableName: true,
  tableName: 'user',
  underscored: true,
  modelName: 'User',
  paranoid: true,
})
export default class User extends Model<UserAttributes, IUserCreationAttributes> implements UserAttributes {
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: DataTypes.BIGINT,
    autoIncrement: true,
  })
  id: number;

  @AllowNull(false)
  @Unique(true)
  @Column({
    type: DataTypes.STRING,
  })
  email: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING(256),
  })
  password: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING(256),
  })
  fullName: string;

  @AllowNull(true)
  @Unique(true)
  @Column({
    type: DataTypes.STRING(100),
  })
  shortLink: string;

  @ForeignKey(() => Profile)
  @AllowNull(true)
  @Column({
    type: DataTypes.BIGINT,
  })
  profileId: number;

  @BelongsTo(() => Profile)
  profile: Profile;

  @HasMany(() => Follow, {
    foreignKey: 'toUserId',
  })
  followers: Follow[];

  @HasMany(() => Follow, {
    foreignKey: 'fromUserId',
  })
  following: Follow[];

  // public getFollowing!: HasManyGetAssociationsMixin<Follow>; // Note the null assertions!

  // public getFollowsers!: HasManyGetAssociationsMixin<Follow>;
  public countFollowers!: HasManyCountAssociationsMixin; // Note the null assertions

  // public getFollowers!: HasManyGetAssociationsMixin<Follow>; // Note the null assertions
}
