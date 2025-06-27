import dealsData from '@/services/mockData/deals.json'

class DealsService {
  constructor() {
    this.deals = [...dealsData]
  }

  async getAll() {
    await this.delay()
    return [...this.deals]
  }

  async getById(id) {
    await this.delay()
    const deal = this.deals.find(d => d.Id === id)
    if (!deal) {
      throw new Error('Deal not found')
    }
    return { ...deal }
  }

  async create(dealData) {
    await this.delay()
    const maxId = Math.max(...this.deals.map(d => d.Id), 0)
    const newDeal = {
      Id: maxId + 1,
      ...dealData
    }
    this.deals.push(newDeal)
    return { ...newDeal }
  }

  async update(id, dealData) {
    await this.delay()
    const index = this.deals.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Deal not found')
    }
    this.deals[index] = { ...this.deals[index], ...dealData }
    return { ...this.deals[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.deals.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Deal not found')
    }
    this.deals.splice(index, 1)
    return true
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300))
  }
}

export default new DealsService()