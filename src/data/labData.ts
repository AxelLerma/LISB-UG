export interface Pillar {
  id: string;
  name: string;
  description: string;
  image: string;
  badgeLabel: string;
  color: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  area: "robotica" | "electronica" | "neurociencia";
  tags: string[];
  status: "activo" | "completado" | "en-desarrollo";
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  abstract: string;
  area: "robotica" | "electronica" | "neurociencia";
  image?: string;
}

export interface Infrastructure {
  id: string;
  name: string;
  description: string;
  image: string;
  equipment: string[];
  area: "robotica" | "electronica" | "neurociencia" | "compartido";
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  area: "robotica" | "electronica" | "neurociencia" | "direccion";
  image: string;
  email: string;
  bio: string;
  researchLines: string[];
}

export interface LabData {
  pillars: Pillar[];
  projects: Project[];
  publications: Publication[];
  infrastructure: Infrastructure[];
  team: TeamMember[];
  images: {
    logo: string;
    hero: string;
    default: string;
  };
}

export const labData: LabData = {
  pillars: [
    {
      id: "robotica",
      name: "Robótica",
      description:
        "Diseño y desarrollo de sistemas robóticos bio-inspirados para aplicaciones de asistencia, exploración y rehabilitación, integrando sensores, actuadores y algoritmos de control adaptativo.",
      image: "/images/pillars/robotica.jpg",
      badgeLabel: "Robótica",
      color: "#002E5D",
    },
    {
      id: "electronica",
      name: "Electrónica",
      description:
        "Desarrollo de plataformas electrónicas embebidas, adquisición de bio-señales y circuitos integrados para sistemas inteligentes de bajo consumo y alta precisión.",
      image: "/images/pillars/electronica.jpg",
      badgeLabel: "Electrónica",
      color: "#00468B",
    },
    {
      id: "neurociencia",
      name: "Neurociencia",
      description:
        "Estudio de señales neurales, interfaces cerebro-computadora y modelado computacional de procesos cognitivos, aplicado a neuroprótesis y neurofeedback.",
      image: "/images/pillars/neurociencia.jpg",
      badgeLabel: "Neurociencia",
      color: "#0284C7",
    },
  ],
  projects: [
    {
      id: "proj-001",
      title: "Exosqueleto de Rehabilitación Neuronal",
      subtitle: "Dispositivo portátil para rehabilitación de miembros superiores",
      description:
        "Exosqueleto ligero impulsado por actuadores neumáticos y controlado mediante señales EEG para pacientes con lesiones medulares y ictus.",
      image: "/images/projects/exosqueleto.jpg",
      area: "robotica",
      tags: ["rehabilitación", "exosqueleto", "EEG", "bio-señales"],
      status: "en-desarrollo",
    },
    {
      id: "proj-002",
      title: "Prótesis Mioeléctrica Adaptativa",
      subtitle: "Prótesis de brazo con control por patrones musculares",
      description:
        "Sistema de prótesis transhumeral con sensores de EMG de superficie y clasificación de patrones de movimiento mediante machine learning embebido.",
      image: "/images/projects/protesis.jpg",
      area: "electronica",
      tags: ["prótesis", "EMG", "mioeléctrica", "machine learning"],
      status: "activo",
    },
    {
      id: "proj-003",
      title: "Interfaz Cerebro-Computadora No Invasiva",
      subtitle: "Sistema EEG de alta densidad para comunicación asistida",
      description:
        "Plataforma de adquisición EEG de 64 canales con procesamiento en tiempo real para permitir comunicación y control de dispositivos mediante pensamiento.",
      image: "/images/projects/bci.jpg",
      area: "neurociencia",
      tags: ["BCI", "EEG", "interfaz cerebro-computadora", "neurofeedback"],
      status: "activo",
    },
    {
      id: "proj-004",
      title: "Robot Móvil Autónomo para Monitoreo Ambiental",
      subtitle: "Plataforma robótica con sensores multispectrales",
      description:
        "Robot móvil diferencial equipado con LiDAR, cámara multiespectral y sistema de navegación autónoma para monitoreo de ecosistemas y zonas de difícil acceso.",
      image: "/images/projects/robot-movil.jpg",
      area: "robotica",
      tags: ["robot móvil", "autónomo", "LiDAR", "monitoreo ambiental"],
      status: "completado",
    },
    {
      id: "proj-005",
      title: "Sistema de Adquisición de Bio-señales Cardiovasculares",
      subtitle: "Plataforma electrónica para ECG y PPG de alta fidelidad",
      description:
        "Front-end analógico y convertidor ADC de 24 bits para adquisición simultánea de señales ECG y PPG con filtrado adaptativo y transmisión inalámbrica BLE.",
      image: "/images/projects/biosignals.jpg",
      area: "electronica",
      tags: ["ECG", "PPG", "bio-señales", "ADC 24 bits", "BLE"],
      status: "activo",
    },
    {
      id: "proj-006",
      title: "Modelado Computacional de Redes Neuronales Corticales",
      subtitle: "Simulación de patrones de actividad cortical en tiempo real",
      description:
        "Modelo computacional de redes neuronales spiking para estudiar la plasticidad sináptica y los patrones de oscilación en la corteza cerebral durante tareas cognitivas.",
      image: "/images/projects/redes-neuronales.jpg",
      area: "neurociencia",
      tags: ["redes neuronales", "modelado computacional", "corteza cerebral", "plasticidad"],
      status: "en-desarrollo",
    },
  ],
  publications: [
    {
      id: "pub-001",
      title:
        "Control Adaptativo de Exosqueletos Basado en Señales EEG para Rehabilitación Neuronal",
      authors: [
        "Dr. Carlos Méndez",
        "Ing. Ana López",
        "Mtro. Roberto Sánchez",
      ],
      journal: "IEEE Transactions on Neural Systems and Rehabilitation Engineering",
      year: 2024,
      doi: "10.1109/TNSRE.2024.3405678",
      abstract:
        "Presentamos un sistema de control adaptativo para exosqueletos de rehabilitación que utiliza señales electroencefalográficas para estimar la intención de movimiento del usuario, mejorando la asistencia terapéutica en pacientes con parálisis parcial.",
      area: "neurociencia",
    },
    {
      id: "pub-002",
      title:
        "Diseño de Prótesis Mioeléctrica con Clasificación de Patrones mediante Redes Neuronales Convolucionales",
      authors: ["Dra. Elena Ramírez", "Ing. Luis García", "Dr. Carlos Méndez"],
      journal: "Sensors (MDPI)",
      year: 2023,
      doi: "10.3390/s2315.6789",
      abstract:
        "Prototipo de prótesis transradial con control mioeléctrico basado en redes neuronales convolucionales para clasificación de patrones de EMG de superficie, logrando una precisión del 94.2% en la estimación de movimientos de agarre.",
      area: "electronica",
    },
    {
      id: "pub-003",
      title:
        "Interfaz Cerebro-Computadora No Invasiva para Comunicación Asistida en Pacientes con ELA",
      authors: [
        "Dr. Roberto Sánchez",
        "Dra. Elena Ramírez",
        "Ing. Patricia Morales",
      ],
      journal: "Frontiers in Neuroscience",
      year: 2023,
      doi: "10.3389/fnins.2023.1124567",
      abstract:
        "Sistema BCI basado en EEG de 64 canales con filtrado espacial y clasificación de potenciales P300 para permitir comunicación asistida en pacientes con esclerosis lateral amiotrófica en estado avanzado.",
      area: "neurociencia",
    },
    {
      id: "pub-004",
      title:
        "Robot Móvil Autónomo con Navegación SLAM para Monitoreo de Ecosistemas",
      authors: ["Ing. Luis García", "Dr. Carlos Méndez", "Mtro. Javier Cortés"],
      journal: "Robotics and Autonomous Systems",
      year: 2024,
      doi: "10.1016/j.robot.2024.104567",
      abstract:
        "Desarrollo de un robot móvil diferencial con sistema de navegación autónoma basado en SLAM (Localización y Mapeo Simultáneos) para monitoreo ambiental en zonas de difícil acceso.",
      area: "robotica",
    },
  ],
  infrastructure: [
    {
      id: "infra-001",
      name: "Laboratorio de Robótica y Automatización",
      description:
        "Espacio equipado con bancos de trabajo, impresoras 3D, cortadora láser y herramientas de prototipado rápido para el desarrollo de sistemas robóticos.",
      image: "/images/infra/robotica-lab.jpg",
      equipment: [
        "Impresoras 3D (FDM y SLA)",
        "Cortadora láser CO2",
        "Bancos de soldadura y electrónica",
        "Brazo robótico colaborativo UR3",
        "Sistema de captura de movimiento OptiTrack",
      ],
      area: "robotica",
    },
    {
      id: "infra-002",
      name: "Laboratorio de Electrónica Embebida",
      description:
        "Laboratorio especializado en diseño de PCB, adquisición de señales y desarrollo de sistemas embebidos para plataformas de bajo consumo.",
      image: "/images/infra/electronica-lab.jpg",
      equipment: [
        "Osciloscopios digitales de 100 MHz",
        "Analizador de espectros",
        "Estaciones de rework SMD",
        "Impresora de PCB LPKF",
        "Microcontroladores ARM Cortex-M y RISC-V",
      ],
      area: "electronica",
    },
    {
      id: "infra-003",
      name: "Laboratorio de Neurociencia y Bio-señales",
      description:
        "Sala acústicamente tratada para adquisición de señales neuronales, ECG, EMG y EEG con equipos de alta precisión y aislamiento electromagnético.",
      image: "/images/infra/neurociencia-lab.jpg",
      equipment: [
        "Sistema EEG de 64 canales (BrainProducts)",
        "Amplificadores de bio-señales",
        "Sala Faraday",
        "Equipos de estimulación transcranial (tDCS)",
        "Software de procesamiento de señales MATLAB/Python",
      ],
      area: "neurociencia",
    },
    {
      id: "infra-004",
      name: "Sala de Integración y Pruebas",
      description:
        "Espacio para integración de subsistemas, pruebas de compatibilidad electromagnética y validación de prototipos completos antes de pruebas de campo.",
      image: "/images/infra/integracion.jpg",
      equipment: [
        "Cámara anecoica",
        "Analizador de red vectorial",
        "Bancos de prueba de vibración",
        "Sistema de visión artificial",
      ],
      area: "compartido",
    },
  ],
  team: [
    {
      id: "team-001",
      name: "Dr. Carlos Méndez Rodríguez",
      role: "Director del Laboratorio",
      area: "direccion",
      image: "/images/team/director.jpg",
      email: "carlos.mendez@ugto.mx",
      bio:
        "Doctor en Ingeniería Electrónica por el CINVESTAV. Investigador especializado en sistemas de control, robótica y bio-señales con más de 15 años de experiencia en el desarrollo de tecnologías asistivas.",
      researchLines: [
        "Control adaptativo",
        "Robótica de rehabilitación",
        "Bio-señales",
      ],
    },
    {
      id: "team-002",
      name: "Dra. Elena Ramírez Castro",
      role: "Investigadora Titular - Neurociencia",
      area: "neurociencia",
      image: "/images/team/elena-ramirez.jpg",
      email: "elena.ramirez@ugto.mx",
      bio:
        "Doctora en Neurociencia Computacional por la UNAM. Experta en interfaces cerebro-computadora, procesamiento de señales neuronales y modelado de redes corticales.",
      researchLines: [
        "Interfaces cerebro-computadora",
        "EEG",
        "Neurofeedback",
        "Modelado computacional",
      ],
    },
    {
      id: "team-003",
      name: "Ing. Luis García Mendoza",
      role: "Investigador Asociado - Electrónica",
      area: "electronica",
      image: "/images/team/luis-garcia.jpg",
      email: "luis.garcia@ugto.mx",
      bio:
        "Ingeniero en Electrónica por la Universidad de Guanajuato. Especialista en diseño de PCB, sistemas embebidos y adquisición de bio-señales para dispositivos médicos.",
      researchLines: [
        "Electrónica embebida",
        "Adquisición de señales",
        "Sistemas embebidos",
        "IoT médico",
      ],
    },
    {
      id: "team-004",
      name: "Mtro. Roberto Sánchez López",
      role: "Investigador Asociado - Robótica",
      area: "robotica",
      image: "/images/team/roberto-sanchez.jpg",
      email: "roberto.sanchez@ugto.mx",
      bio:
        "Maestro en Ciencias en Robótica por el Tecnológico de Monterrey. Especialista en robots móviles, exosqueletos y sistemas autónomos para aplicaciones de monitoreo y asistencia.",
      researchLines: [
        "Robots móviles autónomos",
        "Exosqueletos",
        "Navegación SLAM",
        "Sistemas de control",
      ],
    },
  ],
  images: {
    logo: "/images/logo-ugto.svg",
    hero: "/images/hero-lab.jpg",
    default: "/images/default-placeholder.jpg",
  },
};