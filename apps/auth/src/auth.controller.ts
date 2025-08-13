import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user-decorator';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Guards are going to run the local strategy to verify whether the useremail and pwd are
  //even valid before hitting the POST request endpoint
  //We will specify the auth guard here which will implement the strategy
  /*
    * in your AuthController, after a guard like @UseGuards(LocalAuthGuard) is applied,
    * the output of the Local Auth strategy's validation process (typically the user data)
    * is automatically attached to the request object.

Here's a breakdown of how this works:

Local Strategy Validation: In the Local Auth strategy, there is a validate method where
* you verify the user's credentials. If successful, this method should return the user object.

Attaching to Request: The NestJS framework automatically takes whatever is returned from
* this validate method and assigns it to the request object under the user property.
* This means that after the guard runs, you can access the user information through
* req.user in your controller.

Accessing in Controller: In your controller post-login, you can easily obtain this user
*  information since it has been populated into the request object by the guard.

In summary, applying the guard allows you to inject the user details validated by the
* Local Auth strategy into the request, making it accessible in your login route handler.
 * */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    //instead of passing the JWT as a plain text, we are going to return it
    //as an HTTP cookie as cookies are much more secure so we are going to
    //set passthrough on the response object to manually handle the response
    //instead of using return
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }
}
