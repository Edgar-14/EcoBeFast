'use client';

import { useState } from 'react';
import { DriverApplication } from '@/lib/types/driver';

interface DriverApplicationDialogProps {
  application: DriverApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (applicationId: string) => void;
  onReject: (applicationId: string, reason: string) => void;
}

export default function DriverApplicationDialog({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject
}: DriverApplicationDialogProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !application) return null;

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(application.id);
      onClose();
    } catch (error) {
      console.error('Error approving application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    
    setLoading(true);
    try {
      await onReject(application.id, rejectionReason);
      onClose();
    } catch (error) {
      console.error('Error rejecting application:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Driver Application Review
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-gray-900">{application.personalInfo.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{application.personalInfo.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-gray-900">{application.personalInfo.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">RFC</label>
                <p className="text-gray-900">{application.personalInfo.rfc}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">NSS</label>
                <p className="text-gray-900">{application.personalInfo.nss}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CURP</label>
                <p className="text-gray-900">{application.personalInfo.curp}</p>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="text-gray-900">{application.personalInfo.address}</p>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <p className="text-gray-900 capitalize">{application.vehicleInfo.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <p className="text-gray-900">{application.vehicleInfo.brand}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <p className="text-gray-900">{application.vehicleInfo.model}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <p className="text-gray-900">{application.vehicleInfo.year}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Plates</label>
                <p className="text-gray-900">{application.vehicleInfo.plates}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <p className="text-gray-900">{application.vehicleInfo.color}</p>
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Bank Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                <p className="text-gray-900">{application.bankInfo.bankName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CLABE</label>
                <p className="text-gray-900">{application.bankInfo.clabe}</p>
              </div>
            </div>
          </div>

          {/* Training */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Training Results</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Score</label>
              <p className="text-gray-900">{application.training.score}%</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Application Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Status</label>
                <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                  application.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {application.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Submission Date</label>
                <p className="text-gray-900">
                  {application.submissionDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {application.status === 'pending_review' && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            {!showRejectForm ? (
              <div className="flex space-x-4">
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Approve Application'}
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={loading}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Reject Application
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Please provide a reason for rejection..."
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleReject}
                    disabled={loading || !rejectionReason.trim()}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Confirm Rejection'}
                  </button>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    disabled={loading}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}