import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { ProjectUser } from '@/api/projectUsers';

interface ProjectUserListProps {
  users: ProjectUser[];
  currentUserRole: string | null;
  onEditRole: (user: ProjectUser) => void;
  onRemoveUser: (userId: number, userName: string) => void;
  isLoading: boolean;
}

export const ProjectUserList: React.FC<ProjectUserListProps> = ({
  users,
  currentUserRole,
  onEditRole,
  onRemoveUser,
  isLoading,
}) => {
  const sortedUsers = [...users].sort((a, b) => {
    const aIsAdmin = a.roleName?.toLowerCase() === 'admin';
    const bIsAdmin = b.roleName?.toLowerCase() === 'admin';

    if (aIsAdmin !== bIsAdmin) {
      return aIsAdmin ? -1 : 1;
    }

    return (a.name || '').localeCompare(b.name || '');
  });

  const isCurrentUserAdmin = currentUserRole?.toLowerCase() === 'admin';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span>Loading team members...</span>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-3">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 00-9.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">No team members yet</p>
        <p className="text-gray-500 text-sm">Add team members to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Team Member
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Role
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Added
            </th>
            {isCurrentUserAdmin && (
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedUsers.map((user) => (
            <tr
              key={user.user_id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                    {user.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.roleName?.toLowerCase() === 'admin'
                      ? 'bg-blue-100 text-blue-800'
                      : user.roleName?.toLowerCase() === 'member'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {user.roleName || 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600 text-sm">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : '-'}
              </td>
              {isCurrentUserAdmin && (
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditRole(user)}
                      className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit role"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onRemoveUser(user.user_id, user.name)}
                      className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
