import { FullNamePipe } from './full-name.pipe';

describe('FullNamePipe', () => {
  let pipe: FullNamePipe;

  beforeEach(() => {
    pipe = new FullNamePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms null value to empty string', () => {
    const transformedValue = pipe.transform(null);
    expect(transformedValue).toBe('');
  });

  it('transforms object with name and surname to full name', () => {
    const input = { name: 'Manuel', surname: 'Neuer' };
    const transformedValue = pipe.transform(input);
    expect(transformedValue).toBe('Manuel Neuer');
  });

  it('transforms empty object to empty string', () => {
    const input = {}; 
    const transformedValue = pipe.transform(input);
    expect(transformedValue).toBe('');
  });
});
