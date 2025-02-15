export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export const TaskStatusColors = {
  [TaskStatus.BACKLOG]: "bg-gray-200",
  [TaskStatus.TODO]: "bg-blue-200",
  [TaskStatus.IN_PROGRESS]: "bg-green-200",
  [TaskStatus.IN_REVIEW]: "bg-yellow-200",
  [TaskStatus.DONE]: "bg-green-200",
};
