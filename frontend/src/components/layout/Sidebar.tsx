import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getProjectsByBusiness } from "@/api/projects";
import type { Project } from "@/api/projects";
import { useAuth } from "@/store/auth";

interface SidebarProps {
	projects?: Project[];
	activeProject?: string;
	onProjectSelect?: (projectId: string) => void;
	onNewProject?: () => void;
	onManageColumns?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onProjectSelect, onManageColumns }) => {
	const [isProjectsOpen, setIsProjectsOpen] = useState(true);
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
	const navigate = useNavigate();
	const location = useLocation();
	const businessId = useAuth((state) => state.businessId());

	// Determinar qué item está activo basado en la ruta actual
	const getIsActive = (name: string): boolean => {
		const path = location.pathname;
		
		switch (name) {
			case "Dashboard":
				return path === "/app";
			case "Projects":
				return path === "/app" || path.includes("/app/projects");
			case "Team":
				return path === "/app/team";
			case "Calendar":
				return path === "/app/calendar";
			case "Reports":
				return path === "/app/reports";
			case "Gestionar Columnas":
				// Este es un modal, no una ruta
				return false;
			default:
				return false;
		}
	};

	useEffect(() => {
		let isMounted = true;
		const fetchProjects = async () => {
			try {
				if (!businessId) {
					return;
				}
				const data = await getProjectsByBusiness(businessId.toString());
				if (isMounted) setProjects(data);
			} catch (err) {
				console.error("Error fetching projects:", err);
			}
		};
		fetchProjects();
		return () => {
			isMounted = false;
		};
	}, [businessId]);

	const navigationItems: Array<{
		name: string;
		icon: React.ReactNode;
		onClick?: () => void;
	}> = [
		{
			name: "Dashboard",
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H10a2 2 0 01-2-2V5z"
					/>
				</svg>
			),
			onClick: () => navigate("/app"),
		},
		{
			name: "Projects",
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
					/>
				</svg>
			),
			onClick: () => navigate("/app"),
		},
		{
			name: "Team",
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
					/>
				</svg>
			),
			onClick: () => navigate("/app/team"),
		},
		{
			name: "Calendar",
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			),
			onClick: () => navigate("/app/calendar"),
		},
		{
			name: "Reports",
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					/>
				</svg>
			),
			onClick: () => navigate("/app/reports"),
		},
    {
			name: "Gestionar Columnas",
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M7 16V4m0 0L3 8m4-4l4 4m6-4v12m0 0l4-4m-4 4l-4-4"
					/>
				</svg>
			),
			onClick: () => onManageColumns?.(),
		},
	];

	return (
		<div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
			<nav className="flex-1 px-4 py-6 space-y-2">
			{navigationItems.map((item, index) => (
				<button
					key={index}
					onClick={() => item.onClick?.()}
					className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
						getIsActive(item.name)
							? "bg-blue-50 text-blue-700 border-l-4 border-blue-700 pl-2"
							: "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
					}`}
				>
					<span
						className={
							getIsActive(item.name)
								? "text-blue-700"
								: "text-gray-400 group-hover:text-gray-500"
						}
					>
						{item.icon}
					</span>
					<span className="ml-3">{item.name}</span>
				</button>
			))}				<div className="pt-6">
					<button
						onClick={() => setIsProjectsOpen(!isProjectsOpen)}
						className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
					>
						<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
							PROJECTS
						</span>
						<svg
							className={`w-4 h-4 text-gray-400 transform transition-transform ${
								isProjectsOpen ? "rotate-180" : ""
							}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					{isProjectsOpen && (
						<div className="mt-2 space-y-1">
							<button
								onClick={() => navigate("/app/projects/new")}
								className="w-full flex items-center px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors"
							>
								<svg
									className="w-4 h-4 mr-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
								<span>New project</span>
							</button>

							{projects.map((project) => (
								<button
									key={project.id}
									onClick={() => {
										setSelectedProjectId(project.id);
										onProjectSelect?.(project.id);
									}}
									className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
										selectedProjectId === project.id
											? "bg-blue-50 text-blue-700 border-l-4 border-blue-700 pl-2"
											: "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
									}`}
								>
									<div
										className={`w-2 h-2 rounded-full ${
											selectedProjectId === project.id ? "bg-blue-500" : "bg-green-500"
										} mr-3`}
									></div>
									<span className="truncate">{project.name}</span>
								</button>
							))}
						</div>
					)}
				</div>
			</nav>

			<div className="border-t border-gray-200 p-4">
				<button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
					<svg
						className="w-5 h-5 text-gray-400 mr-3"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					Settings
				</button>
			</div>
		</div>
	);
};
