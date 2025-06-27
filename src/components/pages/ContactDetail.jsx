import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Button from '@/components/atoms/Button'
import StatusBadge from '@/components/molecules/StatusBadge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import contactsService from '@/services/api/contactsService'
import dealsService from '@/services/api/dealsService'
import activitiesService from '@/services/api/activitiesService'
import tasksService from '@/services/api/tasksService'

const ContactDetail = () => {
  const { id } = useParams()
  const [contact, setContact] = useState(null)
  const [deals, setDeals] = useState([])
  const [activities, setActivities] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const loadContactData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [contactData, allDeals, allActivities, allTasks] = await Promise.all([
        contactsService.getById(parseInt(id)),
        dealsService.getAll(),
        activitiesService.getAll(),
        tasksService.getAll()
      ])

      setContact(contactData)
      setDeals(allDeals.filter(deal => deal.contactId === parseInt(id)))
      setActivities(allActivities.filter(activity => activity.contactId === parseInt(id)))
      setTasks(allTasks.filter(task => task.contactId === parseInt(id)))
    } catch (err) {
      setError('Failed to load contact data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContactData()
  }, [id])

  if (loading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadContactData} />
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="p-6">
        <Error message="Contact not found" />
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'activities', label: 'Activities', icon: 'Activity' },
    { id: 'deals', label: 'Deals', icon: 'Target' },
    { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' }
  ]

  return (
    <div className="p-6">
      <Header 
        title={contact.name}
        actions={
          <div className="flex items-center space-x-3">
            <Link to="/contacts">
              <Button variant="secondary" icon="ArrowLeft">
                Back to Contacts
              </Button>
            </Link>
            <Button variant="primary" icon="Edit">
              Edit Contact
            </Button>
          </div>
        }
      />

      {/* Contact Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-custom p-6 mb-6"
      >
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {contact.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{contact.name}</h1>
            <p className="text-lg text-gray-600 mb-2">{contact.position} at {contact.company}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{contact.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{contact.phone}</span>
              </div>
              <StatusBadge status={contact.status} type="contact" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-custom">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-gray-900">{contact.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Position</label>
                    <p className="text-gray-900">{contact.position}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{contact.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{contact.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <StatusBadge status={contact.status} type="contact" />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'activities' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {activities.length === 0 ? (
                <Empty
                  title="No activities found"
                  description="No activities have been logged for this contact yet"
                  icon="Activity"
                />
              ) : (
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <ApperIcon 
                          name={
                            activity.type === 'Call' ? 'Phone' :
                            activity.type === 'Email' ? 'Mail' :
                            activity.type === 'Meeting' ? 'Calendar' : 'MessageSquare'
                          } 
                          className="w-4 h-4 text-white" 
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.subject}</h4>
                        <p className="text-sm text-gray-600 mt-1">{activity.notes}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'deals' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {deals.length === 0 ? (
                <Empty
                  title="No deals found"
                  description="No deals are associated with this contact yet"
                  icon="Target"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deals.map((deal, index) => (
                    <motion.div
                      key={deal.Id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{deal.title}</h4>
                        <StatusBadge status={deal.stage} type="deal" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        ${deal.value.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">{deal.notes}</p>
                      <p className="text-xs text-gray-400">
                        Close Date: {format(new Date(deal.closeDate), 'MMM d, yyyy')}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {tasks.length === 0 ? (
                <Empty
                  title="No tasks found"
                  description="No tasks are assigned to this contact yet"
                  icon="CheckSquare"
                />
              ) : (
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        task.priority === 'High' ? 'bg-red-100 text-red-600' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        <ApperIcon 
                          name={
                            task.priority === 'High' ? 'AlertTriangle' :
                            task.priority === 'Medium' ? 'Clock' : 'CheckCircle'
                          } 
                          className="w-4 h-4" 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <StatusBadge status={task.status} type="task" />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactDetail