//get products category
import { Router, Request, Response } from "express";
import prisma from "../../../../packages/libs/prisma";


export const getCategories = async (req: Request, res: Response) => {
  try {
    const config = await prisma.site_config.findFirst();
    if(!config){
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(config.categories);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};