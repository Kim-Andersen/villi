import debug from 'debug';
import { BadRequestError } from '../../errors';
import { IVendorLocationModel, IVendorModel } from '../../models';
import { Vendor, VendorId, VendorInput, VendorLocation, VendorLocationDetails, VendorLocationId, VendorLocationInput, VendorLocationSearch } from '../../shared';

export class VendorService {
  private readonly log = debug(VendorService.name);
  
  constructor(private readonly vendorModel: IVendorModel, private readonly vendorLocationModel: IVendorLocationModel) {
    this.log('initialize');
  }

  // public async updateVendorLocation(vendorId: VendorId, locationId: LocationId, update: VendorLocationInput): Promise<void> {
  //   return this.vendorModel.updateVendorLocation(vendorId, locationId, update);
  // }

  public async updateVendor(vendorId: VendorId, input: VendorInput): Promise<Pick<Vendor, 'updated_at'>> {
    this.log('updateVendor', { vendorId, input });
    return this.vendorModel.updateVendor(vendorId, input);
  }

  public async getVendorDetails(vendorId: VendorId): Promise<Vendor> {
    this.log('getVendorDetails', { vendorId });
    return this.vendorModel.findById(vendorId);
  }

  public async findVendorLocations(search: VendorLocationSearch): Promise<VendorLocationDetails[]> {
    this.log('findVendorLocations', { search });
    return this.vendorLocationModel.findAll(search);
  }

  public async findOneVendorLocation(search: VendorLocationSearch): Promise<VendorLocationDetails | undefined> {
    this.log('findOneVendorLocation', { search });
    return this.vendorLocationModel.findOne(search);
  }

  public async addVendorLocation(input: VendorLocationInput): Promise<VendorLocationDetails> {
    this.log('addLocationToVendor', { input });

    if (await this.findOneVendorLocation({ vendor_id: input.vendor_id, location_id: input.location_id })) {
      this.log(`VendorLocation already exists.`, { input });
      throw new BadRequestError('Vendor is already at this location.');
    } else {
      const { id } = await this.vendorLocationModel.insert(input);
      return this.vendorLocationModel.findById(id as VendorLocationId);
    }
  }

  public async updateVendorLocation(id: VendorLocationId, input: VendorLocationInput): Promise<Pick<VendorLocation, 'updated_at'>> {
    this.log('updateVendorLocation', { id, input });
    return this.vendorLocationModel.update(id, input);
  }

  public async removeVendorLocation(id: VendorLocationId): Promise<void> {
    this.log('deleteVendor', { id });
    return this.vendorLocationModel.delete(id);
  }

  public async getAllVendors(): Promise<Vendor[]> {
    this.log('getAllVendors');
    return this.vendorModel.findAll({});
  }

  public async createVendor(input: VendorInput): Promise<VendorId> {
    this.log('createVendor', input);
    return this.vendorModel.insertVendor(input);
  }

  public async deleteVendor(vendorId: VendorId): Promise<void> {
    this.log('deleteVendor', { vendorId });
    return this.vendorModel.deleteVendor(vendorId);
  }
}