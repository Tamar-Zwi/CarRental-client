import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService, Customer } from '../services/customer.service';
import { Router } from '@angular/router';
import { City, CityService } from '../services/city.service';
import { AuthService } from '../services/auth.service';

interface RegisterCustomerPayload {
  Id: number;
  firstName: string;
  lastName: string;
  codeCity: number;
  email: string;
  numRents: number;
  codePayment: number;
  address: string;
}

@Component({
  selector: 'app-register-customer',
  standalone: true,
  imports: [CommonModule, FormsModule], // ייבוא מודולים לשימוש בטפסים ותנאים
  templateUrl: './register-customer.html',
  styleUrls: ['./register-customer.css']
})
export class RegisterCustomerComponent implements OnInit {
  // יצירת אובייקט ריק של לקוח לפי המודל שיש לך בסרוויס
  newCustomer: Customer = {
    id: 0,
    Id: 0,
    firstName: '',
    lastName: '',
    codeCity: 0,
    email: '',
    numRents: 0,
    address: '',
    Cities: null,
    Payments: undefined
  };

  cities: City[] = [];
  selectedCityCode: number | null = null;
  newCityName: string = '';
  message: string = '';
  isSuccess: boolean = false;
  isAddingCity: boolean = false;
  registeredCustomer: Customer | null = null;

  // פרטי כרטיס אשראי
  creditCard: string = '';
  validity: number | null = null;
  cvc: number | null = null;

  constructor(
    private customerService: CustomerService,
    private cityService: CityService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCities();
  }

  loadCities() {
    this.cityService.getAllCities().subscribe({
      next: (cities) => {
        console.log('רשימת ערים מהשרת:', cities);
        this.cities = cities || [];
        if (this.selectedCityCode === null && this.cities.length > 0) {
          this.selectedCityCode = this.cities[0].code;
          console.log('נבחרה עיר ברירת מחדל:', this.selectedCityCode, this.cities[0]);
        }
      },
      error: (err) => {
        console.error('שגיאה בטעינת ערים:', err);
        this.isSuccess = false;
        this.message = 'לא הצלחנו לטעון רשימת ערים מהשרת.';
      }
    });
  }

  addCity() {
    const cityName = this.newCityName.trim();
    if (!cityName) {
      this.isSuccess = false;
      this.message = 'יש להזין שם עיר לפני הוספה.';
      return;
    }

    // בדיקה אם העיר כבר קיימת ברשימה
    const existingCity = this.cities.find(c => 
      c.name.trim().toLowerCase() === cityName.toLowerCase()
    );
    if (existingCity) {
      this.isSuccess = false;
      this.message = `העיר "${cityName}" כבר קיימת ברשימה.`;
      this.selectedCityCode = existingCity.code; // בוחרים אותה אוטומטית
      this.newCityName = '';
      return;
    }

    this.isAddingCity = true;
    const newCity = { name: cityName };
    console.log('שולח בקשת הוספת עיר:', newCity);
    console.log('נתיב API:', 'http://localhost:53191/api/city/insertcity');
    
    this.cityService.addCity(newCity).subscribe({
      next: (response) => {
        console.log('נוספה עיר - תשובה מהשרת:', response);
        this.newCityName = '';
        this.isSuccess = true;
        this.message = 'העיר נוספה בהצלחה!';
        this.isAddingCity = false;
        
        // טעינת הרשימה מחדש ובחירה אוטומטית של העיר החדשה
        setTimeout(() => {
          this.cityService.getAllCities().subscribe({
            next: (cities) => {
              console.log('רשימת ערים לאחר הוספה:', cities);
              this.cities = cities || [];
              // מחפשים את העיר שהוספנו ובוחרים אותה
              const addedCity = this.cities.find(c => 
                c.name.trim().toLowerCase() === cityName.toLowerCase()
              );
              if (addedCity) {
                this.selectedCityCode = addedCity.code;
                console.log('נבחרה העיר החדשה:', addedCity);
                this.cdr.detectChanges(); // אכיפת עידכון התצוגה
              } else {
                console.warn('העיר לא נמצאה ברשימה מהשרת');
              }
            },
            error: (err) => {
              console.error('שגיאה בטעינת רשימת ערים לאחר הוספה:', err);
            }
          });
        }, 500); // הגדלתי ל-500ms כדי לתת לשרת זמן לאחסן את העיר
      },
      error: (err) => {
        console.error('שגיאה בהוספת עיר:', err);
        console.error('סטטוס:', err.status);
        console.error('תשובת שרת:', err.error);
        console.error('URL מלא:', err.url);
        this.isSuccess = false;
        
        let errorMsg = 'הוספת העיר נכשלה: ';
        if (err.status === 0) {
          errorMsg += 'לא ניתן להתחבר לשרת. ודא שהשרת פועל.';
        } else if (err.status === 404) {
          errorMsg += 'נתיב ה-API לא נמצא (404). בדוק: /api/city/insertcity';
        } else if (err.status === 400) {
          errorMsg += 'בקשה לא תקינה. השרת דחה את הנתונים.';
        } else if (err.status === 500) {
          errorMsg += 'שגיאת שרת פנימית (500).';
        } else {
          errorMsg += `סטטוס ${err.status}`;
        }
        
        this.message = errorMsg;
        this.isAddingCity = false;
      }
    });
  }

