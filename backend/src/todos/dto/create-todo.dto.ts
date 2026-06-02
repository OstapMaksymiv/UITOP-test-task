import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty({ message: "text must not be empty" })
  @MaxLength(200)
  text!: string;

  @Type(() => Number)
  @IsInt({ message: "categoryId must be an integer" })
  categoryId!: number;
}
