import { PartialType } from '@nestjs/swagger';
import { CreateAlgoliaDto } from './create-algolia.dto';

export class UpdateAlgoliaDto extends PartialType(CreateAlgoliaDto) {}
