import { ParseUpperTrimPipe } from './parse-uppertrim.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';

describe('ParseUpperTrimPipe', () => {
  let pipe: ParseUpperTrimPipe;

  beforeEach(() => {
    pipe = new ParseUpperTrimPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should trim and convert string to uppercase', () => {
    const input = '  hello world  ';
    const result = pipe.transform(input, {} as ArgumentMetadata);
    expect(result).toBe('HELLO WORLD');
  });

  it('should throw BadRequestException if value is a number', () => {
    expect(() => pipe.transform(123, {} as ArgumentMetadata)).toThrow(BadRequestException);
    expect(() => pipe.transform(123, {} as ArgumentMetadata)).toThrow('The value must be a string');
  });

  it('should return value unchanged if not string or number', () => {
    const input = { name: 'Melisa' };
    const result = pipe.transform(input, {} as ArgumentMetadata);
    expect(result).toEqual(input);
  });
});