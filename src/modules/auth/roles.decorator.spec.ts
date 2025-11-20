import { Roles } from './roles.decorator';

describe('Roles decorator', () => {
  it('Should define metadata with given roles', () => {
    const metadata = Roles('admin', 'user');
    expect(metadata).toBeDefined();
  });
});