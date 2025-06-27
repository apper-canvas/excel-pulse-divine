import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Button from '@/components/atoms/Button'
import StatusBadge from '@/components/molecules/StatusBadge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ContactForm from '@/components/organisms/ContactForm'
import ApperIcon from '@/components/ApperIcon'
import contactsService from '@/services/api/contactsService'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await contactsService.getAll()
      setContacts(data)
      setFilteredContacts(data)
    } catch (err) {
      setError('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  useEffect(() => {
    let filtered = contacts

    if (searchQuery) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(contact => contact.status === statusFilter)
    }

    setFilteredContacts(filtered)
  }, [contacts, searchQuery, statusFilter])

  const handleSave = async (contactData) => {
    try {
      if (editingContact) {
        await contactsService.update(editingContact.Id, contactData)
        toast.success('Contact updated successfully')
      } else {
        await contactsService.create(contactData)
        toast.success('Contact created successfully')
      }
      setShowForm(false)
      setEditingContact(null)
      loadContacts()
    } catch (err) {
      toast.error('Failed to save contact')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactsService.delete(id)
        toast.success('Contact deleted successfully')
        loadContacts()
      } catch (err) {
        toast.error('Failed to delete contact')
      }
    }
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        </div>
        <Loading type="table" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadContacts} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <Header 
        title="Contacts"
        onSearch={setSearchQuery}
        actions={
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Lead">Lead</option>
              <option value="Customer">Customer</option>
            </select>
            <Button 
              variant="primary" 
              icon="Plus"
              onClick={() => setShowForm(true)}
            >
              Add Contact
            </Button>
          </div>
        }
      />

      {filteredContacts.length === 0 && !loading ? (
        <Empty
          title="No contacts found"
          description="Start building your customer base by adding your first contact"
          actionLabel="Add Contact"
          onAction={() => setShowForm(true)}
          icon="Users"
        />
      ) : (
        <div className="space-y-4">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-custom hover:shadow-elevation transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {contact.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <Link
                      to={`/contacts/${contact.Id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                    >
                      {contact.name}
                    </Link>
                    <p className="text-sm text-gray-600">{contact.position} at {contact.company}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{contact.email}</span>
                      <span className="text-sm text-gray-500">{contact.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <StatusBadge status={contact.status} type="contact" />
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Last Activity</p>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(contact.lastActivity), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(contact)}
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(contact.Id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showForm && (
        <ContactForm
          contact={editingContact}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingContact(null)
          }}
        />
      )}
    </div>
  )
}

export default Contacts