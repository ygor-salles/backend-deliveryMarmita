import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { join } from 'path';
import { of } from 'rxjs';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user-roles.enum';
import { ProductDto } from './dto/product.dto';
import { Products } from './entities/products.entity';
import { ProductService } from './product.service';

@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  public async getAll(@Res() res, @Req() request): Promise<Products[]> {
    const products = await this.productService.findAll(request.query);

    return res.status(HttpStatus.OK).json(products);
  }

  @Get('images/:imagename')
  public async findProfileImage(@Param('imagename') imagename, @Res() res: Response) {
    return of(res.sendFile(join(process.cwd(), `src/product/images/${imagename}`)));
  }

  @Get('/paged')
  public async getPaged(@Res() res: Response, @Req() request: Request) {
    let { limit, page }: any = request.query;
    const { type }: any = request.query;
    limit = parseInt(limit || 0);
    page = parseInt(page || 0);
    const productPaged = await this.productService.findPaged(limit, page, type);

    return res.status(HttpStatus.OK).json({
      total: productPaged.total,
      page: productPaged.page,
      totalPages: productPaged.totalPages,
      limit: productPaged.limit,
      offset: productPaged.offset,
      instances: productPaged.instaces
    });
  }

  @Get('/:product_id')
  public async getById(@Res() res, @Param('product_id') product_id: string): Promise<Products> {
    const product = await this.productService.findById(product_id);

    if (product) {
      return res.status(HttpStatus.OK).json(product);
    }
    else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Produto não encontrado.',
        status: HttpStatus.NOT_FOUND,
      });
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(UserRole.ADMIN)
  public async create(
    @Res() res,
    @Body() productDto: ProductDto
  ): Promise<any> {
    try {
      if (productDto.image && !productDto.firebasePost) {
        console.log('ENTROU....')
        const nameImage = (new Date()).valueOf().toString() + '.png';

        const base64Data = productDto.image.replace(/^data:image\/[a-z]+;base64,/, "");

        require("fs").writeFile(`./src/product/images/${nameImage}`, base64Data, 'base64', function (err) {
          console.log(err);
          if (err != null) {
            return res.status(HttpStatus.BAD_REQUEST).json({
              message: 'Erro ao salvar imagem!' + err,
              status: HttpStatus.BAD_REQUEST,
            });
          }
        });
        productDto.image = `products/images/${nameImage}`;
      }

      await this.productService.create(productDto);

      return res.status(HttpStatus.OK).json({
        message: 'Produto cadastrado com sucesso.',
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Erro ao cadastrar produto!',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Put('/:product_id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(UserRole.ADMIN)
  public async update(
    @Res() res,
    @Body() productDto: ProductDto,
    @Param('product_id') product_id: string
  ): Promise<any> {
    try {
      const product = await this.productService.findById(product_id);
      if (product) {
        if (productDto.image && !productDto.firebasePost) {
          console.log(product.image.split('images/'))

          if (product.image != null) {
            try {
              require('fs').unlinkSync(`./src/product/images/${product.image.split('images/')[1]}`)
              //file removed
            } catch (err) {
              console.error(err)
            }
          }

          const nameImage = (new Date()).valueOf().toString() + '.png';

          const base64Data = productDto.image.replace(/^data:image\/[a-z]+;base64,/, "");

          require("fs").writeFile(`./src/product/images/${nameImage}`, base64Data, 'base64', function (err) {

            if (err != null) {
              return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Erro ao salvar imagem!' + err,
                status: HttpStatus.BAD_REQUEST,
              });
            }
          });
          productDto.image = `products/images/${nameImage}`;
        }

        await this.productService.update(productDto, product_id);

        return res.status(HttpStatus.OK).json({
          message: 'Produto atualizado com sucesso.',
          status: HttpStatus.OK,
        });
      }
      else {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Produto não encontrado.',
          status: HttpStatus.NOT_FOUND,
        });
      }
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Erro ao atualizar produto!',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Put('/:product_id/update-status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async updateStatus(
    @Res() res,
    @Body() body: any,
    @Param('product_id') product_id: string
  ): Promise<any> {
    try {
      const product = await this.productService.findById(product_id);
      if (product) {
        product.status = body.status;
        await this.productService.updateStatus(body, product_id);

        return res.status(HttpStatus.OK).json({
          message: 'Status atualizado com sucesso.',
          status: HttpStatus.OK,
        });
      }
      else {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Produto não encontrado.',
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

  @Get('/perSize/teste')
  public async getBySize(@Res() res): Promise<any> {
    const order = await this.productService.findBySize();

    return res.status(HttpStatus.OK).json(order);
  }

  @Delete("/:product_id")
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(UserRole.ADMIN)
  public async delete(
    @Res() res,
    @Param('product_id') product_id: string
  ): Promise<any> {
    try {
      await this.productService.delete(product_id);

      return res.status(HttpStatus.OK).json({
        message: "Produto deletado com sucesso.",
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Erro ao deletar produto!",
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
