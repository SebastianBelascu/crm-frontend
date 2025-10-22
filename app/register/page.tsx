import { RegisterForm } from "@/components/register/register-form"

export default function Register() {
    return <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-8">
            <RegisterForm />
        </div>
    </div>
}