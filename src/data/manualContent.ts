import { ManualChapter } from '../types';

export const INITIAL_MANUAL_CHAPTERS: ManualChapter[] = [
  {
    id: 'cap_1',
    capitulo: 1,
    titulo: 'Introducción a Styled By Wilma',
    descripcion: 'Filosofía, público objetivo, ventajas y requisitos técnicos de la aplicación.',
    icono: 'Sparkles',
    secciones: [
      {
        id: 'sec_1_1',
        seccion: 1,
        subseccion: '1.1',
        titulo: '¿Qué es Styled By Wilma?',
        contenido: [
          'Styled By Wilma es una plataforma progresiva (PWA) de asesoría de imagen y colorimetría personal potenciada por inteligencia artificial (Gemini) y diseñada por la asesora de imagen Wilma Hernández en Concepción, Región del Biobío, Chile.',
          'Nuestra premisa fundamental es: "No creamos una app que solo analiza cómo te ves; creamos una app que aprende quién eres para ayudarte a vestir". Mediante un ecosistema de 7 DNAs de Estilo (Color, Cuerpo, Estilo, Estilo de Vida, Confort, Compras y Armario), la app se adapta a tu edad biológica y estilo de vida.'
        ],
        tips: [
          'La app funciona en teléfonos móviles, tablets y computadores de escritorio.',
          'Puedes instalarla directamente desde tu navegador en tu pantalla de inicio como una app nativa gracias a su arquitectura PWA.'
        ]
      },
      {
        id: 'sec_1_2',
        seccion: 2,
        subseccion: '1.2',
        titulo: '¿Para quién es la aplicación?',
        contenido: [
          'Diseñada para mujeres de todas las edades (de 18 a 75+ años) divididas en 6 grupos de edad específicos:',
          '1. Joven (18-25 años): Tendencias, frescura y presupuesto accesible.',
          '2. Adulta Joven (26-35 años): Balance entre vida profesional, personal y versatilidad.',
          '3. Adulta (36-45 años): Presencia profesional ejecutiva, empoderamiento y cortes de calidad.',
          '4. Madura (46-55 años): Elegancia, confort refinado y luz rejuvenecedora.',
          '5. Senior (56-65 años): Estilo atemporal, tejidos nobles y distinción.',
          '6. Golden (66+ años): Elegancia clásica, calidez, botones ampliados y alta legibilidad.'
        ]
      },
      {
        id: 'sec_1_3',
        seccion: 3,
        subseccion: '1.3',
        titulo: 'Beneficios Principales',
        contenido: [
          '• Ahorro de dinero al comprar únicamente prendas que armonizan con tu paleta natural.',
          '• Reducción del estrés matutino al saber exactamente qué colores y cortes favorecen tu rostro.',
          '• Seguridad personal en entrevistas de trabajo, citas y eventos familiares.',
          '• Asistencia continua por WhatsApp con la asesora máster Wilma Hernández.'
        ]
      },
      {
        id: 'sec_1_4',
        seccion: 4,
        subseccion: '1.4',
        titulo: 'Requisitos Técnicos',
        contenido: [
          '• Navegador moderno: Google Chrome, Safari, Edge, Firefox o Samsung Internet.',
          '• Cámara fotográfica (frontal o trasera) para el diagnóstico cromático con luz natural.',
          '• Conexión a Internet para la sincronización con Cloudflare D1 y el motor Gemini AI.'
        ]
      }
    ]
  },
  {
    id: 'cap_2',
    capitulo: 2,
    titulo: 'Registro y Acceso al Sistema',
    descripcion: 'Proceso de creación de cuenta, inicio de sesión unificado y gestión de contraseña.',
    icono: 'ShieldCheck',
    secciones: [
      {
        id: 'sec_2_1',
        seccion: 1,
        subseccion: '2.1',
        titulo: 'Cómo registrarse con Google',
        contenido: [
          'El registro con Google es instantáneo y seguro mediante Google Identity Services.',
          'Toca el botón "[G] Continuar con Google", selecciona tu cuenta de correo y tus datos de nombre y foto de perfil se sincronizarán inmediatamente.'
        ]
      },
      {
        id: 'sec_2_2',
        seccion: 2,
        subseccion: '2.2',
        titulo: 'Cómo registrarse con Facebook',
        contenido: [
          'Permite ingresar rápidamente con tu perfil de Facebook.',
          'Haz clic en "[f] Continuar con Facebook", aprueba los permisos básicos y tu sesión quedará iniciada de inmediato.'
        ]
      },
      {
        id: 'sec_2_3',
        seccion: 3,
        subseccion: '2.3',
        titulo: 'Cómo registrarse con Correo Electrónico',
        contenido: [
          'En la pestaña "Registrarme", completa los siguientes campos obligatorios:',
          '1. Nombre de usuario (único en el sistema, ej. @valeria_cl).',
          '2. Correo electrónico válido.',
          '3. Contraseña segura (mínimo 6 caracteres).',
          '4. Nombres y Apellidos.',
          '5. Fecha de nacimiento (para asignarte automáticamente tu grupo de edad entre los 6 disponibles).',
          '6. Aceptación de Términos y Condiciones y Política de Privacidad.'
        ]
      },
      {
        id: 'sec_2_4',
        seccion: 4,
        subseccion: '2.4',
        titulo: 'Inicio de Sesión (Usuario o Correo)',
        contenido: [
          'La pantalla de login cuenta con un campo unificado inteligente donde puedes escribir indistintamente tu nombre de usuario (ej. "valeria_cl") o tu correo electrónico (ej. "valeria@gmail.com"), acompañado de tu contraseña.'
        ]
      },
      {
        id: 'sec_2_5',
        seccion: 5,
        subseccion: '2.5',
        titulo: 'Recuperación de Contraseña',
        contenido: [
          'Si olvidaste tu clave, haz clic en "¿Olvidaste tu contraseña?". Recibirás un enlace o código PIN de 6 dígitos para restablecerla de forma instantánea.'
        ]
      },
      {
        id: 'sec_2_6',
        seccion: 6,
        subseccion: '2.6',
        titulo: 'Pausar o Cerrar Cuenta (Estilo Facebook)',
        contenido: [
          'Puedes pausar tu cuenta temporalmente si deseas tomarte un descanso. Tus análisis quedan protegidos.',
          'Si solicitas la eliminación, el sistema activa un periodo de gracia de 30 a 90 días configurable por la administración antes de su borrado definitivo en D1.'
        ]
      }
    ]
  },
  {
    id: 'cap_3',
    capitulo: 3,
    titulo: 'Onboarding y Diagnóstico Inicial',
    descripcion: 'Paso a paso del proceso guiado de bienvenida.',
    icono: 'Users',
    secciones: [
      {
        id: 'sec_3_1',
        seccion: 1,
        subseccion: '3.1',
        titulo: 'Paso 1: About You (Sobre Ti)',
        contenido: [
          'Ingreso de edad, ciudad de residencia (ej. Concepción, Biobío) y rutina principal diaria.'
        ]
      },
      {
        id: 'sec_3_2',
        seccion: 2,
        subseccion: '3.2',
        titulo: 'Paso 2: Your Style (Tu Estilo Deseado)',
        contenido: [
          'Selección de tus arquetipos visuales favoritos (Clásico, Natural, Elegante, Romántico, Creativo, Dramático, Seductor).'
        ]
      },
      {
        id: 'sec_3_3',
        seccion: 3,
        subseccion: '3.3',
        titulo: 'Paso 3: Your Colors (Tus Colores Actuales)',
        contenido: [
          'Preguntas sobre cómo reacciona tu piel al sol, tus joyas favoritas (oro vs plata) y tonos que te hacen sentir cansada.'
        ]
      },
      {
        id: 'sec_3_4',
        seccion: 4,
        subseccion: '3.4',
        titulo: 'Paso 4: Your Body (Tu Silueta y Confort)',
        contenido: [
          'Definición de silueta y preferencias de escotes y tipos de calzado.'
        ]
      },
      {
        id: 'sec_3_5',
        seccion: 5,
        subseccion: '3.5',
        titulo: 'Paso 5: Your Results (Tus Resultados Iniciales)',
        contenido: [
          'Generación de tu primer informe de compatibilidad y propuesta de estación.'
        ]
      }
    ]
  },
  {
    id: 'cap_4',
    capitulo: 4,
    titulo: 'Colorimetría de las 12 Estaciones',
    descripcion: 'Toma de fotografía, análisis con IA y lectura de tu paleta.',
    icono: 'Palette',
    secciones: [
      {
        id: 'sec_4_1',
        seccion: 1,
        subseccion: '4.1',
        titulo: 'Cómo tomar la foto correcta',
        contenido: [
          '• Iluminación: Luz natural indirecta (cerca de una ventana, entre las 10:00 y las 16:00 hrs).',
          '• Rostro: Sin maquillaje cargado ni filtros de belleza.',
          '• Cabello: Retirado de las mejillas o con pañuelo neutro si está teñido.',
          '• Ropa: Prenda blanca o gris clara en el cuello.'
        ]
      },
      {
        id: 'sec_4_2',
        seccion: 2,
        subseccion: '4.2',
        titulo: 'Interpretación de los 4 Parámetros',
        contenido: [
          '1. Temperatura (Subtono): Cálido (dorado, melocotón) vs Frío (azulado, rosado).',
          '2. Valor (Luminosidad): Claro (Light) vs Oscuro / Profundo (Deep).',
          '3. Croma (Saturación): Brillante (Clear/Bright) vs Suave (Muted/Soft).',
          '4. Contraste Facial: Diferencia de intensidad entre ojos, tez y cabello.'
        ]
      },
      {
        id: 'sec_4_3',
        seccion: 3,
        subseccion: '4.3',
        titulo: 'Tu Paleta y Códigos HEX para Compras',
        contenido: [
          'Cada color cuenta con su código HEX exacto (ej. #E11D48) para comparar directamente en la pantalla de tu teléfono mientras vitrineas en tiendas físicas u online.'
        ]
      },
      {
        id: 'sec_4_4',
        seccion: 4,
        subseccion: '4.4',
        titulo: 'Neutros Maestros y Metales Ideales',
        contenido: [
          'Descubre si tu metal de poder es el Oro pulido, Plata de ley, Oro rosa o Peltre envejecido, junto a tus mejores neutros (blanco óptico vs marfil, carbón vs chocolate).'
        ]
      },
      {
        id: 'sec_4_5',
        seccion: 5,
        subseccion: '4.5',
        titulo: 'Colores a Evitar y Trucos de Compensación',
        contenido: [
          'Si un color te apasiona pero no pertenece a tu paleta, úsalo en pantalones, faldas, calzados o bolsos alejados de tu mandíbula, compensando con un collar o pañuelo de tu estación.'
        ]
      }
    ]
  },
  {
    id: 'cap_5',
    capitulo: 5,
    titulo: 'El Sistema Style DNA (7 Dimensiones)',
    descripcion: 'Comprensión profunda de cada componente de tu ADN estilístico.',
    icono: 'Layers',
    secciones: [
      { id: 'sec_5_1', seccion: 1, subseccion: '5.1', titulo: 'Color DNA', contenido: ['Subtono, estación, contrastes y armonías cromáticas.'] },
      { id: 'sec_5_2', seccion: 2, subseccion: '5.2', titulo: 'Body DNA', contenido: ['Proporciones, cortes de prendas, largos de falda y estructura de hombros.'] },
      { id: 'sec_5_3', seccion: 3, subseccion: '5.3', titulo: 'Style DNA', contenido: ['Personalidad expresiva, arquetipos de vestuario y balance minimalista vs maximalista.'] },
      { id: 'sec_5_4', seccion: 4, subseccion: '5.4', titulo: 'Lifestyle DNA', contenido: ['Actividad laboral, vida social y clima particular (Biobío/Concepción).'] },
      { id: 'sec_5_5', seccion: 5, subseccion: '5.5', titulo: 'Comfort DNA', contenido: ['Sensibilidad cutánea, tolerancia a tacones y preferencia de tejidos elásticos vs rígidos.'] },
      { id: 'sec_5_6', seccion: 6, subseccion: '5.6', titulo: 'Shopping DNA', contenido: ['Frecuencia de compra, presupuesto estimado y prioridad por sostenibilidad local.'] },
      { id: 'sec_5_7', seccion: 7, subseccion: '5.7', titulo: 'Wardrobe DNA', contenido: ['Organización del clóset, rotación de prendas y armado de armario cápsula funcional.'] }
    ]
  },
  {
    id: 'cap_6',
    capitulo: 6,
    titulo: 'Herramientas de Estilismo Inteligente',
    descripcion: 'Draping virtual, generador de looks y consultoría interactiva.',
    icono: 'Zap',
    secciones: [
      { id: 'sec_6_1', seccion: 1, subseccion: '6.1', titulo: '¿Qué me pongo hoy?', contenido: ['Generador de outfits inteligentes según la ocasión, el clima del Biobío y tu estado de ánimo.'] },
      { id: 'sec_6_2', seccion: 2, subseccion: '6.2', titulo: 'Draping Virtual en Tiempo Real', contenido: ['Prueba digital de telas virtuales sobre tu fotografía para comprobar qué tonos iluminan tus facciones al instante.'] },
      { id: 'sec_6_3', seccion: 3, subseccion: '6.3', titulo: '¿Me lo compro? (Test de Probador)', contenido: ['Herramienta rápida para resolver dudas frente al espejo de la tienda antes de pasar por caja.'] },
      { id: 'sec_6_4', seccion: 4, subseccion: '6.4', titulo: 'Directorio de las 12 Estaciones', contenido: ['Enciclopedia visual completa de las 12 paletas para comparar y comprender la armonía de tus amigas o familiares.'] }
    ]
  },
  {
    id: 'cap_7',
    capitulo: 7,
    titulo: 'Perfil y Preferencias de Usuaria',
    descripcion: 'Personalización de interfaz, temas visuales y ajustes de cuenta.',
    icono: 'Settings',
    secciones: [
      { id: 'sec_7_1', seccion: 1, subseccion: '7.1', titulo: 'Editar datos personales', contenido: ['Modificación de nombre, foto de perfil, fecha de nacimiento y enlaces a redes sociales.'] },
      { id: 'sec_7_2', seccion: 2, subseccion: '7.2', titulo: 'Temas visuales y Modo Oscuro', contenido: ['Elige entre la paleta suave Rose Gold, Esmeralda, Terracota o el modo oscuro de alto contraste.'] },
      { id: 'sec_7_3', seccion: 3, subseccion: '7.3', titulo: 'Tarjeta de Bolsillo Compartible', contenido: ['Exporta tu tarjeta de colorimetría para guardarla en las fotos de tu teléfono o compartirla en Instagram.'] }
    ]
  },
  {
    id: 'cap_8',
    capitulo: 8,
    titulo: 'Planes y Membresías VIP',
    descripcion: 'Diferencias entre planes, suscripción segura y cancelación.',
    icono: 'CreditCard',
    secciones: [
      { id: 'sec_8_1', seccion: 1, subseccion: '8.1', titulo: 'Comparativa de Planes', contenido: ['Plan Gratuito Básico, Plan Mensual VIP ($4.99 USD), Plan Anual VIP ($39.99 USD) y Plan Asesora Pro.'] },
      { id: 'sec_8_2', seccion: 2, subseccion: '8.2', titulo: 'Proceso de Suscripción', contenido: ['Activación inmediata mediante pasarela de pago segura con tarjeta o transferencia.'] },
      { id: 'sec_8_3', seccion: 3, subseccion: '8.3', titulo: 'Cancelación sin penalidades', contenido: ['Puedes cancelar tu renovación automática en cualquier momento desde tu panel de usuario conservando los días restantes.'] }
    ]
  },
  {
    id: 'cap_9',
    capitulo: 9,
    titulo: 'Copias de Seguridad y Datos (Tipo WhatsApp)',
    descripcion: 'Respaldos cifrados, exportación a Excel y portabilidad.',
    icono: 'Database',
    secciones: [
      { id: 'sec_9_1', seccion: 1, subseccion: '9.1', titulo: 'Crear Backup Manual', contenido: ['Guarda un archivo cifrado con tus fotos, diagnósticos y configuración en tu almacenamiento local o en la nube.'] },
      { id: 'sec_9_2', seccion: 2, subseccion: '9.2', titulo: 'Restaurar Respaldo', contenido: ['Restaura tus datos en un nuevo dispositivo cargando el archivo de copia de seguridad con un solo clic.'] },
      { id: 'sec_9_3', seccion: 3, subseccion: '9.3', titulo: 'Exportación a Excel / JSON', contenido: ['Descarga tus tablas de colores, notas y fechas en formato .xlsx para tu archivo personal.'] }
    ]
  },
  {
    id: 'cap_10',
    capitulo: 10,
    titulo: 'Canales de Soporte y WhatsApp',
    descripcion: 'Comunicación directa con Wilma Hernández y preguntas frecuentes.',
    icono: 'HelpCircle',
    secciones: [
      { id: 'sec_10_1', seccion: 1, subseccion: '10.1', titulo: 'Botón Flotante de WhatsApp', contenido: ['Inicia una conversación directa por WhatsApp con Wilma Hernández desde cualquier vista de la aplicación.'] },
      { id: 'sec_10_2', seccion: 2, subseccion: '10.2', titulo: 'Preguntas Frecuentes (FAQ)', contenido: ['Respuestas a dudas sobre cambios de estación con el bronceado de verano, tinte de cabello y envejecimiento natural.'] }
    ]
  },
  {
    id: 'cap_11',
    capitulo: 11,
    titulo: 'Consola Superadministradora (Solo Máster)',
    descripcion: 'Guía de uso para las 15 secciones administrativas ampliadas.',
    icono: 'Crown',
    secciones: [
      { id: 'sec_11_1', seccion: 1, subseccion: '11.1', titulo: 'Acceso Secreto y Credenciales', contenido: ['Acceso por ruta oculta /admin, gesto de 5 toques en el logo o credencial de master admin.'] },
      { id: 'sec_11_2', seccion: 2, subseccion: '11.2', titulo: 'Dashboard con 8 Gráficos y KPIs', contenido: ['Monitoreo en tiempo real de visitas, ingresos, uso de tokens Gemini, CPU y almacenamiento R2.'] },
      { id: 'sec_11_3', seccion: 3, subseccion: '11.3', titulo: 'Gestión de Visitas', contenido: ['Tabla completa con país, ciudad, IP anonimizada, duración de sesión y exportación a Excel/PDF.'] },
      { id: 'sec_11_4', seccion: 4, subseccion: '11.4', titulo: 'Editor en Vivo de Apariencia', contenido: ['Personalización de logo, header, sidebar, bottom nav, tipografías y paleta pastel con vista previa al instante.'] },
      { id: 'sec_11_5', seccion: 5, subseccion: '11.5', titulo: 'Configuración de Seguridad y Registro', contenido: ['Gestión de proveedores OAuth (Google, Facebook), longitud de contraseña, modo mantenimiento y logs de auditoría.'] }
    ]
  }
];
