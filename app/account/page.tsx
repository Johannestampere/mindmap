import { JSX } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default function AccountPage(): JSX.Element {
    const supabase = createClient()

    return (
        <div>
            Account info
        </div>
    )
}
