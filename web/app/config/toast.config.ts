export const toastConfig = {
    position: "top-center" as const,
    reverseOrder: false,
    gutter: 12,
    toastOptions: {
        duration: 4000,
        style: {
            background: "white",
            color: "black",
            padding: "14px 18px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow:
                "0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.1)",
        },
        success: {
            style: {
                borderLeft: "4px solid oklch(60.9% 0.126 221.723)",
            },
            iconTheme: {
                primary: "oklch(60.9% 0.126 221.723)",
                secondary: "white",
            },
        },
        error: {
            style: {
                borderLeft: "4px solid #ef4444",
            },
            iconTheme: {
                primary: "#ef4444",
                secondary: "white",
            },
        },
        loading: {
            style: {
                borderLeft: "4px solid oklch(60.9% 0.126 221.723)",
            },
        },
    },
};
