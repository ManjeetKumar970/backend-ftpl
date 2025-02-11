import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(email: string, password: string): string {
    console.log({ email, password });
    return 'Hello World!';
  }

  signUp(email: string, password: string): string {
    console.log({ email, password });
    return 'Hello World!';
  }
}
