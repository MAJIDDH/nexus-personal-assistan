import { Injectable } from '@nestjs/common';

export type MockModelRequest = {
  task: string;
  input: string;
};

export type MockModelResponse = {
  provider: 'mock';
  task: string;
  output: string;
};

@Injectable()
export class MockModelProvider {
  async complete(request: MockModelRequest): Promise<MockModelResponse> {
    return {
      provider: 'mock',
      task: request.task,
      output: `MOCK_RESPONSE: ${request.input}`,
    };
  }
}
