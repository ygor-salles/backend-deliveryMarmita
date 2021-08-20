import { IsNotEmpty, IsNumber } from 'class-validator';

export class ShippingDto {
  @IsNotEmpty({
    message: 'Informe um bairro',
  })
  neighborhood: string;

  @IsNotEmpty({
    message: 'Informe um valor',
  })
  @IsNumber()
  value: number;
}
