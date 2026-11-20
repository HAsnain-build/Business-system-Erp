import {
  INITIAL_COSTS,
  INITIAL_CUSTOMERS,
  INITIAL_INVOICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
  INITIAL_STAFF,
  INITIAL_STOCK,
} from '../data/initialData.js';

const STORAGE_KEYS = {
  orders: 'clearline_orders_v3',
  stock: 'clearline_stock_v3',
  staff: 'clearline_staff_v3',
  customers: 'clearline_customers_v3',
  invoices: 'clearline_invoices_v3',
  costs: 'clearline_costs_v3',
  notifications: 'clearline_notifications_v3',
};

const scheduleSave =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? window.requestIdleCallback
    : (fn) => setTimeout(fn, 0);

function loadCollection(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function saveCollection(key, items) {
  scheduleSave(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  });
}

export const workspaceApi = {
  getOrders: () => loadCollection(STORAGE_KEYS.orders, INITIAL_ORDERS),
  saveOrders: (items) => saveCollection(STORAGE_KEYS.orders, items),

  getStock: () => loadCollection(STORAGE_KEYS.stock, INITIAL_STOCK),
  saveStock: (items) => saveCollection(STORAGE_KEYS.stock, items),

  getStaff: () => loadCollection(STORAGE_KEYS.staff, INITIAL_STAFF),
  saveStaff: (items) => saveCollection(STORAGE_KEYS.staff, items),

  getCustomers: () => loadCollection(STORAGE_KEYS.customers, INITIAL_CUSTOMERS),
  saveCustomers: (items) => saveCollection(STORAGE_KEYS.customers, items),

  getInvoices: () => loadCollection(STORAGE_KEYS.invoices, INITIAL_INVOICES),
  saveInvoices: (items) => saveCollection(STORAGE_KEYS.invoices, items),

  getCosts: () => loadCollection(STORAGE_KEYS.costs, INITIAL_COSTS),
  saveCosts: (items) => saveCollection(STORAGE_KEYS.costs, items),

  getNotifications: () =>
    loadCollection(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS),
  saveNotifications: (items) =>
    saveCollection(STORAGE_KEYS.notifications, items),

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore
      }
    });
  },
};