import { MockModelProvider } from './mock-model.provider';

describe('MockModelProvider', () => {
  it('returns deterministic output without external calls', async () => {
    const provider = new MockModelProvider();

    await expect(
      provider.complete({ task: 'summarize', input: 'synthetic fixture' }),
    ).resolves.toEqual({
      provider: 'mock',
      task: 'summarize',
      output: 'MOCK_RESPONSE: synthetic fixture',
    });
  });
});
