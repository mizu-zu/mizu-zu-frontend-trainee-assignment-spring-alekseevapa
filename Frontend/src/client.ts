import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/items';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// ==================== Типы ====================

export type Category = 'auto' | 'real_estate' | 'electronics';

export interface ItemsGetParams {
  q?: string;                    // поиск по названию
  limit?: number;
  skip?: number;
  needsRevision?: boolean;
  categories?: Category[];       // несколько категорий — массив
  sortColumn?: 'title' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

export interface ItemListItem {
  id: number;
  category: Category;
  title: string;
  price: number;
  needsRevision: boolean;
}

export interface ItemsGetOut {
  items: ItemListItem[];
  total: number;
}

export type ItemUpdateIn = {
  category: Category;
  title: string;
  description?: string;
  price: number;
  params: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
};

export type AutoItemParams = {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: 'automatic' | 'manual';
  mileage?: number;
  enginePower?: number;
};

export type RealEstateItemParams = {
  type?: 'flat' | 'house' | 'room';
  address?: string;
  area?: number;
  floor?: number;
};

export type ElectronicsItemParams = {
  type?: 'phone' | 'laptop' | 'misc';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used';
  color?: string;
};

export interface ItemFull {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  createdAt: string;        
  updatedAt: string;        
  needsRevision: boolean;
  params: Record<string, any>;   
}

/** * Метод получения всех объявлений  */
export async function getItems(params: ItemsGetParams = {}): Promise<ItemsGetOut> {
  const response = await api.get<ItemsGetOut>('', { 
    params: {
      q: params.q || undefined,
      limit: params.limit,
      skip: params.skip,
      needsRevision: params.needsRevision !== undefined ? String(params.needsRevision) : undefined,
      categories: params.categories?.join(',') || undefined,
      sortColumn: params.sortColumn,
      sortDirection: params.sortDirection,
    },
  });

  return response.data;
}

/** * Метод получения количества всех объявлений */
export async function getTotalItemsCount(): Promise<number> {
  const response = await api.get<ItemsGetOut>('', {
    params: {
      limit: 1,
      skip: 0,
    },
  });

  return response.data.total;
}

export async function getItemById(id: number | string): Promise<ItemFull> {
  const response = await api.get<ItemFull>(`/${id}`);
  return response.data;
}

export async function updateItem(
  id: number | string,
  data: ItemUpdateIn
): Promise<ItemFull> {
  const response = await api.put<ItemFull>(`/${id}`, data);
  return response.data;
}