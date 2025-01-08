import { Component, OnInit, ViewChild, ElementRef, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../shared/snackbar.service';
import { ProductService } from '../product.service';
import { IProduct } from '../product';
import { SnackbarColor } from '../../shared/snackbar-color.enum';
import { TranslationService } from '../../shared/translation.service';
import { FormService } from '../../shared/form.service';

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
  isEdit: boolean = false;

  @Output() productAdded = new EventEmitter<void>();
  @ViewChild('productFormRef') productFormRef!: NgForm;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { operation: string, product?: IProduct },
    private snackbarService: SnackbarService,
    public translationService: TranslationService,
    private formService: FormService
  ) {
    this.productForm = this.formService.getProductForm(this.data.product);
  }

  ngOnInit(): void {
    if (this.data.operation === 'edit' && this.data.product) {
      this.productForm.patchValue(this.data.product);
      this.isEdit = true;
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.imageError = false;
    } else {
      this.imageError = !this.isEdit;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productName = this.productForm.value.productName;
      const productCode = this.productForm.value.productCode;
      const currentProductId = this.data.product ? this.data.product.id : null;

      this.productService.getProducts().subscribe({
        next: products => {
          const nameExists = products.some(product => product.productName === productName && product.id !== currentProductId);
          const codeExists = products.some(product => product.productCode === productCode && product.id !== currentProductId);

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
            formData.append('ProductId', this.data.product ? this.data.product.id.toString() : '');
            formData.append('ProductName', this.productForm.value.productName);
            formData.append('ProductCode', this.productForm.value.productCode);
            formData.append('Description', this.productForm.value.description);
            formData.append('Price', this.productForm.value.price.toString());
            if (this.selectedFile) {
              formData.append('image', this.selectedFile, this.selectedFile.name);
            }

            this.saveProduct(formData);
          }
        },
        error: error => {
          console.error('Error fetching products', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  saveProduct(formData: FormData): void {
    console.log('Form data before POST:', formData);
    if (this.isEdit) {
      this.productService.updateProduct(this.data.product!.id, formData).subscribe({
        next: result => {
          this.productAdded.emit();
          this.dialogRef.close(result);
          this.snackbarService.showSnackBar(this.translationService.translate('productFormDialog', 'productUpdated'), SnackbarColor.Primary);
        },
        error: error => {
          console.error('Error updating product', error);
        }
      });
    } else {
      this.productService.submitNewProduct(formData).subscribe({
        next: result => {
          this.productAdded.emit();
          this.dialogRef.close(result);
          this.snackbarService.showSnackBar(this.translationService.translate('productFormDialog', 'productAdded'), SnackbarColor.Primary);
        },
        error: error => {
          console.error('Error adding product', error);
        }
      });
    }
  }

  resetForm(): void {
    this.productFormRef.resetForm();
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
  }

  resetPurchased(): void {
    if (this.data.product) {
      this.productService.resetPurchased(this.data.product.id).subscribe({
        next: result => {
          this.productForm.patchValue(result);
        },
        error: error => {
          console.error('Error resetting purchased', error);
        }
      });
    }
  }
}