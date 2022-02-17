import { Table, Column, Model, PrimaryKey, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Optional, DataTypes } from 'sequelize';
// eslint-disable-next-line import/no-cycle
import User from './User';

interface FollowTagsAttributes {
  id: number;
  fromUserId: number;
  circleId?: number;
  toUserId?: number;
}
type FollowTagsCreationAttributes = Optional<FollowTagsAttributes, 'id'>;

@Table({
  timestamps: false,
  freezeTableName: true,
  tableName: 'follow',
  underscored: true,
  modelName: 'Follow',
})
export default class Follow
  extends Model<FollowTagsAttributes, FollowTagsCreationAttributes>
  implements FollowTagsAttributes
{
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: DataTypes.BIGINT,
    autoIncrement: true,
  })
  public id!: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataTypes.BIGINT,
  })
  public fromUserId: number;

  @BelongsTo(() => User, 'fromUserId')
  public fromUser: User;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({
    type: DataTypes.BIGINT,
  })
  public toUserId: number;

  @BelongsTo(() => User, 'toUserId')
  public toUser: User;
}
