import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProjectUserList } from '@/components/projects/ProjectUserList';
import { AddProjectUserModal } from '@/components/projects/AddProjectUserModal';
import { ProjectUserRoleModal } from '@/components/projects/ProjectUserRoleModal';
import {
  getProjectUsers,
  getMyProjectRole,
  removeUserFromProject,
  type ProjectUser,
  type UserRole,
} from '@/api/projectUsers';
import { getProjectById } from '@/api/projects';
import type { Project } from '@/api/projects';

interface ConfirmDialog {
  isOpen: boolean;
  userId: number | null;
  userName: string;
}

export const ProjectUsers: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ProjectUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    isOpen: false,
    userId: null,
    userName: '',
  });
  const [removeLoading, setRemoveLoading] = useState(false);

  const projectIdNum = projectId ? Number(projectId) : 0;

  useEffect(() => {
    const fetchData = async () => {
      if (!projectIdNum) {
        setError('Invalid project ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [projectData, users, userRole] = await Promise.all([
          getProjectById(projectId!),
          getProjectUsers(projectIdNum),
          getMyProjectRole(projectIdNum),
        ]);

        setProject(projectData);
        setProjectUsers(users);
        setCurrentUserRole(userRole);
      } catch (err: any) {
        console.error('Error fetching project data:', err);
        setError(err.message || 'Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, projectIdNum]);

  const handleAddUserSuccess = () => {
    const fetchUpdatedUsers = async () => {
      try {
        const users = await getProjectUsers(projectIdNum);
        setProjectUsers(users);
      } catch (err: any) {
        console.error('Error refetching users:', err);
      }
    };

    fetchUpdatedUsers();
  };

  const handleEditRoleClick = (user: ProjectUser) => {
    setSelectedUser(user);
    setIsEditRoleModalOpen(true);
  };

  const handleEditRoleSuccess = () => {
    const fetchUpdatedUsers = async () => {
      try {
        const users = await getProjectUsers(projectIdNum);
        setProjectUsers(users);
      } catch (err: any) {
        console.error('Error refetching users:', err);
      }
    };

    fetchUpdatedUsers();
  };

  const handleRemoveUserClick = (userId: number, userName: string) => {
    setConfirmDialog({
      isOpen: true,
      userId,
      userName,
    });
  };

  const handleConfirmRemove = async () => {
    if (!confirmDialog.userId) return;

    try {
      setRemoveLoading(true);
      await removeUserFromProject(projectIdNum, confirmDialog.userId);

      setProjectUsers((prev) =>
        prev.filter((u) => u.user_id !== confirmDialog.userId)
      );

      setConfirmDialog({ isOpen: false, userId: null, userName: '' });
    } catch (err: any) {
      console.error('Error removing user:', err);
      setError(err.message || 'Failed to remove user');
    } finally {
      setRemoveLoading(false);
    }
  };

  const isCurrentUserAdmin =
    currentUserRole?.role_name?.toLowerCase() === 'admin';
  const adminCount = projectUsers.filter(
    (u) => u.roleName?.toLowerCase() === 'admin'
  ).length;
  const isLastAdmin =
    selectedUser?.roleName?.toLowerCase() === 'admin' && adminCount === 1;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading project data...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !project) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-gray-900 font-medium">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isCurrentUserAdmin) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-gray-900 font-medium">
              You don't have permission to manage team members
            </p>
            <p className="text-gray-600 text-sm">
              Only project admins can access this page
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout projectName={project?.name} boardName="Team Members">
      <div className="h-full flex flex-col overflow-hidden bg-gray-50">
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage who has access to this project
              </p>
            </div>
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Member
            </button>
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
              <ProjectUserList
                users={projectUsers}
                currentUserRole={currentUserRole?.role_name || null}
                onEditRole={handleEditRoleClick}
                onRemoveUser={handleRemoveUserClick}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>

      <AddProjectUserModal
        isOpen={isAddUserModalOpen}
        projectId={projectIdNum}
        onClose={() => setIsAddUserModalOpen(false)}
        onSuccess={handleAddUserSuccess}
        existingUserIds={projectUsers.map((u) => u.user_id)}
      />

      <ProjectUserRoleModal
        isOpen={isEditRoleModalOpen}
        user={selectedUser}
        projectId={projectIdNum}
        onClose={() => {
          setIsEditRoleModalOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={handleEditRoleSuccess}
        isLastAdmin={isLastAdmin}
      />

      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Remove Team Member?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <strong>{confirmDialog.userName}</strong> from this project? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog({ isOpen: false, userId: null, userName: '' })}
                disabled={removeLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                disabled={removeLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {removeLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {removeLoading ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
