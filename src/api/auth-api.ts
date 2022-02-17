import dotenv from 'dotenv';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import is from 'is_js';
import jwt from 'jsonwebtoken';
import User from '../database/models/User';
// import Follow from '../database/models/Follow';
import sequelize from '../database/sequelize';
import CustomError from '../utils/CustomError';

// User.sync({ alter: true });
dotenv.config();

export default class AuthApi {
  sequelize: Sequelize;

  constructor() {
    this.sequelize = sequelize;
  }

  public static async signUp(options: { name: string; email: string; password: string; phone: string }): Promise<any> {
    // eslint-disable-next-line no-param-reassign
    options.email = options.email.toLowerCase();
    const { name, email, password, phone } = options;
    if (!name || !email || !password || !phone) {
      throw new CustomError({
        status: 400,
        message: 'All parameters are required.',
      });
    }
    // if (
    //   // password.search(
    //   //   // eslint-disable-next-line no-useless-escape
    //   //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\(\)\[\]\{\}\~?<>;:\\_\/`+=\-\|!@#\$%\^&\*\.])(?=.{8,})/i,
    //   // ) === -1
    // ) {
    //   throw new CustomError({
    //     status: 400,
    //     message: 'Password must be at least 8 characters, must contain 1 special character and number.',
    //   });
    // }
    const user = await User.findOne({
      where: {
        email: {
          [Op.iLike]: `%${email}%`,
        },
      },
      attributes: {
        exclude: ['password'],
      },
      paranoid: false,
    });
    if (user) {
      throw new CustomError({
        status: 400,
        message: 'User already exists',
      });
    }
    const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) || 10);
    const createdUser = await User.create({
      email,
      password: passwordHash,
      name,
      phone,
    });
    if (!createdUser) {
      throw new CustomError({
        status: 500,
        message: 'Internal server error: could not connect to database.',
      });
    }
    return {
      status: 200,
      message: 'User was successfully created.',
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
          fullName: user.name,
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
}
