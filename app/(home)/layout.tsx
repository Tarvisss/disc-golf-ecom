// Importing the Footer component from your components folder
import Footer from "@/components/footer";

// Importing the Header component from the shared components folder
import Header from "@/components/shared";

// Exporting the HomeLayout component as the default export
// This is an *async server component* in Next.js 13+ (using the App Router)
// It acts as a layout/wrapper for pages
export default async function HomeLayout({
    children, // children represent whatever content gets passed inside this layout
}: {
    children?: React.ReactNode // Explicitly typing "children" as a React Node. This tells Typecript children can be anything. Arrays, text, etc.
}) {
    return (
        // Parent container
        // - flex flex-col → makes it a vertical flexbox
        // - min-h-screen → ensures the container is at least the full height of the screen
        <div className="flex flex-col min-h-screen">

            {/* Header component goes at the top of the page */}
            <Header />

            {/* Main content area */}
            {/* - flex-1 → takes up all available vertical space between Header & Footer */}
            {/* - flex flex-col → allows children to stack vertically if needed */}
            <main className="flex-1 flex flex-col">
                {children}
            </main>

            {/* Footer component goes at the bottom of the page */}
            <Footer />
        </div>
    )
}
