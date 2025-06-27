import mockData from '@/services/mockData/notifications.json'

let notifications = [...mockData]
let nextId = Math.max(...mockData.map(n => n.Id)) + 1

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const notificationService = {
  async getAll() {
    await delay(300)
    return [...notifications]
  },

  async getById(id) {
    await delay(200)
    const notification = notifications.find(n => n.Id === parseInt(id))
    return notification ? { ...notification } : null
  },

  async create(notification) {
    await delay(400)
    const newNotification = {
      ...notification,
      Id: nextId++,
      read: false,
      createdAt: new Date().toISOString()
    }
    notifications.unshift(newNotification)
    return { ...newNotification }
  },

  async update(id, data) {
    await delay(300)
    const index = notifications.findIndex(n => n.Id === parseInt(id))
    if (index === -1) throw new Error('Notification not found')
    
    notifications[index] = { ...notifications[index], ...data, Id: parseInt(id) }
    return { ...notifications[index] }
  },

  async delete(id) {
    await delay(200)
    const index = notifications.findIndex(n => n.Id === parseInt(id))
    if (index === -1) throw new Error('Notification not found')
    
    notifications.splice(index, 1)
    return true
  },

  async markAsRead(id) {
    await delay(200)
    const index = notifications.findIndex(n => n.Id === parseInt(id))
    if (index === -1) throw new Error('Notification not found')
    
    notifications[index] = { ...notifications[index], read: true }
    return { ...notifications[index] }
  },

  async markAsUnread(id) {
    await delay(200)
    const index = notifications.findIndex(n => n.Id === parseInt(id))
    if (index === -1) throw new Error('Notification not found')
    
    notifications[index] = { ...notifications[index], read: false }
    return { ...notifications[index] }
  },

  async markAllAsRead() {
    await delay(500)
    notifications = notifications.map(n => ({ ...n, read: true }))
    return [...notifications]
  }
}

export default notificationService