import ENV from '../config/env';

export default function MemberModal({ member, onClose, onVerify, onToggleStatus }) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Member Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg">
              {member.photo ? (
                <img 
                  src={`${ENV.BACKEND_URL}${member.photo}`} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl font-bold text-primary">
                  {member.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{member.name}</h2>
              <p className="text-blue-100 text-lg">@{member.username}</p>
              <div className="flex gap-2 mt-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    member.isVerified
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}
                >
                  {member.isVerified ? '✓ Verified' : '⏳ Unverified'}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    member.isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {member.isActive ? '● Active' : '○ Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Member Details */}
        <div className="p-8 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${member.email}`} className="text-base font-semibold text-blue-600 hover:underline">
                    {member.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <a href={`tel:${member.mobile}`} className="text-base font-semibold text-green-600 hover:underline">
                    {member.mobile}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Personal Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {member.dateOfBirth && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="font-semibold">{new Date(member.dateOfBirth).toLocaleDateString()}</span>
                </div>
              )}
              {member.gender && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-semibold capitalize">{member.gender}</span>
                </div>
              )}
              {member.aadharNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Aadhar Number:</span>
                  <span className="font-semibold">{member.aadharNumber}</span>
                </div>
              )}
              {member.address && (
                <div>
                  <span className="text-gray-600">Address:</span>
                  <p className="font-semibold mt-1">{member.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verification Status
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Email</p>
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${member.isEmailVerified ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                  {member.isEmailVerified ? '✓' : '○'}
                </span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Mobile</p>
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${member.isMobileVerified ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                  {member.isMobileVerified ? '✓' : '○'}
                </span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Aadhar</p>
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${member.isAadharVerified ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                  {member.isAadharVerified ? '✓' : '○'}
                </span>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div>
            <h3 className="text-xl font-bold text-secondary mb-4">Account Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Created:</span>
                <span className="font-semibold">{new Date(member.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-semibold">{new Date(member.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6">
            <div className="flex gap-3">
              {!member.isVerified && (
                <button
                  onClick={() => {
                    onVerify(member.id);
                    onClose();
                  }}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  ✓ Verify Member
                </button>
              )}
              <button
                onClick={() => {
                  onToggleStatus(member.id);
                  onClose();
                }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  member.isActive
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {member.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
