import { useAuth } from "@/store/auth";
import { logoutUser } from "@/api/auth";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const { refreshToken, clearAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            if (refreshToken) {
                await logoutUser(refreshToken);
            }
        } catch (err) {
            console.error("Error during logout:", err);
        } finally {
            clearAuth(); 
            localStorage.removeItem("auth-storage"); 
            navigate("/login"); // Redirige
        }
    };

    return handleLogout;
};
