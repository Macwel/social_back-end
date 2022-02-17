// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-cycle */
import { Table, Column, Model, PrimaryKey, AllowNull, Unique } from 'sequelize-typescript';
import { DataTypes, Optional } from 'sequelize';
// Заявки
interface RequestAttributes {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  status?: number;
  desc: string;
  call?: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IRequestCreationAttributes extends Optional<RequestAttributes, 'id'> {}

@Table({
  timestamps: true,
  freezeTableName: true,
  tableName: 'requests',
  underscored: true,
  modelName: 'Request',
  paranoid: true,
})
export default class Request extends Model<RequestAttributes, IRequestCreationAttributes> implements RequestAttributes {
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: DataTypes.BIGINT,
    autoIncrement: true,
  })
  id: number;

  @AllowNull(true)
  @Column({
    type: DataTypes.STRING(256),
  })
  fullName: string;

  @AllowNull(true)
  @Column({
    type: DataTypes.STRING(256),
  })
  email: string;

  @AllowNull(true)
  @Column({
    type: DataTypes.STRING(256),
  })
  phone: string;

  @AllowNull(true)
  @Column({
    type: DataTypes.STRING(256),
  })
  desc: string;

  @AllowNull(true)
  @Column({
    type: DataTypes.STRING(256),
    defaultValue: 0,
  })
  status: number;

  @AllowNull(true)
  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  call: boolean;
}
