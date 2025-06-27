import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Button from '@/components/atoms/Button'
import StatusBadge from '@/components/molecules/StatusBadge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import DealForm from '@/components/organisms/DealForm'
import ApperIcon from '@/components/ApperIcon'
import dealsService from '@/services/api/dealsService'
import contactsService from '@/services/api/contactsService'

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)

  const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [dealsData, contactsData] = await Promise.all([
        dealsService.getAll(),
        contactsService.getAll()
      ])
      setDeals(dealsData)
      setContacts(contactsData)
    } catch (err) {
      setError('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSave = async (dealData) => {
    try {
      if (editingDeal) {
        await dealsService.update(editingDeal.Id, dealData)
        toast.success('Deal updated successfully')
      } else {
        await dealsService.create(dealData)
        toast.success('Deal created successfully')
      }
      setShowForm(false)
      setEditingDeal(null)
      loadData()
    } catch (err) {
      toast.error('Failed to save deal')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await dealsService.delete(id)
        toast.success('Deal deleted successfully')
        loadData()
      } catch (err) {
        toast.error('Failed to delete deal')
      }
    }
  }

  const handleEdit = (deal) => {
    setEditingDeal(deal)
    setShowForm(true)
  }

  const handleStageChange = async (dealId, newStage) => {
    try {
      const deal = deals.find(d => d.Id === dealId)
      await dealsService.update(dealId, { ...deal, stage: newStage })
      toast.success(`Deal moved to ${newStage}`)
      loadData()
    } catch (err) {
      toast.error('Failed to update deal stage')
    }
  }

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.name : 'Unknown Contact'
  }

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage)
  }

  const getStageValue = (stage) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
        </div>
        <Loading type="cards" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadData} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <Header 
        title="Sales Pipeline"
        actions={
          <Button 
            variant="primary" 
            icon="Plus"
            onClick={() => setShowForm(true)}
          >
            Add Deal
          </Button>
        }
      />

      {deals.length === 0 && !loading ? (
        <Empty
          title="No deals found"
          description="Start building your sales pipeline by adding your first deal"
          actionLabel="Add Deal"
          onAction={() => setShowForm(true)}
          icon="Target"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {stages.map((stage, stageIndex) => {
            const stageDeals = getDealsByStage(stage)
            const stageValue = getStageValue(stage)
            
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stageIndex * 0.1 }}
                className="bg-gray-50 rounded-xl p-4 min-h-[600px]"
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{stage}</h3>
                    <span className="text-sm text-gray-500">{stageDeals.length}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    ${stageValue.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-3">
                  {stageDeals.map((deal, index) => (
                    <motion.div
                      key={deal.Id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-lg p-4 shadow-custom hover:shadow-elevation transition-all duration-200 cursor-pointer"
                      onClick={() => handleEdit(deal)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{deal.title}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(deal.Id)
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <ApperIcon name="X" className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-lg font-bold text-gray-900 mb-2">
                        ${deal.value.toLocaleString()}
                      </p>
                      
                      <p className="text-xs text-gray-600 mb-2">
                        {getContactName(deal.contactId)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {deal.probability}% chance
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(deal.closeDate), 'MMM d')}
                        </span>
                      </div>
                      
                      {deal.notes && (
                        <p className="text-xs text-gray-600 mt-2 truncate">
                          {deal.notes}
                        </p>
                      )}

                      {/* Stage change buttons */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                        {stageIndex > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStageChange(deal.Id, stages[stageIndex - 1])
                            }}
                            className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
                          >
                            <ApperIcon name="ChevronLeft" className="w-3 h-3" />
                          </button>
                        )}
                        <div className="flex-1"></div>
                        {stageIndex < stages.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStageChange(deal.Id, stages[stageIndex + 1])
                            }}
                            className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
                          >
                            <ApperIcon name="ChevronRight" className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {showForm && (
        <DealForm
          deal={editingDeal}
          contacts={contacts}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingDeal(null)
          }}
        />
      )}
    </div>
  )
}

export default Deals