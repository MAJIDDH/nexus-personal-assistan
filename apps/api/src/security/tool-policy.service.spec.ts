import { ToolPolicyService } from './tool-policy.service';

describe('ToolPolicyService', () => {
  let policy: ToolPolicyService;

  beforeEach(() => {
    policy = new ToolPolicyService();
  });

  it('allows only an explicitly listed harmless read-only capability version', () => {
    expect(
      policy.authorize({
        tool: 'demo',
        action: 'read_status',
        actionVersion: 'v1',
      }),
    ).toBe(true);
  });

  it('denies an unlisted capability by default', () => {
    expect(
      policy.authorize({
        tool: 'instagram',
        action: 'publish',
        actionVersion: 'v1',
      }),
    ).toBe(false);
  });

  it('denies an unapproved version of an otherwise allowlisted capability', () => {
    expect(
      policy.authorize({
        tool: 'demo',
        action: 'read_status',
        actionVersion: 'v2',
      }),
    ).toBe(false);
  });

  it('does not trust a caller-supplied approval object', () => {
    expect(
      policy.authorize({
        tool: 'finance',
        action: 'transfer',
        actionVersion: 'v1',
        approval: {
          token: 'made-up-token',
          tool: 'finance',
          action: 'transfer',
          actionVersion: 'v1',
        },
      }),
    ).toBe(false);
  });

  it('denies changed action versions in supplied approval data', () => {
    expect(
      policy.authorize({
        tool: 'finance',
        action: 'delete_record',
        actionVersion: 'v2',
        approval: {
          token: 'made-up-token',
          tool: 'finance',
          action: 'delete_record',
          actionVersion: 'v1',
        },
      }),
    ).toBe(false);
  });
});
