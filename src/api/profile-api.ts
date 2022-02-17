import dotenv from 'dotenv';
// import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// import bcrypt from 'bcrypt';
// import is from 'is_js';
import jwt from 'jsonwebtoken';
import User from '../database/models/User';
import Profile from '../database/models/Profile';
import Follow from '../database/models/Follow';
import sequelize from '../database/sequelize';
import CustomError from '../utils/CustomError';

dotenv.config();

export default class ProfileApi {
  sequelize: Sequelize;

  constructor() {
    this.sequelize = sequelize;
  }

  public static async getUser(options: { id: string }): Promise<any> {
    // eslint-disable-next-line no-param-reassign
    const { token, id } = options;
    const user = await this.tryGetUser(id);
    this.appAssert(user, 'User not found', 404);
    let t: any;

    return {
      status: 200,
      message: 'OK',
      user,
    };
  }

  public static async followToUser(options: { userToId: number; token: any }): Promise<any> {
    // eslint-disable-next-line no-param-reassign
    const { userToId, token } = options;
    const userId = token.verify.user.id;
    this.appAssert(this.tryGetUser(userId), 'User not found', 404);
    this.appAssert(this.tryGetUser(userToId), 'User not found', 404);
    await Follow.create({
      fromUserId: userId,
      toUserId: userToId,
    });
    return {
      status: 200,
      message: 'OK',
    };
  }

  public static async getFollows(options: { token: any }): Promise<any> {
    // eslint-disable-next-line no-param-reassign
    const { token } = options;
    const userId = token.verify.user.id;
    const user = await this.tryGetUser(userId);
    const follow = await user.countFollowers();
    console.log(follow);
    // const follow = await this.tryGetFollow(userId);
    this.appAssert(follow, 'Follows not found', 404);
    return {
      status: 200,
      message: 'OK',
      follow,
    };
  }

  static async tryGetUser(id: any) {
    const userId = Number(id);

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(userId) || userId <= 0) {
      throw new CustomError({
        status: 404,
        message: 'Invalid userId.',
      });
    }
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Profile,
          attributes: {
            exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'],
          },
        },
      ],
      attributes: {
        exclude: ['id', 'profileId', 'password', 'email', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });
    if (!user) {
      throw new CustomError({
        status: 404,
        message: 'Requested user not found.',
      });
    }
    return user;
  }

  // static async tryGetFollow(id: any) {
  //   const userId = Number(id);

  //   if (isNaN(userId) || userId <= 0) {
  //     throw new CustomError({
  //       status: 404,
  //       message: 'Invalid userIds.',
  //     });
  //   }
  //   const user = await Follow.getFollowers({
  //     include: [User],
  //     where: {
  //       toUserId: userId,
  //     },
  //   });

  //   if (!user) {
  //     throw new CustomError({
  //       status: 404,
  //       message: 'Requested user not found.',
  //     });
  //   }
  //   return user;
  // }

  static appAssert = (cmp: any, message: string, status = 500) => {
    if (!cmp) {
      throw new CustomError({
        message,
        status,
      });
    }
  };
}
