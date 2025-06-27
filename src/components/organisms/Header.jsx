import { useState, useEffect } from 'react'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import NotificationDropdown from '@/components/molecules/NotificationDropdown'
import notificationService from '@/services/api/notificationService'
const Header = ({ title, onSearch, actions }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getAll()
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.read).length)
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      }
    }
    fetchNotifications()
  }, [])

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev => 
        prev.map(n => n.Id === id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }
  return (
    <header className="bg-white shadow-custom border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            {onSearch && (
              <SearchBar
                placeholder="Search..."
                onSearch={onSearch}
              />
            )}
          </div>

{/* Right side */}
          <div className="flex items-center space-x-3">
            {actions}
            <div className="relative">
              <Button 
                variant="ghost" 
                className="p-2 relative"
                onClick={handleNotificationClick}
              >
                <ApperIcon name="Bell" className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
              {showNotifications && (
                <NotificationDropdown
                  notifications={notifications.slice(0, 5)}
                  onClose={() => setShowNotifications(false)}
                  onMarkAsRead={handleMarkAsRead}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-4">
          {onSearch && (
            <SearchBar
              placeholder="Search..."
              onSearch={onSearch}
            />
          )}
        </div>
      </div>
    </header>
  )
}

export default Header