export interface IEditTaskApi {
  title: string
  description: string
  status: string //['To Do', 'In Progress', 'Completed']
  due_date: string
}