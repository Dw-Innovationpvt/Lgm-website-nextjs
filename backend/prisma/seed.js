  import { PrismaClient } from '@prisma/client';
  const prisma = new PrismaClient();

  async function main() {
    // ✅ Only the 19 products that have colors
    const productsWithColors = [
      { code: "A0156", colors: [{ name: "Green", hexCode: "#00FF00" }, { name: "White", hexCode: "#FFFFFF" }] },
      { code: "A0202", colors: [{ name: "Red", hexCode: "#FF0000"}, { name: "Blue", hexCode: "#0000FF" }]},
      { code: "A0221", colors: [{ name: "Blue", hexCode: "#0000FF" },{ name: "Green", hexCode: "#00FF00" }, { name: "Yellow", hexCode: "#FFFF00" }] },
      { code: "A0232", colors: [{ name: "Red", hexCode: "#FF0000"}, { name: "Blue", hexCode: "#0000FF" }] },
      { code: "A0246", colors: [{ name: "Green", hexCode: "#00FF00" },{ name: "Red", hexCode: "#FF0000" }, { name: "Orange", hexCode: "#FFA500" }] },
      { code: "A0247", colors: [{ name: "Red", hexCode: "#FF0000" }, { name: "Blue", hexCode: "#0000FF" }] },
      { code: "A0248", colors: [{ name: "Orange", hexCode: "#FFA500" }, { name: "Blue", hexCode: "#0000FF" }, { name: "Green", hexCode: "#00FF00" }, { name: "Pink", hexCode: "#FFC0CB" }, { name: "Dark Blue", hexCode: "#00008B" }] },
      { code: "A0245", colors: [{ name: "Red", hexCode: "#FF0000" }, { name: "Blue", hexCode: "#0000FF" } ] },
      { code: "A0261", colors: [{ name: "Red", hexCode: "#FF0000" }, { name: "Blue", hexCode: "#0000FF" }] },
      { code: "A0291", colors: [{ name: "Blue", hexCode: "#0000FF" }, { name: "Orange", hexCode: "#FFA500" }] },
      { code: "A0112", colors: [{ name: "Blue", hexCode: "#0000FF" }, { name: "Pink", hexCode: "#FFC0CB" }] },
      { code: "A0339", colors: [{ name: "Black", hexCode: "#000000" }, { name: "Blue", hexCode: "#0000FF" }, { name: "Red", hexCode: "#FF0000" }] },
      { code: "A0311", colors: [{ name: "Green", hexCode: "#00FF00" },{ name: "Blue", hexCode: "#0000FF" }, { name: "Orange", hexCode: "#FFA500"} ] },
      { code: "A0016", colors: [{ name: "Orange", hexCode: "#FFA500" }, { name: "Blue", hexCode: "#0000FF" }] },
      { code: "A0036", colors: [{ name: "Blue", hexCode: "#0000FF" }, { name: "Red", hexCode: "#FF0000" }, { name: "Green", hexCode: "#00FF00" }] },
      { code: "A0046", colors: [{ name: "Black", hexCode: "#000000" }, { name: "Yellow", hexCode: "#FFFF00" }] },
      { code: "A0066", colors: [{ name: "Yellow", hexCode: "#FFFF00" }, { name: "Blue", hexCode: "#0000FF" }, { name: "Orange", hexCode: "#FFA500" }] },
      { code: "A0067", colors: [{ name: "Green", hexCode: "#00FF00" }, { name: "Orange", hexCode: "#FFA500" }] },
      { code: "A0085", colors: [{ name: "Black", hexCode: "#000000" }, { name: "Yellow", hexCode: "#FFFF00" }] },
    ];

    for (const product of productsWithColors) {
      const existingProduct = await prisma.product.findUnique({
        where: { code: product.code.trim() },
      });
      if (!existingProduct) {
        console.warn(`Product with code ${product.code} not found, skipping colors`);
        continue; // skip to next product
      }
      for (const color of product.colors) {
        await prisma.productColor.upsert({
          where: {
            productCode_name: {
              productCode: product.code,
              name: color.name,
            },
          },
          update: { hexCode: color.hexCode },
          create: {
            name: color.name,
            hexCode: color.hexCode,
            productCode: product.code,
          },
        });
      }
    }

    console.log("✅ Product colors updated for 19 products!");
  }

  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
