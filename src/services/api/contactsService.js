import contactsData from '@/services/mockData/contacts.json'

class ContactsService {
  constructor() {
    this.contacts = [...contactsData]
  }

  async getAll() {
    await this.delay()
    return [...this.contacts]
  }

  async getById(id) {
    await this.delay()
    const contact = this.contacts.find(c => c.Id === id)
    if (!contact) {
      throw new Error('Contact not found')
    }
    return { ...contact }
  }

  async create(contactData) {
    await this.delay()
    const maxId = Math.max(...this.contacts.map(c => c.Id), 0)
    const newContact = {
      Id: maxId + 1,
      ...contactData
    }
    this.contacts.push(newContact)
    return { ...newContact }
  }

  async update(id, contactData) {
    await this.delay()
    const index = this.contacts.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Contact not found')
    }
    this.contacts[index] = { ...this.contacts[index], ...contactData }
    return { ...this.contacts[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.contacts.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Contact not found')
    }
    this.contacts.splice(index, 1)
    return true
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300))
  }
}

export default new ContactsService()