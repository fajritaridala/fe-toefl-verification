import { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

interface ILogin {
  address: string;
}

interface IRegister extends ILogin {
  fullName: string;
  email: string;
  roleToken?: string;
}

interface UserExt extends User {
  accessToken?: string;
  role?: string;
  needsRegistration?: boolean;
}

interface SessionExt extends Session {
  accessToken?: string;
  address?: string;
  needsRegistration?: boolean;
}

interface JwtExt extends JWT {
  user?: UserExt;
}

export { ILogin, IRegister, UserExt, SessionExt, JwtExt };
