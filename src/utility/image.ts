import { RefObject } from "react";

export function verifyImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export type splitImageToTilesResponse = {
  aspectRatio: number;
  images: string[];
};

export function splitImageToTiles(
  imageUrl: string,
  canvasRef: RefObject<HTMLCanvasElement>,
  row: number,
  col: number,
): Promise<splitImageToTilesResponse> {
  return new Promise((resolve) => {
    const canvas = canvasRef.current!;
    const ctx = canvas?.getContext("2d")!;
    const image = new Image();
    image.setAttribute("crossOrigin", "anonymous");
    image.src = imageUrl;
    image.onload = () => {
      let imagewidth = image.width;
      let imageHeight = image.height;
      canvas.width = imagewidth;
      canvas.height = imageHeight;
      let splitHeight = Math.floor(imageHeight / row);
      let splitWidth = Math.floor(imagewidth / col);
      ctx.drawImage(image, 0, 0);
      const tileCanvases = [];
      for (let y = 0; y < splitHeight * row; y += splitHeight) {
        for (let x = 0; x < splitWidth * col; x += splitWidth) {
          const tileCanvas = document.createElement("canvas");
          tileCanvas.width = splitWidth;
          tileCanvas.height = splitHeight;
          tileCanvas.getContext("2d")!.drawImage(canvas, -x, -y);
          tileCanvases.push(tileCanvas.toDataURL());
        }
      }
      resolve({ images: tileCanvases, aspectRatio: splitWidth / splitHeight });
    };
  });
}
