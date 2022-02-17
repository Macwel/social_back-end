import { Sequelize } from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import is from 'is_js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import RequestModel from '../database/models/Request';
import User from '../database/models/User';
import Agent from '../database/models/Agent';
import Contact from '../database/models/Contact';
import sequelize from '../database/sequelize';
import CustomError from '../utils/CustomError';

// Agent.sync({ alter: false });
// Contact.sync({ alter: false });
export default class AdminApi {
  sequelize: Sequelize;

  constructor() {
    this.sequelize = sequelize;
  }

  public static async sendReq(options: { fullName: string; email: string; phone: string; desc: string }): Promise<any> {
    const { fullName, email, phone, desc } = options;
    try {
      RequestModel.create({ fullName, email, phone, desc });
      // create user
      // UserModel.create({
      //   email: 'wifi215@icloud.com',
      //   password: await bcrypt.hash('sandr777', Number(process.env.SALT_ROUNDS) || 10),
      //   fullName: 'Sandr',
      // });
    } catch (err) {
      return {
        status: 404,
        message: 'Error insert to db',
      };
    }
    return {
      status: 201,
      message: 'Request was successfully created.',
    };
  }

  public static async signIn(options: { email: string; password: string }): Promise<any> {
    // eslint-disable-next-line no-param-reassign
    options.email = options.email.toLowerCase();
    const { email, password } = options;
    if (!email || !password) {
      throw new CustomError({
        status: 400,
        message: 'All parameters are required.',
      });
    }
    if (!is.email(email)) {
      throw new CustomError({
        status: 400,
        message: 'Invalid email address',
      });
    }
    const user = await User.findOne({
      where: {
        email: {
          [Op.iLike]: `%${email}%`,
        },
      },
    });
    if (!user) {
      throw new CustomError({
        status: 404,
        message: 'Cannot find user with current email address.',
      });
    }

    const hashCompare = await bcrypt.compare(password, user.password);
    if (!hashCompare) {
      throw new CustomError({
        status: 400,
        message: 'Invalid email or password.',
      });
    }
    const token = jwt.sign(
      {
        data: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '86400000',
      },
    );
    await user.reload({
      attributes: {
        exclude: ['password'],
      },
    });
    return {
      status: 200,
      message: 'OK',
      user,
      token,
    };
  }

  public static async ValidateJWTResponse(options: { token: string }): Promise<any> {
    const { token } = options;

    const verify = await jwt.verify(token, process.env.TOKEN_SECRET);

    if (typeof verify === 'string') {
      throw new CustomError({
        status: 500,
        message: 'Internal server error',
      });
    }

    if (!verify) {
      throw new CustomError({
        status: 401,
        message: 'Unauthorized.',
      });
    }

    const user = await User.findByPk(verify.data.id, {
      attributes: {
        exclude: ['password'],
      },
    });

    if (!user) {
      throw new CustomError({
        status: 404,
        message: 'User does not exist.',
      });
    }

    return {
      status: 200,
      message: 'OK',
      verify: {
        user,
        iat: verify.iat,
        exp: verify.exp,
      },
    };
  }

  public static async stats(): Promise<any> {
    const requestCount = await RequestModel.findAndCountAll();
    const requestFinall = await RequestModel.findAndCountAll({
      where: {
        status: '1',
      },
    });
    const requestCall = await RequestModel.findAndCountAll({
      where: {
        call: true,
      },
    });
    return {
      status: 200,
      message: 'OK',
      requestCount: requestCount.count,
      requestFinall: requestFinall.count,
      requestCall: requestCall.count,
    };
  }

  public static async requests(): Promise<any> {
    const requests = await RequestModel.findAll();

    return {
      status: 200,
      message: 'OK',
      requests,
    };
  }

  public static async getAgents(): Promise<any> {
    const requests = await Agent.findAll();
    return {
      status: 200,
      message: 'OK',
      requests,
    };
  }

  public static async getContacts(): Promise<any> {
    const requests = await Contact.findAll();

    return {
      status: 200,
      message: 'OK',
      requests,
    };
  }
}
