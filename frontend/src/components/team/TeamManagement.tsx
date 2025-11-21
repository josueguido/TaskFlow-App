import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Search } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { TeamUserList } from '@/components/team/TeamUserList';
import { InviteUserModal } from '@/components/team/InviteUserModal';
import {
  getBusinessUsers,
  removeBusinessUser,
  updateBusinessUserRole,
  resendInvite,
  type BusinessUser,
} from '@/api/businessUsers';
import { useAuth } from '@/store/auth';

interface BusinessRoleModalState {
  isOpen: boolean;
  user: BusinessUser | null;
}

export const TeamManagement: React.FC = () => {
  const [businessUsers, setBusinessUsers] = useState<BusinessUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<BusinessUser[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    userId: string | number | null;
    userEmail: string;
  }>({ isOpen: false, userId: null, userEmail: '' });
  const [roleModalState, setRoleModalState] = useState<BusinessRoleModalState>({
    isOpen: false,
    user: null,
  });
  const [roleLoading, setRoleLoading] = useState(false);
  const [selectedNewRole, setSelectedNewRole] = useState<number | null>(null);

  const userRole = useAuth((state) => state.userRole());
  const isAdmin = userRole === 1; 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const users = await getBusinessUsers();
        setBusinessUsers(users);
        applyFilters(users, searchTerm, roleFilter);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const applyFilters = (users: BusinessUser[], search: string, role: string) => {
    let result = users;

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    if (role !== 'all') {
      result = result.filter((user) => user.role_name?.toLowerCase() === role.toLowerCase());
    }

    setFilteredUsers(result);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(businessUsers, term, roleFilter);
  };

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    setRoleFilter(role);
    applyFilters(businessUsers, searchTerm, role);
  };

  const handleInviteSuccess = () => {
    const fetchUpdatedUsers = async () => {
      try {
        const users = await getBusinessUsers();
        setBusinessUsers(users);
        applyFilters(users, searchTerm, roleFilter);
      } catch (err: any) {
        console.error('Error refetching users:', err);
      }
    };

    fetchUpdatedUsers();
  };

  const handleEditRoleClick = (user: BusinessUser) => {
    setRoleModalState({ isOpen: true, user });
    setSelectedNewRole(user.role_id);
  };

  const handleConfirmRoleChange = async () => {
    if (!roleModalState.user || selectedNewRole === null) return;

    try {
      setRoleLoading(true);
      await updateBusinessUserRole(roleModalState.user.id || roleModalState.user.user_id || 0, selectedNewRole);

      setBusinessUsers((prev) =>
        prev.map((u) =>
          (u.id || u.user_id) === (roleModalState.user?.id || roleModalState.user?.user_id)
            ? { ...u, role_id: selectedNewRole }
            : u
        )
      );

      setRoleModalState({ isOpen: false, user: null });
      setSelectedNewRole(null);
    } catch (err: any) {
      console.error('Error updating role:', err);
      setError(err.message || 'Failed to update user role');
    } finally {
      setRoleLoading(false);
    }
  };

  const handleRemoveUserClick = (userId: string | number, userEmail: string) => {
    setConfirmDialog({ isOpen: true, userId, userEmail });
  };

  const handleConfirmRemove = async () => {
    if (!confirmDialog.userId) return;

    try {
      setRemoveLoading(true);
      await removeBusinessUser(confirmDialog.userId);

      setBusinessUsers((prev) =>
        prev.filter((u) => (u.id || u.user_id) !== confirmDialog.userId)
      );

      applyFilters(
        businessUsers.filter((u) => (u.id || u.user_id) !== confirmDialog.userId),
        searchTerm,
        roleFilter
      );

      setConfirmDialog({ isOpen: false, userId: null, userEmail: '' });
    } catch (err: any) {
      console.error('Error removing user:', err);
      setError(err.message || 'Failed to remove user');
    } finally {
      setRemoveLoading(false);
    }
  };

  const handleResendInvite = async (userId: string | number) => {
    try {
      await resendInvite(userId);
      const users = await getBusinessUsers();
      setBusinessUsers(users);
      applyFilters(users, searchTerm, roleFilter);
    } catch (err: any) {
      console.error('Error resending invite:', err);
      setError(err.message || 'Failed to resend invite');
    }
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-gray-900 font-medium">
              You don't have permission to manage team members
            </p>
            <p className="text-gray-600 text-sm">
              Only business admins can access this page
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout boardName="Team Management">
      <div className="h-full flex flex-col overflow-hidden bg-gray-50">
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage your business team members and invite new ones
              </p>
            </div>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Invite Member
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={roleFilter}
              onChange={handleRoleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">⚠ {error}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow">
              <TeamUserList
                users={filteredUsers}
                currentUserRole={useAuth((state) => {
                  const role = state.userRole();
                  return role === 1 ? 'admin' : 'user';
                })}
                onEditRole={handleEditRoleClick}
                onRemoveUser={handleRemoveUserClick}
                onResendInvite={handleResendInvite}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={handleInviteSuccess}
      />

      {roleModalState.isOpen && roleModalState.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Change User Role
            </h3>
            <p className="text-gray-600 mb-4">
              Update the role for <strong>{roleModalState.user.name}</strong>
            </p>

            <div className="space-y-2 mb-6">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="1"
                  checked={selectedNewRole === 1}
                  onChange={(e) => setSelectedNewRole(Number(e.target.value))}
                  disabled={roleLoading}
                  className="w-4 h-4"
                />
                <span className="ml-2 font-medium">Admin</span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="2"
                  checked={selectedNewRole === 2}
                  onChange={(e) => setSelectedNewRole(Number(e.target.value))}
                  disabled={roleLoading}
                  className="w-4 h-4"
                />
                <span className="ml-2 font-medium">User</span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="3"
                  checked={selectedNewRole === 3}
                  onChange={(e) => setSelectedNewRole(Number(e.target.value))}
                  disabled={roleLoading}
                  className="w-4 h-4"
                />
                <span className="ml-2 font-medium">Viewer</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRoleModalState({ isOpen: false, user: null });
                  setSelectedNewRole(null);
                }}
                disabled={roleLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRoleChange}
                disabled={roleLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {roleLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Remove Team Member?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <strong>{confirmDialog.userEmail}</strong> from your business? They will lose access to all projects.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog({ isOpen: false, userId: null, userEmail: '' })}
                disabled={removeLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                disabled={removeLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {removeLoading ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
