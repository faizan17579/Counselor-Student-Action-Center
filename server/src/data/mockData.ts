import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { MessageRecord, StudentRecord, TaskRecord } from "../types/actionCenter";

interface MockDataFile {
  students: StudentRecord[];
  tasks: TaskRecord[];
  messages: MessageRecord[];
}

const mockDataFilePath = join(process.cwd(), "src", "data", "mockData.json");

function readMockData(): MockDataFile {
  const fileContents = readFileSync(mockDataFilePath, "utf8");
  return JSON.parse(fileContents) as MockDataFile;
}

const mockData = readMockData();

export const students = mockData.students;
export const tasks = mockData.tasks;
export const messages = mockData.messages;

export function persistMockData() {
  const fileContents = `${JSON.stringify({ students, tasks, messages }, null, 2)}\n`;
  writeFileSync(mockDataFilePath, fileContents, "utf8");
}
