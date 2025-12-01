import { KanbanBoard, type KanbanBoardRef } from "./components/kanban/KanbanBoard";
import { ManageColumnsModal } from "./components/kanban/ManageColumnsModal";
import { CalendarComponent } from "./components/calendar/Calendar";
import { Dashboard } from "./components/dashboard/Dashboard";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useRef } from "react";
import SignIn from "./components/auth/SingIn";
import SignUp from "./components/auth/SingUp";
import { BusinessSignup } from "./components/auth/BusinessSignup";
import { Layout } from "./components/layout/Layout";
import { CreateProjectPage } from "./components/projects/CreateProjectPage";
import { ProjectUsers } from "./components/projects/ProjectUsers";
import { TeamManagement } from "./components/team/TeamManagement";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuth } from "./store/auth";

function App() {
	const kanbanBoardRef = useRef<KanbanBoardRef>(null);
	const [isManageColumnsOpen, setIsManageColumnsOpen] = useState(false);
	const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
	const isAuthenticated = useAuth((state) => state.isAuthenticated());

	const handleManageColumns = () => {
		setIsManageColumnsOpen(true);
	};

	const handleManageColumnsClose = () => {
		setIsManageColumnsOpen(false);
	};

	const handleNewTask = () => {
		kanbanBoardRef.current?.openNewTaskModal();
	};

	const handleProjectSelect = (projectId: string) => {
		setSelectedProjectId(Number(projectId));
	};

	return (
		<>
			{/* Solo renderizar ManageColumnsModal si está autenticado */}
			{isAuthenticated && (
				<ManageColumnsModal 
					isOpen={isManageColumnsOpen}
					onClose={handleManageColumnsClose}
				/>
			)}
			<Routes>
			<Route path="/" element={<Navigate to="/login" replace />} />
			<Route path="/login" element={<SignIn />} />
			<Route path="/signup" element={<SignUp />} />
			<Route path="/register" element={<SignUp />} />
			<Route path="/business-signup" element={<BusinessSignup />} />

			<Route 
				key={`/app-${isManageColumnsOpen}`}
				path="/app" 
				element={
					<Layout 
						onNewTask={handleNewTask}
						onManageColumns={handleManageColumns}
						onProjectSelect={handleProjectSelect}
					>
						<KanbanBoard ref={kanbanBoardRef} className="flex-1" projectId={selectedProjectId || undefined} />
					</Layout>
				}
			/>

			<Route 
				path="/app/calendar" 
				element={
					<Layout 
						onProjectSelect={handleProjectSelect}
					>
						<CalendarComponent projectId={selectedProjectId || undefined} />
					</Layout>
				}
			/>

			<Route 
				path="/app/reports" 
				element={
					<Layout 
						onProjectSelect={handleProjectSelect}
					>
						<Dashboard />
					</Layout>
				}
			/>

			<Route path="/app/projects/new" element={
				<Layout>
					<CreateProjectPage />
				</Layout>
			} />

			<Route path="/app/projects/:projectId/users" element={
				<ProtectedRoute requiredRole={1}>
					<ProjectUsers />
				</ProtectedRoute>
			} />

			<Route path="/app/team" element={
				<ProtectedRoute requiredRole={1}>
					<TeamManagement />
				</ProtectedRoute>
			} />
		</Routes>
		</>
	);
}

export default App;
