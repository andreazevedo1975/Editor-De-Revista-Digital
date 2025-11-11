export interface Magazine {
  meta_revista: MagazineMeta;
  paginas: Page[];
}

export interface MagazineMeta {
  titulo: string;
  edicao: string;
  idioma: string;
}

export interface Page {
  numero_pagina: string;
  tipo_layout: string;
  status_monetizacao: 'gratis' | 'premium_assinatura';
  elementos: Element[];
}

export interface Element {
  tipo: string;
  texto: string;
  coluna: string;
  coordenadas_aproximadas: string;
  estilo_fonte: string;
  teaser_gratuito: string;
  nivel_hierarquico: string;
}
