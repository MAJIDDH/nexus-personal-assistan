import { ToolPolicyService } from './tool-policy.service';

describe('ToolPolicyService deny-by-default regression cases', () => {
  const policy = new ToolPolicyService();

  it.each([
    { tool: '', action: 'read_status', actionVersion: 'v1' },
    { tool: 'demo', action: '', actionVersion: 'v1' },
    { tool: 'demo', action: 'read_status', actionVersion: '' },
    { tool: ' demo', action: 'read_status', actionVersion: 'v1' },
    { tool: 'demo', action: 'read_status ', actionVersion: 'v1' },
    { tool: 'demo', action: 'read_status', actionVersion: 'v1 ' },
    { tool: 'demo', action: 'publish', actionVersion: 'v1' },
    { tool: 'demo', action: 'read_status', actionVersion: 'V1' },
  ])('denies non-exact or incomplete capability: %j', (request) => {
    expect(policy.authorize(request)).toBe(false);
  });

  it('does not let matching approval metadata authorize an unlisted action', () => {
    expect(
      policy.authorize({
        tool: 'instagram',
        action: 'publish',
        actionVersion: 'v1',
        approval: {
          token: 'untrusted-caller-token',
          tool: 'instagram',
          action: 'publish',
          actionVersion: 'v1',
        },
      }),
    ).toBe(false);
  });
});
