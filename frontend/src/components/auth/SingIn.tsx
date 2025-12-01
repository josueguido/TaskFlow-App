import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userAuthService } from "@/services/authService";
import { useState, useCallback } from "react";

const schema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .min(5, "Email must be at least 5 characters")
        .max(255, "Email must be at most 255 characters"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(128, "Password must be at most 128 characters")
});

type LoginForm = z.infer<typeof schema>;

export default function SignIn() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const setAuth = useAuth((state) => state.setAuth);
    const rehydrated = useAuth((state) => state.rehydrated);
    const navigate = useNavigate();
    const location = useLocation();

    const successMessage = location.state?.message;
    const prefillEmail = location.state?.email;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({ 
        resolver: zodResolver(schema), 
        mode: "onBlur",
        defaultValues: {
            email: prefillEmail || ""
        }
    });

    if (!rehydrated)
        return <div className="text-white">Loading session...</div>;

    const onSubmit = useCallback(async (data: LoginForm) => {
        try {
            setLoading(true);
            setError(null);

            const response = await userAuthService.login({
                email: data.email,
                password: data.password
            });

            if (response?.success === false) {
                const errorMessage = response.message || 'Error signing in';
                setError(errorMessage);
                return;
            }

            if (response?.data) {
                const { user, token, refreshToken } = response.data;
                
                const business = {
                    id: user.business_id ?? "",
                    name: "Business" 
                };

                setAuth(token, refreshToken, user, business);
                navigate("/app");
            } else {
                setError('Error signing in. Please try again');
            }
        } catch (err: any) {
            const errorMessage = err?.message || 'Invalid email or password';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [setAuth, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-md p-6">
                <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>TF</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
                <h2 className="text-center text-xl font-semibold text-gray-900">
                    Sign in to TaskFlow
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Welcome back! Sign in to continue
                </p>

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600 text-sm">{successMessage}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                        <div className="flex-1">
                            <p className="text-red-700 text-sm font-medium">Error signing in</p>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mb-4">
                    <hr className="flex-1 border-gray-300" />
                    <span className="mx-4 text-sm text-gray-500">o</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <Mail
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                {...register("email")}
                                id="email"
                                type="email"
                                placeholder="your@example.com"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 ${
                                    errors.email
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            {...register("password")}
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <span>Continue</span>
                                <span>▸</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-3">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Sign up
                        </button>
                    </p>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">or</span>
                        </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                        Want to create a business?{" "}
                        <button
                            onClick={() => navigate('/business-signup')}
                            className="text-green-600 hover:text-green-700 font-medium"
                        >
                            Register company
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}