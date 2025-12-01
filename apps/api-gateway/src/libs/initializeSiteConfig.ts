/* eslint-disable @nx/enforce-module-boundaries */

import prisma from '../../../../packages/libs/prisma';

export const initializeSiteConfig = async () => {
  try {
    const existingSiteConfig = await prisma.site_config.findFirst();

    if (!existingSiteConfig) {
      await prisma.site_config.create({
        data: {
          categories: [
            "Electronics",
            "Clothing",
            "Accessories",
            "Home & Kitchen",
            "Sports"
          ],
          subCategories: {
            Electronics: ["Computers", "Smartphones", "Tablets", "Cameras", "Audio"],
            Clothing: ["Men's Clothing", "Women's Clothing", "Children's Clothing", "Accessories"],
            Accessories: ["Bags", "Wallets", "Belts", "Hats", "Glasses"],
            "Home & Kitchen": ["Cookware", "Baking Supplies", "Household Goods", "Cleaning Products"],
            Sports: ["Football", "Basketball", "Tennis", "Running", "Yoga"],
          },
        },
      });
    }
  } catch (error) {      
    console.error("Error initializing site config:", error);
  }
};
