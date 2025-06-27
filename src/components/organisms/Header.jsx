import { useState } from 'react'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ title, onSearch, actions }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
            <Button variant="ghost" className="p-2">
              <ApperIcon name="Bell" className="w-5 h-5" />
            </Button>
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