import { Poppins } from "next/font/google"
import './globals.css'
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
export default function LoginLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="bg-[#E0F7FE]" >
                {children}
            </body>
        </html >
    )
}