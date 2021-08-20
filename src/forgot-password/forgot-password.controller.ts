import { Controller, Post, Body, Res, HttpStatus } from "@nestjs/common";
import { ForgotPasswordService } from "../forgot-password/forgot-password.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";

@Controller("api/auth/forgot-password")
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post()
  public async forgotPassword(
    @Res() res,
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<any> {
    try {
      await this.forgotPasswordService.forgotPassword(forgotPasswordDto);

      return res.status(HttpStatus.OK).json({
        message: "E-mail enviado para alteração de senha",
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Erro ao enviar e-mail! " + err,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