  onRegister() {
    if (this.selectedCityCode === null || this.selectedCityCode === undefined) {
      this.isSuccess = false;
      this.message = 'יש לבחור עיר מהרשימה.';
      return;
    }

    // בדיקת תקינות פרטי כרטיס אשראי
    if (!this.creditCard || this.creditCard.length < 15) {
      this.isSuccess = false;
      this.message = 'יש להזין מספר כרטיס אשראי תקין (15-16 ספרות).';
      return;
    }
    if (!this.validity || this.validity < 1 || this.validity > 12) {
      this.isSuccess = false;
      this.message = 'יש להזין חודש תוקף תקין (1-12).';
      return;
    }
    if (!this.cvc || this.cvc < 100 || this.cvc > 999) {
      this.isSuccess = false;
      this.message = 'יש להזין CVV/CVC תקין (3 ספרות).';
      return;
    }

    const payload: any = {
      Id: this.newCustomer.id || this.newCustomer.Id || 0,
      firstName: this.newCustomer.firstName,
      lastName: this.newCustomer.lastName,
      codeCity: Number(this.selectedCityCode),
      email: this.newCustomer.email,
      numRents: 0,
      codePayment: 1, // ערך זמני - נעדכן אחרי יצירת פרטי התשלום
      address: this.newCustomer.address,
      Payments: {
        creaditCard: this.creditCard,
        validity: this.validity!,
        cvc: this.cvc!
      }
    };

    const paymentData = {
      creaditCard: this.creditCard,
      validity: this.validity!,
      cvc: this.cvc!
    };

    this.customerService.checkIdExists(payload.Id).subscribe({
      next: (result) => {
        if (result?.exists) {
          this.isSuccess = false;
          this.message = 'תעודת הזהות כבר קיימת במערכת. נסי להתחבר.';
          return;
        }

        this.customerService.register(payload as Customer).subscribe({
          next: (response) => {
            console.log('✅ הרשמה הושלמה בהצלחה:', response);
            console.log('📦 Payload שנשלח:', payload);
            
            // נחכה רגע קטן לתת לשרת לסיים
            setTimeout(() => {
              // עכשיו נעדכן את פרטי התשלום
              const customerWithPayment: Customer = {
                id: payload.Id,
                Id: payload.Id,
                firstName: payload.firstName,
                lastName: payload.lastName,
                codeCity: payload.codeCity,
                email: payload.email,
                numRents: 0,
                address: payload.address,
                Cities: this.cities.find(c => Number(c.code) === Number(payload.codeCity)) || null,
                Payments: paymentData
              };

              console.log('📝 מעדכן פרטי תשלום:', paymentData);
              
              // עדכון פרטי התשלום בשרת
              this.customerService.updateCustomer(customerWithPayment).subscribe({
                next: () => {
                  console.log('✅ פרטי תשלום עודכנו בהצלחה');
                  this.authService.setCustomer(customerWithPayment);
                  this.registeredCustomer = customerWithPayment;
                  this.isSuccess = true;
                  this.message = '';
                  this.cdr.detectChanges();
                },
                error: (err) => {
                  console.error('❌ נכשל עדכון פרטי תשלום:', err);
                  console.error('📄 סטטוס:', err.status);
                  console.error('📄 תשובה:', err.error);
                  // גם אם עדכון התשלום נכשל, נמשיך עם הלקוח
                  this.authService.setCustomer(customerWithPayment);
                  this.registeredCustomer = customerWithPayment;
                  this.isSuccess = true;
                  this.message = '';
                  this.cdr.detectChanges();
                }
              });
            }, 500); // המתנה של חצי שנייה
          },
          error: (err) => {
            console.error('❌ שגיאה בהרשמה:', err);
            console.error('📄 סטטוס:', err.status);
            console.error('📄 תשובה:', err.error);
            this.isSuccess = false;
            this.message = 'הייתה שגיאה בהרשמה. ודאי שכל השדות תואמים ל-API.';
          }
        });
      },
      error: (err) => {
        this.isSuccess = false;
        this.message = 'לא הצלחנו לבדוק אם תעודת הזהות קיימת. נסי שוב.';
        console.error(err);
      }
    });
  }

  goToCars(): void {
    this.router.navigate(['/cars']);
  }
}