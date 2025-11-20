import { validate } from 'class-validator';
import { IsAddressOrCity } from './is-address-or-city.validator';

class TestDTO {
  @IsAddressOrCity()
  value!: string;
}

describe('IsAddressOrCity Validator', () => {
  const validateValue = async (value: string) => {
    const dto = new TestDTO();
    dto.value = value;
    const errors = await validate(dto);
    return errors.length === 0; 
  };

  it('should validate a valid city with two words', async () => {
    expect(await validateValue('Bogota Colombia')).toBe(true);
  });

  it('should validate a valid city with accents and ñ', async () => {
    expect(await validateValue('Medellín Antioquia')).toBe(true);
    expect(await validateValue('Año Nuevo')).toBe(true);
  });

  it('should validate valid addresses', async () => {
    expect(await validateValue('Calle 23 #12-99')).toBe(true);
    expect(await validateValue('Cra 45 120-33')).toBe(true);
    expect(await validateValue('Av 7 45-80')).toBe(true);
    expect(await validateValue('Km 18 vía Cali')).toBe(true);
  });

  it('should fail for single-word city names', async () => {
    expect(await validateValue('Bogota')).toBe(false);
    expect(await validateValue('Medellín')).toBe(false);
  });

  it('should fail for invalid address formats', async () => {
    expect(await validateValue('Street 45')).toBe(false);
    expect(await validateValue('Avenue 10')).toBe(false);
  });

  it('should fail for numeric values', async () => {
    expect(await validateValue('12345')).toBe(false);
  });

  it('should fail for empty string', async () => {
    expect(await validateValue('')).toBe(false);
  });

  it('should fail for non-string values', async () => {
    const dto = new TestDTO();
    dto.value = null as any;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
