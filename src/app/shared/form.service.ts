import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor(private fb: FormBuilder) {}

  getProductForm(item: any = null): FormGroup {
    let form = this.fb.group({
      productName: ['', Validators.required],
      productCode: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      starRating: [0, [Validators.min(0), Validators.max(5)]],
      purchased: [0],
      imageUrl: ['assets/images/pizza.png'],
    });

    if (item) {
      form.patchValue(item);
    }

    return form;
  }

  getQuantityForm(item: any = null): FormGroup {
    let form = this.fb.group({
      price: [{ value: '', disabled: true }, Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      totalPrice: [{ value: '', disabled: true }]
    });

    if (item) {
      form.patchValue(item);
    }

    this.setQuantityFormSubscribers(form);

    return form;
  }

  private setQuantityFormSubscribers(form: FormGroup): void {
    form.get('quantity')?.valueChanges.pipe(
      startWith(form.get('quantity')?.value),
      map(quantity => {
        const price = form.get('price')?.value;
        return price * quantity;
      })
    ).subscribe(totalPrice => {
      form.get('totalPrice')?.setValue(totalPrice, { emitEvent: false });
    });
  }

  getUserForm(item?: any): FormGroup {
    let form = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      roleName: ['']
    });

    if (item) {
      form.patchValue(item);
    }

    return form;
  }

  getRoleForm(item?: any): FormGroup {
    let form = this.fb.group({
      roleName: ['', Validators.required],
      rolePermissions: [[]]
    });

    if (item) {
      form.patchValue(item);
    }

    return form;
  }

  getPermissionForm(item?: any): FormGroup {
    let form = this.fb.group({
      permissionName: ['', Validators.required]
    });

    if (item) {
      form.patchValue(item);
    }

    return form;
  }
}