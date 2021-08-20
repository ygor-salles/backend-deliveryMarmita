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
  Req,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "src/auth/role.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { UserRole } from "src/users/user-roles.enum";
import { AdditionDto } from "./dto/addition.dto";
import { Addition } from "./entities/addition.entity";
import { AdditionService } from "./addition.service";
@Controller("/api/additions")
export class AdditionController{
  constructor(private readonly additionService: AdditionService) {}

  @Get()
  public async getAll(@Res() res, @Req() request ): Promise<Addition[]> {
    const additions = await this.additionService.findAll(request.query);

    return res.status(HttpStatus.OK).json(additions);
  }

  @Get("/:additionId")
    public async findById(
      @Res() res, 
      @Param('additionId') additionId: string,
    ): Promise<Addition> {
      const addition = await this.additionService.findById(additionId);
      return res.status(HttpStatus.OK).json(addition);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(UserRole.ADMIN)
  public async create(
    @Res() res,
    @Body() additionDto: AdditionDto
  ): Promise<any> {
    try {
      await this.additionService.create(additionDto);

      return res.status(HttpStatus.OK).json({
        message: "Acréscimo cadastrado com sucesso.",
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Erro ao cadastrar acréscimo!",
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Put("/:additionId")
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(UserRole.ADMIN)
  public async update(
    @Res() res,
    @Param('additionId') additionId: string, 
    @Body() additionDto: AdditionDto
  ): Promise<any> {
    try {
      await this.additionService.update(additionId, additionDto);

      return res.status(HttpStatus.OK).json({
        message: "Acréscimo atualizado com sucesso.",
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Erro ao atualizar acréscimo!",
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Put('/:additionId/update-status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async updateStatus(
    @Res() res,
    @Body() body: any,
    @Param('additionId') additionId: string
  ): Promise<any> {
    try {
      const addition = await this.additionService.findById(additionId);
      if(addition){
        addition.status = body.status;
        await this.additionService.updateStatus(body, additionId);
  
        return res.status(HttpStatus.OK).json({
          message: 'Status atualizado com sucesso.',
          status: HttpStatus.OK,
        });
      }
      else{
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Acréscimo não encontrado.',
          status: HttpStatus.NOT_FOUND,
        });
      }
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Erro ao atualizar status!',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Delete("/:additionId/destroy")
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(UserRole.ADMIN)
  public async delete(
    @Res() res,
    @Param('additionId') additionId: string
  ): Promise<any> {
    try {
      await this.additionService.delete(additionId);

      return res.status(HttpStatus.OK).json({
        message: "Acréscimo deletado com sucesso",
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Erro ao deletar acréscimo",
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
