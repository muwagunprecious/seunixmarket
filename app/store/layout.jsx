import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Seunix Marketplace. - Store Dashboard",
    description: "Seunix Marketplace. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
