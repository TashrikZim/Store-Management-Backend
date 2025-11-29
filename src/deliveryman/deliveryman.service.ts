// src/deliveryman/deliveryman.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateDeliverymanDto,
  UpdateDeliverymanDto,
} from './dto/create-deliveryman.dto';
 
export interface Deliveryman extends CreateDeliverymanDto {
  id: number;
}
 
@Injectable()
export class DeliverymanService {
  private deliverymen: Deliveryman[] = [];
  private nextId = 1;
 
  // GET /deliveryman
  getAll() {
    return {
      message: 'All delivery men list',
      data: this.deliverymen,
    };
  }
 
  // GET /deliveryman/:id
  getOne(id: number) {
    const deliveryman = this.deliverymen.find((d) => d.id === id);
    if (!deliveryman) {
      throw new NotFoundException(`Deliveryman with id ${id} not found`);
    }
    return {
      message: 'Single delivery man',
      data: deliveryman,
    };
  }
 
  // GET /deliveryman/search/by-phone?phone=...
  searchByPhone(phone: string) {
    const result = this.deliverymen.filter((d) => d.phone === phone);
    return {
      message: 'Search result by phone',
      data: result,
    };
  }
 
  // GET /deliveryman/stats/count
  count() {
    return {
      message: 'Total delivery men count',
      data: { count: this.deliverymen.length },
    };
  }
 
  // POST /deliveryman/register OR /register-with-file
  create(dto: CreateDeliverymanDto) {
    const newDeliveryman: Deliveryman = {
      id: this.nextId++,
      ...dto,
    };
    this.deliverymen.push(newDeliveryman);
    return {
      message: 'Delivery man created successfully',
      data: newDeliveryman,
    };
  }
 
  // PUT /deliveryman/:id
  update(id: number, dto: UpdateDeliverymanDto) {
    const index = this.deliverymen.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new NotFoundException(`Deliveryman with id ${id} not found`);
    }
 
    this.deliverymen[index] = {
      ...this.deliverymen[index],
      ...dto,
    };
 
    return {
      message: 'Delivery man updated successfully',
      data: this.deliverymen[index],
    };
  }
 
  // PATCH /deliveryman/:id/password
  updatePassword(id: number, password: string) {
    const index = this.deliverymen.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new NotFoundException(`Deliveryman with id ${id} not found`);
    }
 
    this.deliverymen[index].password = password;
 
    return {
      message: 'Password updated successfully',
      data: { id, password },
    };
  }
 
  // DELETE /deliveryman/:id
  remove(id: number) {
    const index = this.deliverymen.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new NotFoundException(`Deliveryman with id ${id} not found`);
    }
 
    const deleted = this.deliverymen.splice(index, 1)[0];
 
    return {
      message: 'Delivery man deleted successfully',
      data: deleted,
    };
  }
}