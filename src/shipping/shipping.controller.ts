import {
  Controller,
  Put,
  Get,
  Delete,
  Post,
  Body,
  Res,
  Param,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "src/auth/role.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { UserRole } from "src/users/user-roles.enum";
import { ShippingDto } from "./dto/shipping.dto";
import { Shipping } from "./entities/shipping.entity";
import { ShippingService } from "./shipping.service";
@Controller("/api/shippings")
export class ShippingController{
  constructor(private readonly shippingService: ShippingService) {}

  @Get()
  public async getAll(@Res() res ): Promise<Shipping[]> {
    const shippings = await this.shippingService.findAll();

    return res.status(HttpStatus.OK).json(shippings);
  }

  @Get("/:shippingId")
    public async findById(
      @Res() res, 
      @Param('shippingId') shippingId: string,
    ): Promise<Shipping> {
      const shipping = await this.shippingService.findById(shippingId);
      return res.status(HttpStatus.OK).json(shipping);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(UserRole.ADMIN)
  public async create(
    @Res() res,
    @Body() shippingDto: ShippingDto
  ): Promise<any> {
    try {
      await this.shippingService.create(shippingDto);

      return res.status(HttpStatus.OK).json({
        message: "Frete cadastrado com sucesso.",
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Erro ao cadastrar frete!",
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Put("/:shippingId")
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(UserRole.ADMIN)
  public async update(
    @Res() res,
    @Param('shippingId') shippingId: string, 
    @Body() shippingDto: ShippingDto
  ): Promise<any> {
    try {
      await this.shippingService.update(shippingId, shippingDto);

      return res.status(HttpStatus.OK).json({
        message: "Frete atualizado com sucesso.",
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Erro ao atualizar frete!",
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Delete("/:shippingId/destroy")
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(UserRole.ADMIN)
  public async delete(
    @Res() res,
    @Param('shippingId') shippingId: string
  ): Promise<any> {
    try {
      await this.shippingService.delete(shippingId);

      return res.status(HttpStatus.OK).json({
        message: "Frete deletado com sucesso",
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Erro ao deletar frete",
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
