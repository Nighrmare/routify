/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
// Pipe that trims and converts string values to uppercase
export class ParseUpperTrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // If the input is a string, trim spaces and convert to uppercase
    if (typeof value === 'string') {
      return value.trim().toUpperCase();
    }
    // Reject numbers because only strings are allowed
    if (typeof value === 'number') {
      throw new BadRequestException('The value must be a string');
    }
    // Return the value unchanged for other types
    return value;
  }
}
