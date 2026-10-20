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

/** Local prototype policy. This service authorizes but never executes tools. */
@Injectable()
export class ToolPolicyService {
  private readonly readOnlyAllowlist = new Set(['demo.read_status@v1']);

  authorize(request: ToolRequest): boolean {
    const capability = `${request.tool}.${request.action}@${request.actionVersion}`;
    if (this.readOnlyAllowlist.has(capability)) return true;

    // No trusted approval issuer exists in this prototype. Caller-provided
    // approval data is not proof of authorization, so reject it by default.
    return false;
  }
}
