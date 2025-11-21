export interface Column {
  id: string;
  title: string;
  status: string;
  color: string;
  order: number;
  wipLimit?: number; 
}