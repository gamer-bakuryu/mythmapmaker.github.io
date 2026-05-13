import { useState } from "react";

export function useAssets() {

  const [assets, setAssets] =
    useState([]);

  // =========================
  // LOAD IMAGE
  // =========================

  const loadImage = (file) => {

    return new Promise(
      (resolve, reject) => {

        const reader =
          new FileReader();

        reader.onload = () => {

          const img = new Image();

          img.onload = () => {

            resolve({
              id: crypto.randomUUID(),

              name: file.name,

              type: file.type,

              src: reader.result,

              width: img.width,

              height: img.height,

              image: img,
            });
          };

          img.onerror = reject;

          img.src = reader.result;
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
      }
    );
  };

  // =========================
  // UPLOAD
  // =========================

  const uploadAssets = async (
    files
  ) => {

    const accepted = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    const uploaded = [];

    for (const file of files) {

      if (
        !accepted.includes(file.type)
      ) {
        continue;
      }

      const asset =
        await loadImage(file);

      uploaded.push(asset);
    }

    setAssets((prev) => [
      ...uploaded,
      ...prev,
    ]);
  };

  return {

    assets,

    uploadAssets,
  };
}
