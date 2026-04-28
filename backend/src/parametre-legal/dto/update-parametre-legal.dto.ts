import { PartialType } from "@nestjs/swagger";
import { CreateParametreLegalDto } from "./create-parametre-legal.dto";

export class UpdateParametreLegalDto extends PartialType(CreateParametreLegalDto) { }