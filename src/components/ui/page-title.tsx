"use client";

import { useEffect } from "react";

interface PageTitleProps {
    title: string;
}

/**
 * Component to handle browser tab titles across SIAKAD-Skripsi.
 * Automatically appends the site name suffix.
 */
export function PageTitle({ title }: PageTitleProps) {
    useEffect(() => {
        const fullTitle = `${title} | SIAKAD-Skripsi`;
        document.title = fullTitle;
    }, [title]);

    return null;
}
