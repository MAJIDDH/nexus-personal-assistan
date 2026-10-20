import { Injectable } from '@nestjs/common';

export type ToolRequest = {
  tool: string;
  action: string;
  actionVersion: string;
  approval?: {
    token: string;
    tool: string;
    action: string;
    actionVersion: string;
  };
};

/**
 * Prototype policy: only explicitly listed harmless read-only capabilities pass.
 * No token is minted here and this class does not execute tools.
 */
@Injectable()
export class ToolPolicyService {
  private readonly readOnlyAllowlist = new Set([
    'demo.read_status',
  ]);

  authorize(request: ToolRequest): boolean {
    const capability = `${request.tool}.${request.action}`;

    if (this.readOnlyAllowlist.has(capability)) {
      return true;
    }

    const approval = request.approval;
    if (!approval || !approval.token.trim()) {
      return false;
    }

    // The prototype deliberately supports no approval issuer yet. A supplied
    // object is not proof of approval; fail closed until a signed, server-side
    // approval-token mechanism is implemented and tested.
    return (
      approval.tool === request.tool &&
      approval.action === request.action &&
      approval.actionVersion === request.actionVersion &&
      false
    );
  }
}
