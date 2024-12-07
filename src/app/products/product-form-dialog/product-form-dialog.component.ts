import { Component, Inject, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
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
  nameExistsError: boolean = false;
  codeExistsError: boolean = false;

  @Output() productAdded = new EventEmitter<void>();
  @ViewChild('productFormRef') productFormRef!: NgForm;
  @ViewChild('fileInput') fileInput!: ElementRef;

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
      const productName = this.productForm.value.productName;
      const productCode = this.productForm.value.productCode;
      const currentProductId = this.data.product ? this.data.product.productId : null;

      this.productService.getProducts().subscribe(products => {
        const nameExists = products.some(product => product.productName === productName && product.productId !== currentProductId);
        const codeExists = products.some(product => product.productCode === productCode && product.productId !== currentProductId);
        
        if (nameExists) {
          this.nameExistsError = true;
        } else {
          this.nameExistsError = false;
        }
        
        if (codeExists) {
          this.codeExistsError = true;
        } else {
          this.codeExistsError = false;
        }
        
        if (!nameExists && !codeExists) {
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
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  resetForm(): void {
    this.productFormRef.resetForm();
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
  }
}