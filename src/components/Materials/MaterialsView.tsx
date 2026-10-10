import React, { useState } from 'react';
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingDown,
  Warehouse,
  Edit3,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  X,
  Save,
  Boxes,
  Truck,
  IndianRupee,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { InventoryItem, InventoryCategory } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const MaterialsView: React.FC = () => {
  const db = storage.getDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [stockAdjustItem, setStockAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Shipment received at Hingna depot');
  const [alertFeedback, setAlertFeedback] = useState<string | null>(null);

  // New Item Form State
  const initialNewItem = {
    item: '',
    category: 'Solar Panels' as InventoryCategory,
    brand: '',
    model: '',
    specifications: '',
    unit: 'Nos',
    warehouseStock: 20,
    minAlertStock: 10,
    unitPrice: 12500,
    supplier: 'Waaree Energies Ltd / Nagpur Depot',
    purchaseDate: new Date().toISOString().slice(0, 10),
    reserved: 0,
    dispatched: 0,
    used: 0,
  };
  const [newItemForm, setNewItemForm] = useState(initialNewItem);

  const categories: InventoryCategory[] = [
    'Solar Panels',
    'Inverters',
    'Structure',
    'ACDB',
    'DCDB',
    'AC Cable',
    'DC Cable',
    'MC4 Connectors',
    'Earthing Material',
    'Lightning Protection',
    'Accessories & Hardware',
  ];

  const filteredInventory = db.inventory.filter((item) => {
    const matchesSearch =
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemForm.item || !newItemForm.brand) {
      alert('Please enter Item Name and Brand.');
      return;
    }

    storage.addInventoryItem({
      ...newItemForm,
      warehouseStock: Number(newItemForm.warehouseStock) || 0,
      minAlertStock: Number(newItemForm.minAlertStock) || 5,
      unitPrice: Number(newItemForm.unitPrice) || 0,
      reserved: 0,
      dispatched: 0,
      used: 0,
    });

    setIsAddModalOpen(false);
    setNewItemForm(initialNewItem);
    setAlertFeedback(`Added "${newItemForm.item}" to warehouse inventory!`);
    setTimeout(() => setAlertFeedback(null), 3000);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    storage.updateInventoryItem(editingItem.id, {
      ...editingItem,
      warehouseStock: Number(editingItem.warehouseStock) || 0,
      minAlertStock: Number(editingItem.minAlertStock) || 0,
      unitPrice: Number(editingItem.unitPrice) || 0,
    });

    setAlertFeedback(`Updated "${editingItem.item}" successfully!`);
    setEditingItem(null);
    setTimeout(() => setAlertFeedback(null), 3000);
  };

  const handleDeleteItem = (item: InventoryItem) => {
    if (confirm(`Are you sure you want to remove "${item.item} (${item.brand})" from inventory?`)) {
      storage.deleteInventoryItem(item.id);
      setAlertFeedback(`Removed "${item.item}" from warehouse.`);
      setTimeout(() => setAlertFeedback(null), 3000);
    }
  };

  const handleApplyStockAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAdjustItem) return;

    storage.adjustInventoryStock(stockAdjustItem.id, adjustDelta, adjustReason);
    setAlertFeedback(
      `Adjusted stock for ${stockAdjustItem.item} by ${adjustDelta >= 0 ? '+' : ''}${adjustDelta} ${stockAdjustItem.unit}.`
    );
    setStockAdjustItem(null);
    setTimeout(() => setAlertFeedback(null), 3000);
  };

  const lowStockCount = db.inventory.filter((i) => i.availableStock <= i.minAlertStock).length;
  const totalValue = db.inventory.reduce((sum, i) => sum + i.warehouseStock * (i.unitPrice || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Package className="w-6 h-6 text-amber-400" /> Warehouse Inventory & BoS Materials
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              Nagpur Hingna Depot
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Full management of stock, BoS allocation, adding new items, live stock adjustments & reorder alerts
          </p>
        </div>

        {/* Add Material Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-950/30 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Material / SKU</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {alertFeedback && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-600 rounded-xl text-emerald-200 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{alertFeedback}</span>
          </div>
          <button onClick={() => setAlertFeedback(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-slate-400">Total Catalog Items</div>
          <div className="text-lg font-bold text-white mt-1">{db.inventory.length} SKUs</div>
          <div className="text-[10px] text-slate-500">ALMM & DCR Compliant</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-slate-400">Total Stock Valuation</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">{formatCurrency(totalValue)}</div>
          <div className="text-[10px] text-slate-500">Depot asset value</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-slate-400">Active Allocations</div>
          <div className="text-lg font-bold text-amber-400 mt-1">
            {db.projectMaterials.length} Assigned Items
          </div>
          <div className="text-[10px] text-slate-500">Reserved for Nagpur sites</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-slate-400">Low Stock Reorder Alerts</div>
          <div className={`text-lg font-bold mt-1 ${lowStockCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {lowStockCount} Items Low
          </div>
          <div className="text-[10px] text-rose-500">Below minimum safety threshold</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search material by name, brand (Waaree, Polycab), model, specifications, supplier..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Categories ({db.inventory.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table with Edit & Remove Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Material & Category</th>
                <th className="py-3 px-4">Brand & Model</th>
                <th className="py-3 px-4 text-center">Warehouse Stock</th>
                <th className="py-3 px-4 text-center">Reserved</th>
                <th className="py-3 px-4 text-center">Available Stock</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    No matching materials found. Click "Add New Material / SKU" to add items.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.availableStock <= item.minAlertStock;
                  return (
                    <tr key={item.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-xs">{item.item}</div>
                        <div className="text-[10px] text-amber-400 font-medium mt-0.5">
                          {item.category}
                        </div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{item.specifications}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        <div>{item.brand}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.model}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                        {item.warehouseStock} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-amber-400 font-bold">
                        {item.reserved} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span
                          className={`font-bold px-2.5 py-1 rounded-full text-xs ${
                            isLow
                              ? 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}
                        >
                          {item.availableStock} {item.unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        <div>{item.supplier}</div>
                        <div className="text-[10px] text-slate-500">Purchased: {formatDate(item.purchaseDate)}</div>
                      </td>
                      {/* Actions: Edit, Quick Stock Adjust, Delete */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Stock Adjust button */}
                          <button
                            onClick={() => {
                              setStockAdjustItem(item);
                              setAdjustDelta(10);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg transition-colors border border-slate-700"
                            title="Adjust / Receive Stock"
                          >
                            <Boxes className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => setEditingItem({ ...item })}
                            className="p-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-lg transition-colors border border-slate-700"
                            title="Edit Material Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 rounded-lg transition-colors border border-slate-700"
                            title="Remove Material from Inventory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW MATERIAL ITEM */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl text-xs">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 border-b border-slate-800 pb-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Add New Material to Warehouse</h3>
                <p className="text-[11px] text-slate-400">
                  Track panels, inverters, structures, cables, earthing & accessories
                </p>
              </div>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Item / Material Name *</label>
                  <input
                    type="text"
                    required
                    value={newItemForm.item}
                    onChange={(e) => setNewItemForm({ ...newItemForm, item: e.target.value })}
                    placeholder="e.g. Waaree 550W Mono PERC DCR Panel"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={newItemForm.category}
                    onChange={(e) =>
                      setNewItemForm({ ...newItemForm, category: e.target.value as InventoryCategory })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={newItemForm.brand}
                    onChange={(e) => setNewItemForm({ ...newItemForm, brand: e.target.value })}
                    placeholder="e.g. Waaree, Polycab, Adani, Schneider"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Model / Part Number</label>
                  <input
                    type="text"
                    value={newItemForm.model}
                    onChange={(e) => setNewItemForm({ ...newItemForm, model: e.target.value })}
                    placeholder="e.g. WS-550-DCR / PS-GT-3.3K"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Technical Specifications</label>
                  <input
                    type="text"
                    value={newItemForm.specifications}
                    onChange={(e) => setNewItemForm({ ...newItemForm, specifications: e.target.value })}
                    placeholder="e.g. 550W 144 Half-Cut Cells, DCR Certified, IP68 Junction Box"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Warehouse Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newItemForm.warehouseStock}
                    onChange={(e) =>
                      setNewItemForm({ ...newItemForm, warehouseStock: Number(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit of Measure</label>
                  <select
                    value={newItemForm.unit}
                    onChange={(e) => setNewItemForm({ ...newItemForm, unit: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Nos">Nos (Units)</option>
                    <option value="Meters">Meters</option>
                    <option value="Set">Set</option>
                    <option value="Kgs">Kgs</option>
                    <option value="Rolls">Rolls</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Reorder Alert Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newItemForm.minAlertStock}
                    onChange={(e) =>
                      setNewItemForm({ ...newItemForm, minAlertStock: Number(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit Purchase Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newItemForm.unitPrice}
                    onChange={(e) =>
                      setNewItemForm({ ...newItemForm, unitPrice: Number(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Supplier / Vendor Name</label>
                  <input
                    type="text"
                    value={newItemForm.supplier}
                    onChange={(e) => setNewItemForm({ ...newItemForm, supplier: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Purchase / Inward Date</label>
                  <input
                    type="date"
                    value={newItemForm.purchaseDate}
                    onChange={(e) => setNewItemForm({ ...newItemForm, purchaseDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                >
                  Add Material to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT EXISTING MATERIAL ITEM */}
      {/* ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl text-xs">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 border-b border-slate-800 pb-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Edit Material Details: {editingItem.item}</h3>
                <p className="text-[11px] text-slate-400 font-mono">ID: {editingItem.id}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.item}
                    onChange={(e) => setEditingItem({ ...editingItem, item: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, category: e.target.value as InventoryCategory })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={editingItem.brand}
                    onChange={(e) => setEditingItem({ ...editingItem, brand: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Model</label>
                  <input
                    type="text"
                    value={editingItem.model}
                    onChange={(e) => setEditingItem({ ...editingItem, model: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Specifications</label>
                  <input
                    type="text"
                    value={editingItem.specifications}
                    onChange={(e) => setEditingItem({ ...editingItem, specifications: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Warehouse Stock ({editingItem.unit})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.warehouseStock}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, warehouseStock: Number(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Alert Stock Threshold</label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.minAlertStock}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, minAlertStock: Number(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.unitPrice}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, unitPrice: Number(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Supplier</label>
                  <input
                    type="text"
                    value={editingItem.supplier}
                    onChange={(e) => setEditingItem({ ...editingItem, supplier: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                >
                  Save Material Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: QUICK STOCK ADJUSTMENT (+ / -) */}
      {/* ========================================================================= */}
      {stockAdjustItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 relative shadow-2xl text-xs">
            <button
              onClick={() => setStockAdjustItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 border-b border-slate-800 pb-3">
              <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Adjust Warehouse Stock</h3>
                <p className="text-[11px] text-slate-400 font-mono">{stockAdjustItem.item}</p>
              </div>
            </div>

            <form onSubmit={handleApplyStockAdjust} className="space-y-4">
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Current Warehouse Stock:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {stockAdjustItem.warehouseStock} {stockAdjustItem.unit}
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Quantity Change (+ for Inward, - for Outward/Damage)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    required
                    value={adjustDelta}
                    onChange={(e) => setAdjustDelta(Number(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-slate-400 font-bold">{stockAdjustItem.unit}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Resulting Stock: {Math.max(0, stockAdjustItem.warehouseStock + adjustDelta)}{' '}
                  {stockAdjustItem.unit}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason / Reference Note</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Inward PO #9102 / Physical audit adjustment"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStockAdjustItem(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl"
                >
                  Apply Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
