import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { Magazine } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// IMPROVEMENT: Define a response schema to ensure the model returns valid JSON in the expected structure, per Gemini API best practices.
const magazineSchema = {
  type: Type.OBJECT,
  properties: {
    meta_revista: {
      type: Type.OBJECT,
      properties: {
        titulo: { type: Type.STRING, description: "Título Identificado da Revista" },
        edicao: { type: Type.STRING, description: "Mês e Ano (Ex: Junho 2025)" },
        idioma: { type: Type.STRING, description: "Idioma Principal do Conteúdo" },
      },
    },
    paginas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          numero_pagina: { type: Type.STRING, description: "Número da página" },
          tipo_layout: { type: Type.STRING, description: "Capa / Índice / Editorial / Artigo Principal / Anúncio" },
          status_monetizacao: { type: Type.STRING, description: "gratis / premium_assinatura" },
          elementos: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                tipo: { type: Type.STRING, description: "Titulo Principal / Subtítulo / Parágrafo de Texto / Imagem / Anúncio" },
                texto: { type: Type.STRING, description: "Conteúdo de texto extraído. Se for imagem ou anúncio, esta é a legenda ou descrição." },
                coluna: { type: Type.STRING, description: "[1, 2 ou 3]" },
                coordenadas_aproximadas: { type: Type.STRING, description: "Ex: Superior Central, Rodapé Esquerdo, Coluna 2 Meio" },
                estilo_fonte: { type: Type.STRING, description: "Ex: Serif Negrito, Corpo Normal, Itálico" },
                teaser_gratuito: { type: Type.STRING, description: "APENAS SE 'status_monetizacao' FOR 'premium_assinatura', inclua aqui os 3 primeiros parágrafos do artigo como isca para o paywall. Caso contrário, deixe este campo vazio." },
                nivel_hierarquico: { type: Type.STRING, description: "[1 para títulos principais, 2 para subtítulos, 3 para texto de corpo]" },
              },
            },
          },
        },
      },
    },
  },
};

export const analyzeMagazinePdf = async (pdfFile: File): Promise<Magazine> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-pro';

  const pdfPart = await fileToGenerativePart(pdfFile);

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { text: "Gere o JSON de editoração para o PDF carregado, seguindo as regras de monetização." },
        pdfPart,
      ],
    },
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: magazineSchema,
    },
  });

  try {
    return JSON.parse(response.text) as Magazine;
  } catch (e) {
    console.error("Failed to parse JSON response:", response.text);
    throw new Error("The AI returned an invalid format. Please check the console for details.");
  }
};
