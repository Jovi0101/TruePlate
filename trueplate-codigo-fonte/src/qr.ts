import QRCode from 'qrcode';

export async function renderQrToCanvas(canvas: HTMLCanvasElement, text: string): Promise<void> {
  await QRCode.toCanvas(canvas, text, {
    width: 480,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#16241D', light: '#FFFFFF' },
  });
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('não foi possível gerar a imagem do QR Code'));
    }, 'image/png');
  });
}
