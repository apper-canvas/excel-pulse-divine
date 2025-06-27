import tasksData from '@/services/mockData/tasks.json'

class TasksService {
  constructor() {
    this.tasks = [...tasksData]
  }

  async getAll() {
    await this.delay()
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay()
    const task = this.tasks.find(t => t.Id === id)
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  }

  async create(taskData) {
    await this.delay()
    const maxId = Math.max(...this.tasks.map(t => t.Id), 0)
    const newTask = {
      Id: maxId + 1,
      ...taskData
    }
    this.tasks.push(newTask)
    return { ...newTask }
  }

  async update(id, taskData) {
    await this.delay()
    const index = this.tasks.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    this.tasks[index] = { ...this.tasks[index], ...taskData }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.tasks.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    this.tasks.splice(index, 1)
    return true
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300))
  }
}

export default new TasksService()