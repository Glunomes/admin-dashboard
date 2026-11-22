import { AdminList } from "./component/AdminList";

export default function App() {
  return (
    <main className="min-h-screen text-center bg-slate-50 p-4 md:p-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-slate-900 text-4xl">Admin Dashboard</h1>
        <p className="text-slate-600 text-lg">Manage users and their wallets in one place.</p>
        <section className="p-4 md:p-6 mt-8 bg-amber-50 rounded-md border border-slate-500">
          <h2>Users & Wallets</h2>
          <AdminList/>
        </section>
      </div>
    </main>
  )
}
