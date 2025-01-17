import { PaginatedRequestDto } from './paginated-request.dto';
import {IsNotEmpty} from 'class-validator';

export class SearchUsersDto extends PaginatedRequestDto {
  @IsNotEmpty({message: 'Search value is required.'})
  search: string;
}