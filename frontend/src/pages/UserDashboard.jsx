import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [myBusinesses, setMyBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [businessesRes, myBusinessesRes, categoriesRes, locationsRes] = await Promise.all([
        api.get('/user/businesses'),
        api.get('/user/my-businesses'),
        api.get('/user/categories'),
        api.get('/user/locations')
      ]);

      setBusinesses(businessesRes.data.data);
      setMyBusinesses(myBusinessesRes.data.data);
      setCategories(categoriesRes.data.data);
      setLocations(locationsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-secondary">Jain Connect</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/app/profile"
                className="px-4 py-2 text-secondary hover:bg-gray-100 rounded-lg transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Status Alert */}
        {!user?.isVerified && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              ⚠️ Your account verification is pending. You cannot add business listings until your account is verified.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-4 border-b">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Businesses
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'my'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Businesses ({myBusinesses.length})
            </button>
          </div>
        </div>

        {/* Add Business Button */}
        {activeTab === 'my' && user?.isVerified && (
          <div className="mb-6">
            <Link
              to="/app/add-business"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              + Add New Business
            </Link>
          </div>
        )}

        {/* Business Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'all'
            ? businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))
            : myBusinesses.map((business) => (
                <MyBusinessCard
                  key={business.id}
                  business={business}
                  onUpdate={fetchData}
                />
              ))}
        </div>

        {activeTab === 'all' && businesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No businesses available yet.</p>
          </div>
        )}

        {activeTab === 'my' && myBusinesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't added any businesses yet.</p>
            {user?.isVerified && (
              <Link
                to="/app/add-business"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add Your First Business
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Business Card Component
function BusinessCard({ business }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-bold text-secondary mb-2">{business.name}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-semibold">Category:</span> {business.category?.name}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {business.location?.name}
          </p>
          <p>
            <span className="font-semibold">Contact:</span> {business.contactNumber}
          </p>
          {business.email && (
            <p>
              <span className="font-semibold">Email:</span> {business.email}
            </p>
          )}
          <p className="text-gray-500">{business.address}</p>
        </div>
      </div>
    </div>
  );
}

// My Business Card Component
function MyBusinessCard({ business, onUpdate }) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this business?')) return;

    try {
      await api.delete(`/user/businesses/${business.id}`);
      alert('Business deleted successfully');
      onUpdate();
    } catch (error) {
      alert('Failed to delete business');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-secondary">{business.name}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              business.isVerified
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {business.isVerified ? 'Verified' : 'Pending'}
          </span>
        </div>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p>
            <span className="font-semibold">Category:</span> {business.category?.name}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {business.location?.name}
          </p>
          <p>
            <span className="font-semibold">Contact:</span> {business.contactNumber}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
