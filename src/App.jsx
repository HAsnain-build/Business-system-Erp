import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { Topbar } from './components/layout/Topbar.jsx';
import { INITIAL_MONTHLY_METRICS } from './data/initialData.js';
import { authService } from './services/authService.js';
import { workspaceApi } from './services/workspaceApi.js';

// ✅ Lazy pages
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage.jsx').then((m) => ({ default: m.DashboardPage }))
);
const ReportsPage = lazy(() =>
  import('./pages/ReportsPage.jsx').then((m) => ({ default: m.ReportsPage }))
);
const OrdersPage = lazy(() =>
  import('./pages/OrdersPage.jsx').then((m) => ({ default: m.OrdersPage }))
);
const StockPage = lazy(() =>
  import('./pages/StockPage.jsx').then((m) => ({ default: m.StockPage }))
);
const StaffPage = lazy(() =>
  import('./pages/StaffPage.jsx').then((m) => ({ default: m.StaffPage }))
);
const CustomersPage = lazy(() =>
  import('./pages/CustomersPage.jsx').then((m) => ({ default: m.CustomersPage }))
);
const InvoicesPage = lazy(() =>
  import('./pages/InvoicesPage.jsx').then((m) => ({ default: m.InvoicesPage }))
);
const CostPage = lazy(() =>
  import('./pages/CostPage.jsx').then((m) => ({ default: m.CostPage }))
);
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage.jsx').then((m) => ({ default: m.ProfilePage }))
);
const AuthPage = lazy(() =>
  import('./pages/AuthPage.jsx').then((m) => ({ default: m.AuthPage }))
);

const EMPTY_ARRAY = [];

// ✅ URL path se page meta
const PAGE_META = {
  '/dashboard': {
    key: 'dashboard',
    title: 'Dashboard',
    subtitle: 'Daily summary of sales, orders, staff, and total cost',
  },
  '/reports': {
    key: 'reports',
    title: 'Reports',
    subtitle: 'Monthly sales, profit, and goal progress',
  },
  '/orders': {
    key: 'orders',
    title: 'Orders',
    subtitle: 'Manage customer orders, due dates, and completion status',
  },
  '/stock': {
    key: 'stock',
    title: 'Stock',
    subtitle: 'Track product quantities and low stock items',
  },
  '/staff': {
    key: 'staff',
    title: 'Staff',
    subtitle: 'Manage staff members, job roles, and work status',
  },
  '/customers': {
    key: 'customers',
    title: 'Customers',
    subtitle: 'View customer accounts and total billing',
  },
  '/invoices': {
    key: 'invoices',
    title: 'Invoices',
    subtitle: 'Create customer bills and track paid or unpaid invoices',
  },
  '/cost': {
    key: 'cost',
    title: 'Total Cost',
    subtitle: 'Track salaries, delivery, office rent, and total business cost',
  },
  '/profile': {
    key: 'profile',
    title: 'Profile',
    subtitle: 'Manage your account details and sign out',
  },
};

