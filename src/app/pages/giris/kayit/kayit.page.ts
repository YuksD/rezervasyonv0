import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-kayit',
  templateUrl: './kayit.page.html',
  styleUrls: ['./kayit.page.scss'],
})
export class KayitPage implements OnInit {
  user: Omit<User, 'id'> = {
    phoneNumber: '',
    password: '',
    firstName: '',
    lastName: ''
  };
  confirmPassword: string = '';

  constructor(private userService: UserService, private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  // Kullanıcıyı kayıt etmek için çağrılan fonksiyon
  async register() {
    if (this.user.password !== this.confirmPassword) {
      this.showAlert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    this.userService.registerUser(this.user)
      .then(() => {
        this.showSuccessAlert();
      })
      .catch(error => {
        console.error('Kayıt hatası:', error);
        this.showAlert('Hata', 'Kayıt hatası: ' + error);
      });
  }

  // Kayıt başarılı olursa çağrılan fonksiyon
  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Başarılı',
      message: 'Kayıt işlemi başarılı.',
      buttons: [{
        text: 'Tamam',
        handler: () => {
          this.router.navigate(['/giris']); // Kullanıcıyı giriş sayfasına yönlendir
        }
      }]
    });

    await alert.present();
  }

  // Genel amaçlı uyarı göstermek için kullanılan fonksiyon
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Tamam']
    });

    await alert.present();
  }
}
