import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Seunix Marketplace. - Admin",
    description: "Seunix Marketplace. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
