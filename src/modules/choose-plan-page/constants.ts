export enum InternalFileType {
  DOC = 'DOC',
  DOCX = 'DOCX',
  JPEG = 'JPEG',
  JPG = 'JPG',
  HEIC = 'HEIC',
  HEIF = 'HEIF',
  PDF = 'PDF',
  PNG = 'PNG',
  PPT = 'PPT',
  PPTX = 'PPTX',
  XLS = 'XLS',
  XLSX = 'XLSX',
  ZIP = 'ZIP',
  BMP = 'BMP',
  EPS = 'EPS',
  GIF = 'GIF',
  SVG = 'SVG',
  TIFF = 'TIFF',
  WEBP = 'WEBP',
  EPUB = 'EPUB',
}

export enum Currency {
  USD = 'USD',
  GBP = 'GBD',
  EUR = 'EUR',
}

export const imagesFormat = [
  InternalFileType.HEIC,
  InternalFileType.SVG,
  InternalFileType.PNG,
  InternalFileType.BMP,
  InternalFileType.EPS,
  InternalFileType.GIF,
  InternalFileType.TIFF,
  InternalFileType.WEBP,
  InternalFileType.JPG,
  InternalFileType.JPEG,
];

export enum PlanTypes {
  MONTHLY = 'monthly',
  MONTHLY_FULL = 'monthly_full',
  ANNUAL = 'annual',
}

export const PLAN_TYPES = [
  PlanTypes.MONTHLY,
  PlanTypes.MONTHLY_FULL,
  PlanTypes.ANNUAL,
];
