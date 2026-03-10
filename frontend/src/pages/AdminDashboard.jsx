import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import BusinessModal from '../components/BusinessModal';
import MemberModal from '../components/MemberModal';
import ENV from '../config/env';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FolderTree, 
  MapPin, 
  Shield, 
  LogOut,
  TrendingUp,
  UserCheck,
  Clock,
  Activity,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">Jain Connect</h1>
          <p className="text-sm text-gray-300">Admin Panel</p>
        </div>
        <nav className="mt-6">
          <NavLink to="/app/admin" active={location.pathname === '/app/admin'}>
            <LayoutDashboard className="w-5 h-5 inline-block mr-3" />
            Dashboard
          </NavLink>
          <NavLink to="/app/admin/members" active={location.pathname === '/app/admin/members'}>
            <Users className="w-5 h-5 inline-block mr-3" />
            Members
          </NavLink>
          <NavLink to="/app/admin/businesses" active={location.pathname === '/app/admin/businesses'}>
            <Building2 className="w-5 h-5 inline-block mr-3" />
            Businesses
          </NavLink>
          <NavLink to="/app/admin/categories" active={location.pathname === '/app/admin/categories'}>
            <FolderTree className="w-5 h-5 inline-block mr-3" />
            Categories
          </NavLink>
          <NavLink to="/app/admin/locations" active={location.pathname === '/app/admin/locations'}>
            <MapPin className="w-5 h-5 inline-block mr-3" />
            Locations
          </NavLink>
          <NavLink to="/app/admin/admins" active={location.pathname === '/app/admin/admins'}>
            <Shield className="w-5 h-5 inline-block mr-3" />
            Admins
          </NavLink>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/members" element={<MembersManagement />} />
          <Route path="/businesses" element={<BusinessesManagement />} />
          <Route path="/categories" element={<CategoriesManagement />} />
          <Route path="/locations" element={<LocationsManagement />} />
          <Route path="/admins" element={<AdminsManagement />} />
        </Routes>
      </main>
    </div>
  );
}

function NavLink({ to, children, active }) {
  return (
    <Link
      to={to}
      className={`block px-6 py-3 hover:bg-blue-700 transition-colors ${
        active ? 'bg-blue-700 border-l-4 border-white' : ''
      }`}
    >
      {children}
    </Link>
  );
}

