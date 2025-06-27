import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Contacts from '@/components/pages/Contacts'
import ContactDetail from '@/components/pages/ContactDetail'
import Deals from '@/components/pages/Deals'
import Tasks from '@/components/pages/Tasks'
import Notifications from '@/components/pages/Notifications'
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-surface via-white to-primary-50">
        <Layout>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
<Route path="/" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/contacts/:id" element={<ContactDetail />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </motion.div>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  )
}

export default App