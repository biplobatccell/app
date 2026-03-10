import ENV from '../config/env';

export default function BusinessModal({ business, onClose }) {
  if (!business) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Business Images Gallery */}
        {business.images && business.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
            {business.images.map((image, index) => (
              <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={`${ENV.BACKEND_URL}${image}`}
                  alt={`${business.name} - Image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}

        {/* Business Details */}
        <div className="p-6 space-y-6">
          {/* Business Name & Status */}
          <div className="border-b pb-4">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-3xl font-bold text-secondary">{business.name}</h2>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  business.isVerified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {business.isVerified ? '✓ Verified' : '⏳ Pending'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                {business.category?.name}
              </span>
              <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full">
                📍 {business.location?.name}
              </span>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-secondary">Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="text-lg font-semibold text-gray-900">{business.contactNumber}</p>
                </div>
              </div>

              {business.email && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-semibold text-gray-900">{business.email}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-base text-gray-900">{business.address}</p>
                {business.location && (
                  <p className="text-sm text-gray-600 mt-1">
                    {business.location.city && `${business.location.city}, `}
                    {business.location.state}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Owner Information */}
          {business.user && (
            <div className="border-t pt-4 space-y-3">
              <h3 className="text-xl font-bold text-secondary">Business Owner</h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    {business.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{business.user.name}</h4>
                    <p className="text-sm text-gray-600">@{business.user.username}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <a 
                        href={`mailto:${business.user.email}`}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {business.user.email}
                      </a>
                      <a 
                        href={`tel:${business.user.mobile}`}
                        className="text-sm text-green-600 hover:underline flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {business.user.mobile}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="border-t pt-4">
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
