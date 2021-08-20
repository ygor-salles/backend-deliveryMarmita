import { MaxLength, IsString, IsNumber, ValidateIf, IsNotEmpty } from 'class-validator';

export class OrderProductDto {
  readonly id: number;

  @ValidateIf(o => 'observation' in o)
  @MaxLength(4000)
  observation: string;

  @IsNotEmpty({
    message: 'Informe a quantidade do produto',
  })
  @IsNumber()
  amount: number;

  @ValidateIf(o => 'meet_options' in o)
  @IsString()
  meet_options: string;

  @IsNotEmpty({
    message: 'Informe o valor total do produto',
  })
  @IsNumber()
  total_item: number;

}
