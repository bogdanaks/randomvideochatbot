import { UserService } from "../user"
import { TgUserSignIn } from "@/common/types"

interface AuthServiceProps {
  userService: UserService
}

export class AuthService {
  protected userService

  constructor({ userService }: AuthServiceProps) {
    this.userService = userService
  }

  async login({ id }: { id: string }) {
    return await this.userService.getUserById(id)
  }

  async signIn(user: TgUserSignIn) {
    return await this.userService.saveUser(user)
  }
}
