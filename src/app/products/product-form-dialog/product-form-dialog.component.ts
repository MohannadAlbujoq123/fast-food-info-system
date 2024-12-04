import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { IProduct } from '../product';

@Component({
  selector: 'app-product-form-dialog',
  templateUrl: './product-form-dialog.component.html',
  standalone: false,
})
export class ProductFormDialogComponent implements OnInit {
  productForm: FormGroup;
  selectedFile: File | null = null;
  imageError: boolean = false;

  @Output() productAdded = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService, 
    public dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { operation: string, product?: IProduct }
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productCode: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      imageUrl: ['assets/images/pizza.png'], 
    });
  }

  ngOnInit(): void {
    if (this.data.operation === 'edit' && this.data.product) {
      this.productForm.patchValue(this.data.product);
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.imageError = false;
    } else {
      this.imageError = this.data.operation === 'add';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('productName', this.productForm.value.productName);
      formData.append('productCode', this.productForm.value.productCode);
      formData.append('price', this.productForm.value.price);
      formData.append('description', this.productForm.value.description);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, `${this.productForm.value.productName}.png`);
      }

      if (this.data.operation === 'edit') {
        this.productService.updateProduct(this.data.product!.productId, formData).subscribe(result => {
          console.log('Product updated successfully', result);
          this.productAdded.emit();
          this.dialogRef.close(result);
        }, error => {
          console.error('Error updating product', error);
        });
      } else {
        this.productService.submitNewProduct(formData).subscribe(result => {
          console.log('Product added successfully', result);
          this.productAdded.emit();
          this.dialogRef.close(result);
        }, error => {
          console.error('Error adding product', error);
        });
      }
    } else {
      console.error('Form is invalid');
    }
  }
}