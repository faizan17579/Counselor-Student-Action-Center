import request from 'supertest';
import { createApp } from '../src/app';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const app = createApp();
const mockPath = join(process.cwd(), 'src', 'data', 'mockData.json');

describe('Action Center integration', () => {
  let original: string;

  beforeAll(() => {
    original = readFileSync(mockPath, 'utf8');
  });

  afterAll(() => {
    writeFileSync(mockPath, original, 'utf8');
  });

  test('mark single message as read reduces unread count', async () => {
    const studentId = 'stu_001';

    const before = await request(app).get(`/students/${studentId}/action-center`).expect(200);
    const beforeCount = before.body.unreadMessagesCount;

    // pick first unread message
    const firstMessage = before.body.unreadMessages?.[0];
    expect(firstMessage).toBeDefined();

    await request(app).patch(`/students/${studentId}/messages/${firstMessage.id}/read`).expect(200);

    const after = await request(app).get(`/students/${studentId}/action-center`).expect(200);
    const afterCount = after.body.unreadMessagesCount;

    expect(afterCount).toBe(beforeCount - 1);
  });
});
