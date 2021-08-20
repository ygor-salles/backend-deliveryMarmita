import { IsNotEmpty, IsNumber } from 'class-validator';

export class AdditionDto {
  @IsNotEmpty({
    message: 'Informe um nome',
  })
  name: string;

  @IsNotEmpty({
    message: 'Informe um preço',
  })
  @IsNumber()
  price: number;
}
