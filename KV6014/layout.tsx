import "./globals.css";
import Providers from "./providers";
import type { ReactNode } from "react";

export const metadata = {
    title: "Elderly Skill Sharing",
    description: "KV6014 group project prototype",
};

type RootLayoutProps = {
    children: ReactNode;
};

export default function RootLayout(props: RootLayoutProps) {
    return (
        <html lang="en">
            <body>
                <Providers>{props.children}</Providers>
            </body>
        </html>
    );
}
