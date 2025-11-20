import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAddressOrCity(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAddressOrCity',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          // Allows letters with accents, ñ and spaces
          const cityRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/u;

          // Must contain at least two words to be a valid city name
          const isCity =
            cityRegex.test(value) && value.trim().split(/\s+/).length >= 2;

          // LATAM common street/address identifiers + numbers
          const addressRegex =
            /^(Calle|Cl|Cra|Cr|Carrera|Avenida|Av|Transversal|Transv|Diagonal|Dg|Kr|Km)\.?\s?\d+/i;

          const isAddress = addressRegex.test(value);

          return isCity || isAddress;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid address or city`;
        },
      },
    });
  };
}