function useDebouncedEffect(effect, deps, delay = 400) {
  useEffect(() => {
    const id = setTimeout(effect, delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-live="polite">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-[12px] bg-[#E6F2FB]" />
        ))}
      </div>
      <div className="h-72 rounded-[12px] bg-[#E6F2FB]" />
      <div className="h-64 rounded-[12px] bg-[#E6F2FB]" />
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState(() => authService.getSession());
  const [searchQuery, setSearchQuery] = useState('');

  const [orders, setOrders] = useState(() => workspaceApi.getOrders());
  const [stock, setStock] = useState(() => workspaceApi.getStock());
  const [staff, setStaff] = useState(() => workspaceApi.getStaff());
  const [customers, setCustomers] = useState(() => workspaceApi.getCustomers());
  const [invoices, setInvoices] = useState(() => workspaceApi.getInvoices());
  const [costs, setCosts] = useState(() => workspaceApi.getCosts());
  const [notifications, setNotifications] = useState(() =>
    workspaceApi.getNotifications()
  );

  // ✅ navigateTo — React Router ka navigate
  const navigateTo = useCallback(
    (page) => {
      const path = page.startsWith('/') ? page : `/${page}`;
      navigate(PAGE_META[path] ? path : '/dashboard');
    },
    [navigate]
  );

  // ✅ Debounced saves
  useDebouncedEffect(() => workspaceApi.saveOrders(orders), [orders]);
  useDebouncedEffect(() => workspaceApi.saveStock(stock), [stock]);
  useDebouncedEffect(() => workspaceApi.saveStaff(staff), [staff]);
  useDebouncedEffect(() => workspaceApi.saveCustomers(customers), [customers]);
  useDebouncedEffect(() => workspaceApi.saveInvoices(invoices), [invoices]);
  useDebouncedEffect(() => workspaceApi.saveCosts(costs), [costs]);
  useDebouncedEffect(
    () => workspaceApi.saveNotifications(notifications),
    [notifications]
  );

  // ✅ document.title — URL ke hisaab se
  useEffect(() => {
    const meta = PAGE_META[location.pathname] || PAGE_META['/dashboard'];
    document.title = session ? `${meta.title} – Clearline` : 'Sign In – Clearline';
  }, [location.pathname, session]);

  // ✅ Search — khali query par same reference
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return EMPTY_ARRAY;

    const results = [];
    for (const o of orders) {
      if (
        o.id.toLowerCase().includes(q) ||
        o.title.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q)
      ) {
        results.push({
          id: o.id,
          label: `${o.id} — ${o.title}`,
          sublabel: o.customer,
          targetPage: '/orders',
        });
      }
    }
    for (const inv of invoices) {
      if (
        inv.id.toLowerCase().includes(q) ||
        inv.customer.toLowerCase().includes(q)
      ) {
        results.push({
          id: inv.id,
          label: `${inv.id} — ${inv.customer}`,
          sublabel: `Invoice · ${inv.status}`,
          targetPage: '/invoices',
        });
      }
    }
    for (const item of stock) {
      if (
        item.sku.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q)
      ) {
        results.push({
          id: item.id,
          label: `${item.sku} — ${item.name}`,
          sublabel: `${item.stock} in stock · ${item.status}`,
          targetPage: '/stock',
        });
      }
    }
    for (const m of staff) {
      if (
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
      ) {
        results.push({
          id: m.id,
          label: m.name,
          sublabel: `${m.role} · ${m.department}`,
          targetPage: '/staff',
        });
      }
    }
    for (const c of customers) {
      if (
        c.company.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q)
      ) {
        results.push({
          id: c.id,
          label: c.company,
          sublabel: `${c.contactName} · ${c.plan}`,
          targetPage: '/customers',
        });
      }
    }
    return results;
  }, [searchQuery, orders, invoices, stock, staff, customers]);

  const handleAuthenticated = useCallback(
    (newSession, isNewAccount) => {
      setSession(newSession);
      navigate('/dashboard', { replace: true });
      if (isNewAccount) {
        const profile = newSession.profile;
        setStaff((prev) => {
          const exists = prev.some(
            (m) => m.email.toLowerCase() === profile.email.toLowerCase()
          );
          if (exists) return prev;
          return [
            {
              id: `STF-${crypto.randomUUID().slice(0, 8)}`,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              department: profile.department || 'Operations',
              activeTasks: 0,
              status: 'Active',
            },
            ...prev,
          ];
        });
      }
    },
    [navigate]
  );

  const handleSaveUser = useCallback((updated) => {
    const previousEmail = updated.email.toLowerCase();
    authService.updateActiveProfile(updated);
    setSession((prev) =>
      prev ? { ...prev, email: updated.email, profile: updated } : prev
    );
    setStaff((prev) =>
      prev.map((m) =>
        m.email.toLowerCase() === previousEmail
          ? {
              ...m,
              name: updated.name,
              email: updated.email,
              role: updated.role,
            }
          : m
      )
    );
  }, []);

  const handleLogout = useCallback(() => {
    authService.signOut();
    setSession(null);
    setSearchQuery('');
    navigate('/login', { replace: true });
  }, [navigate]);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleSelectNotification = useCallback(
    (item) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
      );
      navigateTo(item.targetPage);
    },
    [navigateTo]
  );

  // ✅ AuthPage — login ke liye alag route
  if (!session) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route
            path="/login"
            element={<AuthPage onAuthenticated={handleAuthenticated} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    );
  }

  const user = session.profile;
  const currentMeta =
    PAGE_META[location.pathname] || PAGE_META['/dashboard'];

  return (
    <div className="min-h-screen bg-[#F2F8FD] text-[#1F2937] flex">
      <Sidebar
        activePage={currentMeta.key}
        onNavigate={navigateTo}
        user={user}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          pageTitle={currentMeta.title}
          pageSubtitle={currentMeta.subtitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchResults={searchResults}
          onSelectSearchResult={(entry) => navigateTo(entry.targetPage)}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onSelectNotification={handleSelectNotification}
          user={user}
          onOpenProfile={() => navigateTo('/profile')}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <DashboardPage
                    metrics={INITIAL_MONTHLY_METRICS}
                    orders={orders}
                    invoices={invoices}
                    costs={costs}
                    staff={staff}
                    onNavigate={navigateTo}
                  />
                }
              />
              <Route
                path="/reports"
                element={<ReportsPage metrics={INITIAL_MONTHLY_METRICS} />}
              />
              <Route
                path="/orders"
                element={
                  <OrdersPage
                    orders={orders}
                    searchFilter={searchQuery}
                    currentUserName={user.name}
                    onAddOrder={(newOrder) =>
                      setOrders((prev) => [
                        {
                          ...newOrder,
                          id: `ORD-${crypto.randomUUID().slice(0, 8)}`,
                        },
                        ...prev,
                      ])
                    }
                    onUpdateStatus={(id, status) =>
                      setOrders((prev) =>
                        prev.map((o) =>
                          o.id === id ? { ...o, status } : o
                        )
                      )
                    }
                    onDeleteOrder={(id) =>
                      setOrders((prev) => prev.filter((o) => o.id !== id))
                    }
                  />
                }
              />
              <Route
                path="/stock"
                element={
                  <StockPage
                    items={stock}
                    searchFilter={searchQuery}
                    onAddItem={(item) => {
                      const status =
                        item.stock < item.reorderLevel * 0.7
                          ? 'Low Stock'
                          : item.stock <= item.reorderLevel
                            ? 'Reorder'
                            : 'In Stock';
                      setStock((prev) => [
                        {
                          ...item,
                          id: `STK-${crypto.randomUUID().slice(0, 8)}`,
                          status,
                        },
                        ...prev,
                      ]);
                    }}
                    onRestockItem={(id, delta) =>
                      setStock((prev) =>
                        prev.map((item) => {
                          if (item.id !== id) return item;
                          const updatedStock = item.stock + delta;
                          const status =
                            updatedStock < item.reorderLevel * 0.7
                              ? 'Low Stock'
                              : updatedStock <= item.reorderLevel
                                ? 'Reorder'
                                : 'In Stock';
                          return { ...item, stock: updatedStock, status };
                        })
                      )
                    }
                    onDeleteItem={(id) =>
                      setStock((prev) => prev.filter((item) => item.id !== id))
                    }
                  />
                }
              />
              <Route
                path="/staff"
                element={
                  <StaffPage
                    members={staff}
                    searchFilter={searchQuery}
                    onAddMember={(member) =>
                      setStaff((prev) => [
                        {
                          ...member,
                          id: `STF-${crypto.randomUUID().slice(0, 8)}`,
                        },
                        ...prev,
                      ])
                    }
                    onToggleStatus={(id) =>
                      setStaff((prev) =>
                        prev.map((m) =>
                          m.id === id
                            ? {
                                ...m,
                                status:
                                  m.status === 'Active' ? 'On Leave' : 'Active',
                              }
                            : m
                        )
                      )
                    }
                    onDeleteMember={(id) =>
                      setStaff((prev) => prev.filter((m) => m.id !== id))
                    }
                  />
                }
              />
              <Route
                path="/customers"
                element={
                  <CustomersPage
                    customers={customers}
                    searchFilter={searchQuery}
                    onAddCustomer={(customer) =>
                      setCustomers((prev) => [
                        {
                          ...customer,
                          id: `CUS-${crypto.randomUUID().slice(0, 8)}`,
                        },
                        ...prev,
                      ])
                    }
                    onDeleteCustomer={(id) =>
                      setCustomers((prev) => prev.filter((c) => c.id !== id))
                    }
                  />
                }
              />
              <Route
                path="/invoices"
                element={
                  <InvoicesPage
                    invoices={invoices}
                    searchFilter={searchQuery}
                    onAddInvoice={(inv) =>
                      setInvoices((prev) => [
                        {
                          ...inv,
                          id: `INV-${crypto.randomUUID().slice(0, 8)}`,
                        },
                        ...prev,
                      ])
                    }
                    onMarkPaid={(id) =>
                      setInvoices((prev) =>
                        prev.map((inv) =>
                          inv.id === id ? { ...inv, status: 'Paid' } : inv
                        )
                      )
                    }
                    onDeleteInvoice={(id) =>
                      setInvoices((prev) =>
                        prev.filter((inv) => inv.id !== id)
                      )
                    }
                  />
                }
              />
              <Route
                path="/cost"
                element={
                  <CostPage
                    costs={costs}
                    searchFilter={searchQuery}
                    onAddCost={(costItem) =>
                      setCosts((prev) => [
                        {
                          ...costItem,
                          id: `CST-${crypto.randomUUID().slice(0, 8)}`,
                        },
                        ...prev,
                      ])
                    }
                    onMarkPaid={(id) =>
                      setCosts((prev) =>
                        prev.map((costItem) =>
                          costItem.id === id
                            ? { ...costItem, status: 'Paid' }
                            : costItem
                        )
                      )
                    }
                    onDeleteCost={(id) =>
                      setCosts((prev) =>
                        prev.filter((costItem) => costItem.id !== id)
                      )
                    }
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProfilePage
                    user={user}
                    onSaveUser={handleSaveUser}
                    onLogout={handleLogout}
                  />
                }
              />
              {/* ✅ Default: / → /dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}