import { IOrderProduct } from './orderProduct';

export interface IOrder {
  id: number;
  orderDate: string;
  totalPrice: number;
  orderProducts: {
    $values: IOrderProduct[];
  };
}