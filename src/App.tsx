import { AdminList } from './component/AdminList'

export default function App() {
  return (
    <main className="min-h-screen bg-slate-100 p-4 text-center md:p-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-slate-900 text-4xl">Admin Dashboard</h1>
        <p className="text-slate-600 text-lg">
          Manage users and their wallets in one place.
        </p>
        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Users & Wallets
          </h2>
          <AdminList />
        </section>
      </div>
    </main>
  )
}
