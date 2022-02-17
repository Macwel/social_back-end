// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-cycle */
import { Table, Column, Model, PrimaryKey, AllowNull, Unique } from 'sequelize-typescript';
import { DataTypes, Optional } from 'sequelize';
// Сотрудники
interface RoomAttributes {
  id: number;
  name: string;
  cost: string;
  size: string;
  capacity: string;
  bed: string;
  services: string;
  desc: string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IRoomCreationAttributes extends Optional<RoomAttributes, 'id'> {}

@Table({
  timestamps: true,
  freezeTableName: true,
  tableName: 'rooms',
  underscored: true,
  modelName: 'Room',
  paranoid: true,
})
export default class Room extends Model<RoomAttributes, IRoomCreationAttributes> implements RoomAttributes {
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
  name: string;

  @AllowNull(false)
  @Unique(true)
  @Column({
    type: DataTypes.STRING,
  })
  cost: string;

  @AllowNull(false)
  @Unique(true)
  @Column({
    type: DataTypes.STRING,
  })
  size: string;

  @AllowNull(false)
  @Unique(true)
  @Column({
    type: DataTypes.STRING,
  })
  capacity: string;

  @AllowNull(false)
  @Unique(true)
  @Column({
    type: DataTypes.STRING,
  })
  bed: string;

  @AllowNull(false)
  @Unique(true)
  @Column({
    type: DataTypes.STRING,
  })
  services: string;

  @AllowNull(false)
  @Unique(true)
  @Column({
    type: DataTypes.STRING,
  })
  desc: string;
}
