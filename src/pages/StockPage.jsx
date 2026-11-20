import React, { useState } from 'react';
import { PackagePlus, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { StatusPill } from '../components/ui/StatusPill.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { InputField, SelectField } from '../components/ui/FormField.jsx';
import { formatCurrency, formatNumber } from '../utils/formatters.js';

export function StockPage({
  items,
  searchFilter,
  onAddItem,
  onRestockItem,
  onDeleteItem,
}) {
  const [filter, setFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [stock, setStock] = useState('50');
  const [reorderLevel, setReorderLevel] = useState('25');
  const [unitCost, setUnitCost] = useState('45');

  const filtered = items.filter((item) => {
    const matchesFilter = filter === 'All' || item.status === filter;
    const q = searchFilter.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.sku.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sku.trim() || !name.trim()) return;
    onAddItem({
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      category,
      stock: Math.max(0, Number(stock) || 0),
      reorderLevel: Math.max(1, Number(reorderLevel) || 10),
      unitCost: Math.max(0, Number(unitCost) || 0),
    });
    setSku('');
    setName('');
    setStock('50');
    setModalOpen(false);
  };

  const columns = [
    {
      key: 'sku',
      header: 'Item Code',
      sortable: true,
      sortValue: (row) => row.sku,
      render: (row) => (
        <span className="font-semibold text-[#145E96] tabular-nums">{row.sku}</span>
      ),
    },
    {
      key: 'name',
      header: 'Product Name',
      sortable: true,
      sortValue: (row) => row.name,
      render: (row) => (
        <div>
          <p className="font-medium text-[#1F2937]">{row.name}</p>
          <p className="text-[13px] text-[#5B6B7C]">{row.category}</p>
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'In Stock',
      align: 'right',
      sortable: true,
      sortValue: (row) => row.stock,
      render: (row) => (
        <span className="font-semibold text-[#1F2937]">{formatNumber(row.stock)}</span>
      ),
    },
    {
      key: 'reorderLevel',
      header: 'Minimum Level',
      align: 'right',
      render: (row) => <span className="text-[#5B6B7C]">{formatNumber(row.reorderLevel)}</span>,
    },
    {
      key: 'unitCost',
      header: 'Item Cost',
      align: 'right',
      sortable: true,
      sortValue: (row) => row.unitCost,
      render: (row) => <span>{formatCurrency(row.unitCost)}</span>,
    },
    {
      key: 'status',
      header: 'Stock Status',
      render: (row) => <StatusPill label={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="inline-flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onRestockItem(row.id, 25)}
            aria-label={`Add 25 units of ${row.name}`}
          >
            <PackagePlus className="w-4 h-4" />
            <span>+25 Stock</span>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDeleteItem(row.id)}
            aria-label={`Delete ${row.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'In Stock', 'Reorder', 'Low Stock'].map((tab) => {
            const active = filter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-2 rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1C7AC0] text-[#FFFFFF]'
                    : 'bg-[#FFFFFF] text-[#5B6B7C] border border-[#D6E6F2] hover:bg-[#E6F2FB] hover:text-[#145E96]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>Add Stock Item</span>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        emptyTitle="No stock items found"
        emptyDescription="Add a product item or change the status filter."
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Stock Item"
        subtitle="Enter product details and starting stock quantity."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              id="inv-sku"
              label="Item Code"
              required
              placeholder="SKU-902"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            <SelectField
              id="inv-category"
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'Hardware', label: 'Hardware' },
                { value: 'Packaging', label: 'Packaging' },
                { value: 'Supplies', label: 'Supplies' },
              ]}
            />
          </div>
          <InputField
            id="inv-name"
            label="Product Name"
            required
            placeholder="e.g. Wireless Barcode Reader"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              id="inv-stock"
              label="Quantity"
              type="number"
              min="0"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <InputField
              id="inv-reorder"
              label="Minimum Level"
              type="number"
              min="1"
              required
              value={reorderLevel}
              onChange={(e) => setReorderLevel(e.target.value)}
            />
            <InputField
              id="inv-cost"
              label="Item Cost (USD)"
              type="number"
              min="0"
              required
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D6E6F2]">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Item
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
