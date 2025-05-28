import { addFatura } from '../supabaseApi';
import { supabase } from '../supabaseConfig';

jest.mock('../supabaseConfig', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        data: [{ id: 1, valor: 100 }],
        error: null,
      })),
    })),
  },
}));

describe('addFatura', () => {
  it('should add a fatura successfully', async () => {
    const fatura = { valor: 100 };
    const result = await addFatura(fatura);
    expect(result).toEqual([{ id: 1, valor: 100 }]);
  });
}); 