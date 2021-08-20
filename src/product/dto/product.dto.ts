import { MaxLength, IsString, IsNumber, IsEnum, IsBase64, ValidateIf, IsNotEmpty } from 'class-validator';
import { ProductSize } from '../product-size.enum';
import { ProductType } from '../product-type.enum';

export class ProductDto {
  readonly id: number;

  @IsNotEmpty({
    message: 'Informe o nome do produto',
  })
  @MaxLength(200, {
    message: 'O nome deve ter menos de 200 caracteres',
  })
  name: string;

  @IsNotEmpty({
    message: 'Informe o preço do produto',
  })
  @IsNumber()
  price: number;

  @IsNotEmpty({
    message: 'Informe o tipo do produto',
  })
  @IsEnum(ProductType)
  type: ProductType;

  @ValidateIf(o => 'size' in o)
  @IsEnum(ProductSize)
  size: ProductSize;

  @MaxLength(4000)
  description: string;

  @ValidateIf(o => 'image' in o)
  @IsBase64()
  image: any;

  // user: Users;
}
