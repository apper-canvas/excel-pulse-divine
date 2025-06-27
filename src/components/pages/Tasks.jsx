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
import TaskForm from '@/components/organisms/TaskForm'
import ApperIcon from '@/components/ApperIcon'
import tasksService from '@/services/api/tasksService'
import contactsService from '@/services/api/contactsService'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [tasksData, contactsData] = await Promise.all([
        tasksService.getAll(),
        contactsService.getAll()
      ])
      setTasks(tasksData)
      setFilteredTasks(tasksData)
      setContacts(contactsData)
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = tasks

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchQuery, statusFilter, priorityFilter])

  const handleSave = async (taskData) => {
    try {
      if (editingTask) {
        await tasksService.update(editingTask.Id, taskData)
        toast.success('Task updated successfully')
      } else {
        await tasksService.create(taskData)
        toast.success('Task created successfully')
      }
      setShowForm(false)
      setEditingTask(null)
      loadData()
    } catch (err) {
      toast.error('Failed to save task')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksService.delete(id)
        toast.success('Task deleted successfully')
        loadData()
      } catch (err) {
        toast.error('Failed to delete task')
      }
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.Id === taskId)
      await tasksService.update(taskId, { ...task, status: newStatus })
      toast.success(`Task marked as ${newStatus.toLowerCase()}`)
      loadData()
    } catch (err) {
      toast.error('Failed to update task status')
    }
  }

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.name : 'Unassigned'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const isOverdue = (dueDate, status) => {
    return status !== 'Completed' && new Date(dueDate) < new Date()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        </div>
        <Loading type="table" />
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
        title="Tasks"
        onSearch={setSearchQuery}
        actions={
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <Button 
              variant="primary" 
              icon="Plus"
              onClick={() => setShowForm(true)}
            >
              Add Task
            </Button>
          </div>
        }
      />

      {filteredTasks.length === 0 && !loading ? (
        <Empty
          title="No tasks found"
          description="Stay organized by creating your first task"
          actionLabel="Add Task"
          onAction={() => setShowForm(true)}
          icon="CheckSquare"
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-xl p-6 shadow-custom hover:shadow-elevation transition-all duration-200 ${
                isOverdue(task.dueDate, task.status) ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <button
                    onClick={() => handleStatusChange(
                      task.Id, 
                      task.status === 'Completed' ? 'Pending' : 'Completed'
                    )}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.status === 'Completed'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {task.status === 'Completed' && (
                      <ApperIcon name="Check" className="w-3 h-3" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-lg font-semibold ${
                        task.status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {isOverdue(task.dueDate, task.status) && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Overdue
                        </span>
                      )}
                    </div>

                    <p className={`text-gray-600 mb-3 ${
                      task.status === 'Completed' ? 'line-through' : ''
                    }`}>
                      {task.description}
                    </p>

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Calendar" className="w-4 h-4" />
                        <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="User" className="w-4 h-4" />
                        <span>{getContactName(task.contactId)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="User" className="w-4 h-4" />
                        <span>{task.assignee}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <StatusBadge status={task.status} type="task" />
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(task)}
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(task.Id)}
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
        <TaskForm
          task={editingTask}
          contacts={contacts}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}

export default Tasks