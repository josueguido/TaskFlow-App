import { Request, Response, NextFunction } from 'express';
import {
  signupBusiness,
  getBusinessesList,
  getBusinessDetails
} from '../../services/business/business.service';
import { BadRequestError } from '../../errors/BadRequestError';
import { logger } from '../../utils/logger';

export const businessSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, admin_name, admin_email, password } = req.body;

    if (!name || !admin_name || !admin_email || !password) {
      throw new BadRequestError('All fields are required: name, admin_name, admin_email, password');
    }

    const result = await signupBusiness({
      name,
      admin_name,
      admin_email,
      password
    });

    logger.info(`Business signup successful for: ${admin_email}`);
    res.status(201).json(result);

  } catch (error) {
    next(error);
  }
};

export const getBusinesses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businesses = await getBusinessesList();
    
    res.status(200).json({
      success: true,
      message: 'Businesses retrieved successfully',
      data: businesses
    });

  } catch (error) {
    next(error);
  }
};

export const getBusinessById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError('Business ID is required');
    }

    const business = await getBusinessDetails(id);
    
    res.status(200).json({
      success: true,
      message: 'Business details retrieved successfully',
      data: business
    });

  } catch (error) {
    next(error);
  }
};