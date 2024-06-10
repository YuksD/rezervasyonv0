import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'bir',
    loadChildren: () => import('./bir-iki-uc/bir/bir.module').then(m => m.BirPageModule)
  },
  {
    path: 'iki',
    loadChildren: () => import('./bir-iki-uc/iki/iki.module').then(m => m.IkiPageModule)
  },
  {
    path: 'uc',
    loadChildren: () => import('./bir-iki-uc/uc/uc.module').then(m => m.UcPageModule)
  },
  {
    path: 'giris',
    loadChildren: () => import('./pages/giris/giris.module').then(m => m.GirisPageModule)
  },
  {
    path: 'anasayfa',
    loadChildren: () => import('./pages/anasayfa/anasayfa.module').then(m => m.AnasayfaPageModule)
  },
  {
    path: 'rezervasyon',
    loadChildren: () => import('./pages/rezervasyon/rezervasyon.module').then(m => m.RezervasyonPageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./pages/profil/profil.module').then(m => m.ProfilPageModule)
  },
  {
    path: 'kayit',
    loadChildren: () => import('./pages/giris/kayit/kayit.module').then(m => m.KayitPageModule)
  },
  // Yeni eklenen sayfaların rotaları buraya eklenmeli
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
