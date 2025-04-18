import { ApplicationForm } from "@/views";



export default function ApplicationFormLayout() {
    return (
        <div className="w-full min-h-[100svh] max-lg:flex-col  max-lg:justify-start  min-lg:flex justify-center items-center">
            <ApplicationForm />
        </div>
    )
}