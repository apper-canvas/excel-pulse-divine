import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import notificationService from '@/services/api/notificationService'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const data = await notificationService.getAll()
      setNotifications(data)
    } catch (err) {
      setError('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev => 
        prev.map(n => n.Id === id ? { ...n, read: true } : n)
      )
      toast.success('Notification marked as read')
    } catch (err) {
      toast.error('Failed to mark notification as read')
    }
  }

  const handleMarkAsUnread = async (id) => {
    try {
      await notificationService.markAsUnread(id)
      setNotifications(prev => 
        prev.map(n => n.Id === id ? { ...n, read: false } : n)
      )
      toast.success('Notification marked as unread')
    } catch (err) {
      toast.error('Failed to mark notification as unread')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notification?')) return
    
    try {
      await notificationService.delete(id)
      setNotifications(prev => prev.filter(n => n.Id !== id))
      toast.success('Notification deleted')
    } catch (err) {
      toast.error('Failed to delete notification')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success('All notifications marked as read')
    } catch (err) {
      toast.error('Failed to mark all notifications as read')
    }
  }

  const getFilteredNotifications = () => {
    let filtered = notifications

    if (filter !== 'all') {
      filtered = filtered.filter(n => {
        if (filter === 'unread') return !n.read
        if (filter === 'read') return n.read
        return n.type === filter
      })
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt)
      }
    })
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return 'CheckCircle'
      case 'warning': return 'AlertTriangle'
      case 'error': return 'AlertCircle'
      default: return 'Info'
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-500 bg-green-50'
      case 'warning': return 'text-yellow-500 bg-yellow-50'
      case 'error': return 'text-red-500 bg-red-50'
      default: return 'text-blue-500 bg-blue-50'
    }
  }

  const filterOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'info', label: 'Info' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' }
  ]

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={fetchNotifications} />

  return (
    <div className="h-full flex flex-col">
      <Header
        title="Notifications"
        actions={
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead} size="sm">
                <ApperIcon name="CheckCheck" className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        }
      />

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                options={filterOptions}
                placeholder="Filter notifications..."
              />
            </div>
            <div className="sm:w-48">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={sortOptions}
                placeholder="Sort by..."
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Bell" className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="AlertCircle" className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Read</p>
                  <p className="text-2xl font-bold text-gray-900">{notifications.length - unreadCount}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <Empty 
              icon="Bell"
              title="No notifications found"
              description="No notifications match your current filters."
            />
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
                    !notification.read ? 'ring-2 ring-blue-100' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                        <ApperIcon name={getNotificationIcon(notification.type)} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-sm text-gray-400">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {notification.read ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsUnread(notification.Id)}
                          title="Mark as unread"
                        >
                          <ApperIcon name="MailX" className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.Id)}
                          title="Mark as read"
                        >
                          <ApperIcon name="Mail" className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notification.Id)}
                        title="Delete notification"
                        className="text-red-600 hover:text-red-700"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications