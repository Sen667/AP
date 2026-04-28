import { PartialType } from "@nestjs/swagger";
import { CreatePersonneAutoriseeDto } from "./create-parent-autorisee.dto";

export class UpdatePersonneAutoriseeDto extends PartialType(CreatePersonneAutoriseeDto) { }