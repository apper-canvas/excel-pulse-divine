import activitiesData from '@/services/mockData/activities.json'

class ActivitiesService {
  constructor() {
    this.activities = [...activitiesData]
  }

  async getAll() {
    await this.delay()
    return [...this.activities]
  }

  async getById(id) {
    await this.delay()
    const activity = this.activities.find(a => a.Id === id)
    if (!activity) {
      throw new Error('Activity not found')
    }
    return { ...activity }
  }

  async create(activityData) {
    await this.delay()
    const maxId = Math.max(...this.activities.map(a => a.Id), 0)
    const newActivity = {
      Id: maxId + 1,
      ...activityData
    }
    this.activities.push(newActivity)
    return { ...newActivity }
  }

  async update(id, activityData) {
    await this.delay()
    const index = this.activities.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    this.activities[index] = { ...this.activities[index], ...activityData }
    return { ...this.activities[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.activities.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    this.activities.splice(index, 1)
    return true
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300))
  }
}

export default new ActivitiesService()