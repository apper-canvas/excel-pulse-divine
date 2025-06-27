import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'

const DealForm = ({ deal, contacts, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'Lead',
    contactId: '',
    probability: '',
    closeDate: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || '',
        value: deal.value || '',
        stage: deal.stage || 'Lead',
        contactId: deal.contactId || '',
        probability: deal.probability || '',
        closeDate: deal.closeDate ? deal.closeDate.split('T')[0] : '',
        notes: deal.notes || ''
      })
    }
  }, [deal])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const dealData = {
      ...formData,
      value: parseFloat(formData.value) || 0,
      contactId: parseInt(formData.contactId),
      probability: parseInt(formData.probability) || 0,
      closeDate: formData.closeDate ? new Date(formData.closeDate).toISOString() : new Date().toISOString(),
      createdAt: deal?.createdAt || new Date().toISOString()
    }
    
    await onSave(dealData)
    setLoading(false)
  }

  const stageOptions = [
    { value: 'Lead', label: 'Lead' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Proposal', label: 'Proposal' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Closed Won', label: 'Closed Won' },
    { value: 'Closed Lost', label: 'Closed Lost' }
  ]

  const contactOptions = contacts.map(contact => ({
    value: contact.Id.toString(),
    label: `${contact.name} (${contact.company})`
  }))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-premium max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {deal ? 'Edit Deal' : 'Add New Deal'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Deal Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Input
              label="Deal Value"
              name="value"
              type="number"
              value={formData.value}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Stage"
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              options={stageOptions}
              required
            />
            <Select
              label="Contact"
              name="contactId"
              value={formData.contactId}
              onChange={handleChange}
              options={contactOptions}
              placeholder="Select a contact"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Probability (%)"
              name="probability"
              type="number"
              min="0"
              max="100"
              value={formData.probability}
              onChange={handleChange}
              required
            />
            <Input
              label="Expected Close Date"
              name="closeDate"
              type="date"
              value={formData.closeDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              placeholder="Add any additional notes about this deal..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              {deal ? 'Update Deal' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default DealForm