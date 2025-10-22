import { LoginForm } from "@/components/login/login-form"

export default function Login() {
    return <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-8">
            <LoginForm />
        </div>
    </div>
}