import Badge from '@/components/atoms/Badge'

const StatusBadge = ({ status, type = 'contact' }) => {
  const getStatusConfig = () => {
    if (type === 'contact') {
      const configs = {
        'Active': { variant: 'success', icon: 'CheckCircle' },
        'Inactive': { variant: 'default', icon: 'Circle' },
        'Lead': { variant: 'info', icon: 'User' },
        'Customer': { variant: 'accent', icon: 'Crown' }
      }
      return configs[status] || { variant: 'default', icon: 'Circle' }
    }
    
    if (type === 'deal') {
      const configs = {
        'Lead': { variant: 'info', icon: 'Target' },
        'Qualified': { variant: 'warning', icon: 'Eye' },
        'Proposal': { variant: 'secondary', icon: 'FileText' },
        'Negotiation': { variant: 'primary', icon: 'MessageSquare' },
        'Closed Won': { variant: 'success', icon: 'CheckCircle' },
        'Closed Lost': { variant: 'danger', icon: 'XCircle' }
      }
      return configs[status] || { variant: 'default', icon: 'Circle' }
    }
    
    if (type === 'task') {
      const configs = {
        'Pending': { variant: 'warning', icon: 'Clock' },
        'In Progress': { variant: 'info', icon: 'Play' },
        'Completed': { variant: 'success', icon: 'CheckCircle' },
        'Cancelled': { variant: 'danger', icon: 'XCircle' }
      }
      return configs[status] || { variant: 'default', icon: 'Circle' }
    }
    
    return { variant: 'default', icon: 'Circle' }
  }

  const config = getStatusConfig()
  
  return (
    <Badge variant={config.variant} icon={config.icon}>
      {status}
    </Badge>
  )
}

export default StatusBadge