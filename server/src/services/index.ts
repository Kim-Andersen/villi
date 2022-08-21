import { accountModel, entityPhotoModel, invitationModel, locationModel, photoModel, productCollectionModel, productInCollectionModel, productModel, taggedModel, vendorLocationModel, vendorModel } from '../models';
import { AccountService } from './AccountService/AccountService';
import { EmailAuthService } from './EmailAuthService/EmailAuthService';
import { EmailerService } from './EmailerService/EmailerService';
import { InvitationService } from './InvitationService/InvitationService';
import { LocationService } from './LocationService/LocationService';
import { FileObjectStorage } from './ObjectStorage/FileObjectStorage';
import { S3ObjectStorage } from './ObjectStorage/S3ObjectStorage';
import { IObjectStorage } from './ObjectStorage/types';
import PhotoService from './PhotoService/PhotoService';
import { ProductService } from './ProductService/ProductService';
import { SessionAuthService } from './SessionAuthService/SessionAuthService';
import { TaggedService } from './TaggedService/TaggedService';
import { VendorService } from './VendorService/VendorService';

// Instantiate services.
export const objectStorage: IObjectStorage = process.env.NODE_ENV === 'production' ? new S3ObjectStorage() : new FileObjectStorage();
export const photoService = new PhotoService(photoModel, entityPhotoModel, objectStorage);
export const locationService = new LocationService(locationModel);
export const vendorService = new VendorService(vendorModel, vendorLocationModel);
export const taggedService = new TaggedService(taggedModel);
export const productService = new ProductService(productModel, productCollectionModel, productInCollectionModel);
export const emailerService = new EmailerService();
export const accountService = new AccountService(accountModel);
export const invitationService = new InvitationService(invitationModel);
export const sessionAuthService = new SessionAuthService(accountService);
export const emailAuthService = new EmailAuthService(emailerService, accountService, sessionAuthService);
