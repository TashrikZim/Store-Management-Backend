import { Injectable } from '@nestjs/common';
import { AdminDto } from './dto/admin.dto';

@Injectable()
export class AdminService {

  
  createAdmin(adminData: AdminDto) {
    return { message: 'Admin created successfully', data: adminData };
  }

  getAllSellers() {
    return { message: 'All Sellers Details' };
  }
 searchAdmin(username: string) {
  return {
    message: `searching admin with username: ${username}`
  };
}

  deleteAdmin(id: string) {
    return { message: `Admin with ID ${id} deleted` };
  }
   putMessage(admin: any) {
    return { message: 'Admin replaced successfully', data: admin };
  }

 patchMessage(admin: any) {
    return { message: 'Admin updated successfully', data: admin };
  }

getAllcategories(){
  return { message : 'View all categories'};
}


}
