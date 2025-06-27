import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Header from '@/components/organisms/Header'
import MetricCard from '@/components/molecules/MetricCard'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import contactsService from '@/services/api/contactsService'
import dealsService from '@/services/api/dealsService'
import tasksService from '@/services/api/tasksService'
import activitiesService from '@/services/api/activitiesService'

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null)
  const [recentActivities, setRecentActivities] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [contacts, deals, tasks, activities] = await Promise.all([
        contactsService.getAll(),
        dealsService.getAll(),
        tasksService.getAll(),
        activitiesService.getAll()
      ])

      // Calculate metrics
      const totalContacts = contacts.length
      const activeDeals = deals.filter(deal => !['Closed Won', 'Closed Lost'].includes(deal.stage)).length
      const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0)
      const pendingTasks = tasks.filter(task => task.status === 'Pending').length

      setMetrics({
        totalContacts,
        activeDeals,
        totalDealValue,
        pendingTasks
      })

      // Get recent activities (last 5)
      const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
      setRecentActivities(sortedActivities)

      // Get upcoming tasks (next 5)
      const sortedTasks = tasks
        .filter(task => task.status !== 'Completed')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5)
      setUpcomingTasks(sortedTasks)

    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <Loading type="metrics" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Loading />
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadDashboardData} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <Header 
        title="Dashboard" 
        actions={
          <Button variant="primary" icon="Plus">
            Quick Add
          </Button>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Contacts"
          value={metrics.totalContacts.toLocaleString()}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+12%"
        />
        <MetricCard
          title="Active Deals"
          value={metrics.activeDeals.toLocaleString()}
          icon="Target"
          color="secondary"
          trend="up"
          trendValue="+8%"
        />
        <MetricCard
          title="Pipeline Value"
          value={`$${(metrics.totalDealValue / 1000).toFixed(0)}K`}
          icon="DollarSign"
          color="accent"
          trend="up"
          trendValue="+15%"
        />
        <MetricCard
          title="Pending Tasks"
          value={metrics.pendingTasks.toLocaleString()}
          icon="Clock"
          color="info"
          trend="down"
          trendValue="-5%"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-custom p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
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
                  <p className="text-sm font-medium text-gray-900">{activity.subject}</p>
                  <p className="text-xs text-gray-500">{activity.notes}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-custom p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
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
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard