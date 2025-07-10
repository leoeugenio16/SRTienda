"use client";

export default function ProductFilters({ currentSort, onSortChange }) {
  return (
    <div className="mb-6">
      <label htmlFor="sort" className="mr-2 font-medium">
        Ordenar por:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="border border-gray-300 rounded p-1"
      >
        <option value="createdAt:desc">Más nuevos</option>
        <option value="price_sale:asc">Precio ascendente</option>
        <option value="price_sale:desc">Precio descendente</option>
        <option value="title:asc">Nombre A-Z</option>
        <option value="title:desc">Nombre Z-A</option>
      </select>
    </div>
  );
}
