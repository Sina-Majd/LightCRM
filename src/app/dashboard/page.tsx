import { redirect } from "next/navigation";

/** /dashboard is not a view — send visitors to the default cockpit. */
export default function DashboardIndexPage() {
  redirect("/dashboard/today");
}