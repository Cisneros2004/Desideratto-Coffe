import { Component, OnInit, OnDestroy, HostListener, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private isBrowser: boolean;
  isScrolled = false;
  menuOpen = false;
  currentProductSlide = 0;
  currentTestimonialSlide = 0;
  heroTextVisible = false;
  heroMouseX = 0;
  heroMouseY = 0;
  private productInterval: any;
  private testimonialInterval: any;
  private counterAnimated = false;
  private scrollObserver?: IntersectionObserver;

  products = [
    {
      id: 1,
      name: 'Café Tradicional',
      weight: '250g',
      category: 'Café Molido',
      description: 'Café de Chanchamayo tostado y molido. Tostión media, notas florales y cuerpo equilibrado.',
      price: 'S/. 25',
      image: '/img/product-250.jpg',
      badge: 'POPULAR',
      tags: ['Tostión Media', 'Chanchamayo', 'Molido'],
      color: '#7db31a'
    },
    {
      id: 2,
      name: 'Café Tradicional',
      weight: '450g',
      category: 'Café Molido',
      description: 'Café de Chanchamayo tostado y molido. Tostión media, para quien no puede vivir sin su café.',
      price: 'S/. 42',
      image: '/img/product-450.jpg',
      badge: 'MEJOR VALOR',
      tags: ['Tostión Media', 'Chanchamayo', 'Molido'],
      color: '#7db31a'
    },
    {
      id: 3,
      name: 'Miel de Abeja',
      weight: '500ml',
      category: 'Miel Orgánica',
      description: 'Miel orgánica y artesanal, pura y natural. Sin procesar, directo de las colmenas.',
      price: 'S/. 35',
      image: '/img/honey.jpg',
      badge: 'ORGÁNICO',
      tags: ['Premium', 'Orgánica', 'Artesanal'],
      color: '#c8820f'
    }
  ];

  testimonials = [
    {
      name: 'María García',
      role: 'Cliente frecuente',
      text: 'El café de Desideratto es increíble. Se nota la calidad artesanal en cada sorbo. Ya no puedo tomar otro café.',
      rating: 5,
      image: '/img/testimonial-1.jpg'
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Barista profesional',
      text: 'Trabajo con café de muchas marcas y Desideratto tiene algo especial. El origen Chanchamayo se siente desde el primer aroma.',
      rating: 5,
      image: '/img/testimonial-2.jpg'
    },
    {
      name: 'Ana López',
      role: 'Cliente fiel',
      text: 'La miel artesanal es un complemento perfecto para el café. Todo de la mejor calidad. Ya no compro otra marca.',
      rating: 5,
      image: '/img/testimonial-3.jpg'
    }
  ];

  coffeeSteps = [
    {
      number: '01',
      title: 'Selección del Grano',
      desc: 'Granos selectos de las montañas de Chanchamayo, Junín, cultivados a más de 1800m de altitud.',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
    },
    {
      number: '02',
      title: 'Tueste Artesanal',
      desc: 'Tostión media que preserva los aromas florales y el cuerpo equilibrado del grano peruano.',
      icon: 'M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.58.58 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26m-3.16 6.3c-.28.24-.74.5-1.1.6-1.12.4-2.24-.16-2.9-.82 1.19-.28 1.9-1.16 2.11-2.05.17-.8-.15-1.46-.28-2.23-.12-.74-.1-1.37.17-2.06.19.38.39.76.63 1.06.77 1 1.98 1.44 2.24 2.8.04.14.06.28.06.43.03.82-.33 1.72-.93 2.27z'
    },
    {
      number: '03',
      title: 'Molido Preciso',
      desc: 'Molido justo después del tueste para capturar la máxima frescura, aroma y sabor del café.',
      icon: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-13h2v6h-2zm0 8h2v2h-2z'
    },
    {
      number: '04',
      title: 'Tu Taza Perfecta',
      desc: 'Del campo peruano directo a tu mesa. Una experiencia sensorial única en cada preparación.',
      icon: 'M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 5v3H6V5h10zm2.5 3H18V5h.5c.83 0 1.5.67 1.5 1.5S19.33 8 18.5 8zM4 19h16v2H4z'
    }
  ];

  stats = [
    { value: 1800, suffix: 'm+', label: 'Altitud de cultivo' },
    { value: 100, suffix: '%', label: 'Orgánico y natural' },
    { value: 3, suffix: '+', label: 'Años de experiencia' },
    { value: 500, suffix: '+', label: 'Clientes satisfechos' }
  ];

  animatedValues = [0, 0, 0, 0];

  honeyBenefits = [
    { icon: '🌿', title: 'Sin Procesar', desc: 'Directamente de las colmenas sin tratamiento térmico' },
    { icon: '💛', title: 'Pura y Natural', desc: 'Sin aditivos, conservantes ni azúcares añadidos' },
    { icon: '🌸', title: 'Artesanal', desc: 'Elaborada con técnicas tradicionales de apicultura' },
    { icon: '✅', title: 'Orgánica Premium', desc: 'Certificada orgánica, del campo a tu mesa' }
  ];

  tickerItems = [
    'CAFÉ ARTESANAL',
    'CHANCHAMAYO, PERÚ',
    'TOSTIÓN MEDIA',
    'MIEL ORGÁNICA',
    'PREMIUM',
    'DEL CAMPO A TU TAZA'
  ];

  steps = [
    { n: '01', title: 'Selección', desc: 'Granos a 1800m de altitud' },
    { n: '02', title: 'Tueste artesanal', desc: 'Tostión media, preserva aromas' },
    { n: '03', title: 'Molido preciso', desc: 'Frescura capturada al instante' },
    { n: '04', title: 'Tu taza', desc: 'Del campo directo a ti' }
  ];

  honeyPerks = [
    { icon: '🌿', title: 'Sin procesar', desc: 'Del panal a tu mesa, sin calor ni filtros' },
    { icon: '💛', title: '100% natural', desc: 'Sin aditivos ni conservantes' },
    { icon: '🌸', title: 'Artesanal', desc: 'Apicultura tradicional certificada' },
    { icon: '🍵', title: 'Ideal con café', desc: 'El endulzante perfecto para tu taza' }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if (!this.isBrowser) return;
    this.isScrolled = window.scrollY > 80;
    this.checkCounters();
  }

  ngOnInit() {
    if (!this.isBrowser) return;
    this.startProductCarousel();
    this.startTestimonialCarousel();
    setTimeout(() => { this.heroTextVisible = true; }, 300);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    this.initScrollAnimations();
  }

  ngOnDestroy() {
    if (this.productInterval) clearInterval(this.productInterval);
    if (this.testimonialInterval) clearInterval(this.testimonialInterval);
    if (this.scrollObserver) this.scrollObserver.disconnect();
  }

  startProductCarousel() {
    this.productInterval = setInterval(() => { this.nextProduct(); }, 5000);
  }

  startTestimonialCarousel() {
    this.testimonialInterval = setInterval(() => { this.nextTestimonial(); }, 4500);
  }

  nextProduct() {
    this.currentProductSlide = (this.currentProductSlide + 1) % this.products.length;
  }

  prevProduct() {
    this.currentProductSlide = (this.currentProductSlide - 1 + this.products.length) % this.products.length;
  }

  setProductSlide(index: number) {
    this.currentProductSlide = index;
    clearInterval(this.productInterval);
    this.startProductCarousel();
  }

  nextTestimonial() {
    this.currentTestimonialSlide = (this.currentTestimonialSlide + 1) % this.testimonials.length;
  }

  prevTestimonial() {
    this.currentTestimonialSlide = (this.currentTestimonialSlide - 1 + this.testimonials.length) % this.testimonials.length;
  }

  setTestimonialSlide(index: number) {
    this.currentTestimonialSlide = index;
    clearInterval(this.testimonialInterval);
    this.startTestimonialCarousel();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  scrollToSection(id: string) {
    this.menuOpen = false;
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  initScrollAnimations() {
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });

    setTimeout(() => {
      document.querySelectorAll('.anim, .anim-left, .anim-right').forEach(el => {
        this.scrollObserver!.observe(el);
      });
    }, 200);
  }

  checkCounters() {
    if (this.counterAnimated) return;
    const statsEl = document.querySelector('.stats-grid');
    if (!statsEl) return;
    const rect = statsEl.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      this.counterAnimated = true;
      this.animateCounters();
    }
  }

  animateCounters() {
    const duration = 2000;
    const fps = 60;
    const steps = duration / (1000 / fps);

    this.stats.forEach((stat, i) => {
      const increment = stat.value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timer);
        }
        this.animatedValues[i] = Math.floor(current);
      }, 1000 / fps);
    });
  }

  onHeroMouseMove(event: MouseEvent) {
    if (!this.isBrowser) return;
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    this.heroMouseX = (event.clientX - rect.left) / rect.width - 0.5;
    this.heroMouseY = (event.clientY - rect.top) / rect.height - 0.5;
  }

  onHeroMouseLeave() {
    this.heroMouseX = 0;
    this.heroMouseY = 0;
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getProductImageStyle(product: any): string {
    return `background: linear-gradient(135deg, #141414 0%, #1e1e1e 100%);`;
  }
}
