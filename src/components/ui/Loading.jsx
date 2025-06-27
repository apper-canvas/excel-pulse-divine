import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'table') {
    return (
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-custom"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-1/2"></div>
              </div>
              <div className="w-20 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-custom"
          >
            <div className="space-y-4">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-3/4"></div>
              <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-2/3"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'metrics') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-custom"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-20"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shimmer"></div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full"
      />
    </div>
  )
}

export default Loading