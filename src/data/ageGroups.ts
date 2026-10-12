import { AgeGroup, AgeGroupProfileInfo } from '../types';

export const AGE_GROUPS_CONFIG: Record<AgeGroup, AgeGroupProfileInfo> = {
  joven: {
    id: 'joven',
    title: 'Joven',
    range: '18-25 años',
    badge: 'Fresco & Tendencia',
    focus: 'Tendencias dinámicas, presupuestos inteligentes y estilismo visual para redes sociales.',
    stylingQuote: 'Explora tu identidad con libertad, colores luminosos y prendas versátiles para estudiar o salir.',
    uiPreferences: {
      baseFontSize: '15px',
      contrastMode: 'normal',
      simplifiedNav: false,
    },
  },
  adulta_joven: {
    id: 'adulta_joven',
    title: 'Adulta Joven',
    range: '26-35 años',
    badge: 'Modernidad & Balance',
    focus: 'Equilibrio profesional y vida personal. Looks híbridos de oficina a cóctel o maternidad activa.',
    stylingQuote: 'Prendas versátiles que se adaptan a tu día dinámico entre el trabajo, metas y vida social.',
    uiPreferences: {
      baseFontSize: '15px',
      contrastMode: 'normal',
      simplifiedNav: false,
    },
  },
  adulta: {
    id: 'adulta',
    title: 'Adulta',
    range: '36-45 años',
    badge: 'Confianza & Liderazgo',
    focus: 'Presencia ejecutiva y personal, calidad sobre cantidad, empoderamiento cromático.',
    stylingQuote: 'Tu paleta es tu armadura de sofisticación: cortes impecables y tejidos nobles que inspiran respeto.',
    uiPreferences: {
      baseFontSize: '16px',
      contrastMode: 'normal',
      simplifiedNav: false,
    },
  },
  madura: {
    id: 'madura',
    title: 'Madura',
    range: '46-55 años',
    badge: 'Elegancia & Armonía',
    focus: 'Elegancia sin esfuerzo, confort térmico y cortes favorecedores que iluminan la tez.',
    stylingQuote: 'Los tonos correctos rejuvenecen la mirada y aportan una serenidad magnética incomparable.',
    uiPreferences: {
      baseFontSize: '16px',
      contrastMode: 'normal',
      simplifiedNav: false,
    },
  },
  senior: {
    id: 'senior',
    title: 'Senior',
    range: '56-65 años',
    badge: 'Atemporal & Sofisticada',
    focus: 'Estilo perdurable, fibras naturales suaves, ligereza visual y distinción natural.',
    stylingQuote: 'La belleza madura brilla con mayor pureza cuando se honra la luz orgánica de la piel.',
    uiPreferences: {
      baseFontSize: '17px',
      contrastMode: 'high',
      simplifiedNav: false,
    },
  },
  golden: {
    id: 'golden',
    title: 'Golden',
    range: '66+ años',
    badge: 'Clásica & Calidez',
    focus: 'Elegancia clásica, máxima ergonomía, tipografía legible y prendas fáciles de poner con clase.',
    stylingQuote: 'Un homenaje a tu trayectoria: suavidad, calidez y colores que transmiten paz y señorío.',
    uiPreferences: {
      baseFontSize: '18px',
      contrastMode: 'high',
      simplifiedNav: true,
    },
  },
};

export function getAgeGroupFromBirthDate(birthDateStr?: string): AgeGroup {
  if (!birthDateStr) return 'adulta_joven';
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age <= 25) return 'joven';
  if (age <= 35) return 'adulta_joven';
  if (age <= 45) return 'adulta';
  if (age <= 55) return 'madura';
  if (age <= 65) return 'senior';
  return 'golden';
}

export function getAgeFromBirthDate(birthDateStr?: string): number {
  if (!birthDateStr) return 29;
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