// Dashboard Home with Statistics
function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Real-time insights and analytics
        </p>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ModernStatCard
          title="Total Users"
          value={stats?.statistics.users.total || 0}
          subtitle={`${stats?.statistics.users.verified || 0} verified`}
          trend={stats?.statistics.users.recent || 0}
          trendLabel="new this month"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <ModernStatCard
          title="Total Businesses"
          value={stats?.statistics.businesses.total || 0}
          subtitle={`${stats?.statistics.businesses.pending || 0} pending approval`}
          trend={stats?.statistics.businesses.verified || 0}
          trendLabel="verified"
          icon={<Building2 className="w-6 h-6" />}
          color="green"
        />
        <ModernStatCard
          title="Categories"
          value={stats?.statistics.categories || 0}
          subtitle="Active categories"
          icon={<FolderTree className="w-6 h-6" />}
          color="purple"
        />
        <ModernStatCard
          title="Locations"
          value={stats?.statistics.locations || 0}
          subtitle="Active locations"
          icon={<MapPin className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <QuickStatCard
          icon={<UserCheck className="w-8 h-8 text-green-600" />}
          label="Active Users"
          value={stats?.statistics.users.active || 0}
          bgColor="bg-green-50"
        />
        <QuickStatCard
          icon={<Clock className="w-8 h-8 text-yellow-600" />}
          label="Pending Verifications"
          value={stats?.statistics.users.unverified || 0}
          bgColor="bg-yellow-50"
        />
        <QuickStatCard
          icon={<TrendingUp className="w-8 h-8 text-blue-600" />}
          label="Active Businesses"
          value={stats?.statistics.businesses.active || 0}
          bgColor="bg-blue-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                User Registrations
              </h2>
              <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.charts.dailyRegistrations || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="count" fill="#FF6B35" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Business Listings
              </h2>
              <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.charts.dailyBusinesses || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="count" fill="#004E89" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ModernStatCard({ title, value, subtitle, trend, trendLabel, icon, color }) {
  const colors = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: 'bg-blue-400/30',
      trend: 'bg-blue-400/20 text-blue-100'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-500 to-green-600',
      icon: 'bg-green-400/30',
      trend: 'bg-green-400/20 text-green-100'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      icon: 'bg-purple-400/30',
      trend: 'bg-purple-400/20 text-purple-100'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
      icon: 'bg-orange-400/30',
      trend: 'bg-orange-400/20 text-orange-100'
    }
  };

  const colorScheme = colors[color];

  return (
    <div className={`${colorScheme.bg} text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${colorScheme.icon} p-3 rounded-lg backdrop-blur-sm`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`${colorScheme.trend} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold mb-2 opacity-90">{title}</h3>
      <p className="text-4xl font-bold mb-2">{value}</p>
      <p className="text-sm opacity-75">{subtitle}</p>
      {trendLabel && (
        <p className="text-xs opacity-60 mt-2">{trendLabel}</p>
      )}
    </div>
  );
}

function QuickStatCard({ icon, label, value, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-6 border border-gray-200`}>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Members Management Component
function MembersManagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, verified, unverified
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, [filter]);

  const fetchMembers = async () => {
    try {
      let url = '/admin/members';
      if (filter === 'verified') url += '?verified=true';
      if (filter === 'unverified') url += '?verified=false';

      const response = await api.get(url);
      setMembers(response.data.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await api.put(`/admin/members/${id}/verify`);
      alert('Member verified successfully');
      fetchMembers();
    } catch (error) {
      alert('Failed to verify member');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.put(`/admin/members/${id}/toggle-status`);
      alert('Member status updated');
      fetchMembers();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary">Members Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'verified' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Verified
          </button>
          <button
            onClick={() => setFilter('unverified')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'unverified' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Unverified
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Photo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member, index) => (
              <tr 
                key={member.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {member.photo ? (
                      <img 
                        src={`${ENV.BACKEND_URL}${member.photo}`} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-gray-400">
                        {member.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{member.name}</div>
                  <div className="text-sm text-gray-500">@{member.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{member.email}</div>
                  <div className="text-sm text-gray-500">{member.mobile}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.isVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {member.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <span
                    className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.isActive ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {!member.isVerified && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerify(member.id);
                      }}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Verify
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(member.id);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {member.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onVerify={handleVerify}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
}

// Businesses Management Component
function BusinessesManagement() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Changed default to 'all'
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, [filter]);

  const fetchBusinesses = async () => {
    try {
      let url = '/admin/businesses';
      if (filter === 'verified') url += '?verified=true';
      if (filter === 'unverified') url += '?verified=false';
      // For 'all', don't add any filter

      const response = await api.get(url);
      setBusinesses(response.data.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/businesses/${id}/approve`);
      alert('Business approved successfully');
      fetchBusinesses();
    } catch (error) {
      alert('Failed to approve business');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.put(`/admin/businesses/${id}/toggle-status`);
      alert('Business status updated');
      fetchBusinesses();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary">Business Listings</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'verified' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Verified
          </button>
          <button
            onClick={() => setFilter('unverified')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'unverified' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Unverified
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <div 
            key={business.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
            onClick={() => setSelectedBusiness(business)}
          >
            {/* Business Image Preview */}
            {business.images && business.images.length > 0 && (
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={`${ENV.BACKEND_URL}${business.images[0]}`}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
                {business.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                    +{business.images.length - 1} more
                  </div>
                )}
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-secondary line-clamp-1 flex-1">{business.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0 ${
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
                  <span className="font-semibold">Owner:</span> {business.user?.name}
                </p>
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
                {!business.isVerified && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(business.id);
                    }}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus(business.id);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  {business.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {businesses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No {filter} businesses found.
        </div>
      )}

      {/* Business Detail Modal */}
      {selectedBusiness && (
        <BusinessModal
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
        />
      )}
    </div>
  );
}

// Categories Management Component - Continued in next message due to length
function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/admin/categories/${editId}`, formData);
        alert('Category updated successfully');
      } else {
        await api.post('/admin/categories', formData);
        alert('Category created successfully');
      }
      setShowModal(false);
      setFormData({ name: '', description: '' });
      setEditId(null);
      fetchCategories();
    } catch (error) {
      alert('Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditId(category.id);
    setFormData({ name: category.name, description: category.description || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      alert('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary">Categories</h1>
        <button
          onClick={() => {
            setEditId(null);
            setFormData({ name: '', description: '' });
            setShowModal(true);
          }}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600"
        >
          + Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-900 mr-4">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-secondary mb-4">
              {editId ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Locations Management Component (similar to Categories)
function LocationsManagement() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', city: '', state: '', pincode: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await api.get('/admin/locations');
      setLocations(response.data.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/admin/locations/${editId}`, formData);
        alert('Location updated successfully');
      } else {
        await api.post('/admin/locations', formData);
        alert('Location created successfully');
      }
      setShowModal(false);
      setFormData({ name: '', city: '', state: '', pincode: '' });
      setEditId(null);
      fetchLocations();
    } catch (error) {
      alert('Failed to save location');
    }
  };

  const handleEdit = (location) => {
    setEditId(location.id);
    setFormData({ 
      name: location.name, 
      city: location.city || '', 
      state: location.state || '', 
      pincode: location.pincode || '' 
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      await api.delete(`/admin/locations/${id}`);
      alert('Location deleted successfully');
      fetchLocations();
    } catch (error) {
      alert('Failed to delete location');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary">Locations</h1>
        <button
          onClick={() => {
            setEditId(null);
            setFormData({ name: '', city: '', state: '', pincode: '' });
            setShowModal(true);
          }}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600"
        >
          + Add Location
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pincode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {locations.map((location) => (
              <tr key={location.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{location.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.city}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.state}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.pincode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(location)} className="text-blue-600 hover:text-blue-900 mr-4">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(location.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-secondary mb-4">
              {editId ? 'Edit Location' : 'Add Location'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Admins Management Component
function AdminsManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    name: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admin/admins');
      setAdmins(response.data.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await api.post('/admin/create-admin', formData);
      setMessage('Admin created successfully!');
      setFormData({ username: '', email: '', mobile: '', password: '', name: '' });
      setShowModal(false);
      fetchAdmins();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  if (loading && admins.length === 0) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Admin Management
          </h1>
          <p className="text-gray-600 mt-1">Manage system administrators</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center gap-2"
        >
          <Shield className="w-5 h-5" />
          Add New Admin
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Admins Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Photo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin, index) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    {admin.photo ? (
                      <img 
                        src={`${ENV.BACKEND_URL}${admin.photo}`} 
                        alt={admin.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-white">
                        {admin.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    {admin.name}
                  </div>
                  <div className="text-sm text-gray-500">@{admin.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{admin.email}</div>
                  <div className="text-sm text-gray-500">{admin.mobile}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      admin.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {admin.isActive ? '● Active' : '○ Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Create New Admin
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile *</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  minLength="6"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Admin'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

